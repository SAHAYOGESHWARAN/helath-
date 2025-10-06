import React from 'react';
import Card from '../../components/shared/Card';
import { CubeIcon } from '../../components/shared/Icons';

const products = [
  { 
    name: 'Basic Tier', 
    price: '$49/mo', 
    features: ['Up to 50 patients', 'Basic EHR', 'Appointment Scheduling'],
    color: 'bg-gray-100',
    buttonColor: 'bg-gray-600'
  },
  { 
    name: 'Pro Tier', 
    price: '$99/mo', 
    features: ['Up to 200 patients', 'Full EHR & E-Prescribing', 'Telehealth Included', 'Advanced Reporting'],
    color: 'bg-primary-50',
    buttonColor: 'bg-primary-600'
  },
  { 
    name: 'Enterprise', 
    price: 'Custom', 
    features: ['Unlimited patients', 'All Pro features', 'Dedicated Support', 'HIPAA Compliance+', 'SSO Integration'],
    color: 'bg-tangerine-light/30',
    buttonColor: 'bg-tangerine'
  },
];

const ProductManagement: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors">
          Add New Plan
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <Card key={product.name} className={`flex flex-col ${product.color}`}>
            <div className="flex items-center space-x-3 mb-4">
              <CubeIcon/>
              <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
            </div>
            <p className="text-4xl font-extrabold text-gray-900 mb-4">{product.price}</p>
            <ul className="space-y-2 text-gray-600 flex-grow">
              {product.features.map(feature => (
                <li key={feature} className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <button className={`${product.buttonColor} text-white w-full font-bold py-2 px-4 rounded-lg hover:opacity-90`}>
                Edit Plan
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;