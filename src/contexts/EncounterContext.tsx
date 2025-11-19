/* eslint-disable react-refresh/only-export-components */
import React, { ReactNode, useEffect } from 'react';
import { useEncounterStore } from '@/stores/encounterStore';
import * as api from '@/services/apiService';

export const useEncounter = (patientId: string) => {
  const { encounters, setEncounters } = useEncounterStore();

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.fetchAllData();
      const patientEncounters = data.progressNotes.filter(e => e.patientId === patientId);
      setEncounters(patientEncounters);
    };

    fetchData();
  }, [patientId, setEncounters]);

  return { encounters };
};

export const EncounterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};