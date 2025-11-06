import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import useEMRIntegration from './useEMRIntegration';
import { User, Appointment, Prescription, LabResult, VitalsRecord } from '../types';

export const usePatientData = (patientId?: string) => {
  const { user } = useAuth();
  const {
    syncPatientData,
    syncAppointments,
    syncPrescriptions,
    syncLabResults,
    syncVitals,
    state: emrState,
  } = useEMRIntegration();

  const [patientData, setPatientData] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [vitals, setVitals] = useState<VitalsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = patientId || user?.id;

  const fetchData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const [
        patientRes,
        appointmentsRes,
        prescriptionsRes,
        labResultsRes,
        vitalsRes,
      ] = await Promise.all([
        syncPatientData(id),
        syncAppointments(id),
        syncPrescriptions(id),
        syncLabResults(id),
        syncVitals(id),
      ]);

      if (patientRes.success && patientRes.data) {
        setPatientData(patientRes.data);
      } else if (patientRes.error) {
        setError(patientRes.error.message);
      }

      if (appointmentsRes.success && appointmentsRes.data) {
        setAppointments(appointmentsRes.data);
      }

      if (prescriptionsRes.success && prescriptionsRes.data) {
        setPrescriptions(prescriptionsRes.data);
      }

      if (labResultsRes.success && labResultsRes.data) {
        setLabResults(labResultsRes.data);
      }

      if (vitalsRes.success && vitalsRes.data) {
        setVitals(vitalsRes.data);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching patient data.');
    } finally {
      setLoading(false);
    }
  }, [id, syncPatientData, syncAppointments, syncPrescriptions, syncLabResults, syncVitals]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    patientData,
    appointments,
    prescriptions,
    labResults,
    vitals,
    loading,
    error,
    emrState,
    refetch: fetchData,
  };
};