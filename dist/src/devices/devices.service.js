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
exports.DevicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let DevicesService = class DevicesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createDeviceDto) {
        return this.prisma.device.create({
            data: {
                ...createDeviceDto,
                userId,
            },
        });
    }
    async createBatch(userId, createDevicesBatchDto) {
        const devices = createDevicesBatchDto.devices;
        return this.prisma.$transaction(devices.map((device) => this.prisma.device.create({
            data: {
                ...device,
                userId,
            },
        })));
    }
    async findAll(userId) {
        return this.prisma.device.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const device = await this.prisma.device.findUnique({
            where: { id },
        });
        if (!device) {
            throw new common_1.NotFoundException('Device not found');
        }
        if (device.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have access to this device');
        }
        return device;
    }
    async update(id, userId, updateDeviceDto) {
        await this.findOne(id, userId);
        return this.prisma.device.update({
            where: { id },
            data: updateDeviceDto,
        });
    }
    async remove(id, userId) {
        await this.findOne(id, userId);
        await this.prisma.device.delete({
            where: { id },
        });
    }
    async findByApiKey(apiKey) {
        return this.prisma.device.findUnique({
            where: { apiKey },
        });
    }
};
exports.DevicesService = DevicesService;
exports.DevicesService = DevicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DevicesService);
//# sourceMappingURL=devices.service.js.map