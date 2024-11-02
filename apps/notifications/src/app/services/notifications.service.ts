import { AuthService, PrismaService } from "@backend/libs";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateNotificationDto } from "../dtos/CreateNotificationDto.dto";
import { GetNotificationsDto } from "../dtos/GetNotificationsDto.dto";
import { Result, Err, Ok, ResultInterface } from "@backend/libs";
import { AccountNotification } from "@prisma/client";

@Injectable()
export class NotificationsService {
    constructor(
        @Inject(PrismaService) private readonly prisma: PrismaService,
        @Inject(AuthService) private readonly authService: AuthService
    ) {}

    public async getUserNotifications(payload: GetNotificationsDto) : Promise<Result<{notifications?: AccountNotification[]}&ResultInterface<string>,ResultInterface<string>>>{
        const unpacked = payload.unpack();
        try {
            const token = unpacked.token;

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

            const notifications = await this.prisma.accountNotification.findMany({
                where: {
                    userId: verify.payload.userId,
                },
                skip: unpacked.skip,
                take: unpacked.take
            });

            return new Ok({data:'success', notifications: notifications});

        } catch(e) {
            Logger.log(e);
            return new Err({data:'error',error:'error'});
        }
    }

    public async createUserNotification(payload: CreateNotificationDto) {
        const unpacked = payload.unpack();

        const userExists = await this.prisma.user.findFirst({
            where: {id: unpacked.userId}
        });

        if (!(userExists)) {
            Logger.error("User not found");
            return;
        }

        try {
            await this.prisma.accountNotification.create({
                data: {
                    userId: unpacked.userId,
                    message: unpacked.message,
                    header: unpacked.header
                }
            })
        } catch(e) {
            Logger.error(e);
            return
        }
    }
}