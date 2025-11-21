const { docClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('../db');

class Patient {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.email = data.email;
    this.dob = data.dob;
    this.phone = data.phone;
    this.address = data.address;
    this.state = data.state;
    this.medicalHistory = data.medicalHistory;
    this.allergies = data.allergies;
    this.currentMedications = data.currentMedications;
    this.emergencyContact = data.emergencyContact;
    this.createdAt = data.createdAt;
  }

  static async create(patientData) {
    const params = {
      TableName: 'patients',
      Item: patientData,
    };
    await docClient.send(new PutCommand(params));
    return new Patient(patientData);
  }

  static async findById(id) {
    const params = {
      TableName: 'patients',
      Key: { id },
    };
    const result = await docClient.send(new GetCommand(params));
    return result.Item ? new Patient(result.Item) : null;
  }

  static async findByUserId(userId) {
    const params = {
      TableName: 'patients',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    };
    const result = await docClient.send(new ScanCommand(params));
    return result.Items.length > 0 ? new Patient(result.Items[0]) : null;
  }

  static async findAll() {
    const params = {
      TableName: 'patients',
    };
    const result = await docClient.send(new ScanCommand(params));
    return result.Items.map(item => new Patient(item));
  }

  async update(updates) {
    const params = {
      TableName: 'patients',
      Key: { id: this.id },
      UpdateExpression: 'set #name = :name, email = :email, dob = :dob, phone = :phone, address = :address, #state = :state, medicalHistory = :medicalHistory, allergies = :allergies, currentMedications = :currentMedications, emergencyContact = :emergencyContact',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#state': 'state',
      },
      ExpressionAttributeValues: {
        ':name': updates.name || this.name,
        ':email': updates.email || this.email,
        ':dob': updates.dob || this.dob,
        ':phone': updates.phone || this.phone,
        ':address': updates.address || this.address,
        ':state': updates.state || this.state,
        ':medicalHistory': updates.medicalHistory || this.medicalHistory,
        ':allergies': updates.allergies || this.allergies,
        ':currentMedications': updates.currentMedications || this.currentMedications,
        ':emergencyContact': updates.emergencyContact || this.emergencyContact,
      },
      ReturnValues: 'ALL_NEW',
    };
    const result = await docClient.send(new UpdateCommand(params));
    Object.assign(this, result.Attributes);
    return this;
  }

  async delete() {
    const params = {
      TableName: 'patients',
      Key: { id: this.id },
    };
    await docClient.send(new DeleteCommand(params));
  }
}

module.exports = Patient;
