import { Dto } from "@backend/libs";
import { IsNotEmpty, IsString } from "class-validator";

export class UserCreationPayload implements Dto<UserCreationPayloadParams, UnpackReturnType> {
    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString()
    public email: string;

    @IsNotEmpty()
    @IsString()
    public hashedPassword: string;

    public unpack() {
        return {
            name: this.name,
            email: this.email,
            hashedPassword: this.hashedPassword
        }
    }

    constructor(
        params: UserCreationPayloadParams
    ) {
        this.name = params.name;
        this.email = params.email;
        this.hashedPassword = params.hashedPassword; 
    }
}

type UnpackReturnType = {
    name: string,
    email: string,
    hashedPassword: string,
}

interface UserCreationPayloadParams {
    name: string,
    email: string,
    hashedPassword: string;
}