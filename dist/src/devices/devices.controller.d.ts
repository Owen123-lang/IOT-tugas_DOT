import { DevicesService } from './devices.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateDevicesBatchDto } from './dto/create-devices-batch.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceResponseDto } from './dto/device-response.dto';
export declare class DevicesController {
    private readonly devicesService;
    constructor(devicesService: DevicesService);
    create(req: any, createDeviceDto: CreateDeviceDto): Promise<DeviceResponseDto>;
    createBatch(req: any, createDevicesBatchDto: CreateDevicesBatchDto): Promise<DeviceResponseDto[]>;
    findAll(req: any): Promise<DeviceResponseDto[]>;
    findOne(id: string, req: any): Promise<DeviceResponseDto>;
    update(id: string, req: any, updateDeviceDto: UpdateDeviceDto): Promise<DeviceResponseDto>;
    remove(id: string, req: any): Promise<void>;
}
