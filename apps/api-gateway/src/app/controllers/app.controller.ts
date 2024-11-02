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

  @Get("conn")
  async tryBilling(
    @Res() response: Response
  ) {
    const userId = "4fe5e80a-d284-4235-b96a-2d2d35d91306";

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYm9iIiwiZW1haWwiOiJib2IyMEBnbWFpbC5jb20iLCJwYXNzd29yZCI6InRlc3QxMjMiLCJpYXQiOjE3MzA0ODkxMjF9.oGS-SAk8GskgbuU18sgw4mD8YEeVEKWC569Mvd5FdPM';

    const payload = {
        userId: userId,
        concertId: 'cm2zcr6ih0000j5t4eiqwnd0g',
        quantity: 5
    }
    
    const res = await lastValueFrom(this.clientProxy.send<ResultInterface<string>>("PROCESS_TICKETS_PURCHASE", {
      token,
      payload      
    }));

    return response.json(res);
  }

  @Get("jwt")
  async tryJwtDecode(
    @Res() response: Response
  ) {
      const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYm9iIiwiZW1haWwiOiJib2JieUBnbWFpbC5jb20iLCJpYXQiOjE3MzA1MDIxNzV9.LhtAb4R94foeex-LMEw2EiOo5qCuqR6cpCEq-mS3DSw";

      const decoded = this.authService.verifyJwt(jwt);
      return response.json(decoded);
  }
}
