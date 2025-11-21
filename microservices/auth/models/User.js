const { docClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('../db');

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.avatarUrl = data.avatarUrl;
    this.dob = data.dob;
    this.phone = data.phone;
    this.address = data.address;
    this.state = data.state;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }

  static async create(userData) {
    const params = {
      TableName: 'users',
      Item: userData,
    };
    await docClient.send(new PutCommand(params));
    return new User(userData);
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

  static async findById(id) {
    const params = {
      TableName: 'users',
      Key: { id },
    };
    const result = await docClient.send(new GetCommand(params));
    return result.Item ? new User(result.Item) : null;
  }

  async update(updates) {
    const params = {
      TableName: 'users',
      Key: { id: this.id },
      UpdateExpression: 'set #name = :name, email = :email, password = :password, role = :role',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': updates.name || this.name,
        ':email': updates.email || this.email,
        ':password': updates.password || this.password,
        ':role': updates.role || this.role,
      },
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
