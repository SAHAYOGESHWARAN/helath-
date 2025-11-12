/* eslint-env jest */
const request = require('supertest');
const { app, server } = require('../server');

jest.mock('../auth', () => ({
  checkAuth: (roles) => (req, res, next) => {
    req.user = { id: 'test', role: 'provider' };
    next();
  },
}));

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn().mockResolvedValue({ rows: [] }),
    connect: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Scheduling Microservice', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(4006, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should get appointments', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
