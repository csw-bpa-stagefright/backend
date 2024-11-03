import { Body, Controller, Headers, HttpStatus, Logger, Post, Res } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Response } from "express";
import { TicketService } from "../services/ticket/ticket.service";
import { TicketPurchaseDto } from "../dtos/ticket/TicketPurchaseDto.dto";
import { AuthService } from "@backend/libs";

@Controller("ticket")
export class TicketController {
    constructor(
    @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy,
    @Inject(TicketService) private readonly ticketService: TicketService,
    @Inject(AuthService) private readonly authService: AuthService
    ) {}

    @Post("get")
    async getTicketInfo(
        @Body() body: {
            ticketId: string
        },
        @Headers() headers,
        @Res() response: Response
    ) {
        try {
            const token = headers["authorization"];

            if (!(body) || !(body.ticketId)) {
                return response.status(HttpStatus.BAD_REQUEST).json({data:'error',error:'malformed body'});
            }

            const result = await this.ticketService.getTicket({
                token: token,
                ...body
            }) as any;

            if ((result) && (result.error)) {
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:'error',error:result.error});
            }

            if (result.value) {
                return response.json(result.value);
            }

            return response.json(result);
        } catch(e) {
            Logger.error(e);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:'error',error:e});
        }
    }

    @Post("scan")
    async scanTicket(
        @Body() body: {
            ticketId: string;
            concertId: string;
        },
        @Headers() headers,
        @Res() response: Response
    ) {
        try {
            const token = headers["authorization"];

            const result = await this.ticketService.scanTicket({
                token: token,
                ...body
            }) as any;

            if ((result) && (result.error)) {
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:'error',error:result.error});
            }

            if (result.value) {
                return response.json(result.value);
            }

            return response.json(result);

        } catch(e) {
            Logger.error(e);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:'error',error:e});
        }
    }

    @Post("purchase")
    async purchaseTickets(
        @Body() body: {
        // userId: string,
        concertId: string,
        quantity: number
        },
        @Headers() headers,
        @Res() response: Response
    ) {
        const token = headers["authorization"];
        Logger.log(token)
        if (!(token)) {
            return response.status(HttpStatus.FORBIDDEN).json({data:"forbidden"})
        }

        if (!(body) || !(body.concertId) || !(body.quantity)) {
            return response.status(HttpStatus.BAD_REQUEST).json({data:"Bad Request"});
        }

        const verify = this.authService.verifyJwt(token);

        if (verify.statusCode == 1) {
            return response.status(HttpStatus.FORBIDDEN).json({data:"Forbidden"});
        }

        const userId = verify.payload.userId;

        if (!(userId)) {
            return response.status(HttpStatus.BAD_REQUEST).json({data:"Bad Request"});
        }

        const TicketPurchasePayload = new TicketPurchaseDto({
            userId: userId,
            concertId: body.concertId,
            quantity: body.quantity
        });
        const result = await this.ticketService.purchaseTickets(token, TicketPurchasePayload);

        return response.json(result.unwrapOr({data:'error',error:'default error'}));
    }
}