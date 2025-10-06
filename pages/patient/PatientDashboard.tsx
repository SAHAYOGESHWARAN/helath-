import React from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Upcoming Appointment">
          <p>You have an appointment with <strong>Dr. Jane Smith</strong> tomorrow at <strong>10:30 AM</strong> for an annual check-up.</p>
        </Card>
        <Card title="Recent Activity">
          <p>Your lab results from your last visit are now available in your Health Records.</p>
        </Card>
         <Card title="Messages">
          <p>You have 1 unread message from your provider.</p>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;
