const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

class Patient {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.dateOfBirth = data.dateOfBirth;
    this.gender = data.gender;
    this.phone = data.phone;
    this.email = data.email;
    this.address = data.address;
    this.medicalRecordNumber = data.medicalRecordNumber;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  async save() {
    const params = {
      TableName: 'patients',
      Item: {
        id: this.id,
        userId: this.userId,
        firstName: this.firstName,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        phone: this.phone,
        email: this.email,
        address: this.address,
        medicalRecordNumber: this.medicalRecordNumber,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    };

    await docClient.send(new PutCommand(params));
    return this;
  }

  static async findById(id) {
    const params = {
      TableName: 'patients',
      Key: { id }
    };

    const result = await docClient.send(new GetCommand(params));
    if (result.Item) {
      return new Patient(result.Item);
    }
    return null;
  }

  static async findByUserId(userId) {
    const params = {
      TableName: 'patients',
      IndexName: 'userId-index', // Assuming GSI on userId
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items && result.Items.length > 0) {
      return result.Items.map(item => new Patient(item));
    }
    return [];
  }

  static async findAll() {
    const params = {
      TableName: 'patients'
    };

    const result = await docClient.send(new QueryCommand(params));
    if (result.Items) {
      return result.Items.map(item => new Patient(item));
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
        TableName: 'patients',
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
      TableName: 'patients',
      Key: { id: this.id }
    };

    await docClient.send(new DeleteCommand(params));
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      phone: this.phone,
      email: this.email,
      address: this.address,
      medicalRecordNumber: this.medicalRecordNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Patient;
