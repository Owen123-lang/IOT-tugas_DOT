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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateDevicesBatchDto } from './dto/create-devices-batch.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceResponseDto } from './dto/device-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Devices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new device (requires JWT token)' })
  @ApiResponse({
    status: 201,
    description: 'Device created successfully',
    type: DeviceResponseDto,
  })
  create(
    @Request() req,
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.create(req.user.userId, createDeviceDto);
  }

  @Post('batch')
  @ApiOperation({
    summary: 'Create multiple devices at once (requires JWT token)',
  })
  @ApiResponse({
    status: 201,
    description: 'Devices created successfully',
    type: [DeviceResponseDto],
  })
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
  @ApiOperation({ summary: 'Get all devices owned by the user' })
  @ApiResponse({
    status: 200,
    description: 'List of devices',
    type: [DeviceResponseDto],
  })
  findAll(@Request() req): Promise<DeviceResponseDto[]> {
    return this.devicesService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific device by ID' })
  @ApiResponse({
    status: 200,
    description: 'Device found',
    type: DeviceResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Device not found' })
  findOne(@Param('id') id: string, @Request() req): Promise<DeviceResponseDto> {
    return this.devicesService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a device' })
  @ApiResponse({
    status: 200,
    description: 'Device updated successfully',
    type: DeviceResponseDto,
  })
  update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ): Promise<DeviceResponseDto> {
    return this.devicesService.update(id, req.user.userId, updateDeviceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a device' })
  @ApiResponse({ status: 200, description: 'Device deleted successfully' })
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    return this.devicesService.remove(id, req.user.userId);
  }
}
