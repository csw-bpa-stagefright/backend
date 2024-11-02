import { Injectable, Logger } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { NewJwtReturnObject } from "../interfaces/NewJwtReturnObject.interface";
import { VerifyJwtReturnObject } from "../interfaces/VerifyJwtReturnObject.interface";
import { Result, Err, Ok } from "../../classes/result.class";
import { ResultInterface } from "../../interfaces/ResultInterface.interface";

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
          const verify = jwt.verify(token, process.env['JWT_SECRET'] as string);

          if (verify) {
            return { isValid: true, statusCode: 0, payload: verify }
          }
          return { isValid: false, statusCode: 0, payload:null }
        } catch(e) {
          Logger.log(e)
          return { statusCode: 1, payload:null }
        }
      } 
}