const { docClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('../db');

class User {
  static async create(userData) {
    const params = {
      TableName: 'users',
      Item: {
        id: userData.id,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        dob: userData.dob,
        phone: userData.phone,
        address: userData.address,
        state: userData.state,
        status: userData.status,
        createdAt: userData.createdAt,
        conditions: userData.conditions || [],
        allergies: userData.allergies || [],
        medications: userData.medications || [],
        vitals: userData.vitals || [],
        labResults: userData.labResults || [],
        healthGoals: userData.healthGoals || [],
        tasks: userData.tasks || [],
        subscription: userData.subscription,
        insurance: userData.insurance,
        notificationSettings: userData.notificationSettings,
        specialty: userData.specialty,
        licenseNumber: userData.licenseNumber,
        isVerified: userData.isVerified,
      },
    };
    await docClient.send(new PutCommand(params));
    return userData;
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
