import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Prescription, User, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../../App';
import { PillIcon, EyeIcon } from '../../components/shared/Icons';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';

const getStatusPill = (status: Prescription['status']) => {
    const baseClasses = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
        case 'Sent': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'Filled': return `${baseClasses} bg-emerald-100 text-emerald-800`;
        case 'Draft': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'Cancelled': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
};


const PrescriptionSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    drug: Yup.string().required('Drug name is required'),
    dosage: Yup.string().required('Dosage is required'),
    frequency: Yup.string().required('Frequency is required'),
    quantity: Yup.number().positive('Must be positive').required('Quantity is required'),
    refills: Yup.number().min(0, 'Cannot be negative').required('Number of refills is required'),
    notes: Yup.string().max(200, 'Notes cannot exceed 200 characters'),
});

const POPULAR_DRUGS = ['Lisinopril 10mg', 'Amoxicillin 500mg', 'Atorvastatin 20mg', 'Metformin 500mg', 'Albuterol Inhaler'];

const NewPrescriptionModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { user, users, addPrescription } = useAuth();
    const { showToast } = useApp();
    const patients = useMemo(() => users.filter(u => u.role === UserRole.PATIENT), [users]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New e-Prescription" size="lg">
            <Formik
                initialValues={{ patientId: '', drug: '', dosage: '', frequency: '', quantity: 30, refills: 1, notes: '' }}
                validationSchema={PrescriptionSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const patient = patients.find(p => p.id === values.patientId);
                    if (!patient || !user) return;
                    
                    const newPrescription: Omit<Prescription, 'id' | 'status'> = {
                        patientId: patient.id,
                        patientName: patient.name,
                        drug: values.drug,
                        dosage: values.dosage,
                        frequency: values.frequency,
                        quantity: values.quantity,
                        refills: values.refills,
                        notes: values.notes,
                        pharmacy: 'CVS Pharmacy, Anytown (Default)', // Mocked
                        datePrescribed: new Date().toISOString().split('T')[0],
                    };
                    addPrescription(newPrescription);
                    setSubmitting(false);
                    resetForm();
                    onClose();
                    showToast(`Prescription sent via Dosespot (simulated) for ${patient.name}.`, 'success');
                }}
            >
            {({ isSubmitting, errors, touched, setFieldValue }) => (
                <Form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Patient</label>
                        <Field as="select" name="patientId" className={`w-full p-2 border rounded ${errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select a patient</option>
                            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Field>
                         <ErrorMessage name="patientId" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Drug</label>
                        <Field name="drug" placeholder="Search for drug..." className={`w-full p-2 border rounded ${errors.drug && touched.drug ? 'border-red-500' : 'border-gray-300'}`} />
                         <div className="flex flex-wrap gap-2 pt-2">
                            {POPULAR_DRUGS.map(drug => (
                                <button key={drug} type="button" onClick={() => setFieldValue('drug', drug)} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200">
                                    {drug}
                                </button>
                            ))}
                        </div>
                         <ErrorMessage name="drug" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium">Dosage</label>
                            <Field name="dosage" placeholder="e.g., 1 tablet" className={`w-full p-2 border rounded ${errors.dosage && touched.dosage ? 'border-red-500' : 'border-gray-300'}`} />
                             <ErrorMessage name="dosage" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Frequency</label>
                            <Field name="frequency" placeholder="e.g., Once daily" className={`w-full p-2 border rounded ${errors.frequency && touched.frequency ? 'border-red-500' : 'border-gray-300'}`} />
                             <ErrorMessage name="frequency" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium">Quantity</label>
                            <Field name="quantity" type="number" className={`w-full p-2 border rounded ${errors.quantity && touched.quantity ? 'border-red-500' : 'border-gray-300'}`} />
                            <ErrorMessage name="quantity" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Refills</label>
                            <Field name="refills" type="number" className={`w-full p-2 border rounded ${errors.refills && touched.refills ? 'border-red-500' : 'border-gray-300'}`} />
                            <ErrorMessage name="refills" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Notes (optional)</label>
                        <Field as="textarea" rows="2" name="notes" placeholder="e.g., Take with food" className={`w-full p-2 border rounded ${errors.notes && touched.notes ? 'border-red-500' : 'border-gray-300'}`} />
                        <ErrorMessage name="notes" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                        <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg font-bold">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-bold">Send Prescription</button>
                    </div>
                </Form>
            )}
            </Formik>
        </Modal>
    );
}


const PrescriptionDetailsModal: React.FC<{ prescription: Prescription | null; onClose: () => void; }> = ({ prescription, onClose }) => {
    if (!prescription) return null;

    return (
        <Modal isOpen={!!prescription} onClose={onClose} title={`Prescription Details - ${prescription.drug}`} size="md">
            <div className="space-y-3 text-sm">
                <p><strong>Patient:</strong> {prescription.patientName}</p>
                <p><strong>Drug:</strong> {prescription.drug}</p>
                <p><strong>Dosage:</strong> {prescription.dosage}</p>
                <p><strong>Frequency:</strong> {prescription.frequency}</p>
                <p><strong>Quantity:</strong> {prescription.quantity}</p>
                <p><strong>Refills:</strong> {prescription.refills}</p>
                {prescription.notes && <p><strong>Notes:</strong> {prescription.notes}</p>}
                <p><strong>Pharmacy:</strong> {prescription.pharmacy}</p>
                <p><strong>Date Prescribed:</strong> {prescription.datePrescribed}</p>
                <p><strong>Status:</strong> <span className={getStatusPill(prescription.status)}>{prescription.status}</span></p>
            </div>
             <div className="flex justify-end mt-4 pt-4 border-t">
                <button onClick={onClose} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Close</button>
            </div>
        </Modal>
    );
};


const EPrescribing: React.FC = () => {
    const { prescriptions } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

     const { 
        paginatedItems, 
        paginationProps, 
        setGlobalFilter,
        getSortArrow,
        requestSort
    } = useTable<Prescription>(prescriptions, 10, { initialSort: { key: 'datePrescribed', direction: 'desc' } });
    
    return (
        <div>
            <PageHeader title="E-Prescribing" buttonText="Create Prescription" onButtonClick={() => setIsModalOpen(true)} />
            <Card>
                 <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search by patient or drug..."
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full md:max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                </div>
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th onClick={() => requestSort('patientName')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Patient{getSortArrow('patientName')}</th>
                                <th onClick={() => requestSort('drug')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Drug{getSortArrow('drug')}</th>
                                <th onClick={() => requestSort('datePrescribed')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Date{getSortArrow('datePrescribed')}</th>
                                <th onClick={() => requestSort('status')} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status{getSortArrow('status')}</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.map(rx => (
                                <tr key={rx.id}>
                                    <td className="px-4 py-3 whitespace-nowrap font-medium">{rx.patientName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">{rx.drug}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{rx.datePrescribed}</td>
                                    <td className="px-4 py-3 whitespace-nowrap"><span className={getStatusPill(rx.status)}>{rx.status}</span></td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button onClick={() => setSelectedPrescription(rx)} className="p-1 text-gray-500 hover:text-primary-600" aria-label={`View details for prescription ${rx.id}`}>
                                            <EyeIcon className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <PaginationControls {...paginationProps} />
            </Card>
            <NewPrescriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <PrescriptionDetailsModal prescription={selectedPrescription} onClose={() => setSelectedPrescription(null)} />
        </div>
    );
};

export default EPrescribing;