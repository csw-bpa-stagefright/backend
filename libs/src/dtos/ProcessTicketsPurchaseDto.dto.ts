import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Dto } from "../classes/dto.class";

export class ProcessTicketsPurchaseDto implements Dto<ProcessTicketsPurchaseParamsPayload, ProcessTicketsPurchaseDtoPayload> {
    @IsNotEmpty()
    @IsString()
    private concertId;

    @IsNotEmpty()
    @IsString()
    private userId;

    @IsNotEmpty()
    @IsNumber()
    private quantity;

    constructor(params: ProcessTicketsPurchaseParamsPayload) {
        this.concertId = params.concertId;
        this.quantity = params.quantity;
        this.userId = params.userId;
    }

    public unpack() {
        return {
            concertId: this.concertId,
            userId: this.userId,
            quantity: this.quantity
        }
    }
}

type ProcessTicketsPurchaseDtoPayload = {
    concertId: string;
    userId: string;
    quantity: number;
}

interface ProcessTicketsPurchaseParamsPayload {
    concertId: string;
    userId: string;
    quantity: number;
}