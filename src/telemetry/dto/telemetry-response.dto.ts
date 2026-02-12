import { ApiProperty } from '@nestjs/swagger';

export class TelemetryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  temperature: number | null;

  @ApiProperty()
  humidity: number | null;

  @ApiProperty()
  data: any;

  @ApiProperty()
  timestamp: Date;
}
