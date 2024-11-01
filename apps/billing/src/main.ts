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
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        tls: {}
      }
    }
  );

  await app.listen();
}

bootstrap();
