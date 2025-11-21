const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

class Note {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.patientId = data.patientId;
    this.providerId = data.providerId;
    this.title = data.title;
    this.content = data.content;
    this.type = data.type || 'general'; // general, progress, treatment, etc.
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async save() {
    const params = {
      TableName: 'notes',
      Item: {
        id: this.id,
        patientId: this.patientId,
        providerId: this.providerId,
        title: this.title,
        content: this.content,
        type: this.type,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    };

    await docClient.send(new PutCommand(params));
    return this;
  }

  static async findById(id) {
    const params = {
      TableName: 'notes',
      Key: { id }
    };

    const result = await docClient.send(new GetCommand(params));
    if (result.Item) {
      return new Note(result.Item);
    }
    return null;
  }

  static async findByPatientId(patientId) {
    const params = {
      TableName: 'notes',
      IndexName: 'patientId-index', // Assuming GSI on patientId
      KeyConditionExpression: 'patientId = :patientId',
      ExpressionAttributeValues: {
        ':patientId': patientId
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items && result.Items.length > 0) {
      return result.Items.map(item => new Note(item));
    }
    return [];
  }

  static async findByProviderId(providerId) {
    const params = {
      TableName: 'notes',
      IndexName: 'providerId-index', // Assuming GSI on providerId
      KeyConditionExpression: 'providerId = :providerId',
      ExpressionAttributeValues: {
        ':providerId': providerId
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items && result.Items.length > 0) {
      return result.Items.map(item => new Note(item));
    }
    return [];
  }

  static async findAll() {
    const params = {
      TableName: 'notes'
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items) {
      return result.Items.map(item => new Note(item));
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
        TableName: 'notes',
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
      TableName: 'notes',
      Key: { id: this.id }
    };

    await docClient.send(new DeleteCommand(params));
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      patientId: this.patientId,
      providerId: this.providerId,
      title: this.title,
      content: this.content,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Note;
