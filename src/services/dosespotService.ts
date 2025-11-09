import axios from 'axios';
import { Prescription } from '@/types';
import 'dotenv/config';

const dosespotApiClient = axios.create({
  baseURL: process.env.DOSESPOT_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.DOSESPOT_API_KEY}`
  }
});

export const getPrescriptions = async (): Promise<Prescription[]> => {
  try {
    // const response = await dosespotApiClient.get('/prescriptions');
    // return response.data;
    console.log('Simulating fetching prescriptions from Dosespot');
    return Promise.resolve([]);
  } catch (error) {
    console.error('Error fetching prescriptions from Dosespot:', error);
    return [];
  }
};

export const addPrescription = async (prescription: Omit<Prescription, 'id' | 'status'>): Promise<Prescription> => {
  try {
    // const response = await dosespotApiClient.post('/prescriptions', prescription);
    // return response.data;
    console.log('Simulating adding prescription through Dosespot:', prescription);
    const newPrescription: Prescription = { ...prescription, id: `rx_${Date.now()}`, status: 'Sent' };
    return Promise.resolve(newPrescription);
  } catch (error) {
    console.error('Error adding prescription through Dosespot:', error);
    throw error;
  }
};
