import { Global, Module } from '@nestjs/common';
import { PrismaService as PService } from './prisma.service';

@Global()
@Module({
  providers: [PService],
  exports: [PService],
})
export class PrismaModule {}

// export class PrismaService extends PService {}