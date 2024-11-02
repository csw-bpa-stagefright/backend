import { Result, ResultInterface } from "@backend/libs";
import { Body, Controller, Get, Header, Headers, HttpStatus, Inject, Logger, Post, Res } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Response } from "express";
import { lastValueFrom } from "rxjs";
import { AccountNotification } from "@prisma/client";

@Controller("notifications")
export class NotificationsController {
    constructor(
        @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy
    ) {}

    @Post("get")
    async getNotifications(
        @Body() body: {
            skip: number;
            take: number;
        },
        @Headers() headers,
        @Res() response: Response
    ) {
        try {
            await this.clientProxy.connect();
            const token = headers["authorization"];

            const result = await lastValueFrom(this.clientProxy.send("GET_USER_NOTIFICATIONS", {
                skip: body.skip,
                take: body.take,
                token: token
            }));

            Logger.log(result);

            if (!(result.value) || (result.value.data == "error")) {
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:"error",error: result.error.error});
            }

            const unwrappedResult = result.value;

            await this.clientProxy.close();

            return response.json({data:"success",notifications:unwrappedResult.notifications});
        } catch(e) {
            Logger.error(e);
            await this.clientProxy.close();
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:"error",error:"An error occured"});
        }
    }
}