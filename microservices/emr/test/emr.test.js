/* eslint-env jest */
const request = require('supertest');
const { app, server } = require('../server');
const { connectDB, closeDB } = require('../db/mongo');

jest.mock('../auth', () => ({
  checkAuth: (roles) => (req, res, next) => {
    req.user = { id: 'test', role: 'provider' };
    next();
  },
}));

const { MongoMemoryServer } = require('mongodb-memory-server');

describe('EMR Microservice', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await connectDB(mongoUri);
  });

  afterAll(async () => {
    await closeDB();
    await mongoServer.stop();
    server.close();
  });

  it('should get patients', async () => {
    const res = await request(app).get('/api/patients');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
