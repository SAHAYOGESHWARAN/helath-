const { docClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } = require('../db');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'patient';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static async create(userData) {
    const user = new User(userData);
    const params = {
      TableName: 'users',
      Item: user,
    };
    await docClient.send(new PutCommand(params));
    return user;
  }

  static async findById(id) {
    const params = {
      TableName: 'users',
      Key: { id },
    };
    const result = await docClient.send(new GetCommand(params));
    return result.Item ? new User(result.Item) : null;
  }

  static async findByEmail(email) {
    const params = {
      TableName: 'users',
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };
    const result = await docClient.send(new ScanCommand(params));
    return result.Items.length > 0 ? new User(result.Items[0]) : null;
  }

  async update(updates) {
    const params = {
      TableName: 'users',
      Key: { id: this.id },
      UpdateExpression: 'set ' + Object.keys(updates).map((key, index) => `#${key} = :val${index}`).join(', '),
      ExpressionAttributeNames: Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
      ExpressionAttributeValues: Object.keys(updates).reduce((acc, key, index) => ({ ...acc, [`:val${index}`]: updates[key] }), {}),
      ReturnValues: 'ALL_NEW',
    };
    const result = await docClient.send(new UpdateCommand(params));
    Object.assign(this, result.Attributes);
    return this;
  }

  async delete() {
    const params = {
      TableName: 'users',
      Key: { id: this.id },
    };
    await docClient.send(new DeleteCommand(params));
  }
}

module.exports = User;
