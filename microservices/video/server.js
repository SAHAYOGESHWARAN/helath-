const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { createVideoRoom, generateAccessToken } = require('./twilio');
const { createSession, getSession } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const { checkAuth } = require('./auth');

// Endpoint to create a new video room and session
app.post('/api/video/room', checkAuth(), async (req, res) => {
  const { roomName, userIdentity } = req.body;

  if (!roomName || !userIdentity) {
    return res.status(400).json({ error: 'roomName and userIdentity are required' });
  }

  try {
    const room = await createVideoRoom(roomName);
    const sessionId = uuidv4();
    const sessionData = {
      sessionId,
      roomName: room.uniqueName,
      roomSid: room.sid,
      participants: [userIdentity],
      createdAt: new Date().toISOString(),
    };

    await createSession(sessionData);
    const token = generateAccessToken(userIdentity, room.uniqueName);

    res.status(201).json({
      sessionId,
      roomName: room.uniqueName,
      token,
    });
  } catch {
    res.status(500).json({ error: 'Failed to create video room' });
  }
});

// Endpoint to generate a token to join an existing room
app.post('/api/video/token', checkAuth(), async (req, res) => {
  const { roomName, userIdentity } = req.body;

  if (!roomName || !userIdentity) {
    return res.status(400).json({ error: 'roomName and userIdentity are required' });
  }

  try {
    const token = generateAccessToken(userIdentity, roomName);
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Endpoint to get session information
app.get('/api/video/session/:sessionId', checkAuth(), async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  } catch {
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

const PORT = process.env.VIDEO_PORT || 4004;
let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => console.log(`Video microservice listening on port ${PORT}`));
}

module.exports = { app, server };
