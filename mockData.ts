
import React, { useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { UserRole } from '../../types';
import { UsersIcon, ShieldExclamationIcon, CurrencyDollarIcon, CollectionIcon } from '../../components/shared/Icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const { users, invoices, providerSubscriptionPlans } = useAuth();

    const stats = useMemo(() => {
        const providers = users.filter(u => u.role === UserRole.PROVIDER);
        const patients = users.filter(u => u.role === UserRole.PATIENT);
        
        const totalRevenue = providers.reduce((acc, provider) => {
            const plan = providerSubscriptionPlans.find(p => p.id === provider.subscription?.planId);
            if (plan && plan.price.startsWith('$')) {
                return acc + parseFloat(plan.price.replace(/[^0-9.-]+/g,""));
            }
            return acc;
        }, 0);

        return {
            totalUsers: users.length,
            totalProviders: providers.length,
            totalPatients: patients.length,
            pendingVerifications: providers.filter(p => !p.isVerified).length,
            monthlyRevenue: totalRevenue,
        };
    }, [users, invoices, providerSubscriptionPlans]);

    const userRoleData = [
        { name: 'Patients', value: stats.totalPatients },
        { name: 'Providers', value: stats.totalProviders },
        { name: 'Admins', value: users.filter(u => u.role === UserRole.ADMIN).length },
    ];
    
    const revenueData = [
        { month: 'Mar', revenue: 680 }, { month: 'Apr', revenue: 890 }, { month: 'May', revenue: 1150 },
        { month: 'Jun', revenue: 1340 }, { month: 'Jul', revenue: 1580 }, { month: 'Aug', revenue: stats.monthlyRevenue },
    ];

    const COLORS = ['#3b82f6', '#14B8A6', '#6366f1'];

    return (
        <div className="animate-fade-in-up">
            <PageHeader 
                title="Administrator Dashboard"
                subtitle="Oversee and manage the NovoPath Medical platform."
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="flex items-center p-4">
                    <div className="p-3 bg-blue-100 rounded-full mr-4"><UsersIcon className="w-6 h-6 text-blue-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p><p className="text-gray-500">Total Users</p></div>
                </Card>
                <Card className="flex items-center p-4">
                    <div className="p-3 bg-teal-100 rounded-full mr-4"><CollectionIcon className="w-6 h-6 text-teal-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.totalProviders}</p><p className="text-gray-500">Active Providers</p></div>
                </Card>
                 <Card className="flex items-center p-4">
                    <div className="p-3 bg-emerald-100 rounded-full mr-4"><CurrencyDollarIcon className="w-6 h-6 text-emerald-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">${stats.monthlyRevenue.toFixed(2)}</p><p className="text-gray-500">Est. Monthly Revenue</p></div>
                </Card>
                <Card className="flex items-center p-4">
                    <div className="p-3 bg-amber-100 rounded-full mr-4"><ShieldExclamationIcon className="w-6 h-6 text-amber-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.pendingVerifications}</p><p className="text-gray-500">Pending Verifications</p></div>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card title="Revenue Growth (Monthly)">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }} />
                                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" barSize={30} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card title="User Distribution">
                         <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={userRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {userRoleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
             <div className="mt-8">
                <Card title="Quick Actions">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/users" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Manage Users</Link>
                        <Link to="/subscriptions" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">View Subscriptions</Link>
                        <Link to="/billing" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Go to Billing</Link>
                        <Link to="/reports" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Generate Reports</Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;