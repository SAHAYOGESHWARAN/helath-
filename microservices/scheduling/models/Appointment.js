const { docClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } = require('../db');

class Appointment {
  constructor(data) {
    this.id = data.id;
    this.patientId = data.patientId;
    this.providerId = data.providerId;
    this.date = data.date;
    this.time = data.time;
    this.status = data.status || 'scheduled';
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static async create(appointmentData) {
    const appointment = new Appointment(appointmentData);
    const params = {
      TableName: 'appointments',
      Item: appointment,
    };
    await docClient.send(new PutCommand(params));
    return appointment;
  }

  static async findById(id) {
    const params = {
      TableName: 'appointments',
      Key: { id },
    };
    const result = await docClient.send(new GetCommand(params));
    return result.Item ? new Appointment(result.Item) : null;
  }

  static async findByPatientId(patientId) {
    const params = {
      TableName: 'appointments',
      FilterExpression: 'patientId = :patientId',
      ExpressionAttributeValues: {
        ':patientId': patientId,
      },
    };
    const result = await docClient.send(new ScanCommand(params));
    return result.Items.map(item => new Appointment(item));
  }

  static async findByProviderId(providerId) {
    const params = {
      TableName: 'appointments',
      FilterExpression: 'providerId = :providerId',
      ExpressionAttributeValues: {
        ':providerId': providerId,
      },
    };
    const result = await docClient.send(new ScanCommand(params));
    return result.Items.map(item => new Appointment(item));
  }

  async update(updates) {
    const params = {
      TableName: 'appointments',
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
      TableName: 'appointments',
      Key: { id: this.id },
    };
    await docClient.send(new DeleteCommand(params));
  }
}

module.exports = Appointment;
