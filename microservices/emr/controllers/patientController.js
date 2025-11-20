const db = require('../db');

const createPatient = async (req, res) => {
    try {
        const { email, password, role, first_name, last_name, phone_number, date_of_birth, gender } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }
        const query = `
            INSERT INTO users (email, password, role, first_name, last_name, phone_number, date_of_birth, gender)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, email, role, first_name, last_name, phone_number, date_of_birth, gender, created_at
        `;
        const values = [email, password, role, first_name, last_name, phone_number, date_of_birth, gender];
        const result = await db.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPatients = async (req, res) => {
    try {
        const query = 'SELECT id, email, role, first_name, last_name, phone_number, date_of_birth, gender, created_at FROM users WHERE role = $1';
        const result = await db.query(query, ['patient']);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT id, email, role, first_name, last_name, phone_number, date_of_birth, gender, address, insurance, health_goals, conditions, allergies, created_at FROM users WHERE id = $1 AND role = $2';
        const result = await db.query(query, [id, 'patient']);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, phone_number, date_of_birth, gender, address, insurance, health_goals, conditions, allergies } = req.body;
        const query = `
            UPDATE users
            SET first_name = $1, last_name = $2, phone_number = $3, date_of_birth = $4, gender = $5, address = $6, insurance = $7, health_goals = $8, conditions = $9, allergies = $10, updated_at = CURRENT_TIMESTAMP
            WHERE id = $11 AND role = $12
            RETURNING id, email, role, first_name, last_name, phone_number, date_of_birth, gender, address, insurance, health_goals, conditions, allergies, updated_at
        `;
        const values = [first_name, last_name, phone_number, date_of_birth, gender, address, insurance, health_goals, conditions, allergies, id, 'patient'];
        const result = await db.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePatient = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM users WHERE id = $1 AND role = $2 RETURNING id';
        const result = await db.query(query, [id, 'patient']);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
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
