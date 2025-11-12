const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;

let client;
let AccessToken;
let VideoGrant;

if (accountSid && accountSid.startsWith('AC')) {
  client = twilio(accountSid, authToken);
  AccessToken = twilio.jwt.AccessToken;
  VideoGrant = AccessToken.VideoGrant;
}

/**
 * Creates a new Twilio video room.
 * @param {string} roomName - The name of the room.
 * @returns {Promise<object>}
 */
const createVideoRoom = async (roomName) => {
  try {
    const room = await client.video.v1.rooms.create({
      uniqueName: roomName,
      type: 'group', // Use 'group' for multi-party calls, which is typical for telemedicine.
    });
    return room;
  } catch (error) {
    // If the room already exists, Twilio will throw an error.
    // We can handle this by fetching the existing room.
    if (error.code === 53113) {
      return client.video.v1.rooms(roomName).fetch();
    }
    throw error;
  }
};

/**
 * Generates a Twilio access token for a user to join a video room.
 * @param {string} identity - The identity of the user.
 * @param {string} roomName - The name of the room to join.
 * @returns {string} The generated access token.
 */
const generateAccessToken = (identity, roomName) => {
  const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
    identity: identity,
  });

  const videoGrant = new VideoGrant({
    room: roomName,
  });

  token.addGrant(videoGrant);

  return token.toJwt();
};

module.exports = {
  createVideoRoom,
  generateAccessToken,
};
