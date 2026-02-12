import { PrismaService } from '../prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { CreateDevicesBatchDto } from './dto/create-devices-batch.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceResponseDto } from './dto/device-response.dto';
export declare class DevicesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createDeviceDto: CreateDeviceDto): Promise<DeviceResponseDto>;
    createBatch(userId: string, createDevicesBatchDto: CreateDevicesBatchDto): Promise<DeviceResponseDto[]>;
    findAll(userId: string): Promise<DeviceResponseDto[]>;
    findOne(id: string, userId: string): Promise<DeviceResponseDto>;
    update(id: string, userId: string, updateDeviceDto: UpdateDeviceDto): Promise<DeviceResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    findByApiKey(apiKey: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string | null;
        apiKey: string;
        userId: string;
    } | null>;
}
