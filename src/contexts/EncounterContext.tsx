/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Encounter, User } from '@/types';
import * as api from '@/services/apiService';

interface EncounterContextType {
  encounters: Encounter[];
  patient: User | null;
}

const EncounterContext = createContext<EncounterContextType | undefined>(undefined);

export const EncounterProvider: React.FC<{ patientId: string; children: ReactNode }> = ({ patientId, children }) => {
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [patient, setPatient] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.fetchAllData();
      const foundPatient = data.users.find(p => p.id === patientId);
      setPatient(foundPatient || null);

      const patientEncounters = data.progressNotes.filter(e => e.patientId === patientId);
      setEncounters(patientEncounters);
    };

    fetchData();
  }, [patientId]);

  return (
    <EncounterContext.Provider value={{ encounters, patient }}>
      {children}
    </EncounterContext.Provider>
  );
};

export const useEncounter = () => {
  const context = useContext(EncounterContext);
  if (context === undefined) {
    throw new Error('useEncounter must be used within an EncounterProvider');
  }
  return context;
};
