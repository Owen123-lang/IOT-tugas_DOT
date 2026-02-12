import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
  IsString,
} from 'class-validator';

export class CreateTelemetryDto {
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  humidity?: number;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}
