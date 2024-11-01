import { Body, Controller, HttpStatus, Inject, Post, Res } from "@nestjs/common";
import { AccountActionsProvider } from "../services/user/accountactions.service";
import { AuthService, Err } from "@backend/libs";
import e, { Response } from 'express';
import { UserCreationPayload } from "../dtos/user/user-creation-payload.dto";
import { UserLoginPayload } from "../dtos/user/user-login-payload.dto";


@Controller("auth")
export class UserController {
    constructor (
        @Inject("ACCOUNT_ACTIONS_PROVIDER") private readonly accountActions: AccountActionsProvider,
        private readonly authService: AuthService
    ) {}

    @Post("signup")
    async createUser(
        @Body() body: {
            name: string,
            email: string,
            password: string
        },
        @Res() response: Response
    ) {
        if (!(body) || !(body.name) || !(body.email) || !(body.password)) {
            return response.status(HttpStatus.BAD_REQUEST).json({ data: "malformed body" });
        }
        const hashedPassword: string = await this.authService.generateHashedPassword(body.password);

        const UserCreationPayloadDto = new UserCreationPayload({
            name: body.name,
            email: body.email,
            hashedPassword: hashedPassword
        });

        const result = await this.accountActions.createUser(UserCreationPayloadDto);

        if (
            (result.isErr())
            ||
            (result instanceof Err)
        ) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result.unwrapErr());
        }

        const unwrapped = result.unwrapOr({
            data: 'error'
        });

        const token = this.authService.createNewJwt({
            name: unwrapped.user.name,
            email: unwrapped.user.email
        });

        unwrapped["token"] = token;

        return response.json(unwrapped);
    }

    @Post("login")
    async loginUser(
        @Body() body: {
            email: string,
            password: string
        },
        @Res() response: Response
    ) {
        if (!(body) || !(body.email) || !(body.password)) {
            return response.status(HttpStatus.BAD_REQUEST).json({ data: "malformed body" });
        }

        const LoginUserPayloadDto = new UserLoginPayload({
            email: body.email,
            password: body.password
        });

        const result = await this.accountActions.loginUser(LoginUserPayloadDto);

        if (
            (result.isErr())
            ||
            (result instanceof Err)
        ) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(result.unwrapErr());
        }

        const unwrapped = result.unwrapOr({
            data: 'error'
        });
    
        return response.json(unwrapped);
    }
}