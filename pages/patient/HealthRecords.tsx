import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Medication } from '../../types';
import { PillIcon, CheckCircleIcon, PlusIcon, HeartIcon, ExclamationTriangleIcon, DocumentDuplicateIcon, ChartBarIcon, BeakerIcon, ShieldCheckIcon, UserGroupIcon, ChevronDownIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import Tabs from '../../components/shared/Tabs';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, Legend } from 'recharts';

// --- Start of components adapted from Medications.tsx ---

const MedicationCard: React.FC<{ med: Medication, onRequestRefill: (name: string) => void }> = ({ med, onRequestRefill }) => (
    <div className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row justify-between sm:items-center">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${med.status === 'Active' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                <PillIcon />
            </div>
            <div>
                <p className="font-bold text-lg text-gray-800">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage}, {med.frequency}</p>
                 {med.status === 'Active' && typeof med.adherence === 'number' && (
                    <div className="flex items-center text-xs mt-1">
                        <span className="font-semibold mr-1.5">Adherence:</span>
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${med.adherence}%` }}></div>
                        </div>
                        <span className="ml-1.5 font-medium text-emerald-700">{med.adherence}%</span>
                    </div>
                 )}
            </div>
        </div>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
             {med.status === 'Active' && <button onClick={() => onRequestRefill(med.name)} className="text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-full">Request Refill</button>}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>{med.status}</span>
        </div>
    </div>
);

const MedicationsTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();

    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });
    const [takenMeds, setTakenMeds] = useState<Set<string>>(new Set());
    const [justTaken, setJustTaken] = useState<Set<string>>(new Set());
    
    const activeMeds = useMemo(() => user?.medications?.filter(m => m.status === 'Active') || [], [user]);

    const handleAddMedication = async () => {
        if (newMed.name.trim() && newMed.dosage.trim() && newMed.frequency.trim()) {
            const newMedication: Medication = {
                id: `med_${Date.now()}`,
                status: 'Active',
                adherence: 100, // Start with perfect adherence
                ...newMed
            };
            const updatedMeds = [...(user?.medications || []), newMedication];
            await updateUser(currentUser => ({...currentUser, medications: updatedMeds}));
            showToast('Medication added!', 'success');
            setNewMed({ name: '', dosage: '', frequency: '' });
        } else {
            showToast('Please fill out all fields.', 'error');
        }
    };

    const handleMarkAsTaken = (medId: string, medName: string) => {
        setTakenMeds(prev => new Set(prev).add(medId));
        setJustTaken(prev => new Set(prev).add(medId));
        showToast(`${medName} logged as taken for today.`, 'success');
    };
    
    const handleRequestRefill = (medName: string) => {
        showToast(`Refill requested for ${medName}. Your provider has been notified.`, 'info');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card title="Add New Medication">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                        <input type="text" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} placeholder="Medication Name" className="w-full p-2 border bg-white rounded-md" />
                        <input type="text" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} placeholder="Dosage (e.g., 10mg)" className="w-full p-2 border bg-white rounded-md" />
                        <input type="text" value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})} placeholder="Frequency (e.g., Once daily)" className="w-full p-2 border bg-white rounded-md" />
                    </div>
                    <button onClick={handleAddMedication} className="w-full mt-4 bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center"><PlusIcon className="w-4 h-4 mr-2"/> Add to My List</button>
                </Card>
                 <Card>
                    <h2 className="text-xl font-bold mb-4">My Medication List</h2>
                    <div className="space-y-4">
                        {user?.medications && user.medications.length > 0 ? user.medications.map(med => <MedicationCard key={med.id} med={med} onRequestRefill={handleRequestRefill}/>) : <p className="text-gray-500 text-center">You haven't added any medications yet.</p>}
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-8">
                 <Card title="Log Today's Doses">
                    <div className="space-y-4">
                       {activeMeds.length > 0 ? activeMeds.map(med => {
                           const isTaken = takenMeds.has(med.id);
                           const isJustTaken = justTaken.has(med.id);
                           return (
                               <div 
                                    key={med.id} 
                                    className={`flex justify-between items-center p-3 rounded-lg transition-colors ${isJustTaken ? 'animate-mark-complete' : (isTaken ? 'bg-gray-100' : 'bg-gray-50')}`}
                                    onAnimationEnd={() => {
                                        if (isJustTaken) {
                                            setJustTaken(prev => {
                                                const newSet = new Set(prev);
                                                newSet.delete(med.id);
                                                return newSet;
                                            });
                                        }
                                    }}
                                >
                                    <div>
                                        <p className={`font-semibold transition-colors ${isTaken ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{med.name}</p>
                                        <p className="text-sm text-gray-500">Take {med.frequency.toLowerCase()}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleMarkAsTaken(med.id, med.name)}
                                        disabled={isTaken}
                                        className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <CheckCircleIcon className="w-5 h-5 mr-1.5" />
                                        {isTaken ? 'Taken' : 'Mark as Taken'}
                                    </button>
                               </div>
                           );
                       }) : <p className="text-gray-500 text-center text-sm">No active medications to log.</p>}
                    </div>
                 </Card>
            </div>
        </div>
    );
};
// --- End of components from Medications.tsx ---

