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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { TelemetryResponseDto } from './dto/telemetry-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  @ApiOperation({
    summary: 'Send telemetry data from device (requires device API key)',
  })
  @ApiResponse({
    status: 201,
    description: 'Telemetry data received',
    type: TelemetryResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  create(
    @Body() createTelemetryDto: CreateTelemetryDto,
  ): Promise<TelemetryResponseDto> {
    return this.telemetryService.create(createTelemetryDto);
  }

  @Get('device/:deviceId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get telemetry data for a specific device' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Telemetry data retrieved',
    type: [TelemetryResponseDto],
  })
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
