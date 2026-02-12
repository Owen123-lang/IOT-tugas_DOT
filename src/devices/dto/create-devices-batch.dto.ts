import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDeviceDto } from './create-device.dto';

export class CreateDevicesBatchDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDeviceDto)
  devices: CreateDeviceDto[];
}
