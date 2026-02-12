import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DevicesService } from '../devices/devices.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { TelemetryResponseDto } from './dto/telemetry-response.dto';

@Injectable()
export class TelemetryService {
  constructor(
    private prisma: PrismaService,
    private devicesService: DevicesService,
  ) {}

  async create(
    createTelemetryDto: CreateTelemetryDto,
  ): Promise<TelemetryResponseDto> {
    // Verify device API key
    const device = await this.devicesService.findByApiKey(
      createTelemetryDto.apiKey,
    );

    if (!device) {
      throw new UnauthorizedException('Invalid device API key');
    }

    // Create telemetry record
    const telemetry = await this.prisma.telemetry.create({
      data: {
        deviceId: device.id,
        temperature: createTelemetryDto.temperature,
        humidity: createTelemetryDto.humidity,
        data: createTelemetryDto.data,
      },
    });

    return telemetry;
  }

  async findByDevice(
    deviceId: string,
    userId: string,
    limit: number = 100,
  ): Promise<TelemetryResponseDto[]> {
    // Verify user owns this device
    await this.devicesService.findOne(deviceId, userId);

    return this.prisma.telemetry.findMany({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }
}
