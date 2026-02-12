import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TelemetryService } from './telemetry.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { TelemetryResponseDto } from './dto/telemetry-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  create(
    @Body() createTelemetryDto: CreateTelemetryDto,
  ): Promise<TelemetryResponseDto> {
    return this.telemetryService.create(createTelemetryDto);
  }

  @Get('device/:deviceId')
  @UseGuards(JwtAuthGuard)
  findByDevice(
    @Param('deviceId') deviceId: string,
    @Request() req,
    @Query('limit') limit?: string,
  ): Promise<TelemetryResponseDto[]> {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    return this.telemetryService.findByDevice(
      deviceId,
      req.user.userId,
      limitNum,
    );
  }
}
