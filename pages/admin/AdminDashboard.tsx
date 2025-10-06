import React from 'react';
import Card from '../../components/shared/Card';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center"><p className="text-3xl font-bold text-primary-600">820</p><p className="text-gray-500">Total Patients</p></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-tangerine">75</p><p className="text-gray-500">Total Providers</p></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-green-600">68</p><p className="text-gray-500">Active Subscriptions</p></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-red-500">99.9%</p><p className="text-gray-500">System Uptime</p></Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
