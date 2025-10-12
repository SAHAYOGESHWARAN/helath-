import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Prescription } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../../App';
import { SpinnerIcon } from '../../components/shared/Icons';

const getStatusPill = (status: Prescription['status']) => {
    switch (status) {
        case 'Sent': case 'Filled': return 'bg-emerald-100 text-emerald-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Error': case 'Cancelled': return 'bg-red-100 text-red-800';
    }
};

const PrescriptionSchema = Yup.object().shape({
  patientName: Yup.string().required('Patient is required'),
  drug: Yup.string().required('Drug name is required'),
  dosage: Yup.string().required('Dosage is required'),
  quantity: Yup.number().positive('Must be positive').required('Quantity is required'),
  refills: Yup.number().min(0, 'Cannot be negative').required('Refills are required'),
  pharmacy: Yup.string().required('Pharmacy is required'),
});

const EPrescribing: React.FC = () => {
    const { prescriptions, addPrescription } = useAuth();
    const { showToast } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <PageHeader title="E-Prescribing" buttonText="New Prescription" onButtonClick={() => setIsModalOpen(true)} />
            <Card>
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {prescriptions.map(rx => (
                                <tr key={rx.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{rx.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{rx.drug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rx.datePrescribed}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(rx.status)}`}>{rx.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Prescription">
                <Formik
                    initialValues={{ patientName: '', drug: '', dosage: '', frequency: '', quantity: 30, refills: 0, pharmacy: '' }}
                    validationSchema={PrescriptionSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        setTimeout(() => {
                            const newRx = { ...values, patientId: 'p_new', datePrescribed: new Date().toISOString().split('T')[0] };
                            addPrescription(newRx);
                            showToast('Prescription sent successfully!', 'success');
                            setSubmitting(false);
                            resetForm();
                            setIsModalOpen(false);
                        }, 1000);
                    }}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            <Field name="patientName" placeholder="Patient Name" className={`w-full p-2 border rounded ${errors.patientName && touched.patientName ? 'border-red-500' : 'border-gray-300'}`} />
                             <Field name="drug" placeholder="Drug (e.g., Lisinopril 10mg)" className={`w-full p-2 border rounded ${errors.drug && touched.drug ? 'border-red-500' : 'border-gray-300'}`} />
                            <div className="grid grid-cols-2 gap-4">
                                <Field name="dosage" placeholder="Dosage (e.g., 1 tablet)" className={`w-full p-2 border rounded ${errors.dosage && touched.dosage ? 'border-red-500' : 'border-gray-300'}`} />
                                <Field name="frequency" placeholder="Frequency (e.g., Once daily)" className="w-full p-2 border rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field type="number" name="quantity" placeholder="Quantity" className={`w-full p-2 border rounded ${errors.quantity && touched.quantity ? 'border-red-500' : 'border-gray-300'}`} />
                                <Field type="number" name="refills" placeholder="Refills" className={`w-full p-2 border rounded ${errors.refills && touched.refills ? 'border-red-500' : 'border-gray-300'}`} />
                            </div>
                            <Field name="pharmacy" placeholder="Pharmacy" className={`w-full p-2 border rounded ${errors.pharmacy && touched.pharmacy ? 'border-red-500' : 'border-gray-300'}`} />

                            <div className="flex justify-end pt-4 border-t">
                                <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-40 flex justify-center items-center">
                                    {isSubmitting ? <SpinnerIcon/> : 'Send to Pharmacy'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default EPrescribing;
