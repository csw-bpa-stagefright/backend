import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule, PrismaModule } from '@backend/libs';
import { UserController } from './controllers/user.controller';
import { AccountActionsProvider } from './services/user/accountactions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BILLING_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),  
        },
      }
    ]),
    AuthModule,
    PrismaModule
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    {
      provide: "ACCOUNT_ACTIONS_PROVIDER",
      useClass: AccountActionsProvider
    },
  ],
})
export class AppModule {}