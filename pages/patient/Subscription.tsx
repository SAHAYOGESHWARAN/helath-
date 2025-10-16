
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { SubscriptionPlan } from '../../types';
import { CheckCircleIcon, CreditCardIcon, DownloadIcon, SparklesIcon } from '../../components/shared/Icons';
import SubscriptionTierCard from '../../components/shared/SubscriptionTierCard';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import PageHeader from '../../components/shared/PageHeader';

interface BillingHistoryItem {
    id: string;
    date: string;
    amount: number;
    status: 'Paid';
}

const billingHistory: BillingHistoryItem[] = []; // Start with no history

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
    const { user, currentSubscription, changeSubscription, patientSubscriptionPlans } = useAuth();
    const { showToast } = useApp();
    const [modalState, setModalState] = useState<{ isOpen: boolean; plan: SubscriptionPlan | null }>({ isOpen: false, plan: null });
    const [selectedInvoice, setSelectedInvoice] = useState<BillingHistoryItem | null>(null);

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
      <PageHeader 
        title="My Subscription"
        subtitle="Manage your plan to unlock features like unlimited video consultations."
      />
      
        {!user?.subscription && (
            <div className="mb-8 p-6 bg-gradient-to-r from-primary-500 to-accent rounded-lg text-white shadow-lg flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center"><SparklesIcon className="w-6 h-6 mr-2"/> New Subscriber Offer!</h2>
                    <p>Get <span className="font-bold">50% OFF</span> your first video consultation call when you subscribe to any plan.</p>
                </div>
                <a href="#plans" className="bg-white text-primary-600 font-bold py-2 px-5 rounded-lg shadow hover:bg-primary-50 transition-colors">View Plans</a>
            </div>
        )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-8">
           <Card title="Current Plan">
                {currentSubscription ? (
                    <>
                        <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                            <h3 className="text-2xl font-bold text-primary-700">{currentSubscription.name}</h3>
                            <p className="text-gray-600 mt-1">Renews on {user?.subscription?.renewalDate}</p>
                        </div>
                        <div className="mt-4 space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1"><span className="font-medium">Video Consults</span><span>1 of 5 used</span></div>
                                <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full" style={{width: '20%'}}></div></div>
                            </div>
                             <ul className="space-y-3 pt-4 border-t text-sm">
                                {currentSubscription.features.map(feature => (
                                    <li key={feature} className="flex items-center text-gray-700">
                                        <CheckCircleIcon className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-600">You are not currently subscribed to a plan.</p>
                        <a href="#plans" className="mt-2 inline-block text-primary-600 font-semibold hover:underline">Choose a plan to get started</a>
                    </div>
                )}
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
                    {billingHistory.length > 0 ? billingHistory.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium text-gray-800">Payment on {item.date}</p>
                                <button onClick={() => setSelectedInvoice(item)} className="text-primary-600 hover:underline">Download Invoice</button>
                            </div>
                            <p className="font-semibold text-gray-600">${item.amount.toFixed(2)}</p>
                        </div>
                    )) : <p className="text-gray-500 text-sm text-center">No billing history found.</p>}
                </div>
            </Card>
        </div>

        {/* Right Column */}
        <div id="plans" className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Upgrade Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {patientSubscriptionPlans.map(plan => (
                    <SubscriptionTierCard
                        key={plan.id}
                        plan={plan}
                        currentPlanName={currentSubscription?.name || ''}
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
        planName={currentSubscription?.name || ''}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

export default Subscription;