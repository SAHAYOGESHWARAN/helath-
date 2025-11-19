import { create } from 'zustand';
import { User } from '@/types';

interface PatientState {
  patient: User | null;
  setPatient: (patient: User | null) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  patient: null,
  setPatient: (patient) => set({ patient }),
}));
