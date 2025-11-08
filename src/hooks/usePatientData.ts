import { useState, useEffect } from 'react';
import { User, Appointment, Claim, Prescription, LabResult, VitalsRecord } from '@/types';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_CLAIMS, MOCK_PRESCRIPTIONS } from '@/mockData';

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
                // Simulate API call
                await new Promise(res => setTimeout(res, 500));

                const patientData = MOCK_USERS.find(p => p.id === patientId);
                setPatient(patientData || null);

                const patientAppointments = MOCK_APPOINTMENTS.filter(a => a.patientId === patientId);
                setAppointments(patientAppointments);

                const patientClaims = MOCK_CLAIMS.filter(c => c.patientId === patientId);
                setClaims(patientClaims);

                const patientPrescriptions = MOCK_PRESCRIPTIONS.filter(p => p.patientId === patientId);
                setPrescriptions(patientPrescriptions);

                // If the user record contains vitals or labResults, surface them here
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