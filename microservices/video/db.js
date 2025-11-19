let AWS;
try {
  AWS = require('aws-sdk');
} catch (err) {
  AWS = null;
}
require('dotenv').config();

const SESSIONS_TABLE_NAME = 'video_sessions';

if (AWS) {
  // Configure AWS
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const dynamoDB = new AWS.DynamoDB();
  const documentClient = new AWS.DynamoDB.DocumentClient();

  // Create table if it doesn't exist
  const createSessionsTable = async () => {
    const params = { TableName: SESSIONS_TABLE_NAME };
    try {
      await dynamoDB.describeTable(params).promise();
      console.log(`Table ${SESSIONS_TABLE_NAME} already exists.`);
    } catch (error) {
      if (error.code === 'ResourceNotFoundException') {
        const createParams = {
          TableName: SESSIONS_TABLE_NAME,
          KeySchema: [{ AttributeName: 'sessionId', KeyType: 'HASH' }],
          AttributeDefinitions: [{ AttributeName: 'sessionId', AttributeType: 'S' }],
          ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 },
        };
        await dynamoDB.createTable(createParams).promise();
        console.log(`Table ${SESSIONS_TABLE_NAME} created.`);
      } else {
        console.error('Error creating table:', error);
      }
    }
  };

  // Initialize table on startup
  createSessionsTable();

  const createSession = async (sessionData) => {
    const params = { TableName: SESSIONS_TABLE_NAME, Item: sessionData };
    await documentClient.put(params).promise();
    return sessionData;
  };

  const getSession = async (sessionId) => {
    const params = { TableName: SESSIONS_TABLE_NAME, Key: { sessionId } };
    const { Item } = await documentClient.get(params).promise();
    return Item;
  };

  module.exports = { createSession, getSession };
} else {
  // Fallback: in-memory session store for local development
  const sessions = new Map();

  const createSession = async (sessionData) => {
    const id = sessionData.sessionId || `local-${Date.now()}`;
    sessionData.sessionId = id;
    sessions.set(id, sessionData);
    return sessionData;
  };

  const getSession = async (sessionId) => {
    return sessions.get(sessionId) || null;
  };

  console.warn('AWS SDK not available — using in-memory session store for video service');

  module.exports = { createSession, getSession };
}
