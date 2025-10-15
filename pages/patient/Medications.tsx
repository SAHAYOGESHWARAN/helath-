import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Medication } from '../../types';
import { PillIcon, CheckCircleIcon, PlusIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';


const MedicationCard: React.FC<{ med: Medication }> = ({ med }) => (
    <div className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row justify-between sm:items-center">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${med.status === 'Active' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                <PillIcon />
            </div>
            <div>
                <p className="font-bold text-lg text-gray-800">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage}, {med.frequency}</p>
            </div>
        </div>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>{med.status}</span>
        </div>
    </div>
);

const Medications: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();

    const [medications, setMedications] = useState(user?.medications || []);
    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });
    const [takenMeds, setTakenMeds] = useState<Set<string>>(new Set());
    
    const activeMeds = useMemo(() => medications.filter(m => m.status === 'Active'), [medications]);

    const handleAddMedication = async () => {
        if (newMed.name.trim() && newMed.dosage.trim() && newMed.frequency.trim()) {
            const newMedication: Medication = {
                id: `med_${Date.now()}`,
                status: 'Active',
                ...newMed
            };
            const updatedMeds = [...medications, newMedication];
            setMedications(updatedMeds);
            await updateUser({ medications: updatedMeds });
            showToast('Medication added!', 'success');
            setNewMed({ name: '', dosage: '', frequency: '' });
        } else {
            showToast('Please fill out all fields.', 'error');
        }
    };

    const handleMarkAsTaken = (medId: string, medName: string) => {
        setTakenMeds(prev => new Set(prev).add(medId));
        showToast(`${medName} logged as taken for today.`, 'success');
    };

    return (
        <div>
            <PageHeader title="My Medications" subtitle="Keep a log of your current and past medications."/>
            
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
                            {medications.length > 0 ? medications.map(med => <MedicationCard key={med.id} med={med} />) : <p className="text-gray-500 text-center">You haven't added any medications yet.</p>}
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card title="Log Today's Doses">
                        <div className="space-y-4">
                           {activeMeds.length > 0 ? activeMeds.map(med => {
                               const isTaken = takenMeds.has(med.id);
                               return (
                                   <div key={med.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className={`font-semibold ${isTaken ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{med.name}</p>
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
        </div>
    )
}

export default Medications;