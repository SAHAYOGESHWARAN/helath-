
import React, { useMemo, useCallback } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ArrowTrendingUpIcon, UserPlusIcon, BanknotesIcon, ClockIcon, CalendarIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || rows.length === 0) {
        return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
        keys.join(separator) +
        '\n' +
        rows.map(row => {
            return keys.map(k => {
                let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
                cell = String(cell).replace(/"/g, '""');
                if (String(cell).includes(separator) || String(cell).includes('\n')) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(separator);
        }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

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
    const { users, invoices, appointments } = useAuth();

    const reportData = useMemo(() => {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        
        const newUsersThisMonth = users.filter(u => u.createdAt && new Date(u.createdAt) > lastMonth).length;
        const revenueThisMonth = invoices.filter(i => i.status === 'Paid' && new Date(i.date) > lastMonth).reduce((sum, i) => sum + i.totalAmount, 0);
        const appointmentsThisMonth = appointments.filter(a => new Date(a.date) > lastMonth).length;

        const userGrowthData = Array.from({length: 6}, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' });
            return {
                name: monthName,
                Patients: users.filter(u => u.role === UserRole.PATIENT && u.createdAt && new Date(u.createdAt) <= d).length,
                Providers: users.filter(u => u.role === UserRole.PROVIDER && u.createdAt && new Date(u.createdAt) <= d).length
            };
        });
        
        const revenueData = Array.from({length: 6}, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
            const monthName = d.toLocaleString('default', { month: 'short' });
            const monthRevenue = invoices.filter(inv => inv.status === 'Paid' && new Date(inv.date).getMonth() === d.getMonth() && new Date(inv.date).getFullYear() === d.getFullYear()).reduce((sum, inv) => sum + inv.totalAmount, 0);
            return { name: monthName, MRR: monthRevenue };
        });

        const appointmentTypeData = appointments.reduce((acc, appt) => {
            const week = `Week ${Math.ceil(new Date(appt.date).getDate() / 7)}`;
            let weekData = acc.find(w => w.name === week);
            if (!weekData) {
                weekData = { name: week, 'In-Person': 0, Virtual: 0 };
                acc.push(weekData);
            }
            if (appt.location === 'Virtual') weekData.Virtual++;
            else weekData['In-Person']++;
            return acc;
        }, [] as {name: string, 'In-Person': number, Virtual: number}[]);

        const engagementData = [
            { name: 'Active', value: users.filter(u => u.status === 'Active').length },
            { name: 'Inactive', value: users.filter(u => u.status !== 'Active').length },
        ];
        
        return { newUsersThisMonth, revenueThisMonth, appointmentsThisMonth, userGrowthData, revenueData, appointmentTypeData, engagementData };
    }, [users, invoices, appointments]);

    const handleExport = useCallback(() => {
        const dataToExport = [
            { Report: 'Key Performance Indicators', ...reportData },
            ...reportData.userGrowthData.map(d => ({ Report: 'User Growth', ...d })),
            ...reportData.revenueData.map(d => ({ Report: 'Revenue', ...d })),
        ];
        exportToCsv('admin_report.csv', dataToExport);
    }, [reportData]);

    const COLORS = ['#10b981', '#f87171'];

    return (
        <div className="animate-fade-in-up">
            <PageHeader title="Analytics & Reports" subtitle="Monitor platform growth, revenue, and user engagement." buttonText="Export Report" onButtonClick={handleExport}/>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="New Users" value={String(reportData.newUsersThisMonth)} change="+5.2%" icon={<UserPlusIcon className="w-8 h-8 text-blue-500" />} />
                <KpiCard title="Total Revenue" value={`$${reportData.revenueThisMonth.toLocaleString()}`} change="+12.1%" icon={<BanknotesIcon className="w-8 h-8 text-emerald-500" />} />
                <KpiCard title="Appointments Booked" value={String(reportData.appointmentsThisMonth)} change="+8.3%" icon={<CalendarIcon className="w-8 h-8 text-primary-500" />} />
                <KpiCard title="Avg. Session Duration" value="12 min" change="-1.5%" icon={<ClockIcon className="w-8 h-8 text-amber-500" />} />
            </div>

            <div className="space-y-8">
                <Card title="User Growth Over Time">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={reportData.userGrowthData}>
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
                        <AreaChart data={reportData.revenueData}>
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
                            <BarChart data={reportData.appointmentTypeData}>
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
                                <Pie data={reportData.engagementData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                     {reportData.engagementData.map((entry, index) => (
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