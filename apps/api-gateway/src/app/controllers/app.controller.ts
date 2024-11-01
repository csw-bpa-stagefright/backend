import { Controller, Get, Inject } from '@nestjs/common';

import { AppService } from '../services/app.service';
import { ClientProxy } from '@nestjs/microservices';
// import { AuthService } from '@backend/libs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("BILLING_SERVICE") private readonly billingClient: ClientProxy
  ) {}

  @Get("conn")
  async tryBilling() {
    const userId = "4fe5e80a-d284-4235-b96a-2d2d35d91306";
    await this.billingClient.connect();

    this.billingClient.emit("CREATE_USER_BILLING", {
      userId: userId,
      amount: 100.3,
      description: "Example billing via microservices"
    })

    return "success";
  }
}
