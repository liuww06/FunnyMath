import request from 'supertest';
import express from 'express';
import progressRoutes from './progress';

const app = express();
app.use(express.json());
app.use('/api/progress', progressRoutes);

describe('Progress API', () => {
  // Use unique IDs per test to avoid interference
  const getUserId = () => `test-user-${Math.random().toString(36).substr(2, 9)}`;

  test('GET /api/progress/:userId should return empty progress for new user', async () => {
    const testUserId = getUserId();
    const response = await request(app).get(`/api/progress/${testUserId}`);
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      completedContent: [],
      totalPoints: 0,
      level: 1,
      userId: testUserId
    });
  });

  test('POST /api/progress/:userId should update progress', async () => {
    const testUserId = getUserId();
    const response = await request(app)
      .post(`/api/progress/${testUserId}`)
      .send({ contentId: 'triangle-basic', points: 10 });
    expect(response.status).toBe(200);
    expect(response.body.completedContent).toContain('triangle-basic');
    expect(response.body.totalPoints).toBe(10);
  });

  test('GET after POST should return updated progress', async () => {
    const testUserId = getUserId();
    await request(app)
      .post(`/api/progress/${testUserId}`)
      .send({ contentId: 'triangle-basic', points: 10 });
    const response = await request(app).get(`/api/progress/${testUserId}`);
    expect(response.body.totalPoints).toBe(10);
  });
});
