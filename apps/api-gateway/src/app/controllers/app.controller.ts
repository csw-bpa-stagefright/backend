import { Controller } from '@nestjs/common';

import { AppService } from '../services/app.service';
// import { AuthService } from '@backend/libs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}
}
