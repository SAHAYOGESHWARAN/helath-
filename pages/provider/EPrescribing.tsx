
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Prescription, User, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../../contexts/AppContext';
import { PillIcon } from '../../components/shared/Icons';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { Table, ColumnDefinition } from '../../components/shared/Table';

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

const POPULAR_DRUGS: string[] = ['Lisinopril 10mg', 'Atorvastatin 20mg', 'Metformin 500mg', 'Amoxicillin 500mg', 'Albuterol Inhaler'];

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
                    if (!user) return;
                    const patient = users.find(u => u.id === values.patientId);
                    if (!patient) return;
                    
                    addPrescription({
                        patientId: values.patientId,
                        patientName: patient.name,
                        drug: values.drug,
                        dosage: values.dosage,
                        frequency: values.frequency,
                        quantity: values.quantity,
                        refills: values.refills,
                        pharmacy: 'CVS Pharmacy, Anytown', // Mock
                        datePrescribed: new Date().toISOString().split('T')[0],
                        notes: values.notes,
                    });
                    
                    setSubmitting(false);
                    resetForm();
                    onClose();
                    showToast('e-Prescription has been sent successfully!', 'success');
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
                            <ErrorMessage name="patientId" component="p" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Drug</label>
                             <Field name="drug" placeholder="e.g., Atorvastatin 20mg" className={`w-full p-2 border rounded ${errors.drug && touched.drug ? 'border-red-500' : 'border-gray-300'}`} />
                             <div className="flex flex-wrap gap-2 pt-2">
                                {POPULAR_DRUGS.map(drug => (
                                    <button key={drug} type="button" onClick={() => setFieldValue('drug', drug)} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200">
                                        + {drug}
                                    </button>
                                ))}
                            </div>
                             <ErrorMessage name="drug" component="p" className="text-red-500 text-xs mt-1" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Dosage</label>
                                <Field name="dosage" placeholder="e.g., 1 tablet" className={`w-full p-2 border rounded ${errors.dosage && touched.dosage ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="dosage" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Frequency</label>
                                <Field name="frequency" placeholder="e.g., Once daily" className={`w-full p-2 border rounded ${errors.frequency && touched.frequency ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="frequency" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Quantity</label>
                                <Field name="quantity" type="number" className={`w-full p-2 border rounded ${errors.quantity && touched.quantity ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="quantity" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Refills</label>
                                <Field name="refills" type="number" className={`w-full p-2 border rounded ${errors.refills && touched.refills ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="refills" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>

                         <div>
                            <label className="block text-sm font-medium">Notes for Pharmacist (optional)</label>
                            <Field name="notes" as="textarea" rows="2" className="w-full p-2 border rounded" />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Send Prescription</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

const EPrescribing: React.FC = () => {
    const { prescriptions } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const {
        paginatedItems,
        paginationProps,
        requestSort,
        getSortArrow
    } = useTable(prescriptions, 10, { initialSort: { key: 'datePrescribed', direction: 'desc' } });

    const columns: ColumnDefinition<Prescription>[] = [
        { accessorKey: 'datePrescribed', header: 'Date', cellClassName: 'font-mono text-gray-600' },
        { accessorKey: 'patientName', header: 'Patient', cellClassName: 'font-medium text-gray-900' },
        { accessorKey: 'drug', header: 'Drug' },
        { accessorKey: 'status', header: 'Status', cell: (row) => <span className={getStatusPill(row.status)}>{row.status}</span> },
        { accessorKey: 'actions', header: 'Actions', cell: () => <button className="text-primary-600 hover:underline">View Details</button> },
    ];

    return (
        <div>
            <PageHeader title="E-Prescribing" buttonText="Create Prescription" onButtonClick={() => setIsModalOpen(true)} />
            
            <Card>
                <Table<Prescription>
                    columns={columns}
                    data={paginatedItems}
                    requestSort={requestSort}
                    getSortArrow={getSortArrow}
                />
                <PaginationControls {...paginationProps} />
            </Card>
            <NewPrescriptionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default EPrescribing;