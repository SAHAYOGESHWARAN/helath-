const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB();
const documentClient = new AWS.DynamoDB.DocumentClient();

const SESSIONS_TABLE_NAME = 'video_sessions';

// Create table if it doesn't exist
const createSessionsTable = async () => {
  const params = {
    TableName: SESSIONS_TABLE_NAME,
  };

  try {
    await dynamoDB.describeTable(params).promise();
    console.log(`Table ${SESSIONS_TABLE_NAME} already exists.`);
  } catch (error) {
    if (error.code === 'ResourceNotFoundException') {
      const createParams = {
        TableName: SESSIONS_TABLE_NAME,
        KeySchema: [{ AttributeName: 'sessionId', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'sessionId', AttributeType: 'S' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
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

/**
 * Creates a new video session record in DynamoDB.
 * @param {object} sessionData - The session data to store.
 * @returns {Promise<object>}
 */
const createSession = async (sessionData) => {
  const params = {
    TableName: SESSIONS_TABLE_NAME,
    Item: sessionData,
  };
  await documentClient.put(params).promise();
  return sessionData;
};

/**
 * Retrieves a session from DynamoDB by its ID.
 * @param {string} sessionId - The ID of the session.
 * @returns {Promise<object|null>}
 */
const getSession = async (sessionId) => {
  const params = {
    TableName: SESSIONS_TABLE_NAME,
    Key: { sessionId },
  };
  const { Item } = await documentClient.get(params).promise();
  return Item;
};

module.exports = {
  createSession,
  getSession,
};
