/* eslint-env jest */
const request = require('supertest');
const { app, server, db } = require('../server');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.mock('../auth', () => ({
  checkAuth: (roles) => (req, res, next) => {
    req.user = { id: 'test', role: 'provider' };
    next();
  },
}));

const { connectDB, closeDB } = require('../server');

describe('Notes Microservice', () => {
  let mongoServer;
  let server;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await connectDB(mongoUri);
    server = app.listen(4007);
  });

  afterAll(async () => {
    await mongoServer.stop();
    server.close();
  });

  it('should get notes', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
