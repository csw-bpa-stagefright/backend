import { Dto } from "@backend/libs";
import { IsNotEmpty, IsString } from "class-validator";

export class UserLoginPayload implements Dto<UserLoginPayloadParams, UnpackReturnType> {
    @IsNotEmpty()
    @IsString()
    private email: string;

    @IsNotEmpty()
    @IsString()
    private password: string;

    public unpack() {
        return {
            email: this.email,
            password: this.password 
        }
    }

    constructor(params: UserLoginPayloadParams) {
        this.email = params.email;
        this.password = params.password;
    }
}

type UnpackReturnType = {
    email: string,
    password: string
}

interface UserLoginPayloadParams {
    email: string;
    password: string;
}