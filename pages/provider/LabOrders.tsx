import React, { useState, useMemo } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../hooks/useAuth';
import { User, UserRole, LabOrder } from '../../types';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../../App';
import { TrashIcon, DocumentTextIcon } from '../../components/shared/Icons';

const LabOrderSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    tests: Yup.array().of(Yup.string().required('Test name is required')).min(1, 'At least one test is required'),
});

const POPULAR_LABS = ['Complete Blood Count (CBC)', 'Lipid Panel', 'TSH', 'Comprehensive Metabolic Panel (CMP)', 'Hemoglobin A1c'];

const NewLabOrderModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const { user, users, appointments, addLabOrder } = useAuth();
    const { showToast } = useApp();
    
    const patients = useMemo(() => {
        if (!user || user.role !== UserRole.PROVIDER) return [];

        // Get unique patient IDs from appointments with the current provider
        const providerPatientIds = new Set(
            appointments
                .filter(appt => appt.providerId === user.id)
                .map(appt => appt.patientId)
        );

        // Filter the main user list to get the patient objects
        return users.filter(u => u.role === UserRole.PATIENT && providerPatientIds.has(u.id));
    }, [user, users, appointments]);


    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Lab Order" size="lg">
            <Formik
                initialValues={{ patientId: '', tests: [''] }}
                validationSchema={LabOrderSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const patient = patients.find(p => p.id === values.patientId);
                    if (!patient || !user) return;

                    const newOrder: Omit<LabOrder, 'id'> = {
                        patientId: values.patientId,
                        patientName: patient.name,
                        providerId: user.id,
                        date: new Date().toISOString().split('T')[0],
                        tests: values.tests.filter(t => t.trim() !== ''),
                        status: 'Ordered'
                    };
                    addLabOrder(newOrder);
                    setSubmitting(false);
                    resetForm();
                    onClose();
                    showToast(`Lab order for ${patient.name} created successfully.`, 'success');
                }}
            >
                {({ values, setFieldValue, touched, errors, isSubmitting }) => (
                    <Form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Patient</label>
                            <Field as="select" name="patientId" className={`w-full p-2 border rounded ${errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Select a patient</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </Field>
                            <ErrorMessage name="patientId" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <h3 className="font-semibold mt-4 mb-2">Tests to Order</h3>
                        <FieldArray name="tests">
                            {({ push, remove }) => (
                                <div className="space-y-2">
                                    {values.tests.map((_, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Field name={`tests.${index}`} placeholder="e.g., Lipid Panel" className="w-full p-2 border rounded" />
                                            {values.tests.length > 1 && (
                                              <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {POPULAR_LABS.map(lab => (
                                            <button key={lab} type="button" onClick={() => {
                                                const currentTests = values.tests.filter(t => t.trim() !== '');
                                                setFieldValue('tests', [...currentTests, lab]);
                                            }} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200">
                                                + {lab}
                                            </button>
                                        ))}
                                    </div>
                                     <button type="button" onClick={() => push('')} className="text-sm text-primary-600 font-semibold">+ Add Custom Test</button>
                                    <ErrorMessage name="tests">
                                        {msg => <div className="text-red-500 text-xs mt-1">{msg}</div>}
                                    </ErrorMessage>
                                </div>
                            )}
                        </FieldArray>
                        
                        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg font-bold">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-bold">Place Order</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

const getStatusPill = (status: LabOrder['status']) => {
    switch(status) {
        case 'Ordered': return 'bg-blue-100 text-blue-800';
        case 'Results Ready': return 'bg-emerald-100 text-emerald-800';
        case 'Reviewed': return 'bg-gray-100 text-gray-800';
    }
}

const LabOrders: React.FC = () => {
    const { labOrders } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div>
            <PageHeader title="Lab Orders" buttonText="New Lab Order" onButtonClick={() => setIsModalOpen(true)} />
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests Ordered</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {labOrders.length > 0 ? (
                                labOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.patientName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{order.tests.join(', ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(order.status)}`}>{order.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-primary-600 hover:underline">View Results</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                                        <p className="font-semibold">No Lab Orders</p>
                                        <p>
                                            <button onClick={() => setIsModalOpen(true)} className="text-primary-600 font-semibold hover:underline">
                                                Create a new lab order
                                            </button> to get started.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <NewLabOrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default LabOrders;