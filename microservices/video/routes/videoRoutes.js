const express = require('express');
const { getAllVideoSessions, getVideoSessionById, getVideoSessionsByPatientId, getVideoSessionsByProviderId, getVideoSessionByAppointmentId, createVideoSession, updateVideoSession, deleteVideoSession, createTwilioRoom, generateAccessToken } = require('../controllers/videoController');
const { protect } = require('../middleware/auth'); // We will create this middleware next
const router = express.Router();

router.get('/', protect(['admin', 'provider']), getAllVideoSessions);
router.get('/:id', protect(['admin', 'provider', 'patient']), getVideoSessionById);
router.get('/patient/:patientId', protect(['admin', 'provider', 'patient']), getVideoSessionsByPatientId);
router.get('/provider/:providerId', protect(['admin', 'provider']), getVideoSessionsByProviderId);
router.get('/appointment/:appointmentId', protect(['admin', 'provider', 'patient']), getVideoSessionByAppointmentId);
router.post('/', protect(['admin', 'provider']), createVideoSession);
router.put('/:id', protect(['admin', 'provider']), updateVideoSession);
router.delete('/:id', protect(['admin', 'provider']), deleteVideoSession);
router.post('/twilio/room', protect(['admin', 'provider']), createTwilioRoom);
router.post('/twilio/token', protect(['admin', 'provider', 'patient']), generateAccessToken);

module.exports = router;
