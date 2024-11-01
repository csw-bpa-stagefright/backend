import { Ok, PrismaService, Result, Err, AuthService } from "@backend/libs";
import { Injectable } from "@nestjs/common";
import { UserCreationPayload } from "../../dtos/user/user-creation-payload.dto";
import { User } from "@prisma/client";
import { UserLoginPayload } from "../../dtos/user/user-login-payload.dto";

@Injectable()
export class AccountActionsProvider {
    constructor(
        private readonly prisma: PrismaService,
        private readonly authService: AuthService
    ) {}

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