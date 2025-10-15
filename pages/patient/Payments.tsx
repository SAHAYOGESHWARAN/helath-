
import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../App';
import { SpinnerIcon, DownloadIcon, CreditCardIcon, PhonePeIcon } from '../../components/shared/Icons';
import { BillingInvoice } from '../../types';
import Modal from '../../components/shared/Modal';
import PageHeader from '../../components/shared/PageHeader';

const PaymentSchema = Yup.object().shape({
  nameOnCard: Yup.string()
    .min(3, 'Name is too short')
    .matches(/(\s)/, { message: 'Please enter your full name as it appears on the card', excludeEmptyString: true })
    .required('Name on card is required'),
  cardNumber: Yup.string()
    .matches(/^[0-9]{16}$/, 'Card number must be 16 digits')
    .required('Card number is required'),
  expiryDate: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\s?\/\s?([0-9]{2})$/, 'Use MM / YY format')
    .test('is-not-expired', 'Card has expired', (value) => {
      if (!value || !/^(0[1-9]|1[0-2])\s?\/\s?([0-9]{2})$/.test(value)) return false;
      const [month, year] = value.split('/').map(s => parseInt(s.trim(), 10));
      const expiry = new Date(2000 + year, month - 1);
      const lastDayOfMonth = new Date(expiry.getFullYear(), expiry.getMonth() + 1, 0);
      return lastDayOfMonth >= new Date();
    })
    .required('Expiry date is required'),
  cvc: Yup.string()
    .matches(/^\d{3,4}$/, 'CVC must be 3-4 digits')
    .required('CVC is required'),
  amount: Yup.number()
    .positive('Amount must be positive')
    .required('Amount is required'),
});

const ReceiptModal: React.FC<{ invoice: BillingInvoice | null; onClose: () => void }> = ({ invoice, onClose }) => {
    if (!invoice) return null;

    return (
        <Modal 
            isOpen={!!invoice} 
            onClose={onClose} 
            title={`Receipt for Invoice #${invoice.id}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Close</button>
                    <button onClick={() => window.print()} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center">
                        <DownloadIcon className="w-4 h-4 mr-2" />
                        Print / Download
                    </button>
                </>
            }
        >
            <div className="space-y-4 text-sm">
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
        </Modal>
    );
};


const Payments: React.FC = () => {
    const { user, invoices, makePayment } = useAuth();
    const { showToast } = useApp();
    const [selectedReceipt, setSelectedReceipt] = useState<BillingInvoice | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('card');

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

  return (
    <div>
      <PageHeader title="Payments & Billing" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Outstanding Invoices">
             <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount Due</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dueInvoices.length > 0 ? dueInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${inv.amountDue.toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan={3} className="text-center py-4 text-gray-500">No outstanding invoices.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title="Transaction History">
             <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date Paid</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Receipt</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paidInvoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${inv.totalAmount.toFixed(2)}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => setSelectedReceipt(inv)} className="text-primary-600 hover:text-primary-900 font-medium">Receipt</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card title="Make a Payment">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-700">Current Balance</p>
              <p className="text-3xl font-bold text-primary-600">${currentBalance.toFixed(2)}</p>
            </div>
            
            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <button onClick={() => setPaymentMethod('card')} className={`p-2 border rounded-lg flex justify-center ${paymentMethod === 'card' ? 'bg-primary-100 border-primary-500' : 'bg-white'}`}><CreditCardIcon className="w-6 h-6"/></button>
                <button onClick={() => setPaymentMethod('gpay')} className={`p-2 border rounded-lg flex justify-center ${paymentMethod === 'gpay' ? 'bg-primary-100 border-primary-500' : 'bg-white'}`}>GPay</button>
                <button onClick={() => setPaymentMethod('phonepe')} className={`p-2 border rounded-lg flex justify-center ${paymentMethod === 'phonepe' ? 'bg-primary-100 border-primary-500' : 'bg-white'}`}><PhonePeIcon className="w-6 h-6"/></button>
                <button onClick={() => setPaymentMethod('qr')} className={`p-2 border rounded-lg flex justify-center ${paymentMethod === 'qr' ? 'bg-primary-100 border-primary-500' : 'bg-white'}`}>QR</button>
            </div>

            {paymentMethod === 'card' && (
                <Formik
                  initialValues={{ nameOnCard: '', cardNumber: '', expiryDate: '', cvc: '', amount: currentBalance > 0 ? currentBalance.toFixed(2) : '0.00' }}
                  enableReinitialize validationSchema={PaymentSchema}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    setTimeout(() => { 
                        handleSimulatedPayment(parseFloat(values.amount));
                        setSubmitting(false);
                        resetForm();
                    }, 1000);
                  }}
                >
                {({ errors, touched, isValid, isSubmitting, values }) => ( <Form className="space-y-4">
                    <Field name="nameOnCard" placeholder="Name on Card" className={`w-full p-2 border rounded ${errors.nameOnCard && touched.nameOnCard ? 'border-red-500' : 'border-gray-300'}`} />
                    <Field name="cardNumber" placeholder="Card Number" className={`w-full p-2 border rounded ${errors.cardNumber && touched.cardNumber ? 'border-red-500' : 'border-gray-300'}`} />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Field name="expiryDate" placeholder="MM / YY" className={`w-full p-2 border rounded ${errors.expiryDate && touched.expiryDate ? 'border-red-500' : 'border-gray-300'}`} />
                            <ErrorMessage name="expiryDate" component="p" className="text-red-500 text-xs mt-1" />
                        </div>
                        <div>
                            <Field name="cvc" placeholder="CVC" className={`w-full p-2 border rounded ${errors.cvc && touched.cvc ? 'border-red-500' : 'border-gray-300'}`} />
                            <ErrorMessage name="cvc" component="p" className="text-red-500 text-xs mt-1" />
                        </div>
                    </div>
                    <Field type="number" name="amount" className={`w-full p-2 border rounded ${errors.amount && touched.amount ? 'border-red-500' : 'border-gray-300'}`} />
                    <button type="submit" disabled={!isValid || isSubmitting || parseFloat(values.amount) <= 0} className="w-full flex justify-center items-center bg-primary-600 text-white font-bold py-2 px-4 rounded-lg enabled:hover:bg-primary-700 disabled:bg-gray-400">
                        {isSubmitting ? <SpinnerIcon /> : `Pay $${parseFloat(values.amount || '0').toFixed(2)}`}
                    </button>
                </Form>)}
                </Formik>
            )}

            {(paymentMethod === 'gpay' || paymentMethod === 'phonepe') && (
                <button onClick={() => handleSimulatedPayment(currentBalance)} className="w-full bg-black text-white font-bold py-3 px-4 rounded-lg">{`Pay with ${paymentMethod.toUpperCase()}`}</button>
            )}
             {paymentMethod === 'qr' && (
                <div className="text-center">
                    <p className="font-semibold mb-2">Scan to Pay</p>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=novopath@upi" alt="QR Code" className="mx-auto border-4 rounded-lg"/>
                    <p className="text-xs text-gray-500 mt-2">Use any UPI app to scan and pay the total balance of ${currentBalance.toFixed(2)}.</p>
                </div>
            )}


          </Card>
        </div>
      </div>
      <ReceiptModal invoice={selectedReceipt} onClose={() => setSelectedReceipt(null)} />
    </div>
  );
};

export default Payments;