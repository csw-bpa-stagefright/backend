import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaUtils {
    public async verifyExists<T>(params: {
        tableName: string;
        fieldName: string;
        value: T;
        prisma: PrismaService;
    }): Promise<boolean> {
        try {
            const { tableName, fieldName, value, prisma } = params;

            const result = await prisma.$executeRawUnsafe(`
                SELECT EXISTS (
                    SELECT 1 FROM ${tableName}
                    WHERE ${fieldName} = $1
                ) AS "exists"
            `, value);

            return result === 1;
        } catch(e) {
            return false;
        }
    }
}