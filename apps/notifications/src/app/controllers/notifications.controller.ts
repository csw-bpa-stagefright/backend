import { Controller, Get, Inject, Logger } from "@nestjs/common";
import { NotificationsService } from "../services/notifications.service";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { CreateNotificationDto } from "../dtos/CreateNotificationDto.dto";
import { Err, Ok, Result, ResultInterface } from "@backend/libs";
import { AccountNotification, Concert } from "@prisma/client";
import { GetNotificationsDto } from "../dtos/GetNotificationsDto.dto";

@Controller()
export class NotificationsController {
    constructor(
        @Inject(NotificationsService) private readonly notificationsService: NotificationsService
    ) {}

    @Get("/ping")
    ping() {
        return "pong";
    }

    @EventPattern("NEW_CONCERT_ALERT")
    async sendNewConcertNotifications(
        @Payload() payload: {
            concert: Concert
        }
    ) {
        try {
            await this.notificationsService.sendNewConcertNotifications({...payload});
        } catch(e) {
            Logger.error(e);
        }
    }

    @MessagePattern("GET_USER_NOTIFICATIONS")
    async getUserNotifications(
        @Payload() payload: {
            token: string;
            skip: number;
            take: number;
        }
    ): Promise<Result<{
        notifications?: AccountNotification[];
    } & ResultInterface<string>, ResultInterface<string>>> {
        try {
            if (!(payload) || !(payload.token) || (payload.skip == undefined) || (payload.skip == null) || (payload.take == undefined) || (payload.take == null)){
                Logger.log("malformed error")
                return new Err({data:'error',error:"Malformed payload"});
            }
            
            const GetNotificationsPayload = new GetNotificationsDto(payload);

            const notifications = await this.notificationsService.getUserNotifications(GetNotificationsPayload);

            return notifications;
        } catch(e) {
            return new Err({data:'error', error:'An error occured'});
        }
    }

    @EventPattern("CREATE_USER_NOTIFICATION")
    async createUserNotification(
        @Payload() payload: {
            userId: string;
            header: string;
            message: string;
        }
    ) {
        Logger.log("create user notification");
        if (!(payload) || !(payload.userId) || !(payload.header) || !(payload.message)) {
            return;
        }
    
        const CreateNotificationPayload = new CreateNotificationDto(payload);
        
        try {
            await this.notificationsService.createUserNotification(CreateNotificationPayload);
        } catch(e) {
            Logger.error(e);
        }
    }
}