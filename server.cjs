const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.get('/api/v1/protected', authenticate, (req, res) => {
  res.send('This is a protected route.');
});

// Mock data
const patients = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
];

const appointments = [
  { id: 1, patientId: 1, date: '2024-10-26T10:00:00Z', reason: 'Annual Checkup' },
  { id: 2, patientId: 2, date: '2024-10-27T14:30:00Z', reason: 'Follow-up' },
];

// API routes
app.get('/api/v1/patients', authenticate, (req, res) => {
  res.json(patients);
});

app.get('/api/v1/appointments', authenticate, (req, res) => {
  res.json(appointments);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
