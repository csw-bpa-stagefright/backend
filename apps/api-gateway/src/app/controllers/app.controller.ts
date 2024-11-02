import { Controller, Get, HttpStatus, Inject, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from '../services/app.service';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthService, ResultInterface } from '@backend/libs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("CLIENT_PROXY") private readonly clientProxy: ClientProxy,
    private readonly authService: AuthService
  ) {}
}
