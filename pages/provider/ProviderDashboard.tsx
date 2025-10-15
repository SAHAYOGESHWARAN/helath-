import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { DocumentTextIcon, PillIcon, ShareIcon, BellIcon } from '../../components/shared/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import SkeletonCard from '../../components/shared/skeletons/SkeletonCard';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment } from '../../types';
import { Link } from 'react-router-dom';

const patientVolumeData = [
    { day: 'Mon', patients: 14 }, { day: 'Tue', patients: 18 }, { day: 'Wed', patients: 16 },
    { day: 'Thu', patients: 20 }, { day: 'Fri', patients: 12 }, { day: 'Sat', patients: 5 },
];

const satisfactionData = [
    { month: 'Mar', rating: 4.5 }, { month: 'Apr', rating: 4.6 }, { month: 'May', rating: 4.8 },
    { month: 'Jun', rating: 4.7 }, { month: 'Jul', rating: 4.9 }, { month: 'Aug', rating: 4.8 },
];

const getStatusPill = (status: string) => {
    switch (status) {
        case 'Checked-In': return 'bg-emerald-100 text-emerald-800';
        case 'Waiting': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const ProviderDashboard: React.FC = () => {
    const { user, appointments, progressNotes, prescriptions } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 350);
      return () => clearTimeout(timer);
    }, []);

    const todaysSchedule = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return appointments
            .filter(a => a.date === todayStr && a.providerId === user?.id && a.status !== 'Cancelled')
            .sort((a,b) => a.time.localeCompare(b.time));
    }, [appointments, user]);

    const inboxItems = useMemo(() => {
        const items = [];
        const unsignedNotes = progressNotes.filter(n => n.status === 'Pending Signature');
        const pendingPrescriptions = prescriptions.filter(p => p.status === 'Pending');
        const pendingAppointments = appointments.filter(a => a.status === 'Pending' && a.providerId === user?.id);

        if (unsignedNotes.length > 0) {
            items.push({ id: 'inbox_notes', type: 'Note', description: `Sign ${unsignedNotes.length} pending note(s)`, icon: <DocumentTextIcon className="w-5 h-5 text-amber-600"/>, actionText: "Review & Sign", link: '/progress-notes' });
        }
        if (pendingPrescriptions.length > 0) {
            items.push({ id: 'inbox_rx', type: 'Refill', description: `Approve ${pendingPrescriptions.length} refill request(s)`, icon: <PillIcon className="w-5 h-5 text-emerald-600"/>, actionText: "Approve/Deny", link: '/e-prescribing' });
        }
         if (pendingAppointments.length > 0) {
            items.push({ id: 'inbox_appt', type: 'Appointments', description: `You have ${pendingAppointments.length} new appointment requests`, icon: <BellIcon className="w-5 h-5 text-red-600"/>, actionText: "View", link: '/appointments' });
        }
        
        return items;
    }, [progressNotes, prescriptions, appointments, user]);

    if (isLoading) {
        return (
            <div>
                <div className="h-10 w-3/5 rounded-lg shimmer-bg mb-2"></div>
                <div className="h-6 w-2/5 rounded-lg shimmer-bg mb-8"></div>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3 flex flex-col gap-6"><SkeletonCard className="h-full" /><SkeletonCard /></div>
                    <div className="lg:col-span-2"><SkeletonCard className="h-full" /></div>
                </div>
            </div>
        );
    }

  return (
    <div>
      <PageHeader 
        title={`Welcome back, Dr. ${user?.name?.split(' ').slice(1).join(' ')}!`}
        subtitle={`You have ${inboxItems.length} items needing your attention.`}
      />

       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 stagger-list lg:items-stretch">
            <div className="lg:col-span-3 flex flex-col gap-6">
                 <Card title="Provider Inbox" className="h-full flex flex-col" style={{'--stagger-index': 1} as React.CSSProperties}>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 flex-grow">
                        {inboxItems.length > 0 ? inboxItems.map(item => (
                            <div key={item.id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">{item.icon}</div>
                                <div className="flex-1 ml-3"><p className="font-semibold text-gray-800 text-sm">{item.description}</p></div>
                                <Link to={item.link} className="text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-md">{item.actionText}</Link>
                            </div>
                        )) : <p className="text-center text-gray-500 py-4">Your inbox is clear!</p>}
                    </div>
                </Card>
                <Card title="Practice Metrics" style={{'--stagger-index': 3} as React.CSSProperties}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Patient Volume (Last Week)</h4>
                             <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={patientVolumeData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" tick={{ fill: '#6b7281', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#6b7281', fontSize: 12 }} allowDecimals={false}/><Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}/>
                                    <Bar dataKey="patients" fill="#3b82f6" name="Patients Seen" barSize={20} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Patient Satisfaction</h4>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={satisfactionData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" tick={{ fill: '#6b7281', fontSize: 12 }} />
                                    <YAxis domain={[4, 5]} tick={{ fill: '#6b7281', fontSize: 12 }} /><Tooltip />
                                    <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={2} name="Avg Rating" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card title="Today's Schedule" style={{'--stagger-index': 2} as React.CSSProperties} className="h-full flex flex-col">
                     <div className="space-y-3 max-h-[670px] overflow-y-auto pr-2 flex-grow">
                        {todaysSchedule.length > 0 ? todaysSchedule.map((appt: Appointment) => (
                            <div key={appt.id} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="w-20 text-sm font-semibold text-primary-600">{appt.time}</div>
                                <div className="flex-1 border-l border-gray-300 pl-3">
                                    <p className="font-semibold text-gray-800">{appt.patientName}</p>
                                    <p className="text-sm text-gray-500">{appt.reason}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.checkInStatus || appt.status)}`}>{appt.checkInStatus || appt.status}</span>
                            </div>
                        )) : <p className="text-center text-gray-500 py-8">No appointments scheduled for today.</p>}
                    </div>
                </Card>
            </div>
       </div>
    </div>
  );
};

export default ProviderDashboard;