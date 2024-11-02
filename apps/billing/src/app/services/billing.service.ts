import { AuthService, CreateUserBillingDto, Err, Ok, PrismaService, PrismaUtils, ProcessTicketsPurchaseDto, Result, ResultInterface } from '@backend/libs';
import {  Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { VerifyJwtReturnObject } from '@backend/libs';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BillingService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(PrismaUtils) private readonly prismaUtils: PrismaUtils
  ) {}

  async processTicketsPurchase(token: string, payload: ProcessTicketsPurchaseDto): Promise<Result<ResultInterface<string>,ResultInterface<string>>> {
    try {
      const unpacked = payload.unpack();
      Logger.log("UNPACKED: ");
      Logger.log(unpacked)

      let authentication: VerifyJwtReturnObject;

      try {
        authentication = this.authService.verifyJwt(token);
        if (!(authentication) || (authentication.statusCode == 1)) {
          throw new Error("An error occured");
        }
      } catch(e) {
        Logger.error("Auth Error");
        return new Err({data: 'error',error:e});
      }

      if (authentication.isValid == false) {
        Logger.error("Invalid Token Error");
        return new Err({data:'error',error:"Invalid Token"});
      }

      const userExists = await this.prisma.user.findFirst({
        where: {
            id: unpacked.userId
        }
      });

      if (!(userExists)) {
        Logger.error("No User Error");
        return new Err({data:'error',error:'User does not exist'});
      }

      const concertExists = await this.prisma.concert.findFirst({
        where: {
          id: unpacked.concertId
        }
      })

      if (!(concertExists)) {
        Logger.error("No Concert Error");
        return new Err({data:'error',error:'Concert does not exist'});
      }

      const ticketRefs = [];

      const cleanupTicketsOnError = async(ticketRefs: string[]) => {
        for (const ticketId of ticketRefs) {
          try {
            await this.prisma.ticket.delete({
              where: {
                id: ticketId
              }
            })
          } catch(e) {
            Logger.error(e);
          }
        }
      }


      for (let i = 0; i < unpacked.quantity; i++) {
        const newTicket = await this.prisma.ticket.create({
          data: {
            userId: unpacked.userId,
            concertId: unpacked.concertId,
          }
        });
        ticketRefs.push(newTicket.id);

        const res = await lastValueFrom(this.clientProxy.send<ResultInterface<string>>("CREATE_USER_BILLING", {
          userId: unpacked.userId,
          description: `Bill for ticket to concert ${concertExists.name}`,
          amount: concertExists.ticketCost
        }));

        if (res.data=='error') {
          await cleanupTicketsOnError(Array.from(ticketRefs));
          return new Err({data: 'error', error:'Ticket Billing Failed'});
        }
      }

      return new Ok({data:'success'});

    } catch(error) {
      Logger.error(error);
      return new Err({data:'error'});
    }
  }

  async createNewBilling(payload: CreateUserBillingDto): Promise<Result<CreateBillingResultInterface, CreateBillingResultInterface>> {
    try {
      // eslint-disable-next-line
      const newBilling = await this.prisma.bill.create({data:payload.unpack()});

      return new Ok({data:'success'});
    } catch(e) {
      return new Err({data:'error',error:e})
    }
  }
}

interface CreateBillingResultInterface extends ResultInterface<string> {
  data: "success" | "error";
  error?:string;
}