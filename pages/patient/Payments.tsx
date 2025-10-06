import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Card from '../../components/shared/Card';

const transactions = [
  { id: 'txn_1', date: '2024-07-20', description: 'Co-pay: Dr. Smith', amount: 50.00, status: 'Paid' },
  { id: 'txn_2', date: '2024-06-15', description: 'Lab Services Bill', amount: 85.50, status: 'Paid' },
  { id: 'txn_3', date: '2024-05-10', description: 'Outstanding Balance', amount: 120.00, status: 'Paid' },
];

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


const Payments: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Payments & Billing</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card title="Transaction History">
             <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Receipt</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((txn) => (
                    <tr key={txn.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${txn.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-primary-600 hover:text-primary-900">Receipt</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card title="Make a Payment" className="bg-primary-50">
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-700">Current Balance</p>
              <p className="text-3xl font-bold text-primary-600">$250.00</p>
            </div>
            <Formik
              initialValues={{
                nameOnCard: '',
                cardNumber: '',
                expiryDate: '',
                cvc: '',
                amount: '250.00',
              }}
              validationSchema={PaymentSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setTimeout(() => {
                  alert(`Payment of $${values.amount} submitted successfully! (mock)`);
                  setSubmitting(false);
                  resetForm();
                }, 500);
              }}
            >
              {({ errors, touched, isValid, isSubmitting }) => (
                <Form className="space-y-4">
                   <div>
                    <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">Name on Card</label>
                    <Field 
                        type="text" 
                        id="nameOnCard"
                        name="nameOnCard" 
                        placeholder="JOHN M DOE" 
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.nameOnCard && touched.nameOnCard ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <ErrorMessage name="nameOnCard" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                    <Field 
                        type="text" 
                        id="cardNumber"
                        name="cardNumber" 
                        placeholder="•••• •••• •••• ••••" 
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.cardNumber && touched.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <ErrorMessage name="cardNumber" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry</label>
                      <Field 
                        type="text" 
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM / YY" 
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.expiryDate && touched.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      <ErrorMessage name="expiryDate" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                      <Field 
                        type="text" 
                        id="cvc"
                        name="cvc"
                        placeholder="•••" 
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.cvc && touched.cvc ? 'border-red-500' : 'border-gray-300'}`}
                        />
                      <ErrorMessage name="cvc" component="p" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                   <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                    <Field 
                        type="number" 
                        id="amount"
                        name="amount"
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${errors.amount && touched.amount ? 'border-red-500' : 'border-gray-300'}`}
                    />
                     <ErrorMessage name="amount" component="p" className="text-red-500 text-xs mt-1" />
                  </div>
                  <button 
                    type="submit" 
                    disabled={!isValid || isSubmitting}
                    className="w-full bg-primary-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors enabled:hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Processing...' : 'Pay Now'}
                  </button>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payments;