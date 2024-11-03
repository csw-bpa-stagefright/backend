import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { TicketPurchaseDto } from "../../dtos/ticket/TicketPurchaseDto.dto";
import { lastValueFrom } from "rxjs";
import { AuthService, Err, Ok, PrismaService, Result, ResultInterface } from "@backend/libs";
import { Concert, ConcertAttendence, Ticket } from "@prisma/client";

@Injectable()
export class TicketService {
    constructor(
        @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy,
        @Inject(AuthService) private readonly authService: AuthService,
        @Inject(PrismaService) private readonly prisma: PrismaService
    ) {
        //
    }

    public async getTicket(payload: { token: string, ticketId: string }): Promise<Result<{
        user?: {
            email: string;
            id: string;
            name: string;
        },
        concert?: Concert,
        ticket?: Ticket
    }&ResultInterface<string>,ResultInterface<string>>> {
        try {
            const { token, ticketId } = payload;

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

            const ticketExists = await this.prisma.ticket.findFirst({
                where: {
                    id: ticketId
                }
            });

            if (!(ticketExists)) {
                return new Err({data:'error',error:"Ticket not found"});
            }

            if (!(ticketExists.userId == verify.payload.userId)) {
                return new Err({data:'error',error:"Unauthorized"});
            }

            const concertDetails = await this.prisma.concert.findFirst({
                where: {
                    id: ticketExists.concertId 
                }
            });

            if (!(concertDetails)) {
                return new Err({data:'error',error:"Concert not found"});
            }

            const userDetails = await this.prisma.user.findFirst({
                where: {
                    id: verify.payload.userId
                },
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            });


            if (!(userDetails)) {
                return new Err({data:'error',error:"User not found"});
            }

            return new Ok({
                data: "success",
                ticket: ticketExists,
                concert: concertDetails,
                user: userDetails
            })
        } catch(e) {
            Logger.error(e);
            return new Err({data:'error',error:e});
        }
    }

    public async scanTicket(payload: {token: string, ticketId: string, concertId: string}): Promise<Result<{concertAttendence?:ConcertAttendence}&ResultInterface<string>,ResultInterface<string>>> {
        try {
            const { token, ticketId, concertId } = payload;

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

            if (!(verify.payload.isAdmin) || (verify.payload.isAdmin == false)) {
                return new Err({data:'error',error:"Unauthorized"});
            }

            const ticketExists = await this.prisma.ticket.findFirst({
                where: {
                    id: ticketId
                }
            });

            if (!(ticketExists)) {
                return new Err({data:'error',error:"Ticket not found"});
            }

            const concertExists = await this.prisma.concert.findFirst({
                where: {
                    id: concertId
                }
            });

            if (!(concertExists)) {
                return new Err({data:'error',error:"Concert not found"});
            }

            const alreadyInAttendence = await this.prisma.concertAttendence.findFirst({
                where: {
                    ticketId: ticketId,
                    concertId: concertId
                }
            });

            if (alreadyInAttendence) {
                return new Err({data:"error",error:"Ticket already scanned"});
            }

            const newAttendence = await this.prisma.concertAttendence.create({
                data: {
                    ticketId: ticketId,
                    concertId: concertId
                }
            });

            return new Ok({data:"success",concertAttendence:newAttendence});

        } catch(e) {
            Logger.error(e);
            return new Err({data:'error',error:e});
        }
    }

    public async purchaseTickets(token: string, payload: TicketPurchaseDto): Promise<Result<ResultInterface<string>, ResultInterface<string>>> {
        try {
            const unpacked = payload.unpack();
            await this.clientProxy.connect();

            const res = await lastValueFrom(this.clientProxy.send<ResultInterface<string>>("PROCESS_TICKETS_PURCHASE", {
                token: token,
                payload: unpacked
            }));

            await this.clientProxy.close();

            if (res.data=='error') {
                return new Err({data:'error',error:res.error});
            }

            return new Ok({data:'success'});

        } catch(e) {
            Logger.error(e);
            return new Err({data:'error',error:e});
        }
    }
}