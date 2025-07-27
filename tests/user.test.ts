import request from 'supertest';
import app from '../src/index'; // Assuming app is exported

describe('User Signup', () => {
  it('should fail to signup a blacklisted user', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({ name: 'Blacklisted', email: 'black@example.com' });

    expect(res.status).toBe(403);
  });
});
