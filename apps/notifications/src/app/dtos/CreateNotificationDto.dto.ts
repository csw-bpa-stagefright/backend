import { Dto } from "@backend/libs";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNotificationDto implements Dto<CreateNotificationParamInterface, CreateNotificationReturn> {
    @IsNotEmpty()
    @IsString()
    private userId: string;


    @IsNotEmpty()
    @IsString()
    private header: string;


    @IsNotEmpty()
    @IsString()
    private message: string;

    constructor(params: CreateNotificationParamInterface) {
        this.userId = params.userId;
        this.header = params.header;
        this.message = params.message;
    }

    public unpack() {
        return {
            userId: this.userId,
            message: this.message,
            header: this.header
        };
    }
}

type CreateNotificationReturn = {
    userId: string;
    header: string;
    message: string;
}

interface CreateNotificationParamInterface {
    userId: string;
    header: string;
    message: string;
}