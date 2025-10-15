import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { BillingInvoice, UserRole } from '../../types';
import { DownloadIcon, SpinnerIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useApp } from '../../App';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';

const getStatusColor = (status: BillingInvoice['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-800';
        case 'Due': return 'bg-yellow-100 text-yellow-800';
        case 'Overdue': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const InvoiceSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    description: Yup.string().required('Description is required'),
    totalAmount: Yup.number().positive('Amount must be positive').required('Total amount is required'),
    dueDate: Yup.date().min(new Date(new Date().setDate(new Date().getDate() - 1)), 'Due date cannot be in the past').required('Due date is required'),
});


const AdminBilling: React.FC = () => {
    const { users, invoices, addInvoice, markInvoiceAsPaid } = useAuth();
    const { showToast } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const patients = useMemo(() => users.filter(u => u.role === UserRole.PATIENT), [users]);

    const {
        paginatedItems,
        requestSort,
        getSortArrow,
        setGlobalFilter,
        setColumnFilters,
        paginationProps,
    } = useTable<BillingInvoice>(invoices, 10);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(e.target.value);
    };

    const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setColumnFilters(prev => ({ ...prev, status: e.target.value }));
    };
    
    const handleExport = () => {
        const headers = ["Invoice ID", "Patient ID", "Date", "Due Date", "Total Amount", "Amount Due", "Status", "Description"];
        const csvContent = [
            headers.join(','),
            ...invoices.map(inv => [inv.id, inv.patientId, inv.date, inv.dueDate, inv.totalAmount, inv.amountDue, inv.status, `"${inv.description}"`].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'invoices_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleMarkAsPaid = (invoiceId: string) => {
        markInvoiceAsPaid(invoiceId);
        showToast(`Invoice #${invoiceId} marked as paid.`, 'success');
    };

    return (
        <div>
            <PageHeader 
                title="Global Billing Overview"
                buttonText="Add New Invoice"
                onButtonClick={() => setIsModalOpen(true)}
            >
                <button onClick={handleExport} className="bg-white hover:bg-gray-100 text-gray-700 font-bold py-2 px-4 rounded-lg flex items-center space-x-2 border border-gray-300">
                    <DownloadIcon className="w-5 h-5"/>
                    <span>Export Data</span>
                </button>
            </PageHeader>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={handleSearchChange}
                        className="w-full max-w-xs px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <select
                        onChange={handleStatusFilterChange}
                        className="px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Due">Due</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white">
                            <tr>
                                <th onClick={() => requestSort('id')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Invoice ID<span className="text-gray-400">{getSortArrow('id')}</span></th>
                                <th onClick={() => requestSort('patientId')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Patient ID<span className="text-gray-400">{getSortArrow('patientId')}</span></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th onClick={() => requestSort('date')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Date<span className="text-gray-400">{getSortArrow('date')}</span></th>
                                <th onClick={() => requestSort('totalAmount')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Total<span className="text-gray-400">{getSortArrow('totalAmount')}</span></th>
                                <th onClick={() => requestSort('amountDue')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Amount Due<span className="text-gray-400">{getSortArrow('amountDue')}</span></th>
                                <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status<span className="text-gray-400">{getSortArrow('status')}</span></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.map(inv => (
                                <tr key={inv.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-mono">{inv.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{inv.patientId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{inv.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${inv.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${inv.amountDue.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(inv.status)}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {(inv.status === 'Due' || inv.status === 'Overdue') && (
                                            <button 
                                                onClick={() => handleMarkAsPaid(inv.id)} 
                                                className="text-emerald-600 hover:text-emerald-900"
                                            >
                                                Mark as Paid
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <PaginationControls {...paginationProps} />
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Invoice">
                <Formik
                    initialValues={{ patientId: '', description: '', totalAmount: '', dueDate: '' }}
                    validationSchema={InvoiceSchema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        addInvoice({
                            patientId: values.patientId,
                            description: values.description,
                            totalAmount: Number(values.totalAmount),
                            dueDate: values.dueDate,
                        });
                        showToast('Invoice created successfully!', 'success');
                        setSubmitting(false);
                        resetForm();
                        setIsModalOpen(false);
                    }}
                >
                    {({ isSubmitting, errors, touched }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">Patient</label>
                                <Field as="select" name="patientId" id="patientId" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="">Select a patient</option>
                                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                                </Field>
                                <ErrorMessage name="patientId" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <Field type="text" name="description" id="description" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.description && touched.description ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="description" component="p" className="text-red-500 text-xs mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">Total Amount ($)</label>
                                    <Field type="number" name="totalAmount" id="totalAmount" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.totalAmount && touched.totalAmount ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="totalAmount" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                                    <Field type="date" name="dueDate" id="dueDate" className={`mt-1 block w-full px-3 py-2 border bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.dueDate && touched.dueDate ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="dueDate" component="p" className="text-red-500 text-xs mt-1" />
                                </div>
                            </div>
                             <div className="flex justify-end pt-4 border-t space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                                    {isSubmitting ? <SpinnerIcon /> : 'Create Invoice'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
};

export default AdminBilling;
