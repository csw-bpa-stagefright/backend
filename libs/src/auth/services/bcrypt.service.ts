import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

@Injectable()
export class BcryptService {
    async Hash(
        string: string, 
        /* eslint-disable-next-line */
        hashRounds: number = 8
      ): Promise<string> {
        const hashedString = await bcrypt.hash(string as string, hashRounds as number);
        return hashedString as string;
      }
      
       async Compare(
        plainText: string, 
        hashedText: string
      ): Promise<boolean> {
        const match = await bcrypt.compare(plainText as string, hashedText as string);
        return match as boolean;
      }
}