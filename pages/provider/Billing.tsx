import React from 'react';
import Card from '../../components/shared/Card';

const Billing: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Billing & Coding</h1>
      <Card>
        <p>Manage superbills, claims, and patient billing.</p>
      </Card>
    </div>
  );
};

export default Billing;
