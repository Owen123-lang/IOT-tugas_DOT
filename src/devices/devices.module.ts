import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [DevicesService, PrismaService],
  controllers: [DevicesController],
  exports: [DevicesService], // Export for use in Telemetry module
})
export class DevicesModule {}
