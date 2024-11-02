import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule, PrismaModule } from '@backend/libs';
import { UserController } from './controllers/user.controller';
import { AccountActionsProvider } from './services/user/accountactions.service';
import { TicketController } from './controllers/ticket.controller';
import { TicketService } from './services/ticket/ticket.service';

@Module({
  imports: [
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
  controllers: [AppController, UserController, TicketController],
  providers: [
    TicketService,
    AppService,
    {
      provide: "ACCOUNT_ACTIONS_PROVIDER",
      useClass: AccountActionsProvider
    },
  ],
})
export class AppModule {}