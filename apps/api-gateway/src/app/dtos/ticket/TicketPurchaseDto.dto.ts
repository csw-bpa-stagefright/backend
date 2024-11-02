import { Dto } from "@backend/libs";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TicketPurchaseDto implements Dto<TicketPurchasePayloadInterface, TicketPurchaseDtoReturn> {
    @IsNotEmpty()
    @IsString()
    private userId: string;

    @IsNotEmpty()
    @IsString()
    private concertId: string;

    @IsNotEmpty()
    @IsNumber()
    private quantity: number;

    constructor(payload: TicketPurchasePayloadInterface) {
        this.userId = payload.userId;
        this.concertId = payload.concertId;
        this.quantity= payload.quantity;
    }

    public unpack() {
        return {
            userId: this.userId,
            concertId: this.concertId,
            quantity: this.quantity
        };
    }
}

type TicketPurchaseDtoReturn = {
    userId: string;
    concertId: string;
    quantity: number;
}

interface TicketPurchasePayloadInterface {
    userId: string;
    concertId: string;
    quantity: number;
}