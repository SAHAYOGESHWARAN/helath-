import React from 'react';
import Card from '../../components/shared/Card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PageHeader from '../../components/shared/PageHeader';

const appointmentData = [
  { name: 'Mon', count: 12 }, { name: 'Tue', count: 15 }, { name: 'Wed', count: 18 },
  { name: 'Thu', count: 14 }, { name: 'Fri', count: 10 },
];
const demographicData = [
  { name: '0-18', value: 120 }, { name: '19-40', value: 300 },
  { name: '41-65', value: 250 }, { name: '65+', value: 150 },
];
const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

const ProviderReports: React.FC = () => {
  return (
    <div>
      <PageHeader title="Practice Reports" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="text-center"><p className="text-3xl font-bold text-primary-600">69</p><p className="text-gray-500">Appointments This Week</p></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-tangerine">820</p><p className="text-gray-500">Active Patients</p></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-green-600">95%</p><p className="text-gray-500">Billing Success Rate</p></Card>
        <Card className="text-center"><p className="text-3xl font-bold text-red-500">3</p><p className="text-gray-500">No-shows This Week</p></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Appointments This Week">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Patient Demographics (By Age)">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={demographicData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label>
                {demographicData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default ProviderReports;