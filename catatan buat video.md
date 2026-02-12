# 🎬 IoT Telemetry API - Live Video Demo Script

## 📋 Demo Requirements Checklist

- [x] Camera is ON and visible throughout
- [x] Microphone is working and clear
- [x] Postman workspace ready: https://speeding-shadow-306868.postman.co/workspace/Team-Workspace~c4f35a82-8a91-4f87-8be1-ef75b79a19df/collection/52285863-81bd9597-2c53-462e-a892-89d71e608ec3
- [x] NeonDB is running
- [x] API server is running locally

---

## 🎥 Video Structure (Total: 12-14 minutes)

### 📖 Part 1: Introduction (1 minute)

**Camera ON - Speak to camera**

"Hallo! Saya akan mendemonstrasikan IoT Telemetry API yang saya buat menggunakan NestJS dan TypeScript.

**Apa itu Telemetry?**
Telemetry adalah proses pengumpulan dan transmisi data jarak jauh dari perangkat IoT. Contohnya: sensor suhu, kelembaban, tekanan udara yang mengirim data ke server secara berkala.

**Project Overview:**

- 2 interconnected CRUD operations: Devices + Telemetry Data
- PostgreSQL database dengan Prisma ORM
- JWT authentication untuk user security
- Device API keys untuk secure data submission
- Service-Repository pattern architecture
- E2E testing untuk authentication validation

Sekarang saya akan tunjukkan bagaimana semuanya bekerja secara live!"

---

### 🔧 Part 2: Project Structure & Pattern (1.5 minutes)

**Show VS Code with project structure**

"Struktur project ini mengikuti Service-Repository pattern:

```
src/
├── auth/          # JWT authentication & guards
├── users/         # User CRUD operations
├── devices/       # Device management
├── telemetry/     # Sensor data handling
└── prisma.service.ts
```

**Kenapa pakai pattern ini?**

1. **Separation of Concerns** - Setiap layer memiliki tanggung jawab jelas
2. **Testability** - Business logic terisolasi, mudah di-test
3. **Maintainability** - Perubahan requirements hanya di Service layer
4. **Scalability** - Service dapat digunakan kembali

**Flow:** Controller → Service → Prisma → PostgreSQL"

---

### 🔐 Part 3: JWT Authentication Demo (3 minutes)

**Switch to Postman, start with empty collection**

"JWT Authentication bekerja seperti ini:

#### Step 1: User Registration (Tanpa token)

**Buka POST /auth/register**

"Pertama, kita register user baru. Tidak perlu token karena ini endpoint publik."

**Kirim request:**

```json
{
  "email": "demo@example.com",
  "password": "password123",
  "name": "Demo User"
}
```

**Response 201:**

```json
{
  "id": "uuid-here",
  "email": "demo@example.com",
  "name": "Demo User",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

"Response ini memberikan kita **JWT Token** untuk digunakan di protected endpoints."

#### Step 2: Login (Get JWT Token)

**Buka POST /auth/login**

"Sekarang kita login dengan credential yang sama:"

**Kirim request:**

```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

**Response 200:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "demo@example.com",
    "name": "Demo User"
  }
}
```

"**Copy access_token ini** - ini adalah JWT token kita untuk authenticated requests!"

#### Step 3: Protected Access (WITH JWT Token)

**Buka GET /devices dengan Authorization**

"Sekarang coba akses devices. Pertama tanpa token:"

**Send without token → 401 Unauthorized**

"Expected! Endpoint ini protected. Sekarang dengan JWT token:

1. Klik **Authorization** tab
2. Type: **Bearer Token**
3. Token: **Paste JWT token dari login**

**Send → 200 OK (array kosong, karena belum ada device)**

"Perfect! JWT kita bekerja!"

---

### 📱 Part 4: Service-Repository Pattern Demo (2.5 minutes)

**Show VS Code project structure**

"Sebelum kita demo CRUD, saya jelaskan dulu **Service-Repository Pattern** yang saya pakai dan kenapa ini penting untuk enterprise applications."

## 🏗️ **Apa itu Service-Repository Pattern?**

**Show architecture layers:**

```
┌─────────────────┐
│   Controllers   │ ← HTTP Request/Response handling
├─────────────────┤
│    Services     │ ← Business logic & validation
├─────────────────┤
│   Prisma/DB    │ ← Data access & persistence
└─────────────────┘
```

**Show code example:**

"**Controller Layer** - Handle HTTP only:"

```typescript
// devices.controller.ts
@Post()
create(@Request() req, @Body() createDeviceDto: CreateDeviceDto) {
  return this.devicesService.create(req.user.userId, createDeviceDto);
}
```

"**Service Layer** - Business logic:"

```typescript
// devices.service.ts
async create(userId: string, createDeviceDto: CreateDeviceDto) {
  // Business logic validation
  if (createDeviceDto.name.length < 3) {
    throw new BadRequestException('Device name too short');
  }

  // Data access via Prisma
  return this.prisma.device.create({ data: { ...createDeviceDto, userId } });
}
```

## 🎯 **Kenapa Pakai Service-Repository Pattern?**

### **1. Separation of Concerns**

- **Controller** fokus HTTP requests/responses
- **Service** fokus business logic
- **Repository** fokus data access
- Setiap layer memiliki single responsibility

### **2. Maintainability**

"Business changes hanya di Service layer:"

- Ubah validation rules → Cukup update Service
- Ubah database logic → Cukup update Service
- Controller tidak perlu berubah

### **3. Testability**

"Service bisa di-test unit secara isolasi:"

```typescript
// Test Service tanpa database
const mockPrisma = { device: { create: jest.fn() } };
const service = new DevicesService(mockPrisma);
```

### **4. Reusability**

"Service bisa digunakan oleh multiple controllers:

- DevicesService dipakai DeviceController dan TelemetryController
- Logic tidak duplikasi

**Show module dependencies:**

```typescript
// telemetry.module.ts
@Module({
  imports: [DevicesModule], // Import service
})
export class TelemetryModule {}
```

---

### 📱 Part 5: Interconnected CRUD Demo (4 minutes)

**"Sekarang dengan pemahaman architecture, saya tunjukkan bagaimana 3 entity saling terhubung dalam CRUD operations."**

#### Step 5: Device CRUD (User-to-Device Connection)

**POST /devices dengan Bearer Token**

"Sekarang buat device IoT pertama kita. **JWT token diperlukan** untuk membuktikan hubungan User-to-Device."

**Request:**

```json
{
  "name": "ESP32 Living Room",
  "type": "ESP32",
  "description": "Temperature and humidity sensor"
}
```

**Response 201:**

```json
{
  "id": "device-uuid",
  "name": "ESP32 Living Room",
  "type": "ESP32",
  "description": "Temperature and humidity sensor",
  "apiKey": "device-api-key-uuid",
  "userId": "user-uuid", // 🔗 FOREIGN KEY ke USER!
  "createdAt": "2026-02-12..."
}
```

"**Lihat userId dan apiKey!** Ini membuktikan koneksi:

- **userId**: Device ini milik user yang login (foreign key connection)
- **apiKey**: Unique key untuk device authentication (untuk submit telemetry)"

#### Step 6: Telemetry CRUD (Device-to-Telemetry Connection)

**POST /telemetry (TANPA JWT!)**

"Untuk submit telemetry, kita **tidak pakai JWT**, tapi **device apiKey**. Ini menunjukkan Device-to-Telemetry connection:"

**Request:**

```json
{
  "apiKey": "device-api-key-uuid-dari-response-sebelumnya",
  "temperature": 25.5,
  "humidity": 60.2,
  "data": {
    "pressure": 1013,
    "light": 450,
    "co2": 400
  }
}
```

**Response 201:**

```json
{
  "id": "telemetry-uuid",
  "deviceId": "device-uuid", // 🔗 FOREIGN KEY ke DEVICE!
  "temperature": 25.5,
  "humidity": 60.2,
  "data": { "pressure": 1013, "light": 450, "co2": 400 },
  "timestamp": "2026-02-12..."
}
```

"**Perhatikan deviceId!** Ini foreign key yang menghubungkan telemetry ke device yang spesifik."

#### Step 7: Cross-Entity Read (User-to-Device-to-Telemetry)

**GET /telemetry/device/:deviceId dengan JWT**

"Untuk retrieve telemetry, sistem melakukan **3-level validation** untuk membuktikan semua koneksi:"

**1. JWT Token Validation** - User ter-authenticate?
**2. Device Ownership Check** - Device ini milik user yang login?
**3. Telemetry Filtering** - Hanya telemetry dari device ini

**Response 200:** Array dengan 1 telemetry record

"Perfect! Ini membuktikan interconnected CRUD operations:

- **User → Device** (melalui userId foreign key)
- **Device → Telemetry** (melalui deviceId foreign key)
- **User → Telemetry** (melalui ownership validation)"

#### Step 8: Delete Device (Cascade Deletion Demo)

**DELETE /devices/:id dengan JWT**

"Ketika kita delete device, **semua telemetry data akan ikut terhapus** (cascade deletion). Ini membuktikan hubungan integrity di database level."

"✅ **BUKTI INTERCONNECTED CRUD COMPLETED:**

1. **User Registration** → JWT token untuk authentication
2. **Device Creation** → userId FK + device API key generation
3. **Telemetry Submission** → deviceId FK validation via API key
4. **Telemetry Retrieval** → 3-level security validation
5. **Device Deletion** → Cascade deletion untuk data integrity

**Ini bukan CRUD terpisah, tapi ekosistem IoT yang terintegrasi penuh!**"

---

### 🧪 Part 6: E2E Testing Demo (2 minutes)

**Switch to terminal**

"Sekarang saya jalankan E2E tests untuk membuktikan semua functionality bekerja:"

```bash
npm run test:e2e
```

**While running, explain:**

"E2E tests ini mencakup:

- ✅ User registration dan JWT token generation
- ✅ Login dengan valid credentials
- ✅ JWT validation untuk protected endpoints
- ✅ Unauthorized access prevention (401 responses)
- ✅ Device CRUD operations dengan/without JWT
- ✅ Ownership validation (user hanya akses device-nya sendiri)
- ✅ Telemetry submission dengan API key validation

**When tests complete → All tests passed!**

"Semua tests berhasil membuktikan API berfungsi dengan benar!"

---

### 📊 Part 7: Database & Architecture Summary (1.5 minutes)

**Show Prisma schema**

"Database design menggunakan PostgreSQL dengan 3 entities yang saling terhubung:

**Users** 1:N **Devices** 1:N **Telemetry**

**Foreign Key Relationships:**

- **Device.userId** → User.id (User-to-Device connection)
- **Telemetry.deviceId** → Device.id (Device-to-Telemetry connection)

**Cascade Deletion:**

- Delete User → Delete semua devices + telemetry
- Delete Device → Delete semua telemetry terkait

**Security Features:**

- bcrypt password hashing
- JWT token validation untuk user authentication
- API key validation untuk device authentication
- Ownership checks di setiap layer

## 🔍 **Apa itu Prisma dan Kenapa Menggunakan Prisma?**

**Show package.json dependencies**

"Prisma adalah **next-generation ORM** (Object-Relational Mapper) yang memberikan developer experience yang lebih baik dibanding ORM tradisional."

### **Apa itu Prisma?**

- **Modern Database Toolkit** - Database access layer yang powerful
- **Type-Safe by Default** - Auto-generated types dari database schema
- **Declarative Schema** - Database schema didefinisikan dengan syntax yang clean
- **Database Agnostic** - Support PostgreSQL, MySQL, SQLite, MongoDB, dll

### **Kenapa Memilih Prisma?**

#### **1. Type Safety & IntelliSense**

**Show prisma/schema.prisma**

```prisma
model Device {
  id          String   @id @default(uuid())
  name        String
  type        String
  apiKey      String   @unique @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  telemetry   Telemetry[]
}
```

"Prisma otomatis generate TypeScript types. Dapat auto-complete dan error checking di development time!"

#### **2. Clean Database Schema Design**

"Schema Prisma readable dan maintainable:"

- **Relationships jelas** - `@relation` directives
- **Constraints otomatis** - `@unique`, `@default`, cascade deletion
- **Type definitions** - Float, String, DateTime, Json fields

#### **3. Database Migration & Management**

**Show prisma/migrations folder**
"Prisma handle database schema evolution dengan:

- **Auto-migrations** - `prisma migrate dev`
- **Rollback support** - Bisa kembali ke schema sebelumnya
- **Seed data** - `prisma seed.ts` untuk test data

#### **4. Superior Developer Experience**

"Compare dengan traditional SQL atau ORMs lain:"

**Traditional Approach:**

```typescript
// Raw SQL (error-prone)
const result = await db.query('SELECT * FROM devices WHERE userId = $1', [
  userId,
]);

// Traditional ORM (complex)
const devices = await Device.findAll({
  where: { user_id: userId },
  include: [{ model: Telemetry }],
});
```

**Prisma Approach:**

```typescript
// Type-safe, auto-complete, readable
const devices = await prisma.device.findMany({
  where: { userId },
  include: { telemetry: true },
});
```

#### **5. Advanced Features**

**Show service examples**

"Prisma provides enterprise-grade features:"

**Connection Pooling & Performance:**

```typescript
// Automatic connection management
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
```

**Transaction Support:**

```typescript
// Batch device creation dengan transaction
return this.prisma.$transaction(
  devices.map((device) =>
    this.prisma.device.create({ data: { ...device, userId } }),
  ),
);
```

**JSON Field Support:**

```typescript
// Flexible sensor data storage
data: {
  "pressure": 1013,
  "light": 450,
  "co2": 400
}
```

**Database Indexes:**

```prisma
@@index([deviceId])
@@index([timestamp])
```

### **Prisma vs Alternatives:**

| Feature               | Prisma       | TypeORM   | Sequelize  | Raw SQL    |
| --------------------- | ------------ | --------- | ---------- | ---------- |
| **Type Safety**       | ✅ Native    | ✅ Good   | ⚠️ Limited | ❌ None    |
| **Auto-Complete**     | ✅ Excellent | ✅ Good   | ⚠️ Basic   | ❌ None    |
| **Schema Management** | ✅ Built-in  | ✅ Good   | ⚠️ Manual  | ❌ Manual  |
| **Migrations**        | ✅ Auto      | ✅ Good   | ⚠️ Complex | ❌ Manual  |
| **Performance**       | ✅ Optimized | ⚠️ Good   | ⚠️ Good    | ✅ Fastest |
| **Learning Curve**    | ✅ Easy      | ⚠️ Medium | ⚠️ Steep   | ❌ Complex |

### **Why Prisma Perfect for This Project:**

1. **IoT Data Complexity** - JSON fields untuk flexible sensor data
2. **Type Safety** - Prevent bugs di development time
3. **Rapid Development** - Auto-generated types & CRUD operations
4. **Production Ready** - Connection pooling, transactions, migrations
5. **Developer Experience** - Clean syntax, excellent IntelliSense

**Service-Repository Pattern Benefits:**

- **Separation of Concerns** - Controller, Service, Database layers terpisah
- **Testability** - Business logic terisolasi untuk unit testing
- **Maintainability** - Perubahan requirements hanya di Service layer
- **Scalability** - Service dapat digunakan kembali antar modules
- **Type Safety** - Prisma ensures compile-time error checking

**Flow:** Controller → Service → Prisma → PostgreSQL

"Kombinasi Prisma + Service-Repository pattern memberikan clean architecture yang type-safe, maintainable, dan scalable!"

---

### 🎯 Part 8: Conclusion (1.5 minutes)

**Camera ON - Speak to camera**

"Sebagai kesimpulan, IoT Telemetry API ini **MEMENUHI DAN MELAMPAUI** semua requirements:

✅ **2+ Interconnected CRUD Operations**:

- 3 entities (Users, Devices, Telemetry) dengan foreign key relationships
- Cross-entity validation dan business logic
- Real-world IoT ecosystem yang terintegrasi

✅ **SQL Database**:

- PostgreSQL dengan Prisma ORM
- Type-safe database operations
- Cascade deletion untuk data integrity

✅ **JWT Authentication**:

- Complete user authentication flow
- Device API key authentication untuk IoT security
- Multi-layer security validation

✅ **E2E Testing**:

- Comprehensive test coverage untuk semua endpoints
- Authentication validation testing
- Security boundary testing

✅ **Service-Repository Pattern**:

- Clean architecture dengan separation of concerns
- Maintainable dan scalable codebase
- Type-safe dengan TypeScript

**Dokumentasi lengkap:**

- README.md dalam Bahasa Indonesia
- CRUD_INTERCONNECTION_PROOF.md dengan detailed proof
- VIDEO_DEMO_SCRIPT.md untuk recording guidance

Project ini bukan hanya memenuhi requirements, tapi memberikan **production-ready IoT solution** dengan enterprise-grade practices!

Thank you for watching!"

---

## 🔗 Important Links for Demo

- **Postman Workspace**: https://speeding-shadow-306868.postman.co/workspace/Team-Workspace~c4f35a82-8a91-4f87-8be1-ef75b79a19df/collection/52285863-81bd9597-2c53-462e-a892-89d71e608ec3
- **NeonDB**: Database sudah running
- **API**: localhost:3000

## 💡 Demo Tips

1. **Copy-paste JWT token** - Jangan ketik manual
2. **Show authorization header** - Jelaskan Bearer token format
3. **Highlight 401 vs 200** - Show security working
4. **Point to apiKey** - Emphasize device-level security
5. **Run tests last** - Prove everything works

## ⚠️ Backup Plan

If Postman fails during demo:

- Use curl commands from terminal
- Show that API works regardless of client tool
- Emphasize backend functionality over UI

---

**Good luck with your recording! 🎬**
