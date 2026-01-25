import request from 'supertest';
import express from 'express';
import progressRoutes from './progress';

const app = express();
app.use(express.json());
app.use('/api/progress', progressRoutes);

describe('Progress API', () => {
  const testUserId = 'test-user-123';

  test('GET /api/progress/:userId should return empty progress for new user', async () => {
    const response = await request(app).get(`/api/progress/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      userId: testUserId,
      completedContent: [],
      totalPoints: 0,
      level: 1
    });
  });

  test('POST /api/progress/:userId should update progress', async () => {
    const response = await request(app)
      .post(`/api/progress/${testUserId}`)
      .send({ contentId: 'triangle-basic', points: 10 });
    expect(response.status).toBe(200);
    expect(response.body.completedContent).toContain('triangle-basic');
    expect(response.body.totalPoints).toBe(10);
  });

  test('GET after POST should return updated progress', async () => {
    await request(app)
      .post(`/api/progress/${testUserId}`)
      .send({ contentId: 'triangle-basic', points: 10 });
    const response = await request(app).get(`/api/progress/${testUserId}`);
    expect(response.body.totalPoints).toBe(10);
  });
});
