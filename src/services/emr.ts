import axios from 'axios';

const EMR_API_URL = process.env.VITE_EMR_API_URL || 'http://localhost:4001/api';

export const getEMRData = async (patientId: string) => {
  try {
    const response = await axios.get(`${EMR_API_URL}/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching EMR data', error);
    throw error;
  }
};
