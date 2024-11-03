import { Body, Controller, Headers, HttpStatus, Inject, Logger, Post, Res } from "@nestjs/common";
import { ConcertService } from "../services/concert/concert.service";
import { Response } from "express";

@Controller("concert")
export class ConcertController {
    constructor(
        @Inject(ConcertService) private readonly concertService: ConcertService
    ) {}

    @Post("getmany")
    async getManyConcerts(
        @Body() body: {
            skip: number;
            take: number
        },
        @Res() response: Response
    ) {
        try {
            if (!(body) || (body.skip == undefined) || (body.skip == null) || !(body.take))  {
                return response.status(HttpStatus.BAD_REQUEST).json({data:"error",error:"malformed body"});
            }
            const result = await this.concertService.getConcerts({...body}) as any;


            if ((result) && (result.error)) {
                return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:'error',error:result.error});
            }


            if (result.value) {
                return response.json(result.value);
            }

            return response.json(result);
        } catch(e) {
            Logger.error(e);
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:"error",error:e});
        }
    }

    @Post("create")
    async createConcert(
        @Body() body: {
            name: string;
            description: string;
            ticketCost: number;
            location: string;
            date: Date;
        },
        @Headers() headers,
        @Res() response: Response
    ) {
        try {
            const token = headers["authorization"];

            if (!(body) || !(body.name) || !(body.description) || !(body.ticketCost) || !(body.location) || !(body.date)) {
                return response.status(HttpStatus.BAD_REQUEST).json({ data: "malformed body" });
            }

            const result = await this.concertService.createConcert({
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
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({data:"error",error:e});
        }
    }
}