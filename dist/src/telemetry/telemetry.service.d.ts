import { PrismaService } from '../prisma.service';
import { DevicesService } from '../devices/devices.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { TelemetryResponseDto } from './dto/telemetry-response.dto';
export declare class TelemetryService {
    private prisma;
    private devicesService;
    constructor(prisma: PrismaService, devicesService: DevicesService);
    create(createTelemetryDto: CreateTelemetryDto): Promise<TelemetryResponseDto>;
    findByDevice(deviceId: string, userId: string, limit?: number): Promise<TelemetryResponseDto[]>;
}
