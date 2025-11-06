
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Medication } from '../../types';
import { PillIcon, CheckCircleIcon, PlusIcon, PencilAltIcon, TrashIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../contexts/AppContext.tsx';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Schema for validation
const MedicationSchema = Yup.object().shape({
  name: Yup.string().required('Medication name is required'),
  dosage: Yup.string().required('Dosage is required'),
  frequency: Yup.string().required('Frequency is required'),
});


// Modal for Add/Edit
const MedicationFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  initialValues: Omit<Medication, 'id' | 'status' | 'adherence'>;
}> = ({ isOpen, onClose, onSave, initialValues }) => (
    <Modal isOpen={isOpen} onClose={onClose} title={initialValues.name ? 'Edit Medication' : 'Add Medication'}>
        <Formik
            initialValues={initialValues}
            validationSchema={MedicationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onSave(values);
                setSubmitting(false);
            }}
        >
        {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Field name="name" placeholder="e.g., Lisinopril" className={`w-full p-2 border bg-white rounded-md mt-1 ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`} />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1"/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dosage</label>
                        <Field name="dosage" placeholder="e.g., 10mg" className={`w-full p-2 border bg-white rounded-md mt-1 ${errors.dosage && touched.dosage ? 'border-red-500' : 'border-gray-300'}`} />
                        <ErrorMessage name="dosage" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Frequency</label>
                        <Field name="frequency" placeholder="e.g., Once daily" className={`w-full p-2 border bg-white rounded-md mt-1 ${errors.frequency && touched.frequency ? 'border-red-500' : 'border-gray-300'}`} />
                         <ErrorMessage name="frequency" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">{initialValues.name ? 'Save Changes' : 'Add Medication'}</button>
                </div>
            </Form>
        )}
        </Formik>
    </Modal>
);

// Updated Card to include actions
const MedicationCard: React.FC<{ 
    med: Medication; 
    onRequestRefill: (name: string) => void;
    onEdit: (med: Medication) => void;
    onDelete: (med: Medication) => void;
}> = ({ med, onRequestRefill, onEdit, onDelete }) => (
    <div className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row justify-between sm:items-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
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
        <div className="flex items-center space-x-3 mt-3 sm:mt-0 self-end sm:self-center">
             {med.status === 'Active' && <button onClick={() => onRequestRefill(med.name)} className="text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-full">Request Refill</button>}
             <button onClick={() => onEdit(med)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full" aria-label={`Edit ${med.name}`}><PencilAltIcon className="w-5 h-5"/></button>
             {med.status === 'Active' && <button onClick={() => onDelete(med)} className="p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full" aria-label={`Delete ${med.name}`}><TrashIcon className="w-5 h-5"/></button>}
            <span className={`px-2 py-1 text-xs font-semibold rounded-full w-20 text-center ${med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'}`}>{med.status}</span>
        </div>
    </div>
);

const Medications: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();

    const [editingMed, setEditingMed] = useState<Medication | null>(null);
    const [deletingMed, setDeletingMed] = useState<Medication | null>(null);
    const [takenMeds, setTakenMeds] = useState<Set<string>>(new Set());
    const [justTaken, setJustTaken] = useState<Set<string>>(new Set());

    const activeMeds = useMemo(() => user?.medications?.filter(m => m.status === 'Active') || [], [user]);
    const inactiveMeds = useMemo(() => user?.medications?.filter(m => m.status === 'Inactive') || [], [user]);

    const handleSaveMedication = async (values: Omit<Medication, 'id'|'status'|'adherence'>) => {
        if (editingMed && editingMed.id) {
            // Update logic
            const updatedMeds = user?.medications?.map(m => m.id === editingMed.id ? { ...m, ...values } : m);
            await updateUser({ medications: updatedMeds });
            showToast('Medication updated!', 'success');
        } else {
            // Add logic
            const newMedication: Medication = { id: `med_${Date.now()}`, ...values, status: 'Active', adherence: 100 };
            const updatedMeds = [...(user?.medications || []), newMedication];
            await updateUser({ medications: updatedMeds });
            showToast('Medication added!', 'success');
        }
        setEditingMed(null);
    };

    const handleDeleteMedication = async () => {
        if (!deletingMed) return;
        // FIX: Added 'as const' to ensure 'Inactive' is treated as a literal type, not a generic string, resolving the type mismatch.
        const updatedMeds = user?.medications?.map(m => m.id === deletingMed.id ? { ...m, status: 'Inactive' as const } : m);
        await updateUser({ medications: updatedMeds });
        showToast(`${deletingMed.name} marked as inactive.`, 'success');
        setDeletingMed(null);
    };

    const handleMarkAsTaken = (medId: string, medName: string) => {
        setTakenMeds(prev => new Set(prev).add(medId));
        setJustTaken(prev => new Set(prev).add(medId));
        showToast(`${medName} logged as taken for today.`, 'success');
    };
    
    const handleRequestRefill = (medName: string) => {
        showToast(`Refill requested for ${medName}. Your provider has been notified.`, 'info');
    };
    
    const initialFormValues = useMemo(() => editingMed ? { name: editingMed.name, dosage: editingMed.dosage, frequency: editingMed.frequency } : { name: '', dosage: '', frequency: '' }, [editingMed]);

    return (
        <div>
            <PageHeader title="My Medications" buttonText="Add Medication" onButtonClick={() => setEditingMed({id: '', name: '', dosage: '', frequency: '', status: 'Active'})} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     <Card>
                        <h2 className="text-xl font-bold mb-4">Active Medications</h2>
                        <div className="space-y-4">
                            {activeMeds.length > 0 ? activeMeds.map(med => <MedicationCard key={med.id} med={med} onEdit={setEditingMed} onDelete={setDeletingMed} onRequestRefill={handleRequestRefill}/>) : <p className="text-gray-500 text-center py-4">You have no active medications.</p>}
                        </div>
                    </Card>
                     <Card>
                        <h2 className="text-xl font-bold mb-4">Inactive/Past Medications</h2>
                        <div className="space-y-4">
                            {inactiveMeds.length > 0 ? inactiveMeds.map(med => <MedicationCard key={med.id} med={med} onEdit={setEditingMed} onDelete={setDeletingMed} onRequestRefill={handleRequestRefill}/>) : <p className="text-gray-500 text-center py-4">You have no past medications.</p>}
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
            
            {editingMed && (
                <MedicationFormModal 
                    isOpen={!!editingMed} 
                    onClose={() => setEditingMed(null)} 
                    onSave={handleSaveMedication}
                    initialValues={initialFormValues}
                />
            )}

            <Modal isOpen={!!deletingMed} onClose={() => setDeletingMed(null)} title="Confirm Action" size="sm" footer={
                <>
                    <button onClick={() => setDeletingMed(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleDeleteMedication} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Mark as Inactive</button>
                </>
            }>
                <p>Are you sure you want to mark <strong>{deletingMed?.name}</strong> as inactive? It will be moved to your past medications.</p>
            </Modal>
        </div>
    );
};

export default Medications;