
import React, { useState, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card } from '../../components/shared/Card';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { SpinnerIcon, DownloadIcon, CreditCardIcon } from '../../components/shared/Icons';
import { BillingInvoice } from '../../types';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { Table, ColumnDefinition } from '../../components/shared/Table';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentSchema = Yup.object().shape({
  nameOnCard: Yup.string()
    .min(3, 'Name is too short')
    .matches(/(\s)/, { message: 'Please enter your full name as it appears on the card', excludeEmptyString: true })
    .required('Name on card is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
});

const ReceiptModal: React.FC<{ invoice: BillingInvoice | null; onClose: () => void }> = ({ invoice, onClose }) => {
    if (!invoice) return null;

    const handlePrint = () => {
        const printContents = document.getElementById('invoice-to-print')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); 
        }
    };

    return (
        <Modal 
            isOpen={!!invoice} 
            onClose={onClose} 
            title={`Receipt for Invoice #${invoice.id}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Close</button>
                    <button onClick={handlePrint} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Print / Save as PDF
                    </button>
                </>
            }
        >
            <div id="invoice-to-print">
                 <div className="printable-invoice space-y-4 text-sm">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">NovoPath Medical</h2>
                        <p className="text-gray-500">Payment Receipt</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium text-gray-500">Invoice ID</p>
                                <p className="font-semibold text-gray-800">{invoice.id}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Date Processed</p>
                                <p className="font-semibold text-gray-800">{invoice.date}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Description</p>
                                <p className="font-semibold text-gray-800">{invoice.description}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Payment Method</p>
                                <p className="font-semibold text-gray-800">Visa **** 4242</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t pt-4 mt-4">
                         <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 text-lg">Total Paid</span>
                            <span className="font-bold text-primary-600 text-xl">${invoice.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                     <p className="text-xs text-center text-gray-500 pt-4">Thank you for your payment!</p>
                </div>
            </div>
        </Modal>
    );
};


const CheckoutForm: React.FC<{ currentBalance: number; dueInvoices: BillingInvoice[] }> = ({ currentBalance, dueInvoices }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { makePayment } = useAuth();
    const { showToast } = useApp();

    const handleSubmit = async (values: { nameOnCard: string; amount: string; }, setSubmitting: (isSubmitting: boolean) => void) => {
        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        setSubmitting(true);

        try {
            const { data: { clientSecret } } = await axios.post('/api/create-payment-intent', {
                amount: Math.round(parseFloat(values.amount) * 100), // amount in cents
            });

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: values.nameOnCard,
                    },
                },
            });

            if (error) {
                showToast(error.message || 'An error occurred.', 'error');
                setSubmitting(false);
                return;
            }

            // Find the most overdue invoice to apply the payment to
            const sortedDueInvoices = [...dueInvoices].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
            if (sortedDueInvoices.length > 0) {
                await makePayment(sortedDueInvoices[0].id, parseFloat(values.amount));
                showToast('Payment successful!', 'success');
            } else {
                showToast('No outstanding invoices to pay.', 'info');
            }
        } catch (err) {
            showToast('Payment failed. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={{ nameOnCard: '', amount: currentBalance > 0 ? currentBalance.toFixed(2) : '0.00' }}
            enableReinitialize
            validationSchema={PaymentSchema}
            onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values, setSubmitting);
            }}
        >
            {({ errors, touched, isValid, isSubmitting, values }) => (
                <Form className="space-y-4">
                    <Field name="nameOnCard" placeholder="Name on Card" className={`w-full p-2 border rounded ${errors.nameOnCard && touched.nameOnCard ? 'border-red-500' : 'border-gray-300'}`} />
                    <div className="p-2 border rounded border-gray-300">
                        <CardElement />
                    </div>
                    <Field type="number" name="amount" className={`w-full p-2 border rounded ${errors.amount && touched.amount ? 'border-red-500' : 'border-gray-300'}`} />
                    <button type="submit" disabled={!isValid || isSubmitting || parseFloat(values.amount) <= 0} className="w-full flex justify-center items-center bg-primary-600 text-white font-bold py-2 px-4 rounded-lg enabled:hover:bg-primary-700 disabled:bg-gray-400">
                        {isSubmitting ? <SpinnerIcon /> : `Pay $${parseFloat(values.amount || '0').toFixed(2)}`}
                    </button>
                </Form>
            )}
        </Formik>
    );
};

const Payments: React.FC = () => {
    const { user, invoices, makePayment } = useAuth();
    const { showToast } = useApp();
    const [selectedReceipt, setSelectedReceipt] = useState<BillingInvoice | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [autoPay, setAutoPay] = useState(false);

    const { dueInvoices, paidInvoices, currentBalance } = useMemo(() => {
        if (!user) return { dueInvoices: [], paidInvoices: [], currentBalance: 0 };
        const userInvoices = invoices.filter(inv => inv.patientId === user.id);
        const due = userInvoices.filter(inv => inv.status === 'Due' || inv.status === 'Overdue');
        const paid = userInvoices.filter(inv => inv.status === 'Paid');
        const balance = due.reduce((sum, inv) => sum + inv.amountDue, 0);
        return { dueInvoices: due, paidInvoices: paid, currentBalance: balance };
    }, [invoices, user]);

    const handleSimulatedPayment = (amount: number) => {
        let amountToApply = amount;
        const sortedDueInvoices = [...dueInvoices].sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        for(const inv of sortedDueInvoices) {
            if (amountToApply <= 0) break;
            const paymentForThisInvoice = Math.min(amountToApply, inv.amountDue);
            makePayment(inv.id, paymentForThisInvoice);
            amountToApply -= paymentForThisInvoice;
        }
        showToast(`Payment of $${amount.toFixed(2)} submitted successfully!`, 'success');
    }

    const paidInvoiceColumns: ColumnDefinition<BillingInvoice>[] = [
      { accessorKey: 'date', header: 'Date Paid'},
      { accessorKey: 'description', header: 'Description', cellClassName: 'font-medium text-gray-900'},
      { accessorKey: 'totalAmount', header: 'Amount', cell: (row) => `$${row.totalAmount.toFixed(2)}`},
      { accessorKey: 'actions', header: '', cell: (row) => (
        <button onClick={() => setSelectedReceipt(row)} className="text-primary-600 hover:text-primary-900 font-medium">Receipt</button>
      ), cellClassName: 'text-right'},
    ];

    const dueInvoiceColumns: ColumnDefinition<BillingInvoice>[] = [
      { accessorKey: 'description', header: 'Description', cellClassName: 'font-medium text-gray-900'},
      { accessorKey: 'dueDate', header: 'Due Date'},
      { accessorKey: 'amountDue', header: 'Amount Due', cell: (row) => `$${row.amountDue.toFixed(2)}`, cellClassName: 'text-red-600 font-semibold' },
    ];

  return (
    <div>
      <PageHeader title="Payments & Billing" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Outstanding Invoices">
             <Table<BillingInvoice>
                columns={dueInvoiceColumns}
                data={dueInvoices}
                emptyState={<div className="text-center py-4 text-gray-500">No outstanding invoices.</div>}
             />
          </Card>
          <Card title="Transaction History">
             <Table<BillingInvoice>
                columns={paidInvoiceColumns}
                data={paidInvoices}
             />
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          <Card title="Make a Payment">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-700">Current Balance</p>
              <p className="text-3xl font-bold text-red-600">${currentBalance.toFixed(2)}</p>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
                <button onClick={() => setPaymentMethod('card')} className={`p-2 border rounded-lg flex justify-center ${paymentMethod === 'card' ? 'bg-primary-100 border-primary-500' : 'bg-white'}`}><CreditCardIcon className="w-6 h-6"/></button>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm currentBalance={currentBalance} dueInvoices={dueInvoices} />
            </Elements>
          </Card>
           <Card title="Saved Payment Methods">
               <div className="p-3 border rounded-lg flex justify-between items-center">
                   <div className="flex items-center"><CreditCardIcon className="w-6 h-6 mr-3 text-gray-500"/><div><p className="font-semibold">Visa **** 4242</p><p className="text-xs text-gray-500">Expires 12/26</p></div></div>
                   <button className="text-xs text-red-500 hover:underline">Remove</button>
               </div>
               <button className="w-full mt-4 text-sm font-semibold text-primary-600 hover:underline">+ Add new payment method</button>
           </Card>
           <Card title="Payment Settings">
               <div className="flex items-center justify-between">
                    <div>
                       <p className="font-medium text-gray-700">Enable Auto-Pay</p>
                       <p className="text-sm text-gray-500">Automatically pay your balance on the due date.</p>
                    </div>
                    <ToggleSwitch name="autoPay" checked={autoPay} onChange={() => setAutoPay(p => !p)} />
               </div>
           </Card>
        </div>
      </div>
      <ReceiptModal invoice={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
    </div>
  );
};

export default Payments;