import { Dto } from "@backend/libs";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetNotificationsDto implements Dto<GetNotificationsParamInterface, GetNotificationsReturn> {
    @IsNotEmpty()
    @IsString()
    private token: string;

    @IsNotEmpty()
    @IsNumber()
    private take: number;

    @IsNotEmpty()
    @IsNumber()
    private skip: number;

    constructor(params: GetNotificationsParamInterface) {
        this.token= params.token;
        this.skip = params.skip;
        this.take = params.take;
    }

    public unpack() {
        return {
            token: this.token,
            take: this.take,
            skip: this.skip
        };
    }
}

type GetNotificationsReturn = {
    token: string;
    take: number;
    skip: number;
}

interface GetNotificationsParamInterface {
    token: string;
    take: number;
    skip: number;
}