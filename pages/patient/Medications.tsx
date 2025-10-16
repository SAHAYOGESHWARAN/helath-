import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Medication } from '../../types';
import { PillIcon, CheckCircleIcon, PlusIcon, SparklesIcon, SpinnerIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import Modal from '../../components/shared/Modal';
import { GoogleGenAI } from '@google/genai';

const MedicationInfoModal: React.FC<{ medName: string | null; onClose: () => void; }> = ({ medName, onClose }) => {
    const [info, setInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (medName && process.env.API_KEY) {
            const fetchInfo = async () => {
                setIsLoading(true);
                setError('');
                setInfo('');
                try {
                    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                    const response = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: `Provide a brief, patient-friendly summary for the medication "${medName}". Include what it's commonly used for, common side effects, and one important administration instruction. DO NOT provide dosage advice. Start with "### About ${medName}" and use markdown for formatting.`,
                    });
                    setInfo(response.text);
                } catch (e) {
                    console.error("Failed to fetch medication info", e);
                    setError('Could not retrieve information at this time.');
                }
                setIsLoading(false);
            };
            fetchInfo();
        }
    }, [medName]);

    return (
        <Modal isOpen={!!medName} onClose={onClose} title={`About ${medName}`}>
            {isLoading && <div className="flex justify-center p-8"><SpinnerIcon /></div>}
            {error && <p className="text-red-500">{error}</p>}
            {info && <div className="text-sm space-y-2 prose" dangerouslySetInnerHTML={{ __html: info.replace(/### (.*)/g, '<h3 class="text-lg font-bold">$1</h3>').replace(/\n/g, '<br />') }}></div>}
        </Modal>
    );
};

const MedicationCard: React.FC<{ med: Medication, onLearnMore: (name: string) => void, onRequestRefill: (name: string) => void }> = ({ med, onLearnMore, onRequestRefill }) => (
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
             <button onClick={() => onLearnMore(med.name)} className="text-xs font-semibold text-primary-600 hover:underline">Learn More</button>
             {med.status === 'Active' && <button onClick={() => onRequestRefill(med.name)} className="text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-full">Request Refill</button>}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>{med.status}</span>
        </div>
    </div>
);

const Medications: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();

    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });
    const [takenMeds, setTakenMeds] = useState<Set<string>>(new Set());
    const [medInfoModalName, setMedInfoModalName] = useState<string | null>(null);
    
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
    
    const handleRequestRefill = (medName: string) => {
        showToast(`Refill requested for ${medName}. Your provider has been notified.`, 'info');
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
                            {user?.medications && user.medications.length > 0 ? user.medications.map(med => <MedicationCard key={med.id} med={med} onLearnMore={setMedInfoModalName} onRequestRefill={handleRequestRefill}/>) : <p className="text-gray-500 text-center">You haven't added any medications yet.</p>}
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
            <MedicationInfoModal medName={medInfoModalName} onClose={() => setMedInfoModalName(null)} />
        </div>
    )
}

export default Medications;