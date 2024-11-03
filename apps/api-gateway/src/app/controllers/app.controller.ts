import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { ClientProxy } from '@nestjs/microservices';
import { AuthService } from '@backend/libs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy,
    private readonly authService: AuthService,
    @Inject(CACHE_MANAGER) private  readonly cacheManager: Cache
  ) {}
  @Get("/ping")
  ping() {
    return "pong";
  }
}
