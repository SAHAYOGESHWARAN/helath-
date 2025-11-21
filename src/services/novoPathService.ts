import axios from 'axios';
import { Prescription } from '@/types';
import 'dotenv/config';

const novoPathApiClient = axios.create({
  baseURL: process.env.NOVO_PATH_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.NOVO_PATH_API_KEY}`
  }
});

export const getPrescriptions = async (): Promise<Prescription[]> => {
  try {
    const response = await novoPathApiClient.get('/prescriptions');
    return response.data;
  } catch (error) {
    console.error('Error fetching prescriptions from Novo Path:', error);
    return [];
  }
};

export const addPrescription = async (prescription: Omit<Prescription, 'id' | 'status'>): Promise<Prescription> => {
  try {
    const response = await novoPathApiClient.post('/prescriptions', prescription);
    return response.data;
  } catch (error) {
    console.error('Error adding prescription through Novo Path:', error);
    throw error;
  }
};

// Additional Novo Path specific methods can be added here as needed
export const getPatientRecords = async (patientId: string) => {
  try {
    const response = await novoPathApiClient.get(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching patient records from Novo Path:', error);
    return null;
  }
};
