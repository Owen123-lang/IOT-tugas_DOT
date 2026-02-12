# 📊 IoT Telemetry API - UML Diagram Documentation

## 🎯 Overview
Dokumen ini berisi diagram UML (Unified Modeling Language) yang menggambarkan arsitektur database, hubungan entitas, dan alur CRUD operations pada IoT Telemetry API.

## 📈 Entity Relationship Diagram (ERD)

### Database Schema Relationships

```mermaid
erDiagram
    User {
        string id PK
        string email UK
        string password
        string name
        datetime createdAt
        datetime updatedAt
    }

    Device {
        string id PK
        string name
        string type
        string description
        string apiKey UK
        string userId FK
        datetime createdAt
        datetime updatedAt
    }

    Telemetry {
        string id PK
        string deviceId FK
        float temperature
        float humidity
        json data
        datetime timestamp
    }

    User ||--o{ Device : "owns"
    Device ||--o{ Telemetry : "generates"
```

### Penjelasan Hubungan:

1. **User ↔ Device (One-to-Many)**
   - Satu User dapat memiliki banyak Device
   - Setiap Device dimiliki oleh exactly satu User
   - Foreign Key: `userId` di tabel `devices`
   - Cascade: Jika User dihapus, semua Device miliknya ikut terhapus

2. **Device ↔ Telemetry (One-to-Many)**
   - Satu Device dapat menghasilkan banyak Telemetry data
   - Setiap Telemetry record dimiliki oleh exactly satu Device
   - Foreign Key: `deviceId` di tabel `telemetry`
   - Cascade: Jika Device dihapus, semua Telemetry data-nya ikut terhapus

## 🔄 CRUD Flow Diagrams

### 1. User Authentication Flow

```mermaid
sequenceDiagram
    participant Client
    participant AuthController
    participant AuthService
    participant UserService
    participant Prisma
    participant Database

    Note over Client,Database: User Registration Flow
    Client->>AuthController: POST /auth/register
    AuthController->>AuthService: register(userData)
    AuthService->>UserService: create(userData)
    UserService->>UserService: hashPassword(password)
    UserService->>Prisma: user.create(userData)
    Prisma->>Database: INSERT INTO users
    Database-->>Prisma: created user
    Prisma-->>UserService: user object
    UserService->>AuthService: user object
    AuthService->>AuthService: generateJWT(user)
    AuthService-->>AuthController: { access_token, user }
    AuthController-->>Client: 201 Created + JWT Token

    Note over Client,Database: User Login Flow
    Client->>AuthController: POST /auth/login
    AuthController->>AuthService: login(credentials)
    AuthService->>UserService: findByEmail(email)
    UserService->>Prisma: user.findUnique({email})
    Prisma->>Database: SELECT * FROM users WHERE email = ?
    Database-->>Prisma: user data
    Prisma-->>UserService: user object
    UserService->>UserService: comparePassword()
    UserService-->>AuthService: user object
    AuthService->>AuthService: validateUser() & generateJWT()
    AuthService-->>AuthController: { access_token, user }
    AuthController-->>Client: 200 OK + JWT Token
```

### 2. Device Management Flow

```mermaid
sequenceDiagram
    participant Client
    participant DeviceController
    participant DeviceService
    participant Prisma
    participant Database

    Note over Client,Database: Create Device Flow
    Client->>DeviceController: POST /devices + JWT
    DeviceController->>DeviceService: create(userId, deviceData)
    DeviceService->>Prisma: device.create({data: {...deviceData, userId}})
    Prisma->>Database: INSERT INTO devices
    Database-->>Prisma: created device (with auto-generated apiKey)
    Prisma-->>DeviceService: device object
    DeviceService-->>DeviceController: DeviceResponseDto
    DeviceController-->>Client: 201 Created + device data

    Note over Client,Database: Update Device Flow (with Ownership Check)
    Client->>DeviceController: PATCH /devices/:id + JWT
    DeviceController->>DeviceService: update(id, userId, updateData)
    DeviceService->>DeviceService: findOne(id, userId) [Ownership Validation]
    DeviceService->>Prisma: device.findUnique({where: {id}})
    Prisma->>Database: SELECT * FROM devices WHERE id = ?
    Database-->>Prisma: device data
    Prisma-->>DeviceService: device object
    DeviceService->>DeviceService: validateOwnership(device, userId)
    alt Ownership Valid
        DeviceService->>Prisma: device.update({where: {id}, data: updateData})
        Prisma->>Database: UPDATE devices SET ...
        Database-->>Prisma: updated device
        Prisma-->>DeviceService: device object
        DeviceService-->>DeviceController: DeviceResponseDto
        DeviceController-->>Client: 200 OK
    else Ownership Invalid
        DeviceService-->>DeviceController: 403 Forbidden
        DeviceController-->>Client: 403 Forbidden
    end
```

