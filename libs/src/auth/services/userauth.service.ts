import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserExistReturnObject } from "../interfaces/UserExistsReturnObject.interface";
import { VerifyUserReturnObject } from "../interfaces/VerifyUserReturnObject.interface";
import { BcryptService } from "./bcrypt.service";

@Injectable()
export class UserAuthService {
    constructor
    (
        private readonly prisma: PrismaService,
        @Inject('BCRYPT_PROVIDER') private readonly bcryptService: BcryptService
    ) {}

    private async UserExists(
        email: string
      ): Promise<UserExistReturnObject> {
        try {
          const usersQuery = await this.prisma.user.findFirst({
            where: {
              email: email
            }
          })

          if (!usersQuery) {
            return { userExists: false, statusCode : 0 };
          } 

          return { userExists: true, statusCode : 0, userData: usersQuery };
        } catch(error) {
          return { statusCode: 1 }
        }
    }

    async VerifyUserWithCredentials(
        email: string,
        password: string
      ): Promise<VerifyUserReturnObject> {
        try {
          const verifyUserExists: UserExistReturnObject = await this.UserExists(email as string);

          if (verifyUserExists.statusCode === 1) {
            return { statusCode: 1, errorInfo: "Internal Server Error: [USER_AUTH_SERVICE] Failed", errorCode: 500 }
          }

          if (!verifyUserExists.userExists) {
            return { statusCode: 1, errorInfo: "Email not registered", errorCode: 401 }
          }

          const hashedPassword = verifyUserExists.userData?.hashedPassword;

          const doesPasswordMatch: boolean = await this.bcryptService.Compare(password as string, hashedPassword as string); 

          if (!doesPasswordMatch) {
            return { statusCode: 1, errorInfo: "Invalid Credentials", errorCode: 403 }
          }

          return { userVerified: true, statusCode: 0, userData: verifyUserExists.userData }
        } catch(e) {
          return { statusCode: 1, errorInfo: e as string, errorCode: 500 }
        }
      }
}