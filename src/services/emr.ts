import axios from 'axios';

const EMR_API_URL = process.env.VITE_EMR_API_URL || 'http://localhost:4001/api/emr';

export const getEMRData = async () => {
  try {
    const response = await axios.get(EMR_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching EMR data', error);
    throw error;
  }
};
