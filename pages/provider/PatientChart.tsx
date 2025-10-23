import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole, ProgressNote } from '../../types';
import PageHeader from '../../components/shared/PageHeader';
import {
    ChevronLeftIcon,
    PencilAltIcon,
    PillIcon,
    CalendarIcon,
    DocumentTextIcon,
    BeakerIcon,
    FolderIcon,
    UserCircleIcon,
    ExclamationTriangleIcon,
    HeartIcon
} from '../../components/shared/Icons';

type Tab = 'overview' | 'notes' | 'medications' | 'labs' | 'documents';

const PatientChart: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const { users, progressNotes } = useAuth();
    const [patient, setPatient] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    useEffect(() => {
        const foundPatient = users.find(u => u.id === patientId && u.role === UserRole.PATIENT);
        setPatient(foundPatient || null);
    }, [patientId, users]);

    const patientNotes = useMemo(() => {
        return progressNotes.filter(note => note.patientId === patientId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [progressNotes, patientId]);

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
                subtitle={`DOB: ${patient.dob} | Age: ${new Date().getFullYear() - new Date(patient.dob).getFullYear()}`}
            >
                <div className="flex items-center space-x-2">
                    <Link to="/patients" className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-sm border border-gray-300 transition-colors flex items-center">
                        <ChevronLeftIcon className="w-5 h-5 mr-1" />
                        <span>All Patients</span>
                    </Link>
                     <Link to="/progress-notes" {...patientContext} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center">
                        <PencilAltIcon className="w-5 h-5 mr-2" />
                        <span>New Note</span>
                    </Link>
                </div>
            </PageHeader>
            
            <div className="flex space-x-4 border-b border-gray-200 mb-6">
                {(['overview', 'notes', 'medications', 'labs', 'documents'] as Tab[]).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`capitalize py-3 px-4 text-sm font-bold transition-colors ${activeTab === tab ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-800'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in">
                {activeTab === 'overview' && <OverviewTab patient={patient} />}
                {activeTab === 'notes' && <NotesTab notes={patientNotes} />}
                {activeTab === 'medications' && <MedicationsTab patient={patient} />}
            </div>
        </div>
    );
};

const TabCard: React.FC<{title: string, icon: React.ReactNode, children: React.ReactNode}> = ({title, icon, children}) => (
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center mb-3">
            <div className="text-primary-600 mr-2">{icon}</div>
            <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        </div>
        {children}
    </div>
);

const OverviewTab: React.FC<{patient: User}> = ({patient}) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
             <TabCard title="Active Conditions" icon={<HeartIcon className="w-5 h-5"/>}>
                 <ul className="space-y-1 text-gray-700 list-disc list-inside">
                    {patient.conditions?.length ? patient.conditions.map(c => <li key={c.id}>{c.name}</li>) : <p className="text-sm text-gray-500">None</p>}
                 </ul>
            </TabCard>
             <TabCard title="Current Medications" icon={<PillIcon className="w-5 h-5"/>}>
                 <ul className="space-y-2 text-gray-700">
                    {(patient.medications?.filter(m => m.status === 'Active') || []).map(m => (
                        <li key={m.id}><strong>{m.name}</strong> - {m.dosage}, {m.frequency}</li>
                    ))}
                 </ul>
            </TabCard>
        </div>
         <div className="space-y-6">
            <TabCard title="Allergies" icon={<ExclamationTriangleIcon className="w-5 h-5"/>}>
                <ul className="space-y-1 text-gray-700">
                    {patient.allergies?.length ? patient.allergies.map(a => (
                        <li key={a.id}><strong>{a.name}</strong> ({a.severity}) - {a.reaction}</li>
                    )) : <p className="text-sm text-gray-500">No known allergies</p>}
                </ul>
            </TabCard>
             <TabCard title="Patient Information" icon={<UserCircleIcon className="w-5 h-5"/>}>
                <div className="text-sm">
                    <p><strong>Contact:</strong> {patient.email}</p>
                    <p><strong>State:</strong> {patient.state}</p>
                </div>
            </TabCard>
        </div>
    </div>
);

const NotesTab: React.FC<{notes: ProgressNote[]}> = ({notes}) => (
     <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Chart Notes</h3>
        <div className="space-y-4">
            {notes.map(note => (
                <details key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <summary className="font-semibold cursor-pointer text-gray-900">
                        {note.date} - {note.title} <span className="text-gray-500 font-medium text-sm">(Status: {note.status})</span>
                    </summary>
                    <div className="mt-3 pt-3 border-t border-gray-300 text-gray-700 whitespace-pre-wrap">
                        <p><strong>Subjective:</strong> {note.subjective}</p>
                        <p><strong>Objective:</strong> {note.objective}</p>
                        <p><strong>Assessment:</strong> {note.assessment}</p>
                        <p><strong>Plan:</strong> {note.plan}</p>
                    </div>
                </details>
            ))}
        </div>
    </div>
);

const MedicationsTab: React.FC<{patient: User}> = ({patient}) => (
     <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-800">Medication Management</h3>
             <Link to="/e-prescribing" state={{ patientId: patient.id, patientName: patient.name }} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-3 rounded-lg text-sm flex items-center">
                <PillIcon className="w-4 h-4 mr-2" /> New Prescription
            </Link>
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="border-b bg-gray-50 text-sm text-gray-600">
                    <th className="p-3">Medication</th><th>Dosage</th><th>Frequency</th><th>Status</th>
                </tr>
            </thead>
            <tbody>
                {patient.medications?.map(m => (
                    <tr key={m.id} className="border-b">
                        <td className="p-3 font-semibold">{m.name}</td>
                        <td>{m.dosage}</td><td>{m.frequency}</td>
                        <td><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'}`}>{m.status}</span></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


export default PatientChart;