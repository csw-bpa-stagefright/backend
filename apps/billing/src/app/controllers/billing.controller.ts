import { Controller, Logger } from '@nestjs/common';

import { BillingService } from '../services/billing.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserBillingDto, Err, ProcessTicketsPurchaseDto } from '@backend/libs';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService
  ) {}

  @MessagePattern("TEST_PATTERN")
  async testPattern() {
    return "hi";
  }

  @MessagePattern("PROCESS_TICKETS_PURCHASE")
  async processTicketsPurchase(
    @Payload() payload: {
      token: string;
      payload: {
        userId: string;
        concertId: string;
        quantity: number;
      }
    },
  ) {
    const ProcessTicketsPurchasePayload = new ProcessTicketsPurchaseDto(payload.payload);

    const result = await this.billingService.processTicketsPurchase(payload.token, ProcessTicketsPurchasePayload);

    if (
        (result.isErr())
        ||
        (result instanceof Err)
    ) {
      return {
        data: 'service error',
        error:result.unwrapErr()
      };
    }

    const unwrapped = result.unwrapOr({
        data: 'error'
    });

    return unwrapped;
  }

  @MessagePattern("CREATE_USER_BILLING")
  async createUserBilling(
    @Payload() payload: {
      userId: string,
      amount: number,
      description: string;
      imageUrl?:string;
    }
  ) {
    Logger.log("CREATE_USER_BILLING ACTIVATED")
    const CreateUserBillingPayload = new CreateUserBillingDto(payload);

    const result = await this.billingService.createNewBilling(CreateUserBillingPayload);

    if (
        (result.isErr())
        ||
        (result instanceof Err)
    ) {
      return {
        data: 'error'
      };
    }

    const unwrapped = result.unwrapOr({
        data: 'error'
    });
    return unwrapped;
  }
}