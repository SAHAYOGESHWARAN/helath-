const express = require('express');
const router = express.Router();
const {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient
} = require('../controllers/patientController');

router.get('/', getAllPatients);
router.get('/:patientId', getPatientById);
router.post('/', createPatient);
router.put('/:patientId', updatePatient);
router.delete('/:patientId', deletePatient);

module.exports = router;
