import { AuthService, PrismaService } from "@backend/libs";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { CreateNotificationDto } from "../dtos/CreateNotificationDto.dto";
import { GetNotificationsDto } from "../dtos/GetNotificationsDto.dto";
import { Result, Err, Ok, ResultInterface } from "@backend/libs";
import { AccountNotification, Concert } from "@prisma/client";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class NotificationsService {
    constructor(
        @Inject(PrismaService) private readonly prisma: PrismaService,
        @Inject(AuthService) private readonly authService: AuthService,
        @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy
    ) {}

    public async sendNewConcertNotifications(payload: {
        concert: Concert
    }) {
        for (const user of await this.prisma.user.findMany()) {
            await this.clientProxy.emit("CREATE_USER_NOTIFICATION", {
                userId: user.id,
                header: `New Concert Has Dropped: ${payload.concert.name}! Ticket sales are available!`,
                message: `Buy tickets to ${payload.concert.name} for just $${payload.concert.ticketCost}!`
            })
        }
    }

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