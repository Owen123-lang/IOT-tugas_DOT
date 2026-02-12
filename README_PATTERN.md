# Service-Repository Pattern Analysis

## Apa Pattern Ini?

Service-Repository Pattern adalah arsitektur yang memisahkan tanggung jawab menjadi layer-layer yang jelas. Setiap layer punya satu job:

```
HTTP Request
    |
    v
Controller  --> Terima request, validasi input (DTO), return response
    |
    v
Service     --> Business logic, ownership check, error handling
    |
    v
Repository  --> Akses database, query data
    |
    v
Database
```

Di project ini, Prisma ORM berperan sebagai Repository layer. Kita tidak bikin class Repository terpisah karena Prisma sudah menyediakan type-safe query builder yang cukup abstrak -- `prisma.device.create()`, `prisma.device.findMany()`, dst. Menambahkan Repository class di atas Prisma hanya akan jadi wrapper tanpa value tambah untuk skala project ini.

---

## Kenapa Saya Pilih Ini?

### 1. Testability

Dengan memisahkan business logic ke Service, kita bisa test logic tanpa perlu HTTP server berjalan. Di E2E test (`test/app.e2e-spec.ts`), NestJS dependency injection memungkinkan kita bootstrap seluruh app dan test setiap layer secara terintegrasi.

Kalau mau unit test, Service bisa di-test dengan mock PrismaService:

```typescript
// Contoh: test DevicesService tanpa database sungguhan
const mockPrisma = {
  device: {
    create: jest.fn().mockResolvedValue({ id: '1', name: 'ESP32', apiKey: 'abc' }),
    findUnique: jest.fn(),
  },
};

const service = new DevicesService(mockPrisma as any);
const result = await service.create('user-1', { name: 'ESP32', type: 'sensor' });
expect(result.name).toBe('ESP32');
```

Ini tidak mungkin kalau business logic campur di Controller -- kamu harus mock HTTP request juga.

### 2. Maintainability

Business logic terpusat di satu tempat. Contoh ownership check di `src/devices/devices.service.ts:54-68`:

```typescript
async findOne(id: string, userId: string): Promise<DeviceResponseDto> {
  const device = await this.prisma.device.findUnique({ where: { id } });

  if (!device) {
    throw new NotFoundException('Device not found');
  }

  if (device.userId !== userId) {
    throw new ForbiddenException('You do not have access to this device');
  }

  return device;
}
```

Method `findOne()` ini dipanggil oleh `update()` dan `remove()` untuk verifikasi ownership sebelum operasi:

```typescript
// src/devices/devices.service.ts:70-81
async update(id: string, userId: string, updateDeviceDto: UpdateDeviceDto) {
  await this.findOne(id, userId); // <-- ownership check di sini
  return this.prisma.device.update({ where: { id }, data: updateDeviceDto });
}

// src/devices/devices.service.ts:83-89
async remove(id: string, userId: string) {
  await this.findOne(id, userId); // <-- dan di sini
  await this.prisma.device.delete({ where: { id } });
}
```

Kalau nanti requirements berubah (misalnya ada role admin yang boleh akses semua device), kamu cuma perlu ubah `findOne()` di Service. Controller tidak perlu disentuh.

Sementara Controller (`src/devices/devices.controller.ts`) tetap bersih -- dia cuma meneruskan request ke Service:

```typescript
@Patch(':id')
update(@Param('id') id: string, @Request() req, @Body() dto: UpdateDeviceDto) {
  return this.devicesService.update(id, req.user.userId, dto);
}
```

### 3. Scalability -- Reuse Antar Module

Service bisa di-export dan dipakai oleh module lain. Ini terjadi di dua tempat dalam project ini:

**Contoh 1: DevicesService dipakai oleh TelemetryModule**

`DevicesModule` export `DevicesService` (`src/devices/devices.module.ts:11`). Lalu `TelemetryModule` import `DevicesModule` (`src/telemetry/telemetry.module.ts:10`) supaya `TelemetryService` bisa pakai `DevicesService.findByApiKey()`:

```typescript
// src/telemetry/telemetry.service.ts:14-24
async create(createTelemetryDto: CreateTelemetryDto) {
  // Pakai DevicesService dari module lain untuk validasi API key
  const device = await this.devicesService.findByApiKey(createTelemetryDto.apiKey);

  if (!device) {
    throw new UnauthorizedException('Invalid device API key');
  }

  return this.prisma.telemetry.create({
    data: { deviceId: device.id, temperature: ..., humidity: ..., data: ... },
  });
}
```

**Contoh 2: UsersService dipakai oleh AuthModule dan JwtStrategy**

`UsersModule` export `UsersService`. Lalu:
- `AuthService` pakai `UsersService.create()` dan `UsersService.findByEmail()` untuk register/login
- `JwtStrategy` pakai `UsersService.findById()` untuk validasi bahwa user di token masih exist di database

