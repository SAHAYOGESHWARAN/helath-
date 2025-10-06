import React from 'react';
import Card from '../../components/shared/Card';

const Subscription: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Subscription</h1>
      <Card>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Your Plan: Basic Care</h2>
            <p className="text-gray-600 mt-2">Your subscription is active and will renew on August 31, 2025.</p>
            <button className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg">
                Manage Subscription
            </button>
        </div>
      </Card>
    </div>
  );
};

export default Subscription;
