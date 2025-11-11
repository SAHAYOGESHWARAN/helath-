const { getDB } = require('../db/mongo');
const Joi = require('joi');
const mockData = require('../mockData');

const patientSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    dob: Joi.date().iso().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    contact: Joi.object({
        phone: Joi.string().required(),
        email: Joi.string().email().required()
    }).required(),
    medicalHistory: Joi.array().items(Joi.string()).optional()
});

const getAllPatients = async (req, res) => {
    try {
        const db = getDB();
        const records = await db.collection('records').find({}).toArray();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getPatientById = async (req, res) => {
    try {
        const db = getDB();
        const { patientId } = req.params;
        const record = await db.collection('records').findOne({ id: patientId });
        if (record) {
            res.json(record);
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createPatient = async (req, res) => {
    try {
        const { error, value } = patientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const db = getDB();
        const newRecord = value;
        const result = await db.collection('records').insertOne(newRecord);
        const createdRecord = { _id: result.insertedId, ...newRecord };

        req.app.get('wss').broadcast({
            type: 'RECORD_CREATED',
            payload: createdRecord
        });

        res.status(201).json(createdRecord);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create record', details: err.message });
    }
};

const updatePatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { error, value } = patientSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const db = getDB();
        const updatedRecord = value;
        const result = await db.collection('records').updateOne({ id: patientId }, { $set: updatedRecord });

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        req.app.get('wss').broadcast({
            type: 'RECORD_UPDATED',
            payload: { patientId, ...updatedRecord }
        });

        res.json({ message: 'Patient record updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deletePatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const db = getDB();
        const result = await db.collection('records').deleteOne({ id: patientId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        req.app.get('wss').broadcast({
            type: 'RECORD_DELETED',
            payload: { patientId }
        });

        res.json({ message: 'Patient record deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllClaims = (req, res) => res.json(mockData.claims);
const getAllInvoices = (req, res) => res.json(mockData.invoices);
const getAllPrescriptions = (req, res) => res.json(mockData.prescriptions);
const getAllMessages = (req, res) => res.json(mockData.messages);
const getAllLabOrders = (req, res) => res.json(mockData.labOrders);
const getAllReferrals = (req, res) => res.json(mockData.referrals);

module.exports = {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    getAllClaims,
    getAllInvoices,
    getAllPrescriptions,
    getAllMessages,
    getAllLabOrders,
    getAllReferrals
};
