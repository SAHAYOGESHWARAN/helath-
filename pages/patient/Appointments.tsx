
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment } from '../../types';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import { CalendarIcon, ClockIcon, VideoCameraIcon } from '../../components/shared/Icons';

const mockAppointments: Appointment[] = [
  { id: 'appt1', patientName: 'John Doe', providerName: 'Dr. Jane Smith', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '10:30 AM', reason: 'Annual Check-up', type: 'In-Person', status: 'Confirmed' },
  { id: 'appt2', patientName: 'John Doe', providerName: 'Dr. David Chen', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '02:00 PM', reason: 'Dermatology Follow-up', type: 'Virtual', status: 'Confirmed' },
  { id: 'appt3', patientName: 'John Doe', providerName: 'Dr. Emily White', date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '11:00 AM', reason: 'Pediatric Consultation', type: 'In-Person', status: 'Completed', visitSummary: 'Routine check-up, all vitals normal. Discussed nutrition and upcoming vaccinations.' },
  { id: 'appt4', patientName: 'John Doe', providerName: 'Dr. Jane Smith', date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '09:00 AM', reason: 'Sick Visit', type: 'In-Person', status: 'Completed', visitSummary: 'Diagnosed with a common cold. Recommended rest and fluids.' },
];

const getStatusPill = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const AppointmentDetailModal: React.FC<{ appointment: Appointment | null; onClose: () => void; onReschedule: (id: string) => void; onCancel: (id: string) => void }> = ({ appointment, onClose, onReschedule, onCancel }) => {
    if (!appointment) return null;
    return (
        <Modal isOpen={!!appointment} onClose={onClose} title="Appointment Details">
            <div className="space-y-4">
                <p><strong>Provider:</strong> {appointment.providerName}</p>
                <p><strong>Date & Time:</strong> {new Date(appointment.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })} at {appointment.time}</p>
                <p><strong>Reason:</strong> {appointment.reason}</p>
                <p><strong>Type:</strong> {appointment.type}</p>
                {appointment.visitSummary && <p><strong>Visit Summary:</strong> {appointment.visitSummary}</p>}
                <div className="flex justify-end space-x-2 pt-4">
                    {appointment.status === 'Confirmed' && (
                        <>
                            <button onClick={() => { onReschedule(appointment.id); onClose(); }} className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg">Reschedule</button>
                            <button onClick={() => { onCancel(appointment.id); onClose(); }} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};


const PatientAppointments: React.FC = () => {
    const [filter, setFilter] = useState<'Upcoming' | 'Past'>('Upcoming');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const { showToast } = useApp();

    const appointments = useMemo(() => {
        const now = new Date();
        now.setHours(0,0,0,0);
        const upcoming = mockAppointments.filter(a => new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending')).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const past = mockAppointments.filter(a => new Date(a.date) < now || a.status === 'Completed' || a.status === 'Cancelled').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { upcoming, past };
    }, []);

    const handleReschedule = (id: string) => showToast(`Reschedule requested for appointment ${id}.`, 'info');
    const handleCancel = (id: string) => showToast(`Appointment ${id} has been cancelled.`, 'success');

    return (
        <div>
            <PageHeader title="Appointments" buttonText="Schedule New Appointment" onButtonClick={() => showToast('Navigating to scheduling page...', 'info')} />
            
            <Card>
                <div className="flex space-x-1 border-b border-gray-200 mb-4">
                    <button onClick={() => setFilter('Upcoming')} className={`py-2 px-4 text-sm font-medium ${filter === 'Upcoming' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>Upcoming</button>
                    <button onClick={() => setFilter('Past')} className={`py-2 px-4 text-sm font-medium ${filter === 'Past' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500'}`}>Past</button>
                </div>

                <div className="space-y-4">
                    {(filter === 'Upcoming' ? appointments.upcoming : appointments.past).map(appt => (
                        <div key={appt.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedAppointment(appt)}>
                            <div className="flex flex-col sm:flex-row justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex flex-col items-center justify-center bg-primary-50 text-primary-700 rounded-lg p-3 w-20 text-center">
                                        <span className="text-sm font-bold uppercase">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' })}</span>
                                        <span className="text-2xl font-extrabold">{new Date(appt.date).getUTCDate()}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-gray-800">{appt.reason}</p>
                                        <p className="text-sm text-gray-600">with {appt.providerName}</p>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <ClockIcon className="w-4 h-4 mr-1.5"/> {appt.time}
                                            <span className="mx-2">|</span>
                                            {appt.type === 'Virtual' ? <VideoCameraIcon className="w-4 h-4 mr-1.5"/> : <CalendarIcon className="w-4 h-4 mr-1.5"/>}
                                            {appt.type}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end mt-3 sm:mt-0">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <AppointmentDetailModal 
                appointment={selectedAppointment} 
                onClose={() => setSelectedAppointment(null)} 
                onReschedule={handleReschedule}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default PatientAppointments;
