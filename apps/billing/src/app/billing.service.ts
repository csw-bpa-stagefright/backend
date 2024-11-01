import { PrismaService } from '@backend/libs';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
}
