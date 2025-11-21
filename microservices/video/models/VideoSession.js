const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

class VideoSession {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.appointmentId = data.appointmentId;
    this.patientId = data.patientId;
    this.providerId = data.providerId;
    this.roomName = data.roomName;
    this.twilioRoomSid = data.twilioRoomSid;
    this.status = data.status || 'scheduled'; // scheduled, active, completed, cancelled
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.participants = data.participants || [];
    this.recordings = data.recordings || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async save() {
    const params = {
      TableName: 'video_sessions',
      Item: {
        id: this.id,
        appointmentId: this.appointmentId,
        patientId: this.patientId,
        providerId: this.providerId,
        roomName: this.roomName,
        twilioRoomSid: this.twilioRoomSid,
        status: this.status,
        startTime: this.startTime,
        endTime: this.endTime,
        participants: this.participants,
        recordings: this.recordings,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    };

    await docClient.send(new PutCommand(params));
    return this;
  }

  static async findById(id) {
    const params = {
      TableName: 'video_sessions',
      Key: { id }
    };

    const result = await docClient.send(new GetCommand(params));
    if (result.Item) {
      return new VideoSession(result.Item);
    }
    return null;
  }

  static async findByAppointmentId(appointmentId) {
    const params = {
      TableName: 'video_sessions',
      IndexName: 'appointmentId-index', // Assuming GSI on appointmentId
      KeyConditionExpression: 'appointmentId = :appointmentId',
      ExpressionAttributeValues: {
        ':appointmentId': appointmentId
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items && result.Items.length > 0) {
      return result.Items.map(item => new VideoSession(item));
    }
    return [];
  }

  static async findByPatientId(patientId) {
    const params = {
      TableName: 'video_sessions',
      IndexName: 'patientId-index', // Assuming GSI on patientId
      KeyConditionExpression: 'patientId = :patientId',
      ExpressionAttributeValues: {
        ':patientId': patientId
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items) {
      return result.Items.map(item => new VideoSession(item));
    }
    return [];
  }

  static async findByProviderId(providerId) {
    const params = {
      TableName: 'video_sessions',
      IndexName: 'providerId-index', // Assuming GSI on providerId
      KeyConditionExpression: 'providerId = :providerId',
      ExpressionAttributeValues: {
        ':providerId': providerId
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items) {
      return result.Items.map(item => new VideoSession(item));
    }
    return [];
  }

  static async findAll() {
    const params = {
      TableName: 'video_sessions'
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items) {
      return result.Items.map(item => new VideoSession(item));
    }
    return [];
  }

  async update(updates) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    Object.keys(updates).forEach(key => {
      if (key !== 'id') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = updates[key];
        expressionAttributeNames[`#${key}`] = key;
      }
    });

    if (updateExpression.length > 0) {
      updateExpression.push('updatedAt = :updatedAt');
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      const params = {
        TableName: 'video_sessions',
        Key: { id: this.id },
        UpdateExpression: 'SET ' + updateExpression.join(', '),
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW'
      };

      const result = await docClient.send(new UpdateCommand(params));
      Object.assign(this, result.Attributes);
    }

    return this;
  }

  async delete() {
    const params = {
      TableName: 'video_sessions',
      Key: { id: this.id }
    };

    await docClient.send(new DeleteCommand(params));
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      appointmentId: this.appointmentId,
      patientId: this.patientId,
      providerId: this.providerId,
      roomName: this.roomName,
      twilioRoomSid: this.twilioRoomSid,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      participants: this.participants,
      recordings: this.recordings,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = VideoSession;
