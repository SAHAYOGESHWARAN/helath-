import React from 'react';
import Card from '../../components/shared/Card';

const ProgressNotes: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Progress Notes</h1>
      <Card>
        <p>Document patient encounters and clinical notes.</p>
      </Card>
    </div>
  );
};

export default ProgressNotes;
