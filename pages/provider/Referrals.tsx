import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field } from 'formik';
import { useApp } from '../../App';
import { SpinnerIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { Referral } from '../../types';

type Status = 'Pending' | 'Approved' | 'Declined';

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Declined': return 'bg-red-100 text-red-800';
  }
};

const Referrals: React.FC = () => {
  const { referrals, addReferral } = useAuth();
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useApp();

  const filteredReferrals = useMemo(() => {
    if (filter === 'All') return referrals;
    return referrals.filter(r => r.type === filter);
  }, [filter, referrals]);

  return (
    <div>
        <PageHeader title="Referral Management" buttonText="Create New Referral" onButtonClick={() => setIsModalOpen(true)} />

      <Card>
        <div className="mb-4">
          <div className="flex space-x-4 border-b">
            <button onClick={() => setFilter('All')} className={`py-2 px-4 font-medium ${filter === 'All' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>All</button>
            <button onClick={() => setFilter('Incoming')} className={`py-2 px-4 font-medium ${filter === 'Incoming' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>Incoming</button>
            <button onClick={() => setFilter('Outgoing')} className={`py-2 px-4 font-medium ${filter === 'Outgoing' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>Outgoing</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referred To/From</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReferrals.length > 0 ? filteredReferrals.map((ref) => (
                <tr key={ref.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ref.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ref.type === 'Incoming' ? ref.referredFrom : ref.referredTo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ref.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ref.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ref.status)}`}>
                      {ref.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="text-center py-10 text-gray-500">No referrals found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Referral">
          <Formik
            initialValues={{ patient: '', specialist: '', reason: '' }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                const newReferral: Omit<Referral, 'id' | 'status'> = {
                    patient: values.patient,
                    referredTo: values.specialist,
                    date: new Date().toISOString().split('T')[0],
                    type: 'Outgoing',
                    reason: values.reason,
                };
                addReferral(newReferral);
                setSubmitting(false);
                resetForm();
                setIsModalOpen(false);
                showToast("Referral submitted successfully!", "success");
            }}
          >
            {({ isSubmitting }) => (
                <Form className="space-y-4">
                    <Field name="patient" placeholder="Patient Name" className="w-full p-2 border bg-white rounded"/>
                    <Field name="specialist" placeholder="Specialist Name & Department" className="w-full p-2 border bg-white rounded"/>
                    <Field as="textarea" name="reason" placeholder="Reason for referral" className="w-full p-2 border bg-white rounded"/>
                    <div className="flex justify-end pt-4 border-t">
                        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                            {isSubmitting ? <SpinnerIcon/> : "Submit Referral"}
                        </button>
                    </div>
                </Form>
            )}
          </Formik>
      </Modal>
    </div>
  );
};

export default Referrals;