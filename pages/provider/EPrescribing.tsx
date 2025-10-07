
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { Prescription, Patient } from '../../types';
import { PillIcon, SearchIcon, UsersIcon } from '../../components/shared/Icons';

const mockPrescriptions: Prescription[] = [
    { id: 'rx1', patientId: 'p1', patientName: 'John Doe', drug: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', quantity: 30, refills: 2, pharmacy: 'CVS Pharmacy, Anytown', datePrescribed: '2024-08-14', status: 'Sent' },
    { id: 'rx2', patientId: 'p2', patientName: 'Alice Johnson', drug: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Every 8 hours', quantity: 21, refills: 0, pharmacy: 'Walgreens, Anytown', datePrescribed: '2024-08-15', status: 'Filled' },
    { id: 'rx3', patientId: 'p4', patientName: 'Charlie Brown', drug: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'As needed', quantity: 1, refills: 5, pharmacy: 'Rite Aid, Anytown', datePrescribed: '2024-08-10', status: 'Sent' },
    { id: 'rx4', patientId: 'p1', patientName: 'John Doe', drug: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', quantity: 30, refills: 2, pharmacy: 'CVS Pharmacy, Anytown', datePrescribed: '2024-08-14', status: 'Cancelled' },
];

const mockPatients: Patient[] = [
    { id: 'p1', name: 'John Doe', dob: '1985-05-20', lastSeen: '2024-08-01', status: 'Active' },
    { id: 'p2', name: 'Alice Johnson', dob: '1992-11-12', lastSeen: '2024-07-15', status: 'Active' },
];

const mockDrugs = ['Lisinopril 10mg', 'Amoxicillin 500mg', 'Atorvastatin 20mg', 'Metformin 500mg', 'Albuterol Inhaler'];

const getStatusColor = (status: Prescription['status']) => {
    switch(status) {
        case 'Sent': return 'bg-blue-100 text-blue-800';
        case 'Filled': return 'bg-emerald-100 text-emerald-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'Error': return 'bg-red-100 text-red-800';
        default: return 'bg-yellow-100 text-yellow-800';
    }
};

const CreatePrescriptionModal: React.FC<{onClose: () => void, onSave: (rx: Prescription) => void}> = ({onClose, onSave}) => {
    const [step, setStep] = useState(1);
    const [patientSearch, setPatientSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [drugSearch, setDrugSearch] = useState('');
    const [prescription, setPrescription] = useState<Partial<Prescription>>({});

    const filteredPatients = mockPatients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()));
    const filteredDrugs = mockDrugs.filter(d => d.toLowerCase().includes(drugSearch.toLowerCase()));

    const handleSave = () => {
        const newRx: Prescription = {
            id: `rx_${Date.now()}`,
            patientId: selectedPatient!.id,
            patientName: selectedPatient!.name,
            drug: prescription.drug!,
            dosage: prescription.dosage!,
            frequency: prescription.frequency!,
            quantity: prescription.quantity!,
            refills: prescription.refills!,
            pharmacy: 'CVS Pharmacy, Anytown',
            datePrescribed: new Date().toISOString().split('T')[0],
            status: 'Pending',
        };
        onSave(newRx);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
                <h2 className="text-2xl font-bold mb-4">New Prescription - Step {step} of 3</h2>
                {step === 1 && (
                    <div>
                        <h3 className="font-semibold mb-2">Select Patient</h3>
                        <input type="text" value={patientSearch} onChange={e => setPatientSearch(e.target.value)} placeholder="Search for a patient..." className="w-full p-2 border rounded"/>
                        <div className="mt-2 max-h-48 overflow-y-auto">
                            {filteredPatients.map(p => <div key={p.id} onClick={() => {setSelectedPatient(p); setStep(2);}} className="p-2 hover:bg-gray-100 cursor-pointer">{p.name}</div>)}
                        </div>
                    </div>
                )}
                {step === 2 && selectedPatient && (
                    <div>
                        <h3 className="font-semibold mb-2">Prescription for {selectedPatient.name}</h3>
                         <input type="text" value={drugSearch} onChange={e => setDrugSearch(e.target.value)} placeholder="Search for a drug..." className="w-full p-2 border rounded mb-2"/>
                         <div className="mb-2 max-h-32 overflow-y-auto">{filteredDrugs.map(d => <div key={d} onClick={() => {setPrescription(prev => ({...prev, drug: d})); setDrugSearch(d);}} className="p-2 hover:bg-gray-100 cursor-pointer">{d}</div>)}</div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Dosage (e.g., 1 tablet)" onChange={e => setPrescription(p => ({...p, dosage: e.target.value}))} className="p-2 border rounded"/>
                            <input type="text" placeholder="Frequency (e.g., Once daily)" onChange={e => setPrescription(p => ({...p, frequency: e.target.value}))} className="p-2 border rounded"/>
                            <input type="number" placeholder="Quantity" onChange={e => setPrescription(p => ({...p, quantity: parseInt(e.target.value)}))} className="p-2 border rounded"/>
                            <input type="number" placeholder="Refills" onChange={e => setPrescription(p => ({...p, refills: parseInt(e.target.value)}))} className="p-2 border rounded"/>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h3 className="font-semibold">Review & Send</h3>
                        <p><strong>Patient:</strong> {selectedPatient?.name}</p>
                        <p><strong>Drug:</strong> {prescription.drug}</p>
                        <p><strong>Dosage:</strong> {prescription.dosage}</p>
                        <p><strong>Frequency:</strong> {prescription.frequency}</p>
                        <p><strong>Quantity:</strong> {prescription.quantity}</p>
                        <p><strong>Refills:</strong> {prescription.refills}</p>
                    </div>
                )}
                <div className="flex justify-between mt-6">
                    <button onClick={step > 1 ? () => setStep(s => s - 1) : onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded">{step > 1 ? 'Back' : 'Cancel'}</button>
                    {step < 3 && <button onClick={() => setStep(s => s + 1)} className="bg-primary-600 text-white font-bold py-2 px-4 rounded">Next</button>}
                    {step === 3 && <button onClick={handleSave} className="bg-emerald-500 text-white font-bold py-2 px-4 rounded">Send to Pharmacy</button>}
                </div>
            </div>
        </div>
    )
}

const EPrescribing: React.FC = () => {
    const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSave = (newRx: Prescription) => {
        setPrescriptions(prev => [newRx, ...prev]);
        setIsModalOpen(false);
    }

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">E-Prescribing</h1>
            <button onClick={() => setIsModalOpen(true)} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                <PillIcon className="w-5 h-5"/>
                <span>Create Prescription</span>
            </button>
        </div>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card title="Pending Refill Requests" className="lg:col-span-1">
                <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-gray-600">Lisinopril 10mg</p>
                        <div className="flex justify-end space-x-2 mt-1">
                            <button className="text-xs font-bold text-red-600">Deny</button>
                            <button className="text-xs font-bold text-emerald-600">Approve</button>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="lg:col-span-2">
                <Card title="Recent Prescriptions">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Drug</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {prescriptions.map(rx => (
                                    <tr key={rx.id}>
                                        <td className="px-4 py-3 whitespace-nowrap font-medium">{rx.patientName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{rx.drug}</td>
                                        <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rx.status)}`}>{rx.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
      {isModalOpen && <CreatePrescriptionModal onClose={() => setIsModalOpen(false)} onSave={handleSave}/>}
    </div>
  );
};

export default EPrescribing;
