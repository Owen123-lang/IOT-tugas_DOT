import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty({ example: 'ESP32 Living Room' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'ESP32' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiPropertyOptional({ example: 'Temperature and humidity sensor' })
  @IsString()
  @IsOptional()
  description?: string;
}
