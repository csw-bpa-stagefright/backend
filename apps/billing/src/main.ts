import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { BillingModule } from './app/billing.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BillingModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),  
      }
    }
  );

  await app.listen();
}

bootstrap();
