import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { SubscriptionPlan } from '../../types';
import { CheckCircleIcon, CreditCardIcon, DownloadIcon } from '../../components/shared/Icons';
import SubscriptionTierCard from '../../components/shared/SubscriptionTierCard';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';

interface BillingHistoryItem {
    id: string;
    date: string;
    amount: number;
    status: 'Paid';
}

const billingHistory: BillingHistoryItem[] = [
    { id: 'inv_sub_1', date: '2024-08-01', amount: 19.00, status: 'Paid' },
    { id: 'inv_sub_2', date: '2024-07-01', amount: 19.00, status: 'Paid' },
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
            // We need to reload to re-attach React components, this is a simple approach
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
                        <p className="text-gray-500">Subscription Invoice</p>
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
                                <p className="font-semibold text-gray-800">Visa ending in 4242</p>
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
    const { currentSubscription, changeSubscription, patientSubscriptionPlans } = useAuth();
    const { showToast } = useApp();
    const [modalState, setModalState] = useState<{ isOpen: boolean; plan: SubscriptionPlan | null }>({ isOpen: false, plan: null });
    const [selectedInvoice, setSelectedInvoice] = useState<BillingHistoryItem | null>(null);

    if (!currentSubscription) {
        return <div>Loading subscription...</div>;
    }

    const handleChoosePlan = (planId: string) => {
        const plan = patientSubscriptionPlans.find(p => p.id === planId);
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Subscription</h1>
      <p className="text-gray-600 mb-6">Manage your plan, billing, and payment details.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
           <Card title="Current Plan">
                <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <h3 className="text-2xl font-bold text-primary-700">{currentSubscription.name}</h3>
                    <p className="text-gray-600 mt-1">Renews on August 31, 2025</p>
                </div>
                <ul className="space-y-3 mt-4 text-sm">
                    {currentSubscription.features.map(feature => (
                        <li key={feature} className="flex items-center text-gray-700">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
          </Card>
          <Card title="Payment Method">
              <div className="flex items-center">
                <CreditCardIcon className="w-8 h-8 text-gray-400 mr-4"/>
                <div>
                    <p className="font-semibold text-gray-800">Visa ending in 4242</p>
                    <p className="text-sm text-gray-500">Expires 12 / 2026</p>
                </div>
              </div>
               <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm">
                    Update Payment
                </button>
          </Card>
           <Card title="Billing History">
                <div className="space-y-3">
                    {billingHistory.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium text-gray-800">Payment on {item.date}</p>
                                <button onClick={() => setSelectedInvoice(item)} className="text-primary-600 hover:underline">Download Invoice</button>
                            </div>
                            <p className="font-semibold text-gray-600">${item.amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upgrade Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patientSubscriptionPlans.map(plan => (
                    <SubscriptionTierCard
                        key={plan.id}
                        plan={plan}
                        currentPlanName={currentSubscription.name}
                        onChoosePlan={handleChoosePlan}
                    />
                ))}
            </div>
        </div>
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