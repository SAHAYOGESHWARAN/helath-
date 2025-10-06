import React from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';

const ProviderDashboard: React.FC = () => {
    const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.name}!</h1>
      <Card>
        <p>Here is a summary of your schedule and tasks for today.</p>
      </Card>
    </div>
  );
};

export default ProviderDashboard;
