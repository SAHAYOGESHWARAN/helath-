const VideoSession = require('../models/VideoSession');
const twilio = require('twilio');

// Initialize Twilio client if credentials are available
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Get all video sessions
const getAllVideoSessions = async (req, res) => {
  try {
    const sessions = await VideoSession.findAll();
    res.json(sessions.map(s => s.toJSON()));
  } catch (error) {
    console.error('Error fetching video sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get video session by ID
const getVideoSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await VideoSession.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Video session not found' });
    }
    res.json(session.toJSON());
  } catch (error) {
    console.error('Error fetching video session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get video sessions by patient ID
const getVideoSessionsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const sessions = await VideoSession.findByPatientId(patientId);
    res.json(sessions.map(s => s.toJSON()));
  } catch (error) {
    console.error('Error fetching video sessions by patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get video sessions by provider ID
const getVideoSessionsByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;
    const sessions = await VideoSession.findByProviderId(providerId);
    res.json(sessions.map(s => s.toJSON()));
  } catch (error) {
    console.error('Error fetching video sessions by provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get video session by appointment ID
const getVideoSessionByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const sessions = await VideoSession.findByAppointmentId(appointmentId);
    if (sessions.length === 0) {
      return res.status(404).json({ error: 'Video session not found for this appointment' });
    }
    res.json(sessions[0].toJSON()); // Return the first one
  } catch (error) {
    console.error('Error fetching video session by appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new video session
const createVideoSession = async (req, res) => {
  try {
    const sessionData = req.body;
    const session = new VideoSession(sessionData);
    await session.save();
    res.status(201).json(session.toJSON());
  } catch (error) {
    console.error('Error creating video session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update video session
const updateVideoSession = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const session = await VideoSession.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Video session not found' });
    }
    await session.update(updates);
    res.json(session.toJSON());
  } catch (error) {
    console.error('Error updating video session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete video session
const deleteVideoSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await VideoSession.findById(id);
    if (!session) {
      return res.status(404).json({ error: 'Video session not found' });
    }
    await session.delete();
    res.json({ message: 'Video session deleted successfully' });
  } catch (error) {
    console.error('Error deleting video session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create Twilio room
const createTwilioRoom = async (req, res) => {
  try {
    if (!twilioClient) {
      return res.status(500).json({ error: 'Twilio not configured' });
    }

    const { roomName } = req.body;
    const room = await twilioClient.video.rooms.create({
      uniqueName: roomName,
      type: 'group'
    });

    res.json({ roomSid: room.sid, roomName: room.uniqueName });
  } catch (error) {
    console.error('Error creating Twilio room:', error);
    res.status(500).json({ error: 'Failed to create video room' });
  }
};

// Generate Twilio access token
const generateAccessToken = async (req, res) => {
  try {
    if (!twilioClient) {
      return res.status(500).json({ error: 'Twilio not configured' });
    }

    const { identity, roomName } = req.body;
    const token = new twilio.jwt.AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET,
      { identity }
    );

    const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
      room: roomName
    });

    token.addGrant(videoGrant);

    res.json({ token: token.toJwt() });
  } catch (error) {
    console.error('Error generating access token:', error);
    res.status(500).json({ error: 'Failed to generate access token' });
  }
};

module.exports = {
  getAllVideoSessions,
  getVideoSessionById,
  getVideoSessionsByPatientId,
  getVideoSessionsByProviderId,
  getVideoSessionByAppointmentId,
  createVideoSession,
  updateVideoSession,
  deleteVideoSession,
  createTwilioRoom,
  generateAccessToken
};
