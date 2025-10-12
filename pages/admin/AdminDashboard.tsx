import React from 'react';
import Card from '../../components/shared/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { UsersIcon, BriefcaseIcon, ShieldCheckIcon, CollectionIcon as SubscriptionIcon, HomeIcon, ChartBarIcon, CurrencyDollarIcon, ShieldExclamationIcon } from '../../components/shared/Icons';
import Tabs from '../../components/shared/Tabs';

// --- MOCK DATA ---
const userGrowthData = [
  { month: 'Mar', Patients: 120, Providers: 15 }, { month: 'Apr', Patients: 180, Providers: 22 },
  { month: 'May', Patients: 250, Providers: 30 }, { month: 'Jun', Patients: 400, Providers: 45 },
  { month: 'Jul', Patients: 650, Providers: 60 }, { month: 'Aug', Patients: 820, Providers: 75 },
];
const planDistributionData = [ { name: 'Basic', count: 35 }, { name: 'Pro', count: 28 }, { name: 'Enterprise', count: 5 } ];
const mrrData = [
  { month: 'Mar', mrr: 3867 }, { month: 'Apr', mrr: 5241 }, { month: 'May', mrr: 7050 },
  { month: 'Jun', mrr: 10125 }, { month: 'Jul', mrr: 14700 }, { month: 'Aug', mrr: 18075 },
];
const engagementData = [
  { month: 'Mar', DAU: 80, MAU: 135 }, { month: 'Apr', DAU: 110, MAU: 202 }, { month: 'May', DAU: 150, MAU: 280 },
  { month: 'Jun', DAU: 230, MAU: 445 }, { month: 'Jul', DAU: 350, MAU: 710 }, { month: 'Aug', DAU: 450, MAU: 895 },
];
const apiResponseData = [
    { hour: "12:00", p95: 120, p99: 250 }, { hour: "13:00", p95: 130, p99: 260 },
    { hour: "14:00", p95: 125, p99: 255 }, { hour: "15:00", p95: 140, p99: 300 },
    { hour: "16:00", p95: 135, p99: 280 }, { hour: "17:00", p95: 150, p99: 310 },
];
const recentSystemActivity = [
  { timestamp: '10:32', user: 'Dr. Smith', action: 'Login Success', details: 'IP 192.168.1.1' },
  { timestamp: '09:45', user: 'A. Johnson', action: 'Update Settings', details: 'Updated feature flags' },
  { timestamp: '09:10', user: 'J. Doe', action: 'Payment Submitted', details: '$50.00' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-bold text-gray-700 mb-2">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} className="flex items-center space-x-2">
             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.stroke || pld.fill }} />
             <p className="text-sm font-medium text-gray-600">
                {`${pld.name}: `}<span className="font-bold text-gray-800">{pld.value.toLocaleString()}</span>
             </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const MetricCard: React.FC<{ icon: React.ReactNode; title: string; value: string; iconBgColor: string; }> = ({ icon, title, value, iconBgColor }) => (
    <Card className="p-4">
       <div className="flex items-center">
            <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
                {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6 text-white" })}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
       </div>
    </Card>
);

const ActionableAlert: React.FC<{ icon: React.ReactNode; text: string; link: string; color: string; }> = ({ icon, text, link, color }) => (
    <div className={`p-3 rounded-lg flex items-center justify-between border-l-4 ${color}`}>
        <div className="flex items-center">
            {icon}
            <p className="ml-3 text-sm font-medium text-gray-800">{text}</p>
        </div>
        <a href={link} className="text-sm font-semibold text-primary-600 hover:underline">View</a>
    </div>
);

const OverviewTab = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard icon={<UsersIcon />} title="Total Patients" value="820" iconBgColor="bg-blue-500" />
            <MetricCard icon={<BriefcaseIcon />} title="Total Providers" value="75" iconBgColor="bg-accent" />
            <MetricCard icon={<SubscriptionIcon />} title="Active Subscriptions" value="68" iconBgColor="bg-emerald-500" />
            <MetricCard icon={<CurrencyDollarIcon />} title="MRR" value="$18,075" iconBgColor="bg-amber-500" />
        </div>

        <Card title="Actionable Alerts">
            <div className="space-y-3">
                 <ActionableAlert 
                    icon={<UsersIcon className="w-5 h-5 text-blue-600"/>} 
                    text="3 New provider applications are pending review."
                    link="#/users"
                    color="border-blue-500 bg-blue-50"
                />
                <ActionableAlert 
                    icon={<ShieldExclamationIcon className="w-5 h-5 text-amber-600"/>} 
                    text="System performance degraded: API P99 latency is high."
                    link="#/admin/dashboard" // Link to system health tab
                    color="border-amber-500 bg-amber-50"
                />
            </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card title="Monthly Recurring Revenue (MRR)">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mrrData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="mrr" stroke="#3b82f6" fill="#bfdbfe" name="MRR" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
            <Card title="User Growth (Last 6 Months)">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="Patients" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="Providers" stroke="#14b8a6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </div>
    </div>
);

