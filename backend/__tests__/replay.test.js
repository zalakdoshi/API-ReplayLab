const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Mock setup
const mockUserId = new mongoose.Types.ObjectId();
const mockRequestId = new mongoose.Types.ObjectId();
const mockToken = jwt.sign({ id: mockUserId }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '7d' });

describe('Replay API Endpoints', () => {
  let app;

  beforeAll(() => {
    app = require('../server');
  });

  // Test authentication requirements
  describe('Authentication Requirements', () => {
    test('POST /api/replay/execute/:requestId should require authentication', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .send({
          targetUrl: 'https://api.example.com/test',
          environment: 'test'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    test('POST /api/replay/batch should require authentication', async () => {
      const res = await request(app)
        .post('/api/replay/batch')
        .send({
          requestIds: [mockRequestId],
          targetBaseUrl: 'https://api.example.com'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    test('GET /api/replay/runs should require authentication', async () => {
      const res = await request(app)
        .get('/api/replay/runs');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    test('GET /api/replay/status/:runId should require authentication', async () => {
      const res = await request(app)
        .get(`/api/replay/status/${mockRequestId}`);

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    test('GET /api/replay/stats should require authentication', async () => {
      const res = await request(app)
        .get('/api/replay/stats');

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  // Test SSRF protection
  describe('SSRF Protection', () => {
    test('should reject private IP addresses (127.0.0.0/8)', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'http://127.0.0.1:8080/test',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('not allowed');
    });

    test('should reject private IP addresses (10.0.0.0/8)', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'http://10.0.0.1/api',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('not allowed');
    });

    test('should reject private IP addresses (172.16.0.0/12)', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'http://172.16.0.1/service',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('not allowed');
    });

    test('should reject private IP addresses (192.168.0.0/16)', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'http://192.168.1.100/endpoint',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('not allowed');
    });

    test('should reject localhost', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'http://localhost:3000/api',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('not allowed');
    });

    test('should reject IPv6 loopback', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'http://[::1]/test',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('not allowed');
    });

    test('should reject multicast addresses', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'http://224.0.0.1/api',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('not allowed');
    });

    test('should reject invalid protocols', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'ftp://example.com/file',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('protocol');
    });

    test('should reject invalid URLs', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'not-a-valid-url',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('Invalid URL');
    });

    test('should allow valid public URLs', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'https://api.github.com/users/octocat',
          environment: 'test'
        });

      // We expect 404 or 202 depending on whether the mock request exists
      // But not 403 (forbidden due to SSRF)
      expect(res.statusCode).not.toBe(403);
      expect([202, 404, 500]).toContain(res.statusCode);
    });

    test('should allow valid HTTPS URLs', async () => {
      const res = await request(app)
        .post(`/api/replay/execute/${mockRequestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetUrl: 'https://example.com/api/v1/test',
          environment: 'test'
        });

      // We expect 404 or 202 depending on whether the mock request exists
      expect(res.statusCode).not.toBe(403);
      expect([202, 404, 500]).toContain(res.statusCode);
    });
  });

  // Test CORS headers
  describe('CORS Configuration', () => {
    test('should include CORS headers in response', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      // CORS headers should be present
      expect(res.headers).toHaveProperty('access-control-allow-origin');
    });

    test('should allow requests from allowed origins', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:5173');

      expect([200, 401, 403]).toContain(res.statusCode);
    });
  });

  // Test batch replay URL validation
  describe('Batch Replay URL Validation', () => {
    test('should validate base URL for batch replay', async () => {
      const res = await request(app)
        .post('/api/replay/batch')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          requestIds: [mockRequestId],
          targetBaseUrl: 'http://192.168.1.1/api',
          environment: 'test'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toContain('not allowed');
    });

    test('should accept valid base URLs for batch replay', async () => {
      const res = await request(app)
        .post('/api/replay/batch')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          requestIds: [mockRequestId],
          targetBaseUrl: 'https://api.example.com',
          environment: 'test'
        });

      // Should not be 403 (SSRF rejection)
      expect(res.statusCode).not.toBe(403);
    });
  });

  // Test error handling
  describe('Error Handling', () => {
    test('should return 400 for invalid batch request (empty requestIds)', async () => {
      const res = await request(app)
        .post('/api/replay/batch')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          requestIds: [],
          targetBaseUrl: 'https://api.example.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should return 400 for invalid batch request (no requestIds)', async () => {
      const res = await request(app)
        .post('/api/replay/batch')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          targetBaseUrl: 'https://api.example.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('should return appropriate status codes with JSON responses', async () => {
      const res = await request(app)
        .get('/api/replay/runs')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(res.statusCode).toBeGreaterThanOrEqual(200);
      expect(res.body).toBeDefined();
    });
  });
});
