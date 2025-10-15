import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { SubscriptionPlan } from '../../types';
import SubscriptionTierCard from '../../components/shared/SubscriptionTierCard';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import { DownloadIcon } from '../../components/shared/Icons';
import PageHeader from '../../components/shared/PageHeader';

interface BillingHistoryItem {
    id: string;
    date: string;
    amount: number;
    status: 'Paid';
}

const billingHistory: BillingHistoryItem[] = [
    { id: 'inv_pro_1', date: '2024-08-01', amount: 99.00, status: 'Paid' },
    { id: 'inv_pro_2', date: '2024-07-01', amount: 99.00, status: 'Paid' },
    { id: 'inv_pro_3', date: '2024-06-01', amount: 99.00, status: 'Paid' },
];

const InvoiceModal: React.FC<{ invoice: BillingHistoryItem | null; planName: string; onClose: () => void }> = ({ invoice, planName, onClose }) => {
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
            title={`Invoice #${invoice.id}`}
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
                        <p className="text-gray-500">Provider Subscription Invoice</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium text-gray-500">Invoice ID</p>
                                <p className="font-semibold text-gray-800">{invoice.id}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Date Paid</p>
                                <p className="font-semibold text-gray-800">{invoice.date}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-500">Description</p>
                                <p className="font-semibold text-gray-800">{planName} Subscription</p>
                            </div>
                             <div>
                                <p className="font-medium text-gray-500">Payment Method</p>
                                <p className="font-semibold text-gray-800">Visa ending in 1234</p>
                            </div>
                        </div>
                    </div>
                    <div className="border-t pt-4 mt-4">
                         <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 text-lg">Total Paid</span>
                            <span className="font-bold text-primary-600 text-xl">${invoice.amount.toFixed(2)}</span>
                        </div>
                    </div>
                     <p className="text-xs text-center text-gray-500 pt-4">Thank you for your business!</p>
                </div>
            </div>
        </Modal>
    );
};

const Subscription: React.FC = () => {
    const { currentSubscription, changeSubscription, providerSubscriptionPlans } = useAuth();
    const { showToast } = useApp();
    const [modalState, setModalState] = useState<{ isOpen: boolean; plan: SubscriptionPlan | null }>({ isOpen: false, plan: null });
    const [selectedInvoice, setSelectedInvoice] = useState<BillingHistoryItem | null>(null);

    const currentPatientCount = 85;
    
    if (!currentSubscription) {
        return <div>Loading subscription details...</div>;
    }
    
    const usagePercentage = currentSubscription.patientLimit > 0 
        ? (currentPatientCount / currentSubscription.patientLimit) * 100 
        : 0;

    const handleChoosePlan = (planId: string) => {
        const plan = providerSubscriptionPlans.find(p => p.id === planId);
        if (plan) {
            setModalState({ isOpen: true, plan });
        }
    };

    const handleConfirmChange = () => {
        if (modalState.plan) {
            changeSubscription(modalState.plan.id);
            showToast(`Successfully subscribed to ${modalState.plan.name}!`, 'success');
            setModalState({ isOpen: false, plan: null });
        }
    };


  return (
    <div>
      <PageHeader title="Subscription & Billing" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
            <p className="text-sm text-gray-500 font-medium">Current Plan</p>
            <p className="text-2xl font-bold text-primary-600 mt-1">{currentSubscription.name}</p>
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Active Patients</p>
            <div className="flex items-baseline space-x-2 mt-1">
                <p className="text-2xl font-bold text-gray-800">{currentPatientCount}</p>
                {currentSubscription.patientLimit > 0 && <p className="text-gray-500 text-sm">/ {currentSubscription.patientLimit}</p>}
            </div>
            {currentSubscription.patientLimit > 0 && 
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
                </div>
            }
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Monthly Cost</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{currentSubscription.price.replace('/mo', '')}</p>
        </Card>
        <Card>
            <p className="text-sm text-gray-500 font-medium">Next Renewal</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">Sep 1, 2024</p>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Compare & Upgrade Plans</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {providerSubscriptionPlans.map(plan => (
                <SubscriptionTierCard 
                    key={plan.id}
                    plan={plan}
                    currentPlanName={currentSubscription.name}
                    onChoosePlan={handleChoosePlan}
                />
            ))}
        </div>
      </div>
      
       <div className="mt-8">
        <Card title="Billing History">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Invoice</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {billingHistory.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedInvoice(item)} className="text-primary-600 hover:text-primary-900">Download Invoice</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({isOpen: false, plan: null})}
        title="Confirm Subscription Change"
        footer={<>
            <button onClick={() => setModalState({isOpen: false, plan: null})} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button onClick={handleConfirmChange} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Confirm</button>
        </>}
      >
        <p>Are you sure you want to change your plan to <strong>{modalState.plan?.name}</strong> for <strong>{modalState.plan?.price}</strong>?</p>
      </Modal>

       <InvoiceModal 
        invoice={selectedInvoice}
        planName={currentSubscription.name}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

export default Subscription;