import { Module } from '@nestjs/common';
import { PvzService } from './pvz.service';
import { PvzController } from './pvz.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PvzController],
  providers: [PvzService, PrismaService],
})
export class PvzModule {}
