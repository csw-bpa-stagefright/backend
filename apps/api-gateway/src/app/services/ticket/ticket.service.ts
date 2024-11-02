import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { TicketPurchaseDto } from "../../dtos/ticket/TicketPurchaseDto.dto";
import { lastValueFrom } from "rxjs";
import { Err, Ok, Result, ResultInterface } from "@backend/libs";

@Injectable()
export class TicketService {
    constructor(
        @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy
    ) {
        //
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