import React, { useState, useMemo, useCallback } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { Referral, ReferralStatus, User, UserRole } from '../../types';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../../App';
import { PaperClipIcon, TrashIcon, FaxIcon, SpinnerIcon } from '../../components/shared/Icons';

const getReferralStatusPill = (status: ReferralStatus) => {
    const base = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
        case 'Pending': return `${base} bg-yellow-100 text-yellow-800`;
        case 'Sent': return `${base} bg-blue-100 text-blue-800`;
        case 'Completed': return `${base} bg-emerald-100 text-emerald-800`;
        case 'Cancelled': return `${base} bg-red-100 text-red-800`;
        default: return `${base} bg-gray-100 text-gray-800`;
    }
};

const getUrgencyPill = (urgency: Referral['urgency']) => {
     const base = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch(urgency) {
        case 'STAT': return `${base} bg-red-100 text-red-800`;
        case 'Urgent': return `${base} bg-amber-100 text-amber-800`;
        case 'Routine': return `${base} bg-gray-100 text-gray-800`;
        default: return '';
    }
}

const ReferralSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    referredTo: Yup.string().required('Specialist/Practice is required'),
    faxNumber: Yup.string().matches(/^(\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid fax number').required('Fax number is required'),
    reason: Yup.string().required('Reason for referral is required'),
    urgency: Yup.string().oneOf(['Routine', 'Urgent', 'STAT']).required('Urgency is required'),
});

const NewReferralModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const { user: provider, users, addReferral } = useAuth();
    const { showToast } = useApp();
    const patients = useMemo(() => users.filter(u => u.role === UserRole.PATIENT), [users]);
    const mockAttachments = ['Lab Results - 2024-08-01.pdf', 'Progress Note - 2024-08-15.pdf'];
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Outgoing Referral" size="lg">
            <Formik
                initialValues={{
                    patientId: '',
                    referredTo: '',
                    faxNumber: '',
                    reason: '',
                    notes: '',
                    urgency: 'Routine' as Referral['urgency'],
                    attachments: [] as string[],
                }}
                validationSchema={ReferralSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const patient = patients.find(p => p.id === values.patientId);
                    if (!provider || !patient) return;
                    addReferral({
                        patientId: values.patientId,
                        patientName: patient.name,
                        referredTo: values.referredTo,
                        referredFrom: provider.name,
                        reason: values.reason,
                        notes: values.notes,
                        urgency: values.urgency,
                        attachments: values.attachments,
                    });
                    setSubmitting(false);
                    resetForm();
                    onClose();
                    showToast('Referral sent successfully via Phaxio.', 'success');
                }}
            >
                {({ values, isSubmitting, errors, touched }) => (
                    <Form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium">Patient</label>
                                <Field as="select" name="patientId" className={`w-full p-2 border rounded ${errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="">Select a patient</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </Field>
                                <ErrorMessage name="patientId" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Urgency</label>
                                <Field as="select" name="urgency" className="w-full p-2 border rounded">
                                    <option value="Routine">Routine</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="STAT">STAT</option>
                                </Field>
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Referred To (Specialist/Practice)</label>
                                <Field name="referredTo" className={`w-full p-2 border rounded ${errors.referredTo && touched.referredTo ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="referredTo" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Fax Number</label>
                                <Field name="faxNumber" placeholder="e.g., 555-555-5555" className={`w-full p-2 border rounded ${errors.faxNumber && touched.faxNumber ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="faxNumber" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Reason for Referral</label>
                            <Field name="reason" as="textarea" rows="3" className={`w-full p-2 border rounded ${errors.reason && touched.reason ? 'border-red-500' : 'border-gray-300'}`} />
                             <ErrorMessage name="reason" component="p" className="text-red-500 text-xs mt-1" />
                        </div>
                        
                         <div>
                            <label className="block text-sm font-medium">Clinical Notes (optional)</label>
                            <Field name="notes" as="textarea" rows="4" className="w-full p-2 border rounded" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Attach Documents (optional)</label>
                            <div className="mt-1 space-y-2">
                                <FieldArray name="attachments">
                                    {() => (
                                        mockAttachments.map(file => (
                                            <label key={file} className="flex items-center p-2 border rounded-md bg-gray-50">
                                                <Field type="checkbox" name="attachments" value={file} className="h-4 w-4 text-primary-600 border-gray-300 rounded"/>
                                                <PaperClipIcon className="w-4 h-4 ml-3 mr-2 text-gray-500"/>
                                                <span className="text-sm text-gray-700">{file}</span>
                                            </label>
                                        ))
                                    )}
                                </FieldArray>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center w-40">
                                {isSubmitting ? <SpinnerIcon /> : <><FaxIcon className="w-5 h-5 mr-2" /> Send via Fax</>}
                            </button>
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-2">Securely sent via Phaxio API</p>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

const ReferralDetailsModal: React.FC<{ referral: Referral | null, onClose: () => void }> = ({ referral, onClose }) => {
    const { updateReferral } = useAuth();
    const { showToast } = useApp();
    if (!referral) return null;

    const handleUpdateStatus = (status: ReferralStatus, actionText: string) => {
        updateReferral(referral.id, { status }, actionText);
        showToast(`Referral status updated to ${status}`, 'success');
        onClose();
    };

    const isOutgoingPending = referral.type === 'Outgoing' && referral.status === ReferralStatus.PENDING;
    const isIncomingPending = referral.type === 'Incoming' && referral.status === ReferralStatus.PENDING;

    return (
        <Modal isOpen={!!referral} onClose={onClose} title={`Referral Details - ${referral.patientName}`} size="lg">
            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm p-4 bg-gray-50 rounded-lg border">
                    <div><p className="font-medium text-gray-500">Patient</p><p className="font-semibold">{referral.patientName}</p></div>
                    <div><p className="font-medium text-gray-500">Referred To</p><p className="font-semibold">{referral.referredTo}</p></div>
                    <div><p className="font-medium text-gray-500">Referred From</p><p className="font-semibold">{referral.referredFrom}</p></div>
                    <div><p className="font-medium text-gray-500">Date</p><p className="font-semibold">{new Date(referral.createdAt).toLocaleDateString()}</p></div>
                </div>

                 <div><p className="font-medium text-gray-500">Reason</p><p>{referral.reason}</p></div>
                 {referral.notes && <div><p className="font-medium text-gray-500">Notes</p><p className="p-2 bg-gray-100 rounded-md whitespace-pre-wrap">{referral.notes}</p></div>}
                 {referral.attachments && referral.attachments.length > 0 && <div>
                    <p className="font-medium text-gray-500">Attachments</p>
                    <ul className="list-disc list-inside">
                        {referral.attachments.map(file => <li key={file} className="text-blue-600 underline cursor-pointer">{file}</li>)}
                    </ul>
                </div>}

                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Audit Log</h4>
                    <ul className="space-y-3 border-l-2 pl-6 relative">
                        {referral.auditLog.map(log => (
                            <li key={log.date} className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-gray-300 rounded-full border-4 border-white"></div>
                                <p className="font-medium text-gray-800">{log.action}</p>
                                <p className="text-xs text-gray-500">{new Date(log.date).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                 {isOutgoingPending && <>
                    <button onClick={() => handleUpdateStatus(ReferralStatus.CANCELLED, 'Referral Cancelled by Provider')} className="bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg">Cancel Referral</button>
                    <button onClick={() => handleUpdateStatus(ReferralStatus.SENT, 'Referral Sent via Fax')} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Mark as Sent</button>
                 </>}
                  {isIncomingPending && <>
                    <button onClick={() => handleUpdateStatus(ReferralStatus.CANCELLED, 'Referral Declined')} className="bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg">Decline</button>
                    <button onClick={() => handleUpdateStatus(ReferralStatus.COMPLETED, 'Referral Accepted')} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg">Accept & Schedule</button>
                 </>}
            </div>
        </Modal>
    );
};

const Referrals: React.FC = () => {
    const { referrals } = useAuth();
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
    const [typeFilter, setTypeFilter] = useState<'All' | 'Incoming' | 'Outgoing'>('All');

    const filteredReferrals = useMemo(() => {
        if (typeFilter === 'All') return referrals;
        return referrals.filter(r => r.type === typeFilter);
    }, [referrals, typeFilter]);

    const { paginatedItems, paginationProps, requestSort, getSortArrow } = useTable(filteredReferrals, 10, {
        initialSort: { key: 'createdAt', direction: 'desc' }
    });

    return (
        <div>
            <PageHeader title="Referral Management" buttonText="New Outgoing Referral" onButtonClick={() => setIsNewModalOpen(true)} />
            <Card>
                <div className="flex space-x-2 border-b mb-4">
                    <button onClick={() => setTypeFilter('All')} className={`py-2 px-4 font-medium ${typeFilter === 'All' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>All</button>
                    <button onClick={() => setTypeFilter('Incoming')} className={`py-2 px-4 font-medium ${typeFilter === 'Incoming' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>Incoming</button>
                    <button onClick={() => setTypeFilter('Outgoing')} className={`py-2 px-4 font-medium ${typeFilter === 'Outgoing' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>Outgoing</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th onClick={() => requestSort('patientName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Patient {getSortArrow('patientName')}</th>
                                <th onClick={() => requestSort('type')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Type {getSortArrow('type')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred To/From</th>
                                <th onClick={() => requestSort('createdAt')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Date {getSortArrow('createdAt')}</th>
                                <th onClick={() => requestSort('urgency')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Urgency {getSortArrow('urgency')}</th>
                                <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status {getSortArrow('status')}</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.map(referral => (
                                <tr key={referral.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedReferral(referral)}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{referral.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{referral.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{referral.type === 'Incoming' ? referral.referredFrom : referral.referredTo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(referral.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={getUrgencyPill(referral.urgency)}>{referral.urgency}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={getReferralStatusPill(referral.status)}>{referral.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedReferral(referral); }} className="text-primary-600 hover:text-primary-900">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <PaginationControls {...paginationProps} />
            </Card>
            <NewReferralModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} />
            <ReferralDetailsModal referral={selectedReferral} onClose={() => setSelectedReferral(null)} />
        </div>
    );
};

export default Referrals;