import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ArrowTrendingUpIcon, UserPlusIcon, BanknotesIcon, ClockIcon, CalendarIcon } from '../../components/shared/Icons';

// Mock Data
const userGrowthData = [
  { name: 'Jan', Patients: 120, Providers: 15 },
  { name: 'Feb', Patients: 180, Providers: 22 },
  { name: 'Mar', Patients: 250, Providers: 30 },
  { name: 'Apr', Patients: 400, Providers: 45 },
  { name: 'May', Patients: 650, Providers: 60 },
  { name: 'Jun', Patients: 820, Providers: 75 },
];

const revenueData = [
  { name: 'Jan', MRR: 2400 },
  { name: 'Feb', MRR: 2800 },
  { name: 'Mar', MRR: 3500 },
  { name: 'Apr', MRR: 4200 },
  { name: 'May', MRR: 5100 },
  { name: 'Jun', MRR: 5800 },
];

const appointmentData = [
    { name: 'Jan', 'Virtual': 220, 'In-Person': 340 },
    { name: 'Feb', 'Virtual': 280, 'In-Person': 400 },
    { name: 'Mar', 'Virtual': 350, 'In-Person': 500 },
    { name: 'Apr', 'Virtual': 410, 'In-Person': 580 },
    { name: 'May', 'Virtual': 550, 'In-Person': 700 },
    { name: 'Jun', 'Virtual': 680, 'In-Person': 820 },
];

const engagementData = [
  { name: 'Active Users', value: 895 },
  { name: 'Inactive Users', value: 125 },
];
const COLORS = ['#10b981', '#f87171'];


const KpiCard: React.FC<{ title: string; value: string; change: string; icon: React.ReactNode; }> = ({ title, value, change, icon }) => (
    <Card>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            {icon}
        </div>
        <p className={`text-sm mt-2 flex items-center ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
            <ArrowTrendingUpIcon className={`w-4 h-4 mr-1 ${change.startsWith('-') ? 'rotate-180' : ''}`} />
            {change} vs. last month
        </p>
    </Card>
);

const AdminReports: React.FC = () => {
    return (
        <div className="animate-fade-in-up">
            <PageHeader title="Analytics & Reports" subtitle="Monitor platform growth, revenue, and user engagement." buttonText="Export Report" onButtonClick={() => alert('Exporting report... (mock)')}/>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="New Users" value="132" change="+15.2%" icon={<UserPlusIcon className="w-8 h-8 text-blue-500" />} />
                <KpiCard title="Total Revenue" value="$12,875" change="+8.1%" icon={<BanknotesIcon className="w-8 h-8 text-emerald-500" />} />
                <KpiCard title="Appointments Booked" value="1,502" change="+22.4%" icon={<CalendarIcon className="w-8 h-8 text-primary-500" />} />
                <KpiCard title="Avg. Session Duration" value="18.4 min" change="-2.1%" icon={<ClockIcon className="w-8 h-8 text-amber-500" />} />
            </div>

            <div className="space-y-8">
                <Card title="User Growth Over Time">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={userGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Patients" stroke="#3b82f6" strokeWidth={2} />
                            <Line type="monotone" dataKey="Providers" stroke="#f59e0b" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                 <Card title="Monthly Recurring Revenue (MRR)">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={revenueData}>
                             <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `$${value/1000}k`} />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Legend />
                            <Area type="monotone" dataKey="MRR" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <Card title="Appointment Volume by Type">
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={appointmentData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="In-Person" stackId="a" fill="#3b82f6" />
                                <Bar dataKey="Virtual" stackId="a" fill="#84cc16" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                     <Card title="Platform Engagement">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={engagementData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                     {engagementData.map((entry, index) => (
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
        </div>
    );
};

export default AdminReports;
