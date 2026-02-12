import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTelemetryDto {
  @ApiProperty({ example: 'device-api-key-here' })
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiPropertyOptional({ example: 25.5 })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({ example: 60.2 })
  @IsNumber()
  @IsOptional()
  humidity?: number;

  @ApiPropertyOptional({
    example: { pressure: 1013, light: 450 },
    description: 'Additional sensor data in JSON format',
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