const VitalsTab: React.FC = () => {
    const { user } = useAuth();
    const vitalsChartData = (user?.vitals || []).slice(0, 7).reverse().map(v => ({
        date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric'}),
        'Systolic': parseInt(v.bloodPressure.split('/')[0]),
        'Diastolic': parseInt(v.bloodPressure.split('/')[1]),
        'Heart Rate': v.heartRate
    }));
    return (
        <Card title="Vitals Trend - Blood Pressure & Heart Rate">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={vitalsChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'BP (mmHg)', angle: -90, position: 'insideLeft' }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'HR (bpm)', angle: -90, position: 'insideRight' }}/>
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="Systolic" stroke="#8884d8" />
                    <Line yAxisId="left" type="monotone" dataKey="Diastolic" stroke="#3b82f6" />
                    <Line yAxisId="right" type="monotone" dataKey="Heart Rate" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

const LabResultsTab: React.FC = () => {
    const { user } = useAuth();
    const labResults = user?.labResults || [];
    const [openResultId, setOpenResultId] = useState<string | null>(labResults.length > 0 ? labResults[0].id : null);

    const toggleResult = (id: string) => {
        setOpenResultId(prevId => (prevId === id ? null : id));
    };

    return (
        <div className="space-y-4">
            {labResults.length > 0 ? (
                labResults.map(result => {
                    const isOpen = openResultId === result.id;
                    return (
                        <div key={result.id} className="border border-gray-200 rounded-lg bg-white transition-shadow hover:shadow-md overflow-hidden">
                            <button
                                onClick={() => toggleResult(result.id)}
                                className="w-full p-4 flex justify-between items-center cursor-pointer text-left"
                                aria-expanded={isOpen}
                                aria-controls={`lab-details-${result.id}`}
                            >
                                <div className="font-bold text-lg text-gray-800">
                                    {result.testName} - {new Date(result.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                                </div>
                                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                id={`lab-details-${result.id}`}
                                className={`transition-all duration-300 ease-in-out grid ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Component</th>
                                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Value</th>
                                                        <th className="px-4 py-2 text-left font-medium text-gray-500">Reference Range</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {result.components.map(comp => (
                                                        <tr key={comp.name} className={`hover:bg-gray-50 ${comp.isAbnormal ? 'bg-red-50' : 'bg-white'}`}>
                                                            <td className="px-4 py-2 font-medium text-gray-800">{comp.name}</td>
                                                            <td className={`px-4 py-2 font-semibold ${comp.isAbnormal ? 'text-red-600' : 'text-gray-800'}`}>{comp.value}</td>
                                                            <td className="px-4 py-2 text-gray-500">{comp.referenceRange}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <Card>
                    <p className="text-gray-500 text-center">No lab results on file.</p>
                </Card>
            )}
        </div>
    );
};

const ConditionsAndAllergiesTab: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <div className="flex items-center text-primary-600 mb-2"><HeartIcon className="w-5 h-5 mr-2"/> <h3 className="font-bold">Conditions</h3></div>
                <ul className="space-y-1 text-gray-700 list-disc list-inside">
                    {user?.conditions?.length ? user.conditions.map(c => <li key={c.id}>{c.name}</li>) : <li>None reported</li>}
                </ul>
            </Card>
            <Card>
                <div className="flex items-center text-red-600 mb-2"><ExclamationTriangleIcon className="w-5 h-5 mr-2"/> <h3 className="font-bold">Allergies</h3></div>
                <ul className="space-y-1 text-gray-700 list-disc list-inside">
                     {user?.allergies?.length ? user.allergies.map(a => <li key={a.id}>{a.name} ({a.severity})</li>) : <li>No known allergies</li>}
                </ul>
            </Card>
        </div>
    );
};

const HistoryTab: React.FC = () => {
    const { user } = useAuth();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
                <div className="flex items-center text-gray-600 mb-2"><DocumentDuplicateIcon className="w-5 h-5 mr-2"/> <h3 className="font-bold">Surgeries & Procedures</h3></div>
                <ul className="space-y-1 text-gray-700 list-disc list-inside">
                    {user?.surgeries?.length ? user.surgeries.map(s => <li key={s.id}>{s.name} ({s.date})</li>) : <li>None</li>}
                </ul>
            </Card>
            <Card className="lg:col-span-1">
                 <div className="flex items-center text-gray-600 mb-2"><ShieldCheckIcon className="w-5 h-5 mr-2"/> <h3 className="font-bold">Immunizations</h3></div>
                <ul className="space-y-1 text-gray-700 list-disc list-inside">
                    {user?.immunizations?.length ? user.immunizations.map(i => <li key={i.id}>{i.vaccine} ({i.date})</li>) : <li>None</li>}
                </ul>
            </Card>
            <Card className="lg:col-span-1">
                 <div className="flex items-center text-gray-600 mb-2"><UserGroupIcon className="w-5 h-5 mr-2"/> <h3 className="font-bold">Family History</h3></div>
                <ul className="space-y-1 text-gray-700 list-disc list-inside">
                    {user?.familyHistory?.length ? user.familyHistory.map(f => <li key={f.id}><strong>{f.relation}:</strong> {f.condition}</li>) : <li>None reported</li>}
                </ul>
            </Card>
        </div>
    );
};


const HealthRecords: React.FC = () => {
  const tabs = [
    { name: 'Medications', icon: <PillIcon />, content: <MedicationsTab /> },
    { name: 'Vitals', icon: <ChartBarIcon />, content: <VitalsTab /> },
    { name: 'Lab Results', icon: <BeakerIcon />, content: <LabResultsTab /> },
    { name: 'Conditions & Allergies', icon: <HeartIcon />, content: <ConditionsAndAllergiesTab /> },
    { name: 'History', icon: <DocumentDuplicateIcon />, content: <HistoryTab /> },
  ];

  return (
    <div>
      <PageHeader title="Health Records" subtitle="Your complete electronic medical record." />
      <Tabs tabs={tabs} />
    </div>
  );
};

export default HealthRecords;