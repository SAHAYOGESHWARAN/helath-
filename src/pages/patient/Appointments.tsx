
import React, { useState, useMemo } from 'react';
// FIX: Use `react-router-dom` for web-specific components.
import { Link } from 'react-router-dom';
import { Card } from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment, ReminderSettings } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { ClockIcon, VideoCameraIcon, UsersIcon, CameraIcon, ChevronDownIcon, SpinnerIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import VideoUpdateModal from './VideoUpdateModal';
import ScheduleAppointmentModal from './ScheduleAppointmentModal';
import Modal from '../../components/shared/Modal';

const getStatusPill = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const AppointmentDetails: React.FC<{ appointment: Appointment; onAddVideo: () => void }> = ({ appointment, onAddVideo }) => (
    <div className="px-4 pb-4 border-t border-gray-200">
        <div className="mt-4 space-y-4 text-sm">
            {appointment.visitSummary && (
                <div>
                    <p className="font-medium text-gray-500">Visit Summary</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{appointment.visitSummary}</p>
                </div>
            )}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-gray-500">Video Progress Updates ({appointment.videoUpdates?.length || 0})</p>
                    <button
                        onClick={onAddVideo}
                        className="flex items-center text-xs font-medium text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full"
                    >
                        <CameraIcon className="w-4 h-4 mr-1.5" />
                        Add Video Update
                    </button>
                </div>
                {appointment.videoUpdates && appointment.videoUpdates.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {appointment.videoUpdates.map(update => (
                            <div key={update.id} className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-primary-400 transition-all duration-200 shadow-sm">
                                <video src={update.videoUrl} controls className="w-full h-24 object-cover bg-black" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    {new Date(update.date).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-md">
                        <p className="text-gray-500 text-sm">No video updates for this appointment.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const PatientAppointments: React.FC = () => {
    const { appointments, addAppointment, addVideoUpdateToAppointment, cancelAppointment } = useAuth();
    const { showToast } = useApp();
    const [selectedApptForVideo, setSelectedApptForVideo] = useState<Appointment | null>(null);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [cancellingAppt, setCancellingAppt] = useState<Appointment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sortedAppointments = useMemo(() => {
        const now = new Date();
        now.setHours(0,0,0,0);
        const upcoming = [...appointments].filter(a => new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending')).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const past = [...appointments].filter(a => new Date(a.date) < now || a.status === 'Completed' || a.status === 'Cancelled').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { upcoming, past };
    }, [appointments]);
    
    const handleAppointmentScheduled = (newAppointment: Omit<Appointment, 'id'>, reminder?: ReminderSettings) => {
        addAppointment(newAppointment, reminder);
        showToast('Appointment scheduled! It is now pending confirmation.', 'success');
        setIsScheduleModalOpen(false);
    };

    const handleSendVideo = (videoBlobUrl: string) => {
        if (selectedApptForVideo) {
            addVideoUpdateToAppointment(selectedApptForVideo.id, videoBlobUrl);
            showToast('Video update added successfully!', 'success');
            setSelectedApptForVideo(null);
        }
    };

    const handleAppointmentCancel = () => {
        if (!cancellingAppt) return;
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            cancelAppointment(cancellingAppt.id);
            showToast('Your appointment has been cancelled.', 'success');
            setIsSubmitting(false);
            setCancellingAppt(null);
        }, 500);
    };

    return (
        <div>
            <PageHeader title="Appointments" buttonText="Schedule New Appointment" onButtonClick={() => setIsScheduleModalOpen(true)} />
            
            <div className="space-y-8">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
                    <div className="space-y-4">
                        {sortedAppointments.upcoming.length > 0 ? sortedAppointments.upcoming.map(appt => {
                            const isVirtual = appt.location === 'Virtual';
                            const appointmentDateTime = new Date(`${appt.date}T${appt.time}:00`);
                            const canJoin = isVirtual && appointmentDateTime.getTime() - Date.now() < 15 * 60 * 1000;

                            return (
                             <details key={appt.id} className="group border border-gray-200 rounded-lg bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                 <summary className="p-4 flex flex-wrap justify-between items-center cursor-pointer list-none gap-y-3">
                                     <div className="flex items-center space-x-4 flex-grow min-w-[250px]">
                                         <div className="flex flex-col items-center justify-center bg-primary-50 text-primary-700 rounded-lg p-3 w-20 text-center">
                                             <span className="text-sm font-bold uppercase">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' })}</span>
                                             <span className="text-2xl font-extrabold">{new Date(appt.date).getUTCDate()}</span>
                                         </div>
                                         <div>
                                             <p className="font-bold text-lg text-gray-800">{appt.reason}</p>
                                             <p className="text-sm text-gray-600">with {appt.providerName}</p>
                                             <div className="flex items-center text-sm text-gray-500 mt-1">
                                                 <ClockIcon className="w-4 h-4 mr-1.5"/> {appt.time} ({appt.duration} min) <span className="mx-2">|</span> {isVirtual ? <VideoCameraIcon className="w-4 h-4 mr-1.5"/> : <UsersIcon className="w-4 h-4 mr-1.5"/>} {appt.location}
                                             </div>
                                         </div>
                                     </div>
                                     <div className="flex items-center justify-end space-x-3 w-full sm:w-auto">
                                         <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                                          {(appt.status === 'Confirmed' || appt.status === 'Pending') && (
                                            <>
                                                <button onClick={(e) => { e.stopPropagation(); showToast('Please call our office to reschedule.', 'info'); }} className="text-xs font-semibold text-primary-600 hover:underline">Reschedule</button>
                                                <button onClick={(e) => { e.stopPropagation(); setCancellingAppt(appt); }} className="text-xs font-semibold text-red-600 hover:underline">Cancel</button>
                                            </>
                                         )}
                                         {isVirtual && (
                                            <Link to="/patient/video-consults">
                                                <button disabled={!canJoin} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed">
                                                    <VideoCameraIcon className="w-4 h-4 mr-2" /> Join Call
                                                </button>
                                            </Link>
                                         )}
                                         <ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
                                     </div>
                                 </summary>
                                 <AppointmentDetails appointment={appt} onAddVideo={() => setSelectedApptForVideo(appt)} />
                             </details>
                        )}) : <p className="text-gray-500">You have no upcoming appointments.</p>}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-4">Past Appointments</h2>
                     <div className="space-y-4">
                        {sortedAppointments.past.length > 0 ? (
                            sortedAppointments.past.map(appt => (
                                <details key={appt.id} className="group border border-gray-200 rounded-lg bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                                    <summary className="p-4 flex justify-between items-center cursor-pointer list-none">
                                        <div>
                                            <p className="font-bold text-lg">{appt.providerName} - {new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            <p className="text-sm text-gray-600">{appt.reason}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                                            <ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
                                        </div>
                                    </summary>
                                    <AppointmentDetails appointment={appt} onAddVideo={() => setSelectedApptForVideo(appt)} />
                                </details>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">You have no past appointments to show.</p>
                        )}
                    </div>
                </Card>
            </div>
            <ScheduleAppointmentModal
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onAppointmentScheduled={handleAppointmentScheduled}
            />
            <VideoUpdateModal
                isOpen={!!selectedApptForVideo}
                onClose={() => setSelectedApptForVideo(null)}
                onSend={handleSendVideo}
            />
            <Modal 
                isOpen={!!cancellingAppt} 
                onClose={() => setCancellingAppt(null)} 
                title="Confirm Appointment Cancellation"
                footer={<>
                    <button onClick={() => setCancellingAppt(null)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors hover:bg-gray-300">Go Back</button>
                    <button onClick={handleAppointmentCancel} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-48 flex justify-center items-center transition-colors hover:bg-red-700">
                        {isSubmitting ? <SpinnerIcon /> : 'Yes, Cancel Appointment'}
                    </button>
                </>}
            >
                {cancellingAppt && <p>Are you sure you want to cancel your appointment with <strong>{cancellingAppt.providerName}</strong> on <strong>{new Date(cancellingAppt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric'})}</strong> at {cancellingAppt.time}?</p>}
            </Modal>
        </div>
    );
};

export default PatientAppointments;