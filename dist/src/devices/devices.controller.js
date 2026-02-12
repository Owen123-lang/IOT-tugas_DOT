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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const devices_service_1 = require("./devices.service");
const create_device_dto_1 = require("./dto/create-device.dto");
const create_devices_batch_dto_1 = require("./dto/create-devices-batch.dto");
const update_device_dto_1 = require("./dto/update-device.dto");
const device_response_dto_1 = require("./dto/device-response.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let DevicesController = class DevicesController {
    devicesService;
    constructor(devicesService) {
        this.devicesService = devicesService;
    }
    create(req, createDeviceDto) {
        return this.devicesService.create(req.user.userId, createDeviceDto);
    }
    createBatch(req, createDevicesBatchDto) {
        return this.devicesService.createBatch(req.user.userId, createDevicesBatchDto);
    }
    findAll(req) {
        return this.devicesService.findAll(req.user.userId);
    }
    findOne(id, req) {
        return this.devicesService.findOne(id, req.user.userId);
    }
    update(id, req, updateDeviceDto) {
        return this.devicesService.update(id, req.user.userId, updateDeviceDto);
    }
    remove(id, req) {
        return this.devicesService.remove(id, req.user.userId);
    }
};
exports.DevicesController = DevicesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new device (requires JWT token)' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Device created successfully',
        type: device_response_dto_1.DeviceResponseDto,
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_device_dto_1.CreateDeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('batch'),
    (0, swagger_1.ApiOperation)({
        summary: 'Create multiple devices at once (requires JWT token)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Devices created successfully',
        type: [device_response_dto_1.DeviceResponseDto],
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_devices_batch_dto_1.CreateDevicesBatchDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all devices owned by the user' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of devices',
        type: [device_response_dto_1.DeviceResponseDto],
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific device by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device found',
        type: device_response_dto_1.DeviceResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Device not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a device' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Device updated successfully',
        type: device_response_dto_1.DeviceResponseDto,
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_device_dto_1.UpdateDeviceDto]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a device' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Device deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DevicesController.prototype, "remove", null);
exports.DevicesController = DevicesController = __decorate([
    (0, swagger_1.ApiTags)('Devices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('devices'),
    __metadata("design:paramtypes", [devices_service_1.DevicesService])
], DevicesController);
//# sourceMappingURL=devices.controller.js.map