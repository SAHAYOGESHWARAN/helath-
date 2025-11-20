const db = require('../db');

console.log('db object in patientController:', db);

const createPatient = (req, res) => {
    console.log('createPatient called');
    res.status(501).json({ message: 'Not Implemented' });
};

const getPatients = (req, res) => {
    console.log('getPatients called');
    res.status(501).json({ message: 'Not Implemented' });
};

const getPatientById = (req, res) => {
    console.log('getPatientById called');
    res.status(501).json({ message: 'Not Implemented' });
};

const updatePatient = (req, res) => {
    console.log('updatePatient called');
    res.status(501).json({ message: 'Not Implemented' });
};

const deletePatient = (req, res) => {
    console.log('deletePatient called');
    res.status(501).json({ message: 'Not Implemented' });
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
};
