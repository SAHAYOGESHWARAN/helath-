import { useState, useEffect } from 'react';
import { User, Appointment, Claim, Prescription, LabResult, VitalsRecord } from '@/types';
import * as api from '@/services/apiService';

export const usePatientData = (patientId: string | undefined) => {
    const [patient, setPatient] = useState<User | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [labResults, setLabResults] = useState<LabResult[]>([]);
    const [vitals, setVitals] = useState<VitalsRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!patientId) {
            setLoading(false);
            return;
        }

        const fetchPatientData = async () => {
            setLoading(true);
            try {
                const data = await api.fetchAllData();
                const patientData = data.users.find(p => p.id === patientId);
                setPatient(patientData || null);

                const patientAppointments = data.appointments.filter(a => a.patientId === patientId);
                setAppointments(patientAppointments);

                const patientClaims = data.claims.filter(c => c.patientId === patientId);
                setClaims(patientClaims);

                const patientPrescriptions = data.prescriptions.filter(p => p.patientId === patientId);
                setPrescriptions(patientPrescriptions);

                const patientVitals = patientData?.vitals || [];
                const patientLabResults = patientData?.labResults || [];
                setVitals(patientVitals as VitalsRecord[]);
                setLabResults(patientLabResults as LabResult[]);

            } catch (error) {
                console.error("Failed to fetch patient data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [patientId]);

    return { patient, appointments, claims, prescriptions, labResults, vitals, loading };
};
