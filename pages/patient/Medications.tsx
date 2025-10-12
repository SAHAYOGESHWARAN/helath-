
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Medication } from '../../types';
import { PillIcon, CheckCircleIcon } from '../../components/shared/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';

const mockMedications: Medication[] = [
  { id: 'med1', name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', prescribedBy: 'Dr. Smith', startDate: '2023-01-15', status: 'Active' },
  { id: 'med2', name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', prescribedBy: 'Dr. Smith', startDate: '2023-01-15', status: 'Active' },
  { id: 'med3', name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Every 8 hours for 7 days', prescribedBy: 'Dr. Chen', startDate: '2024-07-20', status: 'Inactive' },
];

const adherenceData = [
    { day: 'Mon', taken: 80 }, { day: 'Tue', taken: 100 }, { day: 'Wed', taken: 100 },
    { day: 'Thu', taken: 60 }, { day: 'Fri', taken: 100 }, { day: 'Sat', taken: 100 }, { day: 'Sun', taken: 100 }
];

const MedicationCard: React.FC<{ med: Medication, onRequestRefill: (med: Medication) => void }> = ({ med, onRequestRefill }) => (
    <div className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row justify-between sm:items-center">
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${med.status === 'Active' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                <PillIcon />
            </div>
            <div>
                <p className="font-bold text-lg text-gray-800">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage}, {med.frequency}</p>
                <p className="text-xs text-gray-500 mt-1">Prescribed by: {med.prescribedBy}</p>
            </div>
        </div>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>{med.status}</span>
            {med.status === 'Active' && <button onClick={() => onRequestRefill(med)} className="text-primary-600 hover:underline text-sm font-medium">Request Refill</button>}
        </div>
    </div>
);

const Medications: React.FC = () => {
    const [filter, setFilter] = useState<'Active' | 'Inactive'>('Active');
    const [refillModal, setRefillModal] = useState<{ isOpen: boolean; med: Medication | null }>({isOpen: false, med: null});
    const [takenMeds, setTakenMeds] = useState<Set<string>>(new Set());
    const { showToast } = useApp();

    const filteredMeds = useMemo(() => mockMedications.filter(m => m.status === filter), [filter]);

    const handleRefillRequest = () => {
        showToast(`Refill requested for ${refillModal.med?.name}!`, 'success');
        setRefillModal({ isOpen: false, med: null });
    };

    const handleMarkAsTaken = (medId: string, medName: string) => {
        setTakenMeds(prev => new Set(prev).add(medId));
        showToast(`${medName} logged as taken.`, 'success');
    };

    return (
        <div>
            <PageHeader title="My Medications" subtitle="Manage your prescriptions and track adherence."/>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <div className="flex space-x-1 border-b border-gray-200 mb-4">
                            <button onClick={() => setFilter('Active')} className={`py-2 px-4 text-sm font-medium ${filter === 'Active' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>Active</button>
                            <button onClick={() => setFilter('Inactive')} className={`py-2 px-4 text-sm font-medium ${filter === 'Inactive' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>Inactive</button>
                        </div>
                        <div className="space-y-4">
                            {filteredMeds.map(med => <MedicationCard key={med.id} med={med} onRequestRefill={(m) => setRefillModal({ isOpen: true, med: m })} />)}
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card title="Weekly Adherence">
                         <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={adherenceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <XAxis dataKey="day" tick={{fontSize: 12}}/>
                                <YAxis tickFormatter={(v) => `${v}%`} />
                                <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}/>
                                <Bar dataKey="taken" name="Adherence">
                                    {adherenceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.taken < 80 ? '#ef4444' : '#10b981'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </Card>
                     <Card title="Log Today's Doses">
                        <div className="space-y-4">
                           {mockMedications.filter(m => m.status === 'Active').map(med => {
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
                           })}
                        </div>
                     </Card>
                </div>
            </div>
            <Modal
                isOpen={refillModal.isOpen}
                onClose={() => setRefillModal({isOpen: false, med: null})}
                title={`Request Refill for ${refillModal.med?.name}`}
                footer={
                    <>
                        <button onClick={() => setRefillModal({isOpen: false, med: null})} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={handleRefillRequest} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Confirm Request</button>
                    </>
                }
            >
                <p>You are requesting a refill for <strong className="text-gray-800">{refillModal.med?.name}</strong>. Your provider will be notified. Please confirm.</p>
            </Modal>
        </div>
    )
}

export default Medications;
