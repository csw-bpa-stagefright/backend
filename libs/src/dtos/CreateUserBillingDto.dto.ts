import { IsDecimal, IsNotEmpty, IsString } from "class-validator";
import { Dto } from "../classes/dto.class";

export class CreateUserBillingDto implements Dto<CreateUserBillingParamsPayload, UserBillingDtoPayload> {
    @IsNotEmpty()
    @IsString()
    private userId: string;

    @IsNotEmpty()
    @IsDecimal()
    private amount;

    @IsNotEmpty()
    @IsString()
    private description: string;

    @IsString()
    private imageUrl = '';


    constructor(params: CreateUserBillingParamsPayload) {
        this.userId = params.userId;
        this.amount = params.amount;
        this.description = params.description;
        if (params.imageUrl) {
            this.imageUrl = params.imageUrl;
        }
    }

    public unpack() {
        return {
            userId: this.userId,
            amount: this.amount,
            description: this.description,
            imageUrl: this.imageUrl
        };
    }
}

type UserBillingDtoPayload = {
    userId: string,
    amount: number,
    description: string,
    imageUrl?: string
}

interface CreateUserBillingParamsPayload {
    userId: string;
    amount: number;
    description:string
    imageUrl?:string;
}