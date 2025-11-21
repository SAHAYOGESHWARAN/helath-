const { docClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
  constructor(userData) {
    this.id = userData.id || uuidv4();
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role;
    this.name = userData.name;
    this.avatarUrl = userData.avatarUrl;
    this.dob = userData.dob;
    this.phone = userData.phone;
    this.address = userData.address;
    this.state = userData.state;
    this.status = userData.status;
    this.createdAt = userData.createdAt || new Date().toISOString();
    this.conditions = userData.conditions || [];
    this.allergies = userData.allergies || [];
    this.medications = userData.medications || [];
    this.vitals = userData.vitals || [];
    this.labResults = userData.labResults || [];
    this.healthGoals = userData.healthGoals || [];
    this.tasks = userData.tasks || [];
    this.subscription = userData.subscription;
    this.insurance = userData.insurance;
    this.notificationSettings = userData.notificationSettings;
    this.specialty = userData.specialty;
    this.licenseNumber = userData.licenseNumber;
    this.isVerified = userData.isVerified;
  }

  async save() {
    // Hash password before saving
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    const params = {
      TableName: 'users',
      Item: {
        id: this.id,
        email: this.email,
        password: this.password,
        role: this.role,
        name: this.name,
        avatarUrl: this.avatarUrl,
        dob: this.dob,
        phone: this.phone,
        address: this.address,
        state: this.state,
        status: this.status,
        createdAt: this.createdAt,
        conditions: this.conditions || [],
        allergies: this.allergies || [],
        medications: this.medications || [],
        vitals: this.vitals || [],
        labResults: this.labResults || [],
        healthGoals: this.healthGoals || [],
        tasks: this.tasks || [],
        subscription: this.subscription,
        insurance: this.insurance,
        notificationSettings: this.notificationSettings,
        specialty: this.specialty,
        licenseNumber: this.licenseNumber,
        isVerified: this.isVerified,
      },
    };
    await docClient.send(new PutCommand(params));
    return this;
  }

  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  static async create(userData) {
    const user = new User(userData);
    await user.save();
    return user;
  }

  static async findById(id) {
    const params = {
      TableName: 'users',
      Key: { id },
    };
    const result = await docClient.send(new GetCommand(params));
    return result.Item;
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
    return result.Items[0];
  }

  static async findAllByRole(role) {
    const params = {
      TableName: 'users',
      FilterExpression: 'role = :role',
      ExpressionAttributeValues: {
        ':role': role,
      },
    };
    const result = await docClient.send(new ScanCommand(params));
    return result.Items;
  }

  static async update(id, updateData) {
    const updateExpression = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    Object.keys(updateData).forEach((key, index) => {
      updateExpression.push(`#${key} = :val${index}`);
      expressionAttributeValues[`:val${index}`] = updateData[key];
      expressionAttributeNames[`#${key}`] = key;
    });

    const params = {
      TableName: 'users',
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    };
    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  static async delete(id) {
    const params = {
      TableName: 'users',
      Key: { id },
    };
    await docClient.send(new DeleteCommand(params));
    return { id };
  }
}

module.exports = User;
