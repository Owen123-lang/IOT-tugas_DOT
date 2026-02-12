"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const devices_service_1 = require("../devices/devices.service");
let TelemetryService = class TelemetryService {
    prisma;
    devicesService;
    constructor(prisma, devicesService) {
        this.prisma = prisma;
        this.devicesService = devicesService;
    }
    async create(createTelemetryDto) {
        const device = await this.devicesService.findByApiKey(createTelemetryDto.apiKey);
        if (!device) {
            throw new common_1.UnauthorizedException('Invalid device API key');
        }
        const telemetry = await this.prisma.telemetry.create({
            data: {
                deviceId: device.id,
                temperature: createTelemetryDto.temperature,
                humidity: createTelemetryDto.humidity,
                data: createTelemetryDto.data,
            },
        });
        return telemetry;
    }
    async findByDevice(deviceId, userId, limit = 100) {
        await this.devicesService.findOne(deviceId, userId);
        return this.prisma.telemetry.findMany({
            where: { deviceId },
            orderBy: { timestamp: 'desc' },
            take: limit,
        });
    }
};
exports.TelemetryService = TelemetryService;
exports.TelemetryService = TelemetryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        devices_service_1.DevicesService])
], TelemetryService);
//# sourceMappingURL=telemetry.service.js.map