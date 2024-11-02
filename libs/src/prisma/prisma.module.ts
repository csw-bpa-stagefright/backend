import { Global, Module } from '@nestjs/common';
import { PrismaService as PService } from './prisma.service';
import { PrismaUtils } from './prismautils.service';

@Global()
@Module({
  providers: [PService, PrismaUtils],
  exports: [PService, PrismaUtils],
})
export class PrismaModule {}

// export class PrismaService extends PService {}