### 3. Telemetry Data Flow

```mermaid
sequenceDiagram
    participant Device
    participant TelemetryController
    participant TelemetryService
    participant DeviceService
    participant Prisma
    participant Database

    Note over Device,Database: Submit Telemetry Data
    Device->>TelemetryController: POST /telemetry + API Key
    TelemetryController->>TelemetryService: create(telemetryData)
    TelemetryService->>DeviceService: findByApiKey(apiKey)
    DeviceService->>Prisma: device.findUnique({where: {apiKey}})
    Prisma->>Database: SELECT * FROM devices WHERE apiKey = ?
    Database-->>Prisma: device data
    Prisma-->>DeviceService: device object
    DeviceService-->>TelemetryService: device object
    alt Valid API Key
        TelemetryService->>Prisma: telemetry.create({data: {deviceId: device.id, ...telemetryData}})
        Prisma->>Database: INSERT INTO telemetry
        Database-->>Prisma: telemetry record
        Prisma-->>TelemetryService: telemetry object
        TelemetryService-->>TelemetryController: TelemetryResponseDto
        TelemetryController-->>Device: 201 Created
    else Invalid API Key
        TelemetryService-->>TelemetryController: 401 Unauthorized
        TelemetryController-->>Device: 401 Unauthorized
    end

    Note over Device,Database: Retrieve Telemetry Data
    Device->>TelemetryController: GET /telemetry/device/:deviceId + JWT
    TelemetryController->>TelemetryService: findByDevice(deviceId, userId, limit)
    TelemetryService->>DeviceService: findOne(deviceId, userId) [Ownership Check]
    DeviceService->>Prisma: device.findUnique({where: {id: deviceId}})
    Prisma->>Database: SELECT * FROM devices WHERE id = ?
    Database-->>Prisma: device data
    Prisma-->>DeviceService: device object
    DeviceService->>DeviceService: validateOwnership(device, userId)
    DeviceService-->>TelemetryService: device object
    TelemetryService->>Prisma: telemetry.findMany({where: {deviceId}, take: limit, orderBy: {timestamp: 'desc'}})
    Prisma->>Database: SELECT * FROM telemetry WHERE deviceId = ? ORDER BY timestamp DESC LIMIT ?
    Database-->>Prisma: telemetry array
    Prisma-->>TelemetryService: telemetry objects
    TelemetryService-->>TelemetryController: TelemetryResponseDto[]
    TelemetryController-->>Device: 200 OK
```

## 🏗️ Architecture Diagram

### System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        WebApp[Web Application]
        MobileApp[Mobile App]
        IoTDevice[IoT Device]
    end

    subgraph "API Gateway / Load Balancer"
        LB[Load Balancer]
    end

    subgraph "NestJS Application"
        subgraph "Controllers"
            AuthController[Auth Controller]
            DeviceController[Device Controller]
            TelemetryController[Telemetry Controller]
        end

        subgraph "Services"
            AuthService[Auth Service]
            UserService[User Service]
            DeviceService[Device Service]
            TelemetryService[Telemetry Service]
        end

        subgraph "Guards & Middleware"
            JWTGuard[JWT Auth Guard]
            ValidationPipe[Validation Pipe]
        end
    end

    subgraph "Data Layer"
        PrismaORM[Prisma ORM]
        PostgreSQL[(PostgreSQL Database)]
    end

    subgraph "External Services"
        Swagger[Swagger Documentation]
        PrismaStudio[Prisma Studio]
    end

    %% Authentication Flow
    WebApp --> LB
    MobileApp --> LB
    IoTDevice --> LB
    
    LB --> JWTGuard
    JWTGuard --> ValidationPipe
    ValidationPipe --> AuthController
    ValidationPipe --> DeviceController
    ValidationPipe --> TelemetryController

    %% Controller to Service mappings
    AuthController --> AuthService
    DeviceController --> DeviceService
    TelemetryController --> TelemetryService

    %% Service Dependencies
    AuthService --> UserService
    DeviceService --> UserService
    TelemetryService --> DeviceService

    %% Service to Database
    UserService --> PrismaORM
    DeviceService --> PrismaORM
    TelemetryService --> PrismaORM

    %% Database Connection
    PrismaORM --> PostgreSQL

    %% Documentation Tools
    LB --> Swagger
    PrismaORM --> PrismaStudio
```

### Module Dependency Graph

```mermaid
graph TD
    subgraph "NestJS Modules"
        AppModule[App Module]
        ConfigModule[Config Module]
        UsersModule[Users Module]
        AuthModule[Auth Module]
        DevicesModule[Devices Module]
        TelemetryModule[Telemetry Module]
    end

    subgraph "Services Exported"
        UserService[Users Service]
        DeviceService[Device Service]
    end

    subgraph "External Modules"
        PassportModule[Passport Module]
        JwtModule[JWT Module]
    end

    %% Module Relationships
    AppModule --> ConfigModule
    AppModule --> UsersModule
    AppModule --> AuthModule
    AppModule --> DevicesModule
    AppModule --> TelemetryModule

    %% Service Exports
    UsersModule --> UserService
    DevicesModule --> DeviceService

    %% Module Dependencies
    AuthModule --> UsersModule
    AuthModule --> PassportModule
    AuthModule --> JwtModule
    TelemetryModule --> DevicesModule

    %% Service Dependencies (Cross Module)
    AuthModule -.-> UserService
    TelemetryModule -.-> DeviceService
```

## 📋 CRUD Operations Matrix

| Entity | Create | Read | Update | Delete | Authentication Required |
|--------|--------|------|--------|--------|-------------------------|
| **User** | `POST /auth/register` | N/A | N/A | `DELETE /auth/account` | JWT (Delete only) |
| **Device** | `POST /devices` | `GET /devices`<br>`GET /devices/:id` | `PATCH /devices/:id` | `DELETE /devices/:id` | JWT Token |
| **Telemetry** | `POST /telemetry` | `GET /telemetry/device/:id` | N/A | N/A | API Key (Create)<br>JWT (Read) |

## 🔒 Security Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant JWTGuard
    participant JWTStrategy
    participant UserService
    participant Controller
    participant Service

    Note over Client,Service: Protected API Request
    Client->>JWTGuard: Request + Authorization: Bearer <token>
    JWTGuard->>JWTStrategy: validate(token)
    JWTStrategy->>UserService: findById(userId)
    UserService->>UserService: database lookup
    UserService-->>JWTStrategy: user object
    JWTStrategy->>JWTStrategy: validate user exists
    JWTStrategy-->>JWTGuard: { userId, email }
    JWTGuard->>JWTGuard: attach user to request
    JWTGuard-->>Controller: proceed with req.user
    Controller->>Service: businessLogic(data, req.user.userId)
    Service-->>Controller: result
    Controller-->>Client: response
```

## 🎯 Key Design Patterns

### 1. Repository Pattern (via Prisma)
- **Benefit**: Type-safe database operations
- **Implementation**: PrismaClient provides repository-like interface
- **Example**: `prisma.device.findMany()`, `prisma.telemetry.create()`

### 2. Service Layer Pattern
- **Benefit**: Business logic separation and reusability
- **Implementation**: Dedicated service classes for each entity
- **Example**: `DevicesService.create()`, `TelemetryService.findByDevice()`

### 3. Dependency Injection
- **Benefit**: Loose coupling and testability
- **Implementation**: NestJS DI container
- **Example**: Service injection in constructors

### 4. Guard Pattern
- **Benefit**: Authentication and authorization separation
- **Implementation**: JWT Auth Guard
- **Example**: `@UseGuards(JwtAuthGuard)`

---

📊 **Diagram ini mencerminkan implementasi lengkap CRUD operations dengan authentication JWT, API key validation, dan ownership checking yang sudah selesai diimplementasikan dalam IoT Telemetry API.**