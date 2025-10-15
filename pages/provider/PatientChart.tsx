import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole } from '../../types';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { ChevronLeftIcon, PencilAltIcon, PillIcon, CalendarIcon } from '../../components/shared/Icons';

const PatientChart: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const { users } = useAuth();
    const [patient, setPatient] = useState<User | null>(null);

    useEffect(() => {
        const foundPatient = users.find(u => u.id === patientId && u.role === UserRole.PATIENT);
        if (foundPatient) {
            setPatient(foundPatient);
        }
    }, [patientId, users]);

    if (!patient) {
        return (
            <div>
                <PageHeader title="Patient Not Found" />
                <p>The patient chart you are looking for does not exist or you do not have permission to view it.</p>
                <Link to="/patients" className="text-primary-600 hover:underline mt-4 inline-block">Return to Patient List</Link>
            </div>
        );
    }
    
    const patientContext = { state: { patientId: patient.id, patientName: patient.name } };

    return (
        <div>
            <PageHeader 
                title={patient.name}
                subtitle={`DOB: ${patient.dob} | Patient ID: ${patient.id}`}
            >
                <div className="flex items-center space-x-2">
                    <Link to="/patients" className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-300 transition-colors flex items-center">
                        <ChevronLeftIcon className="w-5 h-5 mr-2" />
                        <span>Back</span>
                    </Link>
                     <Link to="/progress-notes" {...patientContext} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center">
                        <PencilAltIcon className="w-5 h-5 mr-2" />
                        <span>Add Note</span>
                    </Link>
                    <Link to="/e-prescribing" {...patientContext} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center">
                        <PillIcon className="w-5 h-5 mr-2" />
                        <span>New Rx</span>
                    </Link>
                    <Link to="/appointments" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center">
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        <span>Schedule</span>
                    </Link>
                </div>
            </PageHeader>
            
            <div className="space-y-8">
                <Card title="Medical Conditions">
                    <ul className="space-y-2">
                        {patient.conditions?.length ? patient.conditions.map(c => (
                            <li key={c.id} className="p-2 bg-gray-50 rounded-md">
                                <span>{c.name}</span>
                            </li>
                        )) : <p className="text-gray-500 text-sm">No conditions listed.</p>}
                    </ul>
                </Card>
                <Card title="Allergies">
                    <ul className="space-y-2">
                        {patient.allergies?.length ? patient.allergies.map(a => (
                            <li key={a.id} className="p-3 bg-gray-50 rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{a.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.severity === 'Severe' ? 'bg-red-100 text-red-700' : a.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{a.severity}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Reaction: {a.reaction}</p>
                            </li>
                        )) : <p className="text-gray-500 text-sm">No allergies listed.</p>}
                    </ul>
                </Card>
                <Card title="Surgeries & Procedures">
                    <ul className="space-y-2">
                        {patient.surgeries?.length ? patient.surgeries.map(s => (
                            <li key={s.id} className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                                <span>{s.name}</span>
                                <span className="text-gray-500 text-sm">{s.date}</span>
                            </li>
                        )) : <p className="text-gray-500 text-sm">No surgeries listed.</p>}
                    </ul>
                </Card>
                <Card title="Immunization Records">
                    <ul className="space-y-2">
                        {patient.immunizations?.length ? patient.immunizations.map(i => (
                            <li key={i.id} className="p-2 bg-gray-50 rounded-md flex justify-between items-center">
                                <span>{i.vaccine}</span>
                                <span className="text-gray-500 text-sm">{i.date}</span>
                            </li>
                        )) : <p className="text-gray-500 text-sm">No immunizations listed.</p>}
                    </ul>
                </Card>
                <Card title="Family History">
                    <ul className="space-y-2">
                        {patient.familyHistory?.length ? patient.familyHistory.map(h => (
                            <li key={h.id} className="p-2 bg-gray-50 rounded-md">
                                <span className="font-semibold">{h.relation}:</span>
                                <span className="text-gray-700 ml-2">{h.condition}</span>
                            </li>
                        )) : <p className="text-gray-500 text-sm">No family history listed.</p>}
                    </ul>
                </Card>
                 <Card title="Current Medications">
                    <ul className="space-y-3">
                        {(patient.medications?.filter(m => m.status === 'Active') || []).length > 0 ? patient.medications?.filter(m => m.status === 'Active').map(m => (
                            <li key={m.id} className="p-3 bg-gray-50 rounded-md">
                                <p className="font-semibold">{m.name}</p>
                                <p className="text-sm text-gray-600">{m.dosage}, {m.frequency}</p>
                            </li>
                        )) : <p className="text-gray-500 text-sm">No active medications listed.</p>}
                    </ul>
                </Card>
                <Card title="Lifestyle Information">
                    {patient.lifestyle ? (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                             <div><p className="font-semibold text-gray-500">Diet</p><p className="text-gray-800">{patient.lifestyle.diet || 'Not specified'}</p></div>
                             <div><p className="font-semibold text-gray-500">Exercise</p><p className="text-gray-800">{patient.lifestyle.exercise || 'Not specified'}</p></div>
                             <div><p className="font-semibold text-gray-500">Smoking</p><p className="text-gray-800">{patient.lifestyle.smokingStatus}</p></div>
                             <div><p className="font-semibold text-gray-500">Alcohol</p><p className="text-gray-800">{patient.lifestyle.alcoholConsumption}</p></div>
                        </div>
                    ) : <p className="text-gray-500 text-sm">No lifestyle information provided.</p>}
                </Card>
            </div>
        </div>
    );
};

export default PatientChart;