import { Module } from '@nestjs/common';

import { BillingController } from './controllers/billing.controller';
import { BillingService } from './services/billing.service';
import { PrismaModule } from '@backend/libs';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}