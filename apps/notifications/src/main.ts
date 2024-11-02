import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { NotificationsModule } from './app/notifications.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationsModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),  
        username: process.env.REDIS_USERNAME ?? "",
        password: process.env.REDIS_PASSWORD ?? "",
        tls: parseInt(process.env.REDIS_USE_TLS)==1 ? {} : null,
      }
    }
  );

  await app.listen();
}

bootstrap();
