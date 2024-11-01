import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject("BILLING_SERVICE") private readonly billingService: ClientProxy,
  ) {}
}