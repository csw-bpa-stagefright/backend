import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { NewJwtReturnObject } from "../interfaces/NewJwtReturnObject.interface";
import { VerifyJwtReturnObject } from "../interfaces/VerifyJwtReturnObject.interface";

@Injectable()
export class JwtService {
    public newJwt(
        payload: any
      ): NewJwtReturnObject {
        try {
          const token = jwt.sign(payload, process.env['JWT_SECRET'] as string);
          return { token: token, statusCode: 0 }
        } catch(e) {
          return { statusCode: 1 }
        }
      }
      
      public verifyJwt(
        token: string
      ): VerifyJwtReturnObject {
        try {
          const verify = jwt.verify(token, process.env["JWT_SECRET"] as string);
          if (verify) {
            return { isValid: true, statusCode: 0 }
          }
          return { isValid: false, statusCode: 0 }
        } catch(e) {
          return { statusCode: 1 }
        }
      } 
}