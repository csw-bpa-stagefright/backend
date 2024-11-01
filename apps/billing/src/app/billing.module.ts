import { Module } from '@nestjs/common';

import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { PrismaModule } from '@backend/libs';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}
