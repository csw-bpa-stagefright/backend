import { Global, Module } from "@nestjs/common";
import { AuthService } from "./services/auth.service";
import {  BcryptService } from "./services/bcrypt.service";
import { JwtService } from "./services/jwt.service";
import { PrismaModule } from "../prisma/prisma.module";
import { UserAuthService } from "./services/userauth.service";

@Global()
@Module({
    controllers: [],
    imports: [
        PrismaModule
    ],
    providers: [
        AuthService,
        {
            provide: "BCRYPT_PROVIDER",
            useClass: BcryptService
        },
        {
            provide: 'JWT_PROVIDER',
            useClass: JwtService
        },
        {
            provide: "USER_AUTH_PROVIDER",
            useClass: UserAuthService
        }
    ],
    exports: [AuthService]
})
export class AuthModule {}