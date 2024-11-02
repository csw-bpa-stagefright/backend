import { Inject, Injectable, Logger } from "@nestjs/common";
import { BcryptService } from "./bcrypt.service";
import { JwtService } from "./jwt.service";
import { NewJwtReturnObject } from "../interfaces/NewJwtReturnObject.interface";
import { VerifyJwtReturnObject } from "../interfaces/VerifyJwtReturnObject.interface";
import { UserAuthService } from "./userauth.service";
import { Result, Err, Ok } from "../../classes/result.class";
import { ResultInterface } from "../../interfaces/ResultInterface.interface";


@Injectable()
export class AuthService {
   constructor(
        @Inject("BCRYPT_PROVIDER") private readonly bcryptService: BcryptService,
        @Inject("JWT_PROVIDER") private readonly jwtService: JwtService,
        @Inject("USER_AUTH_PROVIDER") private readonly userAuthService: UserAuthService 
   )  {}

   public async generateHashedPassword(plainTextPassword: string): Promise<string> {
      return await this.bcryptService.Hash(plainTextPassword);
   }

   public async checkHashedPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
      return await this.bcryptService.Compare(plainTextPassword, hashedPassword);
   }

   public createNewJwt(payload: any): NewJwtReturnObject {
      Logger.log(payload)
      return this.jwtService.newJwt(payload);
   }

   public verifyJwt(token: string): VerifyJwtReturnObject {
      return this.jwtService.verifyJwt(token);
   }

   public async verifyUserWithCredentials(email: string, password: string) {
      return await this.userAuthService.VerifyUserWithCredentials(email, password);
   }
}