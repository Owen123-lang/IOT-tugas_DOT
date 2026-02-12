import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDeviceDto } from './create-device.dto';

export class CreateDevicesBatchDto {
  @ApiProperty({
    type: [CreateDeviceDto],
    description: 'Array of devices to create',
    example: [
      {
        name: 'ESP32 Living Room',
        type: 'ESP32',
        description: 'Temperature sensor',
      },
      {
        name: 'Arduino Kitchen',
        type: 'Arduino',
        description: 'Gas detector',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDeviceDto)
  devices: CreateDeviceDto[];
}
