import { Controller, Get, Logger } from '@nestjs/common';

import { BillingService } from './billing.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService
  ) {}
}
