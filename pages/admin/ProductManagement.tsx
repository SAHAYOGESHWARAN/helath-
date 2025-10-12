
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { SubscriptionPlan } from '../../types';
import PageHeader from '../../components/shared/PageHeader';
import { useApp } from '../../App';
import Modal from '../../components/shared/Modal';

const PlanForm: React.FC<{ plan: Partial<SubscriptionPlan> | null; onSave: (plan: Partial<SubscriptionPlan>) => void; onCancel: () => void; }> = ({ plan, onSave, onCancel }) => {
    const [formData, setFormData] = useState(plan || { name: '', price: '', patientLimit: 0, features: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, features: (formData.features as unknown as string).split(',').map(f => f.trim()) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Plan Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded" />
            <input type="text" placeholder="Price (e.g., $99/mo)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full p-2 border rounded" />
            <input type="number" placeholder="Patient Limit" value={formData.patientLimit} onChange={e => setFormData({ ...formData, patientLimit: Number(e.target.value) })} className="w-full p-2 border rounded" />
            <textarea placeholder="Features (comma-separated)" value={(formData.features as any)?.join(', ')} onChange={e => setFormData({ ...formData, features: e.target.value as any })} className="w-full p-2 border rounded" />
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Plan</button>
            </div>
        </form>
    );
};

const ProductManagement: React.FC = () => {
    const { providerSubscriptionPlans, updateProviderPlans } = useAuth();
    const { showToast } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Partial<SubscriptionPlan> | null>(null);

    const handleSavePlan = (planData: Partial<SubscriptionPlan>) => {
        let updatedPlans;
        if (planData.id) {
            updatedPlans = providerSubscriptionPlans.map(p => p.id === planData.id ? { ...p, ...planData } : p);
            showToast('Plan updated successfully!', 'success');
        } else {
            const newPlan = { ...planData, id: `prod_${Date.now()}` } as SubscriptionPlan;
            updatedPlans = [...providerSubscriptionPlans, newPlan];
            showToast('Plan added successfully!', 'success');
        }
        updateProviderPlans(updatedPlans);
        setIsModalOpen(false);
        setEditingPlan(null);
    };

    const handleDeletePlan = (planId: string) => {
        updateProviderPlans(providerSubscriptionPlans.filter(p => p.id !== planId));
        showToast('Plan deleted!', 'success');
    };

    return (
        <div>
            <PageHeader title="Product & Plan Management" buttonText="Add New Plan" onButtonClick={() => { setEditingPlan(null); setIsModalOpen(true); }} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providerSubscriptionPlans.map(plan => (
                    <Card key={plan.id} title={plan.name}>
                        <p className="text-2xl font-bold">{plan.price}</p>
                        <p className="text-sm text-gray-500">{plan.patientLimit > 0 ? `Up to ${plan.patientLimit} patients` : 'Unlimited patients'}</p>
                        <ul className="mt-4 space-y-2 text-sm list-disc list-inside">
                            {plan.features.map(f => <li key={f}>{f}</li>)}
                        </ul>
                        <div className="flex justify-end space-x-2 mt-4 border-t pt-4">
                            <button onClick={() => { setEditingPlan(plan); setIsModalOpen(true); }} className="text-sm font-medium text-primary-600">Edit</button>
                            <button onClick={() => handleDeletePlan(plan.id)} className="text-sm font-medium text-red-600">Delete</button>
                        </div>
                    </Card>
                ))}
            </div>
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPlan ? 'Edit Plan' : 'Add Plan'}>
                <PlanForm plan={editingPlan} onSave={handleSavePlan} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default ProductManagement;
