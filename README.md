# IoT Telemetry API

API RESTful untuk sistem monitoring IoT menggunakan NestJS, TypeScript, dan PostgreSQL. Aplikasi ini menyediakan CRUD operations untuk manajemen perangkat IoT dan data telemetry dengan autentikasi JWT yang aman.

## Tabel Konten

- [Fitur Utama](#fitur-utama)
- [Arsitektur & Pattern](#arsitektur--pattern)
- [Diagram UML](#diagram-uml)
- [Instalasi & Setup](#instalasi--setup)
- [API Endpoints](#api-endpoints)
- [Postman Documentation](#postman-documentation)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)

## Fitur Utama

### Autentikasi & Keamanan

- **JWT Authentication**: Login user dengan token JWT yang aman
- **Device API Key**: Setiap perangkat memiliki unique API key untuk submit data
- **Password Hashing**: Menggunakan bcrypt untuk keamanan password
- **Ownership Validation**: User hanya bisa mengakses device miliknya sendiri

### CRUD Operations

- **User Management**: Registrasi, login, dan penghapusan akun
- **Device Management**:
  - Create, Read, Update, Delete perangkat IoT
  - Batch creation untuk multiple devices
  - Unique API key generation untuk setiap device
- **Telemetry Data**:
  - Submit data dari device menggunakan API key
  - Retrieve data telemetry per device dengan pagination
  - Flexible data storage (JSON field untuk custom sensor data)

### Testing

- **E2E Testing**: Coverage lengkap untuk semua endpoint
- **Authentication Testing**: Validasi JWT token dan API key
- **Database Cleanup**: Auto cleanup test data
- **Error Scenario Testing**: Testing untuk unauthorized access, invalid data, dll.

## Arsitektur & Pattern

### Service-Repository Pattern

Project ini menggunakan **Service-Repository Pattern** dengan alasan:

1. **Separation of Concerns**: Setiap layer memiliki tanggung jawab yang jelas
2. **Testability**: Business logic terisolasi sehingga mudah di-test
3. **Maintainability**: Perubahan requirements hanya perlu dilakukan di Service layer
4. **Scalability**: Service dapat digunakan kembali antar module

### Flow Arsitektur

```
HTTP Request
    |
    v
Controller  → Terima request, validasi DTO, return response
    |
    v
Service     → Business logic, ownership check, error handling
    |
    v
Prisma      → Database query, data persistence
    |
    v
PostgreSQL  → Data storage
```

### Module Dependencies

```
AppModule
├── ConfigModule (Global)
├── UsersModule (exports UsersService)
├── AuthModule (imports UsersModule)
├── DevicesModule (exports DevicesService)
└── TelemetryModule (imports DevicesModule)
```

## Diagram UML

### Entity Relationship Diagram

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

    User ||--o{ Device : "has many"
    Device ||--o{ Telemetry : "generates"
```

### CRUD Flow Diagram

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Service
    participant Prisma
    participant Database

    Note over Client,Database: CREATE Device Flow
    Client->>Controller: POST /devices (with JWT)
    Controller->>Service: create(userId, deviceData)
    Service->>Prisma: device.create(data)
    Prisma->>Database: INSERT INTO devices
    Database-->>Prisma: created device
    Prisma-->>Service: device object
    Service-->>Controller: DeviceResponseDto
    Controller-->>Client: 201 Created + device data

    Note over Client,Database: SUBMIT Telemetry Flow
    Client->>Controller: POST /telemetry (with API Key)
    Controller->>Service: create(telemetryData)
    Service->>Service: validateApiKey(apiKey)
    Service->>Prisma: telemetry.create(data)
    Prisma->>Database: INSERT INTO telemetry
    Database-->>Prisma: telemetry record
    Prisma-->>Service: telemetry object
    Service-->>Controller: TelemetryResponseDto
    Controller-->>Client: 201 Created
```

## Instalasi & Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm atau yarn

### Step-by-Step Installation

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd iot-telemetry-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   ```bash
   cp .env.example .env
   # Edit .env file dengan database credentials dan JWT secret
   ```

4. **Setup Database**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate
   ```

5. **Start Application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

6. **Access Swagger Documentation**
   ```
   http://localhost:3000/api
   ```

## 📡 API Endpoints

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Delete Account

```http
DELETE /auth/account
Authorization: Bearer <jwt_token>
```

### Devices Management

#### Create Device

```http
POST /devices
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "ESP32 Living Room",
  "type": "ESP32",
  "description": "Temperature and humidity sensor"
}
```

#### Get All Devices

```http
GET /devices
Authorization: Bearer <jwt_token>
```

#### Get Device by ID

```http
GET /devices/:id
Authorization: Bearer <jwt_token>
```

#### Update Device

```http
PATCH /devices/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "ESP32 Bedroom"
}
```

#### Delete Device

```http
DELETE /devices/:id
Authorization: Bearer <jwt_token>
```

#### Create Multiple Devices (Batch)

```http
POST /devices/batch
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "devices": [
    {
      "name": "ESP32 Room 1",
      "type": "ESP32"
    },
    {
      "name": "Arduino Sensor",
      "type": "Arduino"
    }
  ]
}
```

### Telemetry Data

#### Submit Telemetry Data

```http
POST /telemetry
Content-Type: application/json

{
  "apiKey": "device-api-key-here",
  "temperature": 25.5,
  "humidity": 60.2,
  "data": {
    "pressure": 1013,
    "light": 450,
    "co2": 400
  }
}
```

#### Get Telemetry for Device

```http
GET /telemetry/device/:deviceId?limit=100
Authorization: Bearer <jwt_token>
```

## 📮 Postman Documentation

Interactive API documentation is available in Postman:

**[View Postman Collection](https://speeding-shadow-306868.postman.co/workspace/Team-Workspace~c4f35a82-8a91-4f87-8be1-ef75b79a19df/request/52285863-73e606f8-3ac3-424e-8496-9599585aaf5c?action=share&creator=52285863&ctx=documentation&active-environment=52285863-73a4cd88-c5a3-4008-812c-18159b4f5b64)**

The Postman collection includes:

- **Authentication endpoints** (Register, Login, Delete Account)
- **Device management** (CRUD operations with batch creation)
- **Telemetry data submission** (Device API key authentication)
- **Request examples** with sample data
- **Environment variables** for quick testing

### How to Use the Postman Collection

1. **Clone the Collection**: Click the link above and fork the collection to your workspace
2. **Set Environment Variables**:
   - `baseUrl`: `http://localhost:3000`
   - `jwtToken`: Will be automatically set after login
   - `apiKey`: Will be automatically set after device creation
3. **Run Authentication Flow**:
   - Execute "Register User" to create account
   - Execute "Login" to get JWT token (auto-saved to environment)
   - Execute "Create Device" to get API key (auto-saved to environment)
4. **Test All Endpoints**: Use the pre-configured requests with authentication

## 🗄️ Database Schema

### Users Table

- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `password`: String (Hashed dengan bcrypt)
- `name`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Devices Table

- `id`: UUID (Primary Key)
- `name`: String
- `type`: String (e.g., "ESP32", "Arduino")
- `description`: String (Optional)
- `apiKey`: String (Unique, UUID)
- `userId`: String (Foreign Key ke Users)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Telemetry Table

- `id`: UUID (Primary Key)
- `deviceId`: String (Foreign Key ke Devices)
- `temperature`: Float (Optional)
- `humidity`: Float (Optional)
- `data`: JSON (Flexible untuk sensor data lainnya)
- `timestamp`: DateTime (Default: now())

### Relationships

- One User can have Many Devices (1:N)
- One Device can generate Many Telemetry records (1:N)
- Cascade deletion: Deleting user deletes all devices and telemetry
- Cascade deletion: Deleting device deletes all telemetry data

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run E2E tests specifically
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Test Coverage

E2E tests cover:

- User registration and login
- JWT authentication flow
- Device CRUD operations (Create, Read, Update, Delete)
- Device batch creation
- Telemetry data submission
- API key validation
- Authorization (unauthorized access prevention)
- Ownership validation (users can only access their devices)
- Error scenarios (invalid credentials, invalid API keys, etc.)

### Test Structure

```
test/
└── app.e2e-spec.ts
    ├── Authentication Tests
    ├── Device CRUD Tests (without token)
    ├── Device CRUD Tests (with token)
    ├── Telemetry Tests
    └── Cleanup Tests
```

### Database Testing

Tests use a separate test database configuration and automatically clean up test data to ensure isolated test runs.

## ⚙️ Environment Variables

Create `.env` file in root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/iot_telemetry"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="24h"

# Application
PORT=3000
NODE_ENV=development
```

## Teknologi yang Digunakan

### Backend Framework

- **NestJS**: Progressive Node.js framework for building efficient applications
- **TypeScript**: Type-safe JavaScript superset

### Database & ORM

- **PostgreSQL**: Relational database
- **Prisma**: Next-generation ORM with type-safe database access

### Authentication & Security

- **JWT**: JSON Web Tokens for user authentication
- **bcrypt**: Password hashing library
- **Passport**: Authentication middleware for Node.js

### Validation & Documentation

- **class-validator**: DTO validation
- **class-transformer**: Data transformation
- **Swagger/OpenAPI**: API documentation

### Testing

- **Jest**: JavaScript testing framework
- **Supertest**: HTTP assertion library

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Prisma Studio**: Database management UI
