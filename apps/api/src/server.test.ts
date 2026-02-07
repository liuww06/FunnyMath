import request from 'supertest';
import express from 'express';
import cors from 'cors';

// Create a test app similar to the actual server
const createTestApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Health check endpoint (same as in server.ts)
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Import and use progress routes
  const progressRoutes = require('./routes/progress').default;
  app.use('/api/progress', progressRoutes);

  return app;
};

describe('Server', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('Health Check', () => {
    test('GET /health should return status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(typeof response.body.timestamp).toBe('string');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });

    test('GET /health should handle CORS', async () => {
      const response = await request(app).get('/health')
        .set('Origin', 'http://localhost:3000');
      expect(response.status).toBe(200);
      // CORS headers should be present
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('CORS Configuration', () => {
    test('should allow requests from any origin', async () => {
      const response = await request(app).get('/health')
        .set('Origin', 'http://example.com');
      expect(response.status).toBe(200);
      expect(response.headers['access-control-allow-origin']).toBe('*');
    });

    test('should handle OPTIONS preflight request', async () => {
      const response = await request(app).options('/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');
      expect(response.status).toBe(204); // No content for OPTIONS
    });
  });

  describe('JSON Body Parsing', () => {
    test('should parse JSON body correctly', async () => {
      const testUserId = `test-json-${Date.now()}`;
      const response = await request(app)
        .post(`/api/progress/${testUserId}`)
        .send({ contentId: 'triangle-basic', points: 10 })
        .set('Content-Type', 'application/json');
      expect(response.status).toBe(200);
      expect(response.body.completedContent).toContain('triangle-basic');
    });

    test('should reject malformed JSON', async () => {
      const response = await request(app)
        .post('/api/progress/test-user')
        .send('{ invalid json }')
        .set('Content-Type', 'application/json');
      expect(response.status).toBe(400);
    });
  });

  describe('404 Handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });
  });

  describe('API Routes Prefix', () => {
    test('progress routes should be under /api/progress prefix', async () => {
      const testUserId = `test-prefix-${Date.now()}`;
      const response = await request(app).get(`/api/progress/${testUserId}`);
      expect(response.status).toBe(200);
    });

    test('should not access progress routes without /api prefix', async () => {
      const testUserId = `test-no-prefix-${Date.now()}`;
      const response = await request(app).get(`/progress/${testUserId}`);
      expect(response.status).toBe(404);
    });
  });
});
