const Appointment = require('../models/Appointment');

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments.map(a => a.toJSON()));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment.toJSON());
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get appointments by patient ID
const getAppointmentsByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;
    const appointments = await Appointment.findByPatientId(patientId);
    res.json(appointments.map(a => a.toJSON()));
  } catch (error) {
    console.error('Error fetching appointments by patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get appointments by provider ID
const getAppointmentsByProviderId = async (req, res) => {
  try {
    const { providerId } = req.params;
    const appointments = await Appointment.findByProviderId(providerId);
    res.json(appointments.map(a => a.toJSON()));
  } catch (error) {
    console.error('Error fetching appointments by provider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get appointments by date range
const getAppointmentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    const appointments = await Appointment.findByDateRange(startDate, endDate);
    res.json(appointments.map(a => a.toJSON()));
  } catch (error) {
    console.error('Error fetching appointments by date range:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new appointment
const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    res.status(201).json(appointment.toJSON());
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    await appointment.update(updates);
    res.json(appointment.toJSON());
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    await appointment.delete();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  getAppointmentsByProviderId,
  getAppointmentsByDateRange,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
