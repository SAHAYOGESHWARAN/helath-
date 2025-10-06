import React from 'react';
import Card from '../../components/shared/Card';

const EPrescribing: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">E-Prescribing</h1>
      <Card>
        <p>Create and send prescriptions electronically to pharmacies.</p>
      </Card>
    </div>
  );
};

export default EPrescribing;
