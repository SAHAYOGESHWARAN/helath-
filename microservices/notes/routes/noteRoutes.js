const express = require('express');
const { getAllNotes, getNoteById, getNotesByPatientId, getNotesByProviderId, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/auth'); // We will create this middleware next
const router = express.Router();

router.get('/', protect(['admin', 'provider']), getAllNotes);
router.get('/:id', protect(['admin', 'provider', 'patient']), getNoteById);
router.get('/patient/:patientId', protect(['admin', 'provider', 'patient']), getNotesByPatientId);
router.get('/provider/:providerId', protect(['admin', 'provider']), getNotesByProviderId);
router.post('/', protect(['admin', 'provider']), createNote);
router.put('/:id', protect(['admin', 'provider']), updateNote);
router.delete('/:id', protect(['admin', 'provider']), deleteNote);

module.exports = router;
