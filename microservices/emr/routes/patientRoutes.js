const express = require('express');
const { createPatient, getAllPatients, getPatients, getPatientById, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/auth'); // We will create this middleware next
const router = express.Router();

router.post('/:user_id', protect(['admin']), createPatient);
router.get('/', protect(['admin', 'provider']), getAllPatients);
router.get('/:id', protect(['admin', 'provider', 'patient']), getPatientById);
router.put('/:id', protect(['admin']), updatePatient);
router.delete('/:id', protect(['admin']), deletePatient);

module.exports = router;