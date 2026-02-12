import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateDevicesBatchDto } from './dto/create-devices-batch.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceResponseDto } from './dto/device-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  create(
    @Request() req,
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.create(req.user.userId, createDeviceDto);
  }

  @Post('batch')
  createBatch(
    @Request() req,
    @Body() createDevicesBatchDto: CreateDevicesBatchDto,
  ): Promise<DeviceResponseDto[]> {
    return this.devicesService.createBatch(
      req.user.userId,
      createDevicesBatchDto,
    );
  }

  @Get()
  findAll(@Request() req): Promise<DeviceResponseDto[]> {
    return this.devicesService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req): Promise<DeviceResponseDto> {
    return this.devicesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.update(id, req.user.userId, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.devicesService.remove(id, req.user.userId);
  }
}
