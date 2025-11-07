/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Encounter } from '../types';
import { MOCK_USERS, MOCK_ENCOUNTERS } from '../mockData';

interface PatientContextType {
  patient: User | null;
  encounters: Encounter[];
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export const PatientProvider: React.FC<{ patientId: string; children: ReactNode }> = ({ patientId, children }) => {
  const [patient, setPatient] = useState<User | null>(null);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  useEffect(() => {
    const foundPatient = MOCK_USERS.find(p => p.id === patientId);
    setPatient(foundPatient || null);

    const patientEncounters = MOCK_ENCOUNTERS.filter(e => e.patientId === patientId);
    setEncounters(patientEncounters);
  }, [patientId]);

  return (
    <PatientContext.Provider value={{ patient, encounters }}>
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};