import { TelemetryService } from './telemetry.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { TelemetryResponseDto } from './dto/telemetry-response.dto';
export declare class TelemetryController {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    create(createTelemetryDto: CreateTelemetryDto): Promise<TelemetryResponseDto>;
    findByDevice(deviceId: string, req: any, limit?: string): Promise<TelemetryResponseDto[]>;
}
