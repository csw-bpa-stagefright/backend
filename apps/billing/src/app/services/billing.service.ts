import { CreateUserBillingDto, Err, Ok, PrismaService, Result } from '@backend/libs';
import {  Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async createNewBilling(payload: CreateUserBillingDto): Promise<Result<CreateBillingResultInterface, CreateBillingResultInterface>> {
    try {
      // eslint-disable-next-line
      const newBilling = await this.prisma.bill.create({data:payload.unpack()});

      return new Ok({data:'success'});
    } catch(e) {
      return new Err({data:'error',error:e})
    }
  }
}

interface CreateBillingResultInterface {
  data: "success" | "error";
  error?:string;
}