import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { Claim, ClaimStatus, ClaimType, User, UserRole } from '../../types';
import { CurrencyDollarIcon, SpinnerIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../../App';

const getStatusColor = (status: ClaimStatus) => {
  switch (status) {
    case ClaimStatus.PAID_IN_FULL: return 'bg-emerald-100 text-emerald-800';
    case ClaimStatus.SUBMITTED:
    case ClaimStatus.PROCESSING:
       return 'bg-blue-100 text-blue-800';
    case ClaimStatus.DENIED:
      return 'bg-red-100 text-red-800';
    case ClaimStatus.DRAFT:
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ClaimSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    serviceDate: Yup.date().required('Service date is required'),
    lineItems: Yup.array().of(
        Yup.object().shape({
            service: Yup.string().required('Service description is required'),
            charge: Yup.number().positive('Charge must be positive').required('Charge is required'),
        })
    ).min(1, 'At least one line item is required'),
});

const SuperbillModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    patients: User[]; 
}> = ({ isOpen, onClose, patients }) => {
    const { user, addClaim } = useAuth();
    const { showToast } = useApp();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Superbill" size="lg">
            <Formik
                initialValues={{ patientId: '', serviceDate: new Date().toISOString().split('T')[0], lineItems: [{ service: '', charge: '' }] }}
                validationSchema={ClaimSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const totalClaimChargeAmount = values.lineItems.reduce((sum, item) => sum + Number(item.charge), 0);
                    const newClaim: Omit<Claim, 'id'> = {
                        patientId: values.patientId,
                        status: ClaimStatus.DRAFT,
                        claimType: ClaimType.PROFESSIONAL,
                        totalClaimChargeAmount,
                        serviceDate: values.serviceDate,
                        provider: user?.name || 'Unknown Provider',
                        patientOwes: totalClaimChargeAmount, // Initially, patient owes full amount
                        insurancePaid: 0,
                        lineItems: values.lineItems.map(item => ({ service: item.service, charge: Number(item.charge) })),
                    };
                    addClaim(newClaim);
                    showToast('Superbill created as a draft.', 'success');
                    setSubmitting(false);
                    resetForm();
                    onClose();
                }}
            >
            {({ values, isSubmitting, errors, touched }) => (
                <Form>
                    <div className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Patient</label>
                                <Field as="select" name="patientId" className={`w-full p-2 border rounded bg-white ${errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="">Select a patient</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </Field>
                                <ErrorMessage name="patientId" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Service Date</label>
                                <Field type="date" name="serviceDate" className={`w-full p-2 border rounded ${errors.serviceDate && touched.serviceDate ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="serviceDate" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                        </div>

                        <FieldArray name="lineItems">
                        {({ push, remove }) => (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Line Items</label>
                                {values.lineItems.map((_, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Field name={`lineItems.${index}.service`} placeholder="Service Description" className="w-full p-2 border rounded"/>
                                        <Field name={`lineItems.${index}.charge`} type="number" placeholder="Charge" className="w-1/3 p-2 border rounded"/>
                                        <button type="button" onClick={() => remove(index)} className="p-2 text-red-500">&times;</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => push({ service: '', charge: '' })} className="text-sm text-primary-600">+ Add Item</button>
                            </div>
                        )}
                        </FieldArray>

                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                                {isSubmitting ? <SpinnerIcon /> : 'Save Draft'}
                            </button>
                        </div>
                    </div>
                </Form>
            )}
            </Formik>
        </Modal>
    );
};

const Billing: React.FC = () => {
    const { user, users, claims } = useAuth();
    const [filter, setFilter] = useState<ClaimStatus | 'All'>('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const providerPatients = useMemo(() => {
        if (!user) return [];
        return users.filter(u => u.role === UserRole.PATIENT && u.state === user.state);
    }, [users, user]);

    const filteredClaims = useMemo(() => {
        if (filter === 'All') return claims;
        return claims.filter(c => c.status === filter);
    }, [claims, filter]);

    const metrics = useMemo(() => ({
        billedThisMonth: claims.reduce((acc, c) => acc + c.totalClaimChargeAmount, 0),
        outstanding: claims.filter(c => [ClaimStatus.SUBMITTED, ClaimStatus.PROCESSING].includes(c.status)).reduce((acc, c) => acc + c.totalClaimChargeAmount, 0)
    }), [claims]);

  return (
    <div>
        <PageHeader title="Billing & Coding" onButtonClick={() => setIsModalOpen(true)}>
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
                <CurrencyDollarIcon className="w-5 h-5"/>
                <span>Create Superbill</span>
            </button>
        </PageHeader>
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <p className="text-gray-500">Billed This Month</p>
                <p className="text-3xl font-bold text-gray-800">${metrics.billedThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </Card>
            <Card>
                <p className="text-gray-500">Outstanding</p>
                <p className="text-3xl font-bold text-gray-800">${metrics.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </Card>
            <Card>
                <p className="text-gray-500">Success Rate</p>
                <p className="text-3xl font-bold text-gray-800">
                    {claims.length > 0 ? 
                        `${((claims.filter(c => c.status === ClaimStatus.PAID_IN_FULL).length / claims.length) * 100).toFixed(1)}%`
                        : 'N/A'
                    }
                </p>
            </Card>
        </div>

        <Card>
             <div className="mb-4">
              <div className="flex space-x-2 border-b overflow-x-auto">
                {(['All', ...Object.values(ClaimStatus)] as const).map(status => (
                    <button 
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`py-2 px-3 text-sm font-medium whitespace-nowrap ${filter === status ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
                    >
                        {status.replace(/_/g, ' ')}
                    </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClaims.length > 0 ? filteredClaims.map(claim => (
                            <tr key={claim.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{claim.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{claim.patientId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{claim.createdAt}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">${claim.totalClaimChargeAmount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(claim.status)}`}>{claim.status.replace(/_/g, ' ')}</span></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><button className="text-primary-600 hover:underline">View</button></td>
                            </tr>
                        )) : (
                            <tr><td colSpan={6} className="text-center py-10 text-gray-500">No claims found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
        <SuperbillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} patients={providerPatients} />
    </div>
  );
};

export default Billing;