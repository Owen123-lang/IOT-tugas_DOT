import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('IoT Telemetry API (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let userId: string;
  let deviceId: string;
  let deviceApiKey: string;

  beforeAll(async () => {
    // Clean up any existing test user first to ensure clean state
    const { PrismaClient } = require('@prisma/client');
    const { PrismaPg } = require('@prisma/adapter-pg');
    const pg = require('pg');
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });
    try {
      await prisma.user.deleteMany({
        where: { email: 'test@example.com' },
      });
    } catch {
      // User may not exist, continue
    } finally {
      await prisma.$disconnect();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same pipes as main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    // Clean up test user from database to allow re-running tests
    if (userId) {
      const { PrismaClient } = require('@prisma/client');
      const { PrismaPg } = require('@prisma/adapter-pg');
      const pg = require('pg');
      const pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL,
      });
      const adapter = new PrismaPg(pool);
      const prisma = new PrismaClient({ adapter });
      try {
        await prisma.user.delete({ where: { id: userId } });
      } catch {
        // User may already be deleted or not exist
      } finally {
        await prisma.$disconnect();
      }
    }
    await app.close();
  });

  describe('Authentication', () => {
    it('/auth/register (POST) - should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
          expect(response.body).toHaveProperty('user');
          expect(response.body.user.email).toBe('test@example.com');
        });
    });

    it('/auth/login (POST) - should login and return JWT token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('access_token');
          jwtToken = response.body.access_token; // Save token for later tests
          userId = response.body.user.id;
        });
    });

    it('/auth/login (POST) - should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('Devices - Without Token', () => {
    it('/devices (POST) - should FAIL without token (401)', () => {
      return request(app.getHttpServer())
        .post('/devices')
        .send({
          name: 'ESP32 Room 1',
          type: 'ESP32',
          description: 'Temperature sensor',
        })
        .expect(401); // Unauthorized
    });

    it('/devices (GET) - should FAIL without token (401)', () => {
      return request(app.getHttpServer()).get('/devices').expect(401);
    });
  });

  describe('Devices - With Token', () => {
    it('/devices (POST) - should CREATE device with valid token', () => {
      return request(app.getHttpServer())
        .post('/devices')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'ESP32 Living Room',
          type: 'ESP32',
          description: 'Temperature and humidity sensor',
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body).toHaveProperty('apiKey');
          expect(response.body.name).toBe('ESP32 Living Room');
          deviceId = response.body.id;
          deviceApiKey = response.body.apiKey; // Save for telemetry test
        });
    });

    it('/devices (GET) - should GET all devices with valid token', () => {
      return request(app.getHttpServer())
        .get('/devices')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
        });
    });

    it('/devices/:id (GET) - should GET specific device', () => {
      return request(app.getHttpServer())
        .get(`/devices/${deviceId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(deviceId);
          expect(response.body.name).toBe('ESP32 Living Room');
        });
    });

    it('/devices/:id (PATCH) - should UPDATE device', () => {
      return request(app.getHttpServer())
        .patch(`/devices/${deviceId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
          name: 'ESP32 Bedroom',
        })
        .expect(200)
        .then((response) => {
          expect(response.body.name).toBe('ESP32 Bedroom');
        });
    });
  });

  describe('Telemetry', () => {
    it('/telemetry (POST) - should SEND telemetry data with device API key', () => {
      return request(app.getHttpServer())
        .post('/telemetry')
        .send({
          apiKey: deviceApiKey,
          temperature: 25.5,
          humidity: 60.2,
          data: {
            pressure: 1013,
            light: 450,
          },
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.temperature).toBe(25.5);
          expect(response.body.humidity).toBe(60.2);
          expect(response.body.deviceId).toBe(deviceId);
        });
    });

    it('/telemetry (POST) - should FAIL with invalid API key', () => {
      return request(app.getHttpServer())
        .post('/telemetry')
        .send({
          apiKey: 'invalid-api-key',
          temperature: 25.5,
        })
        .expect(401);
    });

    it('/telemetry/device/:deviceId (GET) - should GET telemetry data for device', () => {
      return request(app.getHttpServer())
        .get(`/telemetry/device/${deviceId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .then((response) => {
          expect(Array.isArray(response.body)).toBe(true);
          expect(response.body.length).toBeGreaterThan(0);
          expect(response.body[0].deviceId).toBe(deviceId);
        });
    });

    it('/telemetry/device/:deviceId (GET) - should FAIL without token', () => {
      return request(app.getHttpServer())
        .get(`/telemetry/device/${deviceId}`)
        .expect(401);
    });
  });

  describe('Cleanup', () => {
    it('/devices/:id (DELETE) - should DELETE device', () => {
      return request(app.getHttpServer())
        .delete(`/devices/${deviceId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });
});
