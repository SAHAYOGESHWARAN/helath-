const Note = require('../models/Note');

// Get all notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes.map(n => n.toJSON()));
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note.toJSON());
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get notes by patient ID
const getNotesByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const notes = await Note.findByPatientId(patientId);
    res.json(notes.map(n => n.toJSON()));
  } catch (error) {
    console.error('Error fetching notes by patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get notes by provider ID
const getNotesByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;
    const notes = await Note.findByProviderId(providerId);
    res.json(notes.map(n => n.toJSON()));
  } catch (error) {
    console.error('Error fetching notes by provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new note
const createNote = async (req, res) => {
  try {
    const noteData = req.body;
    const note = new Note(noteData);
    await note.save();
    res.status(201).json(note.toJSON());
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    await note.update(updates);
    res.json(note.toJSON());
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    await note.delete();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  getNotesByPatientId,
  getNotesByProviderId,
  createNote,
  updateNote,
  deleteNote
};
