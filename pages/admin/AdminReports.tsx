import React from 'react';
import Card from '../../components/shared/Card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const revenueData = [
  { name: 'Jan', MRR: 2400 }, { name: 'Feb', MRR: 2800 }, { name: 'Mar', MRR: 3500 },
  { name: 'Apr', MRR: 4200 }, { name: 'May', MRR: 5100 }, { name: 'Jun', MRR: 5800 },
];
const signupData = [
  { name: 'Jan', Patients: 50, Providers: 5 }, { name: 'Feb', Patients: 65, Providers: 7 }, { name: 'Mar', Patients: 80, Providers: 10 },
  { name: 'Apr', Patients: 75, Providers: 8 }, { name: 'May', Patients: 90, Providers: 12 }, { name: 'Jun', Patients: 110, Providers: 15 },
];
const engagementData = [
  { name: 'Day 1', DAU: 300 }, { name: 'Day 2', DAU: 350 }, { name: 'Day 3', DAU: 400 },
  { name: 'Day 4', DAU: 380 }, { name: 'Day 5', DAU: 420 }, { name: 'Day 6', DAU: 450 }, { name: 'Day 7', DAU: 500 },
];

const AdminReports: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics & Reports</h1>
      
      <div className="space-y-8">
        <Card title="Monthly Recurring Revenue (MRR)">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Area type="monotone" dataKey="MRR" stroke="#1d4ed8" fill="#3b82f6" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="New User Signups">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={signupData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Patients" stroke="#3b82f6" />
              <Line type="monotone" dataKey="Providers" stroke="#f59e0b" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <Card title="User Engagement (Daily Active Users - Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="DAU" name="Daily Active Users" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;