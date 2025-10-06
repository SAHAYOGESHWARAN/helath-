import React from 'react';
import Card from '../../components/shared/Card';

const HealthRecords: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Health Records</h1>
      <Card>
        <p>Access your personal health records, including lab results, visit summaries, and medications.</p>
        {/* Placeholder for record list */}
         <ul className="mt-4 space-y-2">
            <li className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">Lab Results - August 10, 2024</li>
            <li className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">Visit Summary - August 1, 2024</li>
            <li className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">Current Medications</li>
        </ul>
      </Card>
    </div>
  );
};

export default HealthRecords;
