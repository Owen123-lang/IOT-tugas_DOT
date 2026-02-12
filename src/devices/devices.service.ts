import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateDevicesBatchDto } from './dto/create-devices-batch.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceResponseDto } from './dto/device-response.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceResponseDto> {
    return this.prisma.device.create({
      data: {
        ...createDeviceDto,
        userId,
      },
    });
  }

  async createBatch(
    userId: string,
    createDevicesBatchDto: CreateDevicesBatchDto,
  ): Promise<DeviceResponseDto[]> {
    const devices = createDevicesBatchDto.devices;

    // Use a transaction with individual creates to get back all fields (including auto-generated apiKey)
    return this.prisma.$transaction(
      devices.map((device) =>
        this.prisma.device.create({
          data: {
            ...device,
            userId,
          },
        }),
      ),
    );
  }

  async findAll(userId: string): Promise<DeviceResponseDto[]> {
    return this.prisma.device.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<DeviceResponseDto> {
    const device = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    if (device.userId !== userId) {
      throw new ForbiddenException('You do not have access to this device');
    }

    return device;
  }

  async update(
    id: string,
    userId: string,
    updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceResponseDto> {
    await this.findOne(id, userId); // Check ownership

    return this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.findOne(id, userId); // Check ownership

    await this.prisma.device.delete({
      where: { id },
    });
  }

  // For telemetry - verify device exists
  async findByApiKey(apiKey: string) {
    return this.prisma.device.findUnique({
      where: { apiKey },
    });
  }
}
