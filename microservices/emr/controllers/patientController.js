const User = require('../models/User');

const createPatient = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { first_name, last_name, phone_number, date_of_birth, gender, address, insurance, health_goals, conditions, allergies } = req.body;

        // Find existing user
        const existingUser = await User.findById(user_id);
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update user with patient details
        const updateData = {
            name: `${first_name} ${last_name}`,
            phone: phone_number,
            dob: date_of_birth,
            gender,
            address,
            insurance,
            healthGoals: health_goals,
            conditions,
            allergies,
        };

        const updatedUser = await User.update(user_id, updateData);
        res.status(201).json(updatedUser);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPatients = async (req, res) => {
    try {
        const patients = await User.findAllByRole('PATIENT');
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await User.findById(id);
        if (!patient || patient.role !== 'PATIENT') {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone_number, date_of_birth, gender, address, insurance, health_goals, conditions, allergies } = req.body;

        const patient = await User.findById(id);
        if (!patient || patient.role !== 'PATIENT') {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const updateData = {
            name: first_name && last_name ? `${first_name} ${last_name}` : patient.name,
            phone: phone_number || patient.phone,
            dob: date_of_birth || patient.dob,
            gender: gender || patient.gender,
            address: address || patient.address,
            insurance: insurance || patient.insurance,
            healthGoals: health_goals || patient.healthGoals,
            conditions: conditions || patient.conditions,
            allergies: allergies || patient.allergies,
        };

        const updatedPatient = await User.update(id, updateData);
        res.json(updatedPatient);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await User.findById(id);
        if (!patient || patient.role !== 'PATIENT') {
            return res.status(404).json({ error: 'Patient not found' });
        }

        await User.delete(id);
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient,
};
