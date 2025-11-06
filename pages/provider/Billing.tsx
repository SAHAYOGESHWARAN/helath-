import React, { useState, useMemo } from 'react';
import { Card } from '../../components/shared/Card';
import { Claim, ClaimStatus, ClaimType, UserRole } from '../../types';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { TrashIcon, CurrencyDollarIcon } from '../../components/shared/Icons';
import { useApp } from '../../contexts/AppContext.tsx';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { Table, ColumnDefinition } from '../../components/shared/Table';

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

const SuperbillSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    serviceDate: Yup.date().required('Service date is required').max(new Date(), 'Service date cannot be in the future'),
    lineItems: Yup.array().of(
        Yup.object().shape({
            service: Yup.string().required('Description is required'),
            charge: Yup.number().positive('Charge must be positive').required('Charge is required'),
        })
    ).min(1, 'At least one line item is required'),
});

const NewSuperbillModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { users, addClaim, addInvoice } = useAuth();
    const { showToast } = useApp();
    const patients = useMemo(() => users.filter(u => u.role === UserRole.PATIENT), [users]);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Superbill" size="xl">
            <Formik
                initialValues={{ patientId: '', serviceDate: new Date().toISOString().split('T')[0], lineItems: [{ service: '', charge: '' }] }}
                validationSchema={SuperbillSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    const patient = patients.find(p => p.id === values.patientId);
                    if (!patient) return;

                    const totalCharge = values.lineItems.reduce((sum, item) => sum + parseFloat(item.charge || '0'), 0);
                    
                    const newClaim: Omit<Claim, 'id'> = {
                        patientId: values.patientId,
                        provider: 'Dr. John Smith', // Logged in provider
                        serviceDate: values.serviceDate,
                        status: ClaimStatus.DRAFT,
                        claimType: ClaimType.PROFESSIONAL,
                        totalClaimChargeAmount: totalCharge,
                        patientOwes: totalCharge,
                        insurancePaid: 0,
                        lineItems: values.lineItems.map(li => ({ service: li.service, charge: parseFloat(li.charge) })),
                        createdAt: new Date().toISOString().split('T')[0],
                    };
                    addClaim(newClaim);
                    
                    addInvoice({
                        patientId: values.patientId,
                        date: new Date().toISOString().split('T')[0],
                        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        totalAmount: totalCharge,
                        amountDue: totalCharge,
                        status: 'Due',
                        description: `Services on ${values.serviceDate}`,
                    });

                    setSubmitting(false);
                    resetForm();
                    onClose();
                    showToast('Superbill created successfully as a draft.', 'success');
                }}
            >
                {({ values, isSubmitting, errors, touched }) => (
                    <Form>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Field as="select" name="patientId" className="w-full p-2 border rounded">
                                <option value="">Select Patient</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </Field>
                             <Field type="date" name="serviceDate" className="w-full p-2 border rounded" />
                        </div>
                        <ErrorMessage name="patientId" component="div" className="text-red-500 text-xs" />
                        <ErrorMessage name="serviceDate" component="div" className="text-red-500 text-xs" />

                        <h3 className="font-semibold mt-4 mb-2">Line Items</h3>
                        <FieldArray name="lineItems">
                            {({ push, remove }) => (
                                <>
                                    <div className="space-y-2">
                                        {values.lineItems.map((_, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Field name={`lineItems.${index}.service`} placeholder="Service Description (e.g., Office Visit)" className="w-full p-2 border rounded" />
                                                <Field name={`lineItems.${index}.charge`} type="number" placeholder="Charge" className="w-32 p-2 border rounded" />
                                                {values.lineItems.length > 1 && (
                                                    <button type="button" onClick={() => setItemToDelete(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => push({ service: '', charge: '' })} className="text-sm text-primary-600 font-semibold">+ Add Line Item</button>
                                    </div>
                                    <ErrorMessage name="lineItems" component="div" className="text-red-500 text-xs mt-1" />
                                     <Modal
                                        isOpen={itemToDelete !== null}
                                        onClose={() => setItemToDelete(null)}
                                        title="Confirm Test Deletion"
                                        size="sm"
                                        footer={
                                        <>
                                            <button type="button" onClick={() => setItemToDelete(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">
                                            Cancel
                                            </button>
                                            <button
                                            type="button"
                                            onClick={() => {
                                                if (itemToDelete !== null) {
                                                remove(itemToDelete);
                                                setItemToDelete(null);
                                                }
                                            }}
                                            className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                                            >
                                            Delete
                                            </button>
                                        </>
                                        }
                                    >
                                        <p>Are you sure you want to remove this item?</p>
                                    </Modal>
                                </>
                            )}
                        </FieldArray>
                        
                        <div className="flex justify-end space-x-2 mt-6">
                            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg font-bold">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-bold">Save Superbill</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};


const Billing: React.FC = () => {
    const { claims } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const metrics = useMemo(() => ({
        billedThisMonth: claims.reduce((acc, c) => acc + c.totalClaimChargeAmount, 0),
        outstanding: claims.filter(c => [ClaimStatus.SUBMITTED, ClaimStatus.PROCESSING].includes(c.status)).reduce((acc, c) => acc + c.totalClaimChargeAmount, 0)
    }), [claims]);

    const { paginatedItems, paginationProps, requestSort, getSortArrow, setColumnFilters, columnFilters } = useTable(claims, 10, {
        initialSort: { key: 'createdAt', direction: 'desc' },
    });

    const columns: ColumnDefinition<Claim>[] = [
        { accessorKey: 'id', header: 'Claim ID', cellClassName: 'font-mono text-gray-600' },
        { accessorKey: 'patientId', header: 'Patient ID' },
        { accessorKey: 'createdAt', header: 'Date' },
        { accessorKey: 'totalClaimChargeAmount', header: 'Amount', cell: (row) => `$${row.totalClaimChargeAmount.toFixed(2)}`, cellClassName: 'font-semibold' },
        { accessorKey: 'status', header: 'Status', cell: (row) => (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}>{row.status.replace(/_/g, ' ')}</span>
        )},
        { accessorKey: 'actions', header: 'Actions', cell: () => <button className="text-primary-600 hover:underline">View</button> },
    ];

  return (
    <div>
        <PageHeader title="Billing & Coding" buttonText="Create Superbill" onButtonClick={() => setIsModalOpen(true)} />
      
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
                        onClick={() => setColumnFilters(prev => ({...prev, status: status === 'All' ? '' : status}))}
                        className={`py-2 px-3 text-sm font-medium whitespace-nowrap ${ (status === 'All' && !columnFilters.status) || columnFilters.status === status ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}
                    >
                        {status.replace(/_/g, ' ')}
                    </button>
                ))}
              </div>
            </div>
            <Table<Claim>
                columns={columns}
                data={paginatedItems}
                requestSort={requestSort}
                getSortArrow={getSortArrow}
            />
            <PaginationControls {...paginationProps} />
        </Card>
        <NewSuperbillModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Billing;