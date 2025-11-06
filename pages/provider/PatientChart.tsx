
import React, { useMemo } from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { UserRole } from '../../types';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { PillIcon, HeartIcon, ChatBubbleLeftRightIcon, PencilSquareIcon } from '../../components/shared/Icons';

const PatientChart: React.FC = () => {
    const { patientId } = useParams<{ patientId: string }>();
    const { users, appointments } = useAuth();

    const patient = useMemo(() => 
        users.find(u => u.id === patientId && u.role === UserRole.PATIENT), 
    [users, patientId]);

    const patientAppointments = useMemo(() => 
        appointments.filter(a => a.patientId === patientId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [appointments, patientId]);

    const vitalsData = useMemo(() => {
      if (!patient?.vitals) return [];
      return patient.vitals.slice().reverse().map(v => ({
          date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC'}),
          systolic: parseInt(v.bloodPressure.split('/')[0]),
          diastolic: parseInt(v.bloodPressure.split('/')[1]),
          heartRate: v.heartRate,
          weight: v.weight,
      }));
    }, [patient?.vitals]);

    if (!patient) {
        return (
            <div>
                <PageHeader title="Patient Not Found" />
                <Card>
                    <p>The requested patient could not be found.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up">
            <PageHeader title={patient.name} subtitle={`DOB: ${patient.dob} | Patient ID: ${patient.id}`}>
                <Link to="/provider/messaging" state={{ patientId: patient.id }} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-gray-100 flex items-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Message
                </Link>
                <Link to="/provider/progress-notes" state={{ patientId: patient.id }} className="bg-white border border-gray-300 text-gray-700 font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-gray-100 flex items-center">
                    <PencilSquareIcon className="w-5 h-5 mr-2" />
                    New Note
                </Link>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Patient Info">
                        <div className="space-y-2 text-sm">
                            <p><strong>Email:</strong> {patient.email}</p>
                            <p><strong>Phone:</strong> {patient.phone}</p>
                            <p><strong>Address:</strong> {patient.address}</p>
                        </div>
                    </Card>
                     <Card title="Conditions">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {patient.conditions?.map(c => <li key={c.id}>{c.name} ({c.status})</li>) || <li>No conditions recorded.</li>}
                        </ul>
                    </Card>
                    <Card title="Allergies">
                         <ul className="list-disc list-inside space-y-1 text-sm">
                            {patient.allergies?.map(a => <li key={a.id}><span className="font-semibold">{a.name}</span> ({a.severity})</li>) || <li>No allergies recorded.</li>}
                        </ul>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card title="Vitals Trend">
                         <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={vitalsData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{fontSize: 12}} />
                                <YAxis yAxisId="left" stroke="#ef4444" tick={{fontSize: 12}} label={{ value: 'BP (mmHg)', angle: -90, position: 'insideLeft', offset: 10 }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#10b981" tick={{fontSize: 12}} label={{ value: 'HR (bpm)', angle: -90, position: 'insideRight' }}/>
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" dot={false} />
                                <Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#10b981" name="Heart Rate" dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                     <Card title="Recent Encounters">
                        <ul className="divide-y divide-gray-200">
                             {patientAppointments.slice(0, 3).map(appt => (
                                <li key={appt.id} className="py-3">
                                    <p className="font-semibold">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC' })} - {appt.reason}</p>
                                    <p className="text-sm text-gray-600">{appt.visitSummary || 'No summary available.'}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                    <Card title="Current Medications">
                         <ul className="divide-y divide-gray-200">
                            {(patient.medications?.filter(m => m.status === 'Active').length || 0) > 0 ? patient.medications?.filter(m => m.status === 'Active').map(med => (
                                <li key={med.id} className="py-3 flex items-center">
                                    <PillIcon className="w-5 h-5 mr-3 text-primary-500" />
                                    <div>
                                        <p className="font-semibold">{med.name} - {med.dosage}</p>
                                        <p className="text-sm text-gray-600">{med.frequency}</p>
                                    </div>
                                </li>
                             )) : <li>No active medications.</li>}
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientChart;