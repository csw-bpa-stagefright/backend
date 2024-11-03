import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule, PrismaModule } from '@backend/libs';
import { UserController } from './controllers/user.controller';
import { AccountActionsProvider } from './services/user/accountactions.service';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket/ticket.service';
import { NotificationsController } from './controllers/notifications.controller';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ConcertController } from './controllers/concert.controller';
import { ConcertService } from './services/concert/concert.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),  
          tls: parseInt(process.env.REDIS_USE_TLS)==1 ? {} : null,
          username: process.env.REDIS_USERNAME ?? "",
          password: process.env.REDIS_PASSWORD ?? "",
          db: 1,
          connectTimeout: 1000
        });

        return {
          store: store as unknown as CacheStore,
          ttl: 3 * 60000,
        };
      },
    }),
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
    AuthModule,
    PrismaModule
  ],
  controllers: [AppController, UserController, TicketController, NotificationsController, ConcertController],
  providers: [
    ConcertService,
    TicketService,
    AppService,
    {
      provide: "ACCOUNT_ACTIONS_PROVIDER",
      useClass: AccountActionsProvider
    },
  ],
})
export class AppModule {}