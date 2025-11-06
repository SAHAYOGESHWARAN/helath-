import React from 'react';
import { useParams } from 'react-router-dom';
import { usePatientData } from '../../hooks/usePatientData';
import { PatientProvider } from '../../contexts/PatientContext';
import { EncounterProvider } from '../../contexts/EncounterContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/shared/Card';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/shared/Avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/shared/Tabs';
import { Badge } from '../../components/shared/Badge';
import { Icons } from '../../components/shared/Icons';

const PatientMedicalRecordPage: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const { patient, loading } = usePatientData(patientId);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!patient) {
        return <div>Patient not found</div>;
    }

    return (
        <PatientProvider patientId={patient.id}>
            <div className="container mx-auto p-4">
                <PatientHeader patient={patient} />
                <EncounterDetails />
            </div>
        </PatientProvider>
    );
};

const PatientHeader: React.FC<{ patient: any }> = ({ patient }) => (
    <Card className="mb-4">
        <CardHeader>
            <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                    <AvatarFallback>{patient.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-3xl">{patient.name}</CardTitle>
                    <p className="text-gray-500">{patient.email} | {patient.phone}</p>
                    <div className="flex space-x-2 mt-2">
                        <Badge variant="secondary">DOB: {patient.dob}</Badge>
                        <Badge variant="secondary">Age: {new Date().getFullYear() - new Date(patient.dob).getFullYear()}</Badge>
                    </div>
                </div>
            </div>
        </CardHeader>
    </Card>
);

const EncounterDetails: React.FC = () => {
    const { encounters } = usePatientData(useParams<{ patientId: string }>().patientId);

    return (
        <Tabs defaultValue="encounters">
            <TabsList>
                <TabsTrigger value="encounters">Encounters</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="labs">Labs</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
            </TabsList>
            <TabsContent value="encounters">
                <EncounterList encounters={encounters} />
            </TabsContent>
        </Tabs>
    );
};

const EncounterList: React.FC<{ encounters: any[] }> = ({ encounters }) => (
    <Card>
        <CardHeader>
            <CardTitle>Encounters</CardTitle>
        </CardHeader>
        <CardContent>
            {encounters.map(encounter => (
                <div key={encounter.id} className="border-b py-2">
                    <p className="font-bold">{encounter.type} - {encounter.date}</p>
                    <p>{encounter.chiefComplaint}</p>
                    <p className="text-sm text-gray-500">Status: {encounter.status}</p>
                </div>
            ))}
        </CardContent>
    </Card>
);

export default PatientMedicalRecordPage;