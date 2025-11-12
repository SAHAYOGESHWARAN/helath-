const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createAppointmentsTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_id VARCHAR(255),
      provider_id VARCHAR(255),
      patient_name VARCHAR(255) NOT NULL,
      appointment_date TIMESTAMP NOT NULL,
      reason TEXT
    );
  `;
  try {
    await pool.query(queryText);
    console.log('Appointments table is successfully created or already exists.');
  } catch (err) {
    console.error('Error in creating appointments table', err.stack);
  }
};

const migrateDatabase = async () => {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='appointments'");
    const columns = res.rows.map(row => row.column_name);

    if (!columns.includes('provider_id')) {
      await pool.query('ALTER TABLE appointments ADD COLUMN provider_id VARCHAR(255)');
      console.log('Successfully migrated database: added provider_id');
    }

    if (!columns.includes('patient_id')) {
      await pool.query('ALTER TABLE appointments ADD COLUMN patient_id VARCHAR(255)');
      console.log('Successfully migrated database: added patient_id');
    }
  } catch (err) {
    console.error('Error during database migration', err.stack);
  }
};

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
    createAppointmentsTable();
    migrateDatabase();
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const { checkAuth } = require('./auth');

// API endpoints
app.get('/api/appointments', checkAuth(), async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM appointments');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/:id', checkAuth(), async (req, res) => {
    const { id } = req.params;
    try {
        const { rows } = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/appointments', checkAuth(), async (req, res) => {
  const { patient_id, provider_id, patient_name, appointment_date, reason } = req.body;

  if (!patient_id || !provider_id || !patient_name || !appointment_date) {
    return res.status(400).json({ error: 'patient_id, provider_id, patient_name and appointment_date are required' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO appointments (patient_id, provider_id, patient_name, appointment_date, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [patient_id, provider_id, patient_name, appointment_date, reason]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/appointments/:id', checkAuth(), async (req, res) => {
    const { id } = req.params;
    const { patient_id, provider_id, patient_name, appointment_date, reason } = req.body;

    if (!patient_id || !provider_id || !patient_name || !appointment_date) {
        return res.status(400).json({ error: 'patient_id, provider_id, patient_name and appointment_date are required' });
    }

    try {
        const { rows } = await pool.query(
            'UPDATE appointments SET patient_id = $1, provider_id = $2, patient_name = $3, appointment_date = $4, reason = $5 WHERE id = $6 RETURNING *',
            [patient_id, provider_id, patient_name, appointment_date, reason, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/appointments/:id', checkAuth(), async (req, res) => {
    const { id } = req.params;
    try {
        const { rowCount } = await pool.query('DELETE FROM appointments WHERE id = $1', [id]);
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.SCHEDULING_PORT || 4002;
let server;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => console.log(`Scheduling microservice listening on port ${PORT}`));
}

module.exports = { app, server };
