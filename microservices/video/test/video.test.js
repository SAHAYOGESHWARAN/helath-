/* eslint-env jest */
const request = require('supertest');
const { app, server } = require('../server');

jest.mock('../auth', () => ({
  checkAuth: (roles) => (req, res, next) => {
    req.user = { id: 'test', role: 'provider' };
    next();
  },
}));

jest.mock('../db', () => ({
  createSession: jest.fn(),
  getSession: jest.fn(),
}));

jest.mock('../twilio', () => ({
  createVideoRoom: jest.fn().mockResolvedValue({ sid: 'room-sid', uniqueName: 'room-name' }),
  generateAccessToken: jest.fn().mockReturnValue('test-token'),
}));

describe('Video Microservice', () => {
  let server;

  beforeAll((done) => {
    server = app.listen(4008, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should create a video room', async () => {
    const res = await request(app)
      .post('/api/video/room')
      .send({
        roomName: 'test-room',
        userIdentity: 'test-user',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should get a video token', async () => {
    const res = await request(app)
      .post('/api/video/token')
      .send({
        roomName: 'test-room',
        userIdentity: 'test-user',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