Tanpa pattern ini, logic validasi API key dan user lookup harus di-duplicate di setiap tempat yang membutuhkan.

### 4. Separation of Concerns yang Jelas

Setiap layer punya tanggung jawab tunggal:

| Layer | Boleh | Tidak Boleh |
|-------|-------|-------------|
| **Controller** | Parse request, panggil service, return response, Swagger decorators | Akses database langsung, business logic |
| **Service** | Business logic, validasi, error handling, panggil Prisma | Handle HTTP request/response, set status code |
| **Prisma** | Query database, manage connections | Business logic, error handling |
| **DTO** | Validasi shape data, transform input | Logic apapun |
| **Guard** | Autentikasi, set req.user | Business logic, akses database |

---

## Implementasi dalam Codebase

### Module Dependency Graph

```
AppModule
  |
  +-- ConfigModule (global)
  |
  +-- UsersModule
  |     provides: UsersService, PrismaService
  |     exports:  UsersService
  |
  +-- AuthModule
  |     imports:  UsersModule, PassportModule, JwtModule
  |     provides: AuthService, JwtStrategy
  |
  +-- DevicesModule
  |     provides: DevicesService, PrismaService
  |     exports:  DevicesService
  |
  +-- TelemetryModule
        imports:  DevicesModule
        provides: TelemetryService, PrismaService
```

### File Mapping per Layer

| Layer | Files |
|-------|-------|
| Controllers | `src/auth/auth.controller.ts`, `src/devices/devices.controller.ts`, `src/telemetry/telemetry.controller.ts` |
| Services | `src/auth/auth.service.ts`, `src/users/users.service.ts`, `src/devices/devices.service.ts`, `src/telemetry/telemetry.service.ts` |
| Repository | `src/prisma.service.ts` (shared, extends PrismaClient) |
| DTOs | `src/*/dto/*.dto.ts` (input validation + response shaping) |
| Guards | `src/auth/jwt-auth.guard.ts`, `src/auth/jwt.strategy.ts` |

---

## Flow Example: Create Device

Concrete flow saat user bikin device baru (`POST /devices`):

```
1. HTTP Request masuk
   POST /devices
   Header: Authorization: Bearer <jwt_token>
   Body: { "name": "ESP32 Room 1", "type": "ESP32" }

2. JwtAuthGuard (src/auth/jwt-auth.guard.ts)
   --> Extract token dari header
   --> JwtStrategy.validate() cek user exist di DB
   --> Set req.user = { userId: "abc-123", email: "user@mail.com" }

3. DevicesController.create() (src/devices/devices.controller.ts:39-43)
   --> Ambil req.user.userId dan body (sudah divalidasi oleh DTO + ValidationPipe)
   --> Panggil devicesService.create(userId, dto)

4. DevicesService.create() (src/devices/devices.service.ts:16-26)
   --> Spread DTO data + userId
   --> prisma.device.create({ data: { ...dto, userId } })
   --> Prisma auto-generate apiKey (UUID)

5. PostgreSQL
   --> INSERT INTO devices (id, name, type, userId, apiKey, ...) VALUES (...)

6. Response balik ke client
   --> 201 Created
   --> { id, name, type, description, apiKey, userId, createdAt, updatedAt }
```

---

## Kenapa Bukan Pattern Lain?

### vs. MVC (Model-View-Controller)

MVC tradisional menggabungkan business logic dan data access di Model. Di project ini, saya pisahkan keduanya (Service untuk logic, Prisma untuk data access). Ini memberikan flexibility lebih -- kalau nanti ganti ORM dari Prisma ke TypeORM, yang perlu diubah cuma query di Service, bukan seluruh arsitektur.

### vs. Repository Pattern Murni

Repository Pattern murni biasanya bikin class Repository terpisah yang membungkus semua database query. Untuk project ini, itu overkill -- Prisma sudah menyediakan abstraksi yang cukup. `prisma.device.findUnique()` sudah cukup deskriptif dan type-safe. Menambah layer Repository di atas Prisma cuma nambah boilerplate tanpa benefit yang signifikan di skala ini.

### vs. CQRS (Command Query Responsibility Segregation)

CQRS memisahkan read dan write operations ke handler yang berbeda. Cocok untuk sistem yang kompleks dengan event sourcing. Untuk IoT telemetry API yang straightforward ini, CQRS terlalu kompleks -- Service-Repository sudah memenuhi kebutuhan separation of concerns tanpa overhead yang berlebihan.

---

## Kesimpulan

Service-Repository Pattern dipilih karena memberikan keseimbangan yang tepat antara structure dan simplicity. Codebase tetap terorganisir dengan separation of concerns yang jelas, tapi tidak over-engineered dengan layer yang tidak dibutuhkan. Pattern ini juga memanfaatkan NestJS module system secara optimal -- Service di-export antar module untuk reusability, dan dependency injection menangani wiring secara otomatis.
