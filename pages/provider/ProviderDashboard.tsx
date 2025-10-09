
import React from 'react';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { DocumentTextIcon, BellIcon, PillIcon, ShareIcon } from '../../components/shared/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const todaysSchedule = [
    { time: '09:00 AM', patient: 'John Doe', reason: 'Annual Check-up', status: 'Checked-In' },
    { time: '09:30 AM', patient: 'Alice Johnson', reason: 'Follow-up', status: 'Waiting' },
    { time: '10:00 AM', patient: 'Bob Williams', reason: 'New Patient Consultation', status: 'Waiting' },
    { time: '10:30 AM', patient: 'Charlie Brown', reason: 'Sick Visit', status: 'Confirmed' },
    { time: '11:00 AM', patient: 'Diana Prince', reason: 'Follow-up', status: 'Confirmed' },
];

const patientVolumeData = [
    { day: 'Mon', patients: 14 },
    { day: 'Tue', patients: 18 },
    { day: 'Wed', patients: 16 },
    { day: 'Thu', patients: 20 },
    { day: 'Fri', patients: 12 },
    { day: 'Sat', patients: 5 },
];

const satisfactionData = [
    { month: 'Mar', rating: 4.5 },
    { month: 'Apr', rating: 4.6 },
    { month: 'May', rating: 4.8 },
    { month: 'Jun', rating: 4.7 },
    { month: 'Jul', rating: 4.9 },
    { month: 'Aug', rating: 4.8 },
];

const inboxItems = [
    { id: 1, type: 'Note', description: 'Sign note for John Doe', icon: <DocumentTextIcon className="w-5 h-5 text-amber-600"/>, actionText: "Review & Sign" },
    { id: 2, type: 'Lab', description: 'Review CBC results for Alice Johnson', icon: <DocumentTextIcon className="w-5 h-5 text-blue-600"/>, actionText: "Review" },
    { id: 3, type: 'Refill', description: 'Approve refill for C. Brown (Albuterol)', icon: <PillIcon className="w-5 h-5 text-emerald-600"/>, actionText: "Approve/Deny" },
    { id: 4, type: 'Message', description: 'New message from Diana Prince', icon: <BellIcon className="w-5 h-5 text-red-600"/>, actionText: "Reply" },
    { id: 5, type: 'Referral', description: 'Incoming referral for patient B. Wayne', icon: <ShareIcon className="w-5 h-5 text-purple-600"/>, actionText: "View" },
];

const getStatusPill = (status: string) => {
    switch (status) {
        case 'Checked-In': return 'bg-emerald-100 text-emerald-800';
        case 'Waiting': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const ProviderDashboard: React.FC = () => {
    const { user } = useAuth();
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h1>
      <p className="text-lg text-gray-500 mb-8">You have <span className="font-bold text-primary-600">{inboxItems.length} items</span> needing your attention.</p>

       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 stagger-list">
            {/* Main Column */}
            <div className="lg:col-span-3 flex flex-col gap-6">
                 <Card title="Provider Inbox" className="h-full" style={{'--stagger-index': 1} as React.CSSProperties}>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {inboxItems.map(item => (
                            <div key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:shadow-sm transition-all cursor-pointer">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                    {item.icon}
                                </div>
                                <div className="flex-1 ml-3">
                                    <p className="font-semibold text-gray-800 text-sm">{item.description}</p>
                                </div>
                                <button className="text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-md">{item.actionText}</button>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Practice Metrics" style={{'--stagger-index': 3} as React.CSSProperties}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Patient Volume (Last Week)</h4>
                             <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={patientVolumeData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" tick={{ fill: '#6b7281', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#6b7281', fontSize: 12 }} allowDecimals={false}/>
                                    <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}/>
                                    <Bar dataKey="patients" fill="#3b82f6" name="Patients Seen" barSize={20} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Patient Satisfaction</h4>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={satisfactionData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fill: '#6b7281', fontSize: 12 }} />
                                    <YAxis domain={[4, 5]} tick={{ fill: '#6b7281', fontSize: 12 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="rating" stroke="#10b981" strokeWidth={2} name="Avg Rating" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
            </div>
            {/* Side Column */}
            <div className="lg:col-span-2">
                <Card title="Today's Schedule" style={{'--stagger-index': 2} as React.CSSProperties}>
                     <div className="space-y-3 max-h-[670px] overflow-y-auto pr-2">
                        {todaysSchedule.map(appt => (
                            <div key={appt.time} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <div className="w-20 text-sm font-semibold text-primary-600">{appt.time}</div>
                                <div className="flex-1 border-l border-gray-300 pl-3">
                                    <p className="font-semibold text-gray-800">{appt.patient}</p>
                                    <p className="text-sm text-gray-500">{appt.reason}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
       </div>
    </div>
  );
};

export default ProviderDashboard;