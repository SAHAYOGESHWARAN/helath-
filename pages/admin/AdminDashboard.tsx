import React from 'react';
import Card from '../../components/shared/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: The `SubscriptionIcon` is not exported from `Icons.tsx`. `CollectionIcon` is used for subscriptions and is aliased here for consistency.
import { UsersIcon, BriefcaseIcon, ShieldCheckIcon, CollectionIcon as SubscriptionIcon } from '../../components/shared/Icons';

const userGrowthData = [
  { month: 'Mar', Patients: 120, Providers: 15 },
  { month: 'Apr', Patients: 180, Providers: 22 },
  { month: 'May', Patients: 250, Providers: 30 },
  { month: 'Jun', Patients: 400, Providers: 45 },
  { month: 'Jul', Patients: 650, Providers: 60 },
  { month: 'Aug', Patients: 820, Providers: 75 },
];

const planDistributionData = [
    { name: 'Basic Tier', count: 35 },
    { name: 'Pro Tier', count: 28 },
    { name: 'Enterprise', count: 5 },
];

const recentActivity = [
    { user: 'Dr. Jane Smith', action: 'Upgraded to Pro Tier', time: '2h ago' },
    { user: 'Alex Johnson', action: 'Updated system settings', time: '5h ago' },
    { user: 'New Patient', action: 'Account created: B.Wayne', time: '1d ago' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-list">
        <Card className="flex items-center" style={{'--stagger-index': 1} as React.CSSProperties}>
            <UsersIcon className="w-10 h-10 text-primary-500 bg-primary-100 p-2 rounded-lg"/>
            <div className="ml-4">
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">820</p>
            </div>
        </Card>
         <Card className="flex items-center" style={{'--stagger-index': 2} as React.CSSProperties}>
            <BriefcaseIcon className="w-10 h-10 text-tangerine bg-tangerine-light/50 p-2 rounded-lg"/>
            <div className="ml-4">
                <p className="text-sm text-gray-500">Total Providers</p>
                <p className="text-2xl font-bold text-gray-800">75</p>
            </div>
        </Card>
        <Card className="flex items-center" style={{'--stagger-index': 3} as React.CSSProperties}>
            <SubscriptionIcon className="w-10 h-10 text-emerald-500 bg-emerald-100 p-2 rounded-lg"/>
            <div className="ml-4">
                <p className="text-sm text-gray-500">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-800">68</p>
            </div>
        </Card>
        <Card className="flex items-center" style={{'--stagger-index': 4} as React.CSSProperties}>
            <ShieldCheckIcon className="w-10 h-10 text-red-500 bg-red-100 p-2 rounded-lg"/>
            <div className="ml-4">
                <p className="text-sm text-gray-500">System Uptime</p>
                <p className="text-2xl font-bold text-gray-800">99.9%</p>
            </div>
        </Card>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 stagger-list">
            <Card title="User Growth (Last 6 Months)" className="lg:col-span-2" style={{'--stagger-index': 5} as React.CSSProperties}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="Patients" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Providers" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            <Card title="Recent System Activity" style={{'--stagger-index': 6} as React.CSSProperties}>
                 <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="flex">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                {activity.user.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                                <p className="text-sm text-gray-500">{activity.action} - <span className="italic">{activity.time}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
                 <a href="#/compliance" className="text-sm font-semibold text-primary-600 hover:underline mt-4 inline-block w-full text-center">View Full Audit Log &rarr;</a>
            </Card>
       </div>
       <div className="mt-8 stagger-list" style={{'--stagger-index': 7} as React.CSSProperties}>
            <Card title="Subscription Plan Distribution">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={planDistributionData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80}/>
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" name="Providers" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
       </div>
    </div>
  );
};

export default AdminDashboard;