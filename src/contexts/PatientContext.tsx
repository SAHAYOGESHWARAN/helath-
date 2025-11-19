/* eslint-disable react-refresh/only-export-components */
import React, { ReactNode, useEffect } from 'react';
import { usePatientStore } from '@/stores/patientStore';
import * as api from '@/services/apiService';

export const usePatient = (patientId: string) => {
  const { patient, setPatient } = usePatientStore();

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.fetchAllData();
      const foundPatient = data.users.find(p => p.id === patientId);
      setPatient(foundPatient || null);
    };

    fetchData();
  }, [patientId, setPatient]);

  return { patient };
};

export const PatientProvider: React.FC<{ children: ReactNode; patientId?: string }> = ({ children, patientId }) => {
  return <>{children}</>;
};