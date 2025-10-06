import React from 'react';
import Card from '../../components/shared/Card';

const Compliance: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Compliance & Auditing</h1>
      <Card>
        <p>Access audit logs, manage HIPAA compliance settings, and generate reports.</p>
        <div className="mt-4">
          <button className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">
            View Audit Logs
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Compliance;
