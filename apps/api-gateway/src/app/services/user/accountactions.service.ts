import { Ok, PrismaService, Result, Err, AuthService, ResultInterface } from "@backend/libs";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { UserCreationPayload } from "../../dtos/user/user-creation-payload.dto";
import { User } from "@prisma/client";
import { UserLoginPayload } from "../../dtos/user/user-login-payload.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class AccountActionsProvider {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService,
        @Inject(CACHE_MANAGER) private  readonly cacheManager: Cache
    ) {}

    async getProfileDetails(token: string): Promise<Result<{profile?:any}&ResultInterface<string>, ResultInterface<string>>> {
        try {
            const verify = this.authService.verifyJwt(token);

            if (verify.statusCode == 1) {
                return new Err({data:'error',error:'JWT verification error'});
            }

            if (verify.isValid == false) {
                return new Err({data:'error',error:'Invalid JWT'});
            }

            if (!(verify.payload)) {
                return new Err({data:'error',error:"Unreadable JWT payload"});
            }

            if (!(verify.payload.userId)) {
                return new Err({data:'error',error:"User ID not in JWT payload"});
            }

            const cachedUserProfile = await this.cacheManager.get(`${verify.payload.userId}-profile`);
            if (cachedUserProfile) {
                Logger.log("found from cache")
                return new Ok({data:'success',profile:cachedUserProfile});
            }

            const userProfile = await this.prisma.user.findFirst({
                where: {
                    id: verify.payload.userId
                },
                select: {
                    id: true,
                    email: true,
                    name: true
                }
            });

            if (!(userProfile)) {
                return new Err({data:"error",error:"User not found"});
            }

            Logger.log("added to cache")
            await this.cacheManager.set(`${verify.payload.userId}-profile`, userProfile);

            return new Ok({data:'success',profile:userProfile})

        } catch(e) {
            return new Err({data:"error",error:e});
        }
    }

    async loginUser(payload: UserLoginPayload) : Promise<Result<LoginUserReturnInterface, LoginUserReturnInterface>> {
        try {
            const verify = await this.authService.verifyUserWithCredentials(payload.unpack().email, payload.unpack().password);

            if ((verify.statusCode==1) || (!(verify.userData))) {
                return new Err({data: 'error', error: `${verify.errorCode} ${verify.errorInfo}`});
            }

            if (!(verify.userVerified)) {
                return new Err({data: 'error', error: "unverified user"});
            }

            const jwt = this.authService.createNewJwt(
                {
                    email: verify.userData.email,
                    name: verify.userData.name,
                    userId: verify.userData.id
                }
            );

            return new Ok({data:'success',token:jwt.token});

        } catch(e) {
            return new Err({data:'error',error:e})
        }
    }

    async createUser(payload: UserCreationPayload): Promise<Result<CreateUserReturnInterface, CreateUserReturnInterface>> {
        try {
            const newUser = await this.prisma.user.create({
                data: payload.unpack()
            });

            return new Ok({
                data: "success",
                user: newUser
            });

        } catch(e) {
            return new Err({
                data: 'error',
                error: e
            });
        }
    }
}

interface CreateUserReturnInterface {
    data: "success" | "error",
    // eslint-disable-next-line
    error?:any,
    user?: User
}

interface LoginUserReturnInterface {
    // eslint-disable-next-line
    error?:any;
    data: "success" | "error",
    token?:string;
}