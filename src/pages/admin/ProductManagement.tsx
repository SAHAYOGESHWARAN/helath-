import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { SubscriptionPlan } from '../../types';
import Modal from '../../components/shared/Modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const PlanSchema = Yup.object().shape({
  name: Yup.string().required('Plan name is required'),
  price: Yup.string().required('Price is required'),
  features: Yup.string(),
});

const EditPlanModal: React.FC<{
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (plan: SubscriptionPlan) => void;
}> = ({ plan, onClose, onSave }) => {
  if (!plan) return null;

  return (
    <Modal isOpen={!!plan} onClose={onClose} title={`Edit Plan: ${plan.name}`}>
      <Formik
        initialValues={{
          ...plan,
          features: plan.features.join('\n'),
        }}
        validationSchema={PlanSchema}
        onSubmit={(values, { setSubmitting }) => {
          const updatedPlan = {
            ...values,
            features: values.features.split('\n').filter(f => f.trim() !== ''),
          };
          onSave(updatedPlan);
          setSubmitting(false);
          onClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plan Name</label>
              <Field id="name" name="name" className="w-full p-2 border rounded mt-1 bg-white" />
              <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
              <Field id="price" name="price" className="w-full p-2 border rounded mt-1 bg-white" />
              <ErrorMessage name="price" component="p" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label htmlFor="features" className="block text-sm font-medium text-gray-700">Features (one per line)</label>
              <Field id="features" name="features" as="textarea" rows={5} className="w-full p-2 border rounded mt-1 bg-white" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg font-bold">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-bold">Save Changes</button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};


const ProductManagement: React.FC = () => {
    const { providerSubscriptionPlans, patientSubscriptionPlans, updateSubscriptionPlan } = useAuth();
    const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

    const allProducts = [...providerSubscriptionPlans, ...patientSubscriptionPlans];

    const handleEdit = (plan: SubscriptionPlan) => {
        setEditingPlan(plan);
    };

    const handleSave = (plan: SubscriptionPlan) => {
        updateSubscriptionPlan(plan);
        setEditingPlan(null);
    };

    return (
        <div>
            <PageHeader title="Product & Service Management" buttonText="Add New Product" onButtonClick={() => alert('Add new product functionality coming soon!')} />
            <Card>
                <p className="mb-4 text-gray-600">Manage all purchasable products, services, and subscription tiers across the platform.</p>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product/Plan Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target Audience</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {allProducts.length > 0 ? (
                                allProducts.map(plan => (
                                    <tr key={plan.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{plan.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{plan.price}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{plan.id.startsWith('plan_d') ? 'Providers' : 'Patients'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button onClick={() => handleEdit(plan)} className="text-primary-600 hover:underline">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-10 text-gray-500">
                                        No products found. <button onClick={() => {}} className="text-primary-600 font-semibold hover:underline">Add one now.</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <EditPlanModal plan={editingPlan} onClose={() => setEditingPlan(null)} onSave={handleSave} />
        </div>
    );
};

export default ProductManagement;