/* eslint-env jest */
const request = require('supertest');
const { app, server } = require('../server');

describe('Auth Microservice', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('should login a user with correct credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@email.com',
        password: 'Password123!',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login a user with incorrect credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@email.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should verify a valid token', async () => {
    const loginRes = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@email.com',
        password: 'Password123!',
      });
    const token = loginRes.body.token;

    const res = await request(app)
      .post('/auth/verify')
      .send({ token });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
  });

  it('should not verify an invalid token', async () => {
    const res = await request(app)
      .post('/auth/verify')
      .send({ token: 'invalidtoken' });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error');
  });
});
