import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';

const ProductManagement: React.FC = () => {
    const { providerSubscriptionPlans, patientSubscriptionPlans } = useAuth();
    const allProducts = [...providerSubscriptionPlans, ...patientSubscriptionPlans];

    return (
        <div>
            <PageHeader title="Product & Service Management" buttonText="Add New Product" onButtonClick={() => {}} />
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
                                            <button className="text-primary-600 hover:underline">Edit</button>
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
        </div>
    );
};

export default ProductManagement;