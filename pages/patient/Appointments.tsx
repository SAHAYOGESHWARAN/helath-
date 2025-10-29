import React, { useState, useMemo } from 'react';
// FIX: The error indicates a module resolution problem. `Link` is a valid export. Assuming this will be resolved by fixing other react-router-dom issues.
import { Link } from 'react-router-dom';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment } from '../../types';
import { useApp } from '../../App';
import { ClockIcon, VideoCameraIcon, UsersIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';

const getStatusPill = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const PatientAppointments: React.FC = () => {
    const { appointments } = useAuth();

    const sortedAppointments = useMemo(() => {
        const now = new Date();
        now.setHours(0,0,0,0);
        const upcoming = [...appointments].filter(a => new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending')).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const past = [...appointments].filter(a => new Date(a.date) < now || a.status === 'Completed' || a.status === 'Cancelled').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { upcoming, past };
    }, [appointments]);

    return (
        <div>
            <PageHeader title="Appointments" />
            
            <div className="space-y-8">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
                    <div className="space-y-4">
                        {sortedAppointments.upcoming.length > 0 ? sortedAppointments.upcoming.map(appt => {
                            const isVirtual = appt.type === 'Virtual';
                            const appointmentDateTime = new Date(`${appt.date}T${appt.time}`);
                            const canJoin = isVirtual && appointmentDateTime.getTime() - Date.now() < 15 * 60 * 1000;

                            return (
                             <div key={appt.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                                 <div className="flex flex-col sm:flex-row justify-between">
                                     <div className="flex items-center space-x-4 flex-grow">
                                         <div className="flex flex-col items-center justify-center bg-primary-50 text-primary-700 rounded-lg p-3 w-20 text-center">
                                             <span className="text-sm font-bold uppercase">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' })}</span>
                                             <span className="text-2xl font-extrabold">{new Date(appt.date).getUTCDate()}</span>
                                         </div>
                                         <div>
                                             <p className="font-bold text-lg text-gray-800">{appt.reason}</p>
                                             <p className="text-sm text-gray-600">with {appt.providerName}</p>
                                             <div className="flex items-center text-sm text-gray-500 mt-1">
                                                 <ClockIcon className="w-4 h-4 mr-1.5"/> {appt.time} ({appt.duration} min) <span className="mx-2">|</span> {isVirtual ? <VideoCameraIcon className="w-4 h-4 mr-1.5"/> : <UsersIcon className="w-4 h-4 mr-1.5"/>} {appt.type}
                                             </div>
                                         </div>
                                     </div>
                                     <div className="flex items-center justify-end mt-3 sm:mt-0 space-x-3">
                                         <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                                         {isVirtual && (
                                            <Link to="/video-consults">
                                                <button disabled={!canJoin} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed">
                                                    <VideoCameraIcon className="w-4 h-4 mr-2" /> Join Call
                                                </button>
                                            </Link>
                                         )}
                                     </div>
                                 </div>
                             </div>
                        )}) : <p className="text-gray-500">You have no upcoming appointments.</p>}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-4">Past Appointments</h2>
                     <div className="space-y-4">
                        {sortedAppointments.past.length > 0 ? (
                            sortedAppointments.past.map(appt => (
                                 <div key={appt.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                                     <p className="font-bold text-lg">{appt.providerName} - {new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                                     <p className="text-sm">{appt.reason}</p>
                                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                                 </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">You have no past appointments to show.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PatientAppointments;