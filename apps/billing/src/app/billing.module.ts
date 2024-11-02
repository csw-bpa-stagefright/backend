import { Module } from '@nestjs/common';

import { BillingController } from './controllers/billing.controller';
import { BillingService } from './services/billing.service';
import { AuthModule, PrismaModule } from '@backend/libs';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClientsModule.register([
      {
        name: 'CLIENT_PROXY',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),  
          username: process.env.REDIS_USERNAME ?? "",
          password: process.env.REDIS_PASSWORD ?? "",
          tls: parseInt(process.env.REDIS_USE_TLS)==1 ? {} : null,
        },
      }
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule {}