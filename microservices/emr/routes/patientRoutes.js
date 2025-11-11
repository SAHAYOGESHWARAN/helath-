const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/patientController');

router.get('/', getAllPatients);
router.get('/:patientId', getPatientById);
router.post('/', createPatient);
router.put('/:patientId', updatePatient);
router.delete('/:patientId', deletePatient);

router.get('/claims', getAllClaims);
router.get('/invoices', getAllInvoices);
router.get('/prescriptions', getAllPrescriptions);
router.get('/messages', getAllMessages);
router.get('/lab-orders', getAllLabOrders);
router.get('/referrals', getAllReferrals);

module.exports = router;
