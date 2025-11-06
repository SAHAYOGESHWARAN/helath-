
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
    DocumentTextIcon,
    PillIcon,
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    CheckCircleIcon,
    VideoCameraIcon,
    CalendarIcon,
    ClockIcon,
    HandThumbUpIcon,
    UserMinusIcon
} from '../../components/shared/Icons';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import SkeletonCard from '../../components/shared/skeletons/SkeletonCard';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment } from '../../types';
// FIX: Use `react-router-dom` for web-specific components.
import { Link } from 'react-router-dom';
import { Card } from '../../components/shared/Card';

const KpiCard: React.FC<{icon: React.ReactNode, title: string, value: string | number, colorClassName: string;}> = ({icon, title, value, colorClassName}) => (
    <Card className={`flex items-center p-4 border-l-4 ${colorClassName} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    </Card>
);

const AppointmentStatusChart: React.FC<{appointments: Appointment[]}> = ({appointments}) => {
    const data = useMemo(() => {
        const counts = appointments.reduce((acc, appt) => {
            const status = appt.checkInStatus || appt.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [appointments]);

    const COLORS = {
        'Scheduled': '#3b82f6',
        'Checked-In': '#10b981',
        'Complete': '#6b7281',
        'Waiting': '#f59e0b',
        'Confirmed': '#3b82f6',
        'Pending': '#f59e0b',
    };

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#cccccc'} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

const getStatusPill = (status: string) => {
    switch (status) {
        case 'Checked-In': return 'bg-emerald-100 text-emerald-800';
        case 'Pending': return 'bg-amber-100 text-amber-800';
        case 'Confirmed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const getUrgencyBorder = (urgency: 'High' | 'Medium' | 'Low') => {
    switch (urgency) {
      case 'High': return 'border-l-4 border-red-500';
      case 'Medium': return 'border-l-4 border-amber-500';
      case 'Low': return 'border-l-4 border-blue-500';
      default: return 'border-l-4 border-gray-300';
    }
};

const ProviderDashboard: React.FC = () => {
    const { user, appointments, progressNotes, prescriptions, messages, users } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 350);
      return () => clearTimeout(timer);
    }, []);

    const todaysAppointments = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return appointments.filter(a => a.date === todayStr && a.providerId === user?.id && a.status !== 'Cancelled');
    }, [appointments, user]);

    const waitingRoom = useMemo(() => {
        return todaysAppointments.filter(a => a.checkInStatus === 'Waiting');
    }, [todaysAppointments]);
    
    const recentActivity = useMemo(() => {
        const allMessages = [].concat(...Object.values(messages))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map(m => {
                const patient = users.find(u => u.id === m.senderId);
                return {
                    ...m,
                    patientName: patient ? patient.name : 'Unknown Patient',
                };
            });

        const activities = [
            ...allMessages.slice(0, 2).map(m => ({ id: `msg-${m.id}`, type: 'New Message', description: `From ${m.patientName}`, time: '5m ago', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 text-sky-600"/>, link: '/provider/messaging' })),
            ...progressNotes.filter(n => n.status === "Signed").slice(0, 1).map(n => ({ id: `note-${n.id}`, type: 'Note Signed', description: `For ${n.patientName}`, time: '45m ago', icon: <CheckCircleIcon className="w-5 h-5 text-emerald-600"/>, link: `/provider/patients/${n.patientId}` })),
            ...appointments.filter(a => a.status === 'Completed').slice(0, 2).map(a => ({ id: `appt-${a.id}`, type: 'Appointment Complete', description: `${a.patientName} - ${a.reason}`, time: '2h ago', icon: <CalendarIcon className="w-5 h-5 text-gray-500"/>, link: `/provider/patients/${a.patientId}` }))
        ];
        return activities.sort(() => Math.random() - 0.5); // Randomize for demo
    }, [messages, progressNotes, appointments, users]);

    if (isLoading) {
        return (
             <div>
                <div className="h-10 w-3/5 rounded-lg shimmer-bg mb-2"></div>
                <div className="h-6 w-2/5 rounded-lg shimmer-bg mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {[...Array(4)].map((_, i) => <SkeletonCard key={i} className="h-28" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <SkeletonCard className="lg:col-span-2 h-96" />
                    <SkeletonCard className="h-96" />
                </div>
            </div>
        );
    }

    const unsignedNotes = progressNotes.filter(n => n.status === 'Pending Signature').length;
    
    const mockInbox: any[] = [];

  return (
    <div>
      <PageHeader 
        title={`Welcome back, Dr. ${user?.name?.split(' ').slice(-1).join(' ')}`}
        subtitle="Here’s a snapshot of your practice today."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard icon={<CalendarIcon className="w-8 h-8 text-blue-500"/>} title="Appointments Today" value={todaysAppointments.length} colorClassName="border-blue-500" />
        <KpiCard icon={<HandThumbUpIcon className="w-8 h-8 text-emerald-500"/>} title="Patient Satisfaction" value="N/A" colorClassName="border-emerald-500" />
        <KpiCard icon={<ClockIcon className="w-8 h-8 text-amber-500"/>} title="Avg. Wait Time" value="0 min" colorClassName="border-amber-500" />
        <KpiCard icon={<UserMinusIcon className="w-8 h-8 text-red-500"/>} title="No-Show Rate" value="0%" colorClassName="border-red-500" />
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Today's Appointments</h3>
                     <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {todaysAppointments.length > 0 ? todaysAppointments.sort((a,b) => a.time.localeCompare(b.time)).map((appt: Appointment) => (
                            <div key={appt.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-primary-50 hover:shadow-sm transition-all">
                                <div className="w-20 text-sm font-bold text-gray-800">{appt.time}</div>
                                <div className="flex-1 border-l-2 border-gray-300 pl-4">
                                    <p className="font-semibold text-gray-900">{appt.patientName}</p>
                                    <p className="text-sm text-gray-600">{appt.reason}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.checkInStatus || appt.status)}`}>{appt.checkInStatus || appt.status}</span>
                                     <Link to={`/provider/patients/${appt.patientId}`} className="text-primary-600 hover:underline text-xs font-semibold">View Chart</Link>
                                     {appt.location === 'Virtual' && (
                                         <Link to="/provider/video-consults" className="bg-emerald-500 text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-emerald-600">
                                             Start Visit
                                         </Link>
                                     )}
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500 py-8">No appointments scheduled for today.</p>}
                    </div>
                </div>
            </div>
            <div>
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Appointment Status</h3>
                    {todaysAppointments.length > 0 ? <AppointmentStatusChart appointments={todaysAppointments} /> : <p className="text-sm text-center text-gray-500 flex-grow flex items-center justify-center">No appointment data for today.</p>}
                </div>
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div>
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Task Inbox ({mockInbox.length})</h3>
                    <div className="space-y-3">
                        {mockInbox.length > 0 ? mockInbox.map(item => (
                            <Link to={item.link} key={item.id} className={`flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer ${getUrgencyBorder(item.urgency as 'High' | 'Medium' | 'Low')}`}>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">{item.icon}</div>
                                <div className="flex-1 ml-3">
                                    <p className="font-semibold text-gray-800 text-sm">{item.description}</p>
                                </div>
                            </Link>
                        )) : <p className="text-sm text-center text-gray-500 py-4">Inbox is empty.</p>}
                    </div>
                </div>
            </div>
             <div className="lg:col-span-2">
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map(item => (
                            <Link to={item.link} key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">{item.icon}</div>
                                <div className="flex-1 ml-3">
                                    <p className="font-semibold text-gray-800 text-sm">{item.type}</p>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                                <span className="text-xs text-gray-400">{item.time}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
       </div>
    </div>
  );
};

export default ProviderDashboard;