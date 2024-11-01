import { Controller, Logger } from '@nestjs/common';

import { BillingService } from '../services/billing.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateUserBillingDto, Err } from '@backend/libs';

@Controller()
export class BillingController {
  constructor(
    private readonly billingService: BillingService
  ) {}

  @EventPattern("CREATE_USER_BILLING")
  async createUserBilling(
    @Payload() payload: {
      userId: string,
      amount: number,
      description: string;
      imageUrl?:string;
    }
  ) {
    Logger.log("User Billing is Toggled")

    const CreateUserBillingPayload = new CreateUserBillingDto(payload);

    const result = await this.billingService.createNewBilling(CreateUserBillingPayload);

    if (
        (result.isErr())
        ||
        (result instanceof Err)
    ) {
      return;
    }

    const unwrapped = result.unwrapOr({
        data: 'error'
    });

    return unwrapped;
  }
}
