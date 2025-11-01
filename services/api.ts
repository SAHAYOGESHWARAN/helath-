const API_BASE_URL = 'http://localhost:5000/api/v1';
const API_KEY = process.env.API_KEY;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
};

export const fetchPatients = async () => {
  const response = await fetch(`${API_BASE_URL}/patients`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch patients');
  }
  return response.json();
};

export const fetchAppointments = async () => {
  const response = await fetch(`${API_BASE_URL}/appointments`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch appointments');
  }
  return response.json();
};
