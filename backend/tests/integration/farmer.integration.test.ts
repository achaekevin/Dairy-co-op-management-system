import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/database/client.js';
import { generateAccessToken } from '../../src/shared/utils/jwt.js';

describe('Farmer Integration Tests', () => {
  let tenantId: string;
  let accessToken: string;
  let farmerId: string;

  beforeAll(async () => {
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Test Tenant',
        slug: 'test-farmer',
        subdomain: 'test-farmer',
        isActive: true,
      },
    });
    tenantId = tenant.id;

    const user = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash: 'hashedpassword',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        tenantId,
        isEmailVerified: true,
        isActive: true,
      },
    });

    accessToken = generateAccessToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    });
  });

  afterAll(async () => {
    await prisma.farmer.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  });

  describe('POST /api/v1/farmers', () => {
    it('should create a new farmer', async () => {
      const response = await request(app)
        .post('/api/v1/farmers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          farmerId: 'F001',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '1234567890',
          email: 'john@example.com',
          cattle: 5,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.farmerId).toBe('F001');

      farmerId = response.body.data.id;
    });

    it('should return 409 for duplicate farmer ID', async () => {
      const response = await request(app)
        .post('/api/v1/farmers')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          farmerId: 'F001',
          firstName: 'Jane',
          lastName: 'Smith',
          phoneNumber: '0987654321',
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/farmers', () => {
    it('should list farmers with pagination', async () => {
      const response = await request(app)
        .get('/api/v1/farmers?page=1&limit=10')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta).toHaveProperty('total');
    });
  });

  describe('GET /api/v1/farmers/:id', () => {
    it('should get farmer by ID', async () => {
      const response = await request(app)
        .get(`/api/v1/farmers/${farmerId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(farmerId);
    });
  });

  describe('PUT /api/v1/farmers/:id', () => {
    it('should update farmer', async () => {
      const response = await request(app)
        .put(`/api/v1/farmers/${farmerId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          cattle: 10,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.cattle).toBe(10);
    });
  });

  describe('GET /api/v1/farmers/stats', () => {
    it('should get farmer statistics', async () => {
      const response = await request(app)
        .get('/api/v1/farmers/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalFarmers');
      expect(response.body.data).toHaveProperty('activeFarmers');
    });
  });
});
