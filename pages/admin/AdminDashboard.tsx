import React from 'react';
import Card from '../../components/shared/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UsersIcon, BriefcaseIcon, ShieldCheckIcon, CollectionIcon as SubscriptionIcon } from '../../components/shared/Icons';

// --- MOCK DATA (unchanged) ---
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

const recentSystemActivity = [
  { timestamp: '2024-08-15 10:32', user: 'Dr. Jane Smith', action: 'Login Success', details: 'Logged in from IP 192.168.1.1' },
  { timestamp: '2024-08-15 09:45', user: 'Alex Johnson', action: 'Update Settings', details: 'Updated system feature flags' },
  { timestamp: '2024-08-15 09:10', user: 'John Doe', action: 'Payment Submitted', details: 'Submitted payment of $50.00' },
  { timestamp: '2024-08-14 15:20', user: 'Dr. Jane Smith', action: 'E-Prescription', details: 'Sent Rx for Alice Johnson' },
  { timestamp: '2024-08-14 14:05', user: 'Alex Johnson', action: 'Login Failed', details: 'Failed login attempt for user: admin_support' },
];


// --- Custom Tooltip for Charts ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-sm p-3 border border-gray-200 rounded-lg shadow-lg animate-fade-in">
        <p className="font-bold text-gray-700 mb-2">{label}</p>
        {payload.map((pld: any) => (
          <div key={pld.dataKey} className="flex items-center space-x-2">
             <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: pld.stroke || pld.fill }} />
             <p className="text-sm font-medium text-gray-600">
                {`${pld.name}: `}<span className="font-bold text-gray-800">{pld.value}</span>
             </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};


// --- REFACTORED Metric Card Component ---
const MetricCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  style: React.CSSProperties;
  iconBgColor: string;
}> = ({ icon, title, value, style, iconBgColor }) => (
    <Card style={style} className="p-4">
       <div className="flex items-center">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor}`}>
                {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6 text-white" })}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
       </div>
    </Card>
);

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Key Metrics Section */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stagger-list">
        <MetricCard icon={<UsersIcon />} title="Total Patients" value="820" style={{'--stagger-index': 1} as React.CSSProperties} iconBgColor="bg-blue-500" />
        <MetricCard icon={<BriefcaseIcon />} title="Total Providers" value="75" style={{'--stagger-index': 2} as React.CSSProperties} iconBgColor="bg-tangerine" />
        <MetricCard icon={<SubscriptionIcon />} title="Active Subscriptions" value="68" style={{'--stagger-index': 3} as React.CSSProperties} iconBgColor="bg-emerald-500" />
        <MetricCard icon={<ShieldCheckIcon />} title="System Uptime" value="99.9%" style={{'--stagger-index': 4} as React.CSSProperties} iconBgColor="bg-slate-500" />
      </div>

      {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 stagger-list">
            <Card title="User Growth (Last 6 Months)" className="lg:col-span-2" style={{'--stagger-index': 5} as React.CSSProperties}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip cursor={{ stroke: 'hsl(210 10% 80%)', strokeWidth: 1, strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Legend />
                        <Line type="monotone" dataKey="Patients" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="Providers" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
            <Card title="Subscription Plan Distribution" style={{'--stagger-index': 6} as React.CSSProperties}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={planDistributionData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}}/>
                        <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} content={<CustomTooltip />} />
                        <Bar dataKey="count" fill="#10b981" name="No. of Providers" barSize={20}/>
                    </BarChart>
                </ResponsiveContainer>
            </Card>
       </div>
       
      {/* System Health & Activity Section */}
       <div className="stagger-list">
           <Card title="Recent System Activity" style={{'--stagger-index': 7} as React.CSSProperties}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {recentSystemActivity.map((activity, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{activity.timestamp}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.user}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {activity.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.details}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <a href="#/compliance" className="text-sm font-semibold text-primary-600 hover:underline mt-4 inline-block w-full text-center">View Full Audit Log &rarr;</a>
            </Card>
       </div>
    </div>
  );
};

export default AdminDashboard;