const UserAnalyticsTab = () => (
    <div className="space-y-6">
         <Card title="User Engagement (DAU/MAU)">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="DAU" name="Daily Active Users" stroke="#8884d8" />
                    <Line type="monotone" dataKey="MAU" name="Monthly Active Users" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
        <Card title="User Growth (Last 6 Months)">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="Patients" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="Providers" stroke="#14b8a6" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    </div>
);

const FinancialsTab = () => (
     <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard icon={<CurrencyDollarIcon />} title="New MRR (This Month)" value="$3,375" iconBgColor="bg-emerald-500" />
            <MetricCard icon={<CurrencyDollarIcon className="text-red-500"/>} title="Churn Rate" value="1.2%" iconBgColor="bg-red-500" />
            <MetricCard icon={<CurrencyDollarIcon />} title="ARPU" value="$265.80" iconBgColor="bg-slate-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card title="Monthly Recurring Revenue (MRR)">
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mrrData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="mrr" stroke="#3b82f6" fill="#bfdbfe" name="MRR" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
             <Card title="Subscription Plan Distribution">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={planDistributionData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={60}/>
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#10b981" name="Providers"/>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    </div>
);

const SystemHealthTab = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="API Response Times (ms)">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={apiResponseData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="p95" name="P95 Latency" stroke="#f59e0b" />
                        <Line type="monotone" dataKey="p99" name="P99 Latency" stroke="#ef4444" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            <Card title="System Metrics">
                <div className="space-y-4">
                    <MetricCard icon={<ShieldCheckIcon />} title="System Uptime" value="99.98%" iconBgColor="bg-emerald-500" />
                    <MetricCard icon={<ShieldExclamationIcon />} title="Error Rate (24h)" value="0.02%" iconBgColor="bg-slate-500" />
                </div>
            </Card>
        </div>
        <Card title="Recent System Activity">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {recentSystemActivity.map((activity, index) => (
                        <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-mono">{activity.timestamp}</td>
                            <td className="px-4 py-3 whitespace-nowrap font-medium">{activity.user}</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{activity.action}</span></td>
                            <td className="px-4 py-3 text-sm text-gray-500">{activity.details}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Card>
    </div>
);


const AdminDashboard: React.FC = () => {
    const tabs = [
        { name: 'Overview', icon: <HomeIcon />, content: <OverviewTab /> },
        { name: 'User Analytics', icon: <ChartBarIcon />, content: <UserAnalyticsTab /> },
        { name: 'Financials', icon: <CurrencyDollarIcon />, content: <FinancialsTab /> },
        { name: 'System Health', icon: <ShieldCheckIcon />, content: <SystemHealthTab /> },
    ];

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <Card className="p-0">
                <Tabs tabs={tabs} />
            </Card>
        </div>
    );
};

export default AdminDashboard;
