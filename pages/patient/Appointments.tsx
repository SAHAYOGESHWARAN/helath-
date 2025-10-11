
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment } from '../../types';
import { CalendarIcon, ClockIcon, VideoCameraIcon, UsersIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: 'appt1',
    patientName: 'John Doe',
    providerName: 'Dr. Jane Smith',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:30 AM',
    reason: 'Annual Check-up',
    type: 'In-Person',
    status: 'Confirmed',
  },
  {
    id: 'appt2',
    patientName: 'John Doe',
    providerName: 'Dr. David Chen',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '02:00 PM',
    reason: 'Dermatology Follow-up',
    type: 'Virtual',
    status: 'Confirmed',
  },
  {
    id: 'appt3',
    patientName: 'John Doe',
    providerName: 'Dr. Jane Smith',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:00 AM',
    reason: 'Follow-up Visit',
    type: 'In-Person',
    status: 'Completed',
    visitSummary: 'Patient is responding well to treatment. Continue current medication plan. Follow up in 6 months.'
  },
  {
    id: 'appt4',
    patientName: 'John Doe',
    providerName: 'Dr. Emily White',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00 AM',
    reason: 'Initial Consultation',
    type: 'In-Person',
    status: 'Completed',
    visitSummary: 'Discussed patient history and symptoms. Ordered initial lab work.'
  },
];

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
  const isUpcoming = new Date(appointment.date) >= new Date();
  
  return (
    <Card className="mb-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <p className="text-xl font-bold text-gray-800">{appointment.providerName}</p>
          <p className="text-gray-600">{appointment.reason}</p>
        </div>
        <div className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold rounded-full h-fit ${
          appointment.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
          appointment.status === 'Completed' ? 'bg-gray-200 text-gray-700' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {appointment.status}
        </div>
      </div>
      <div className="mt-4 border-t pt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
        <div className="flex items-center text-gray-700">
          <CalendarIcon className="w-5 h-5 mr-2 text-gray-500"/>
          <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <ClockIcon className="w-5 h-5 mr-2 text-gray-500"/>
          <span>{appointment.time}</span>
        </div>
        <div className="flex items-center text-gray-700">
          {appointment.type === 'Virtual' ? <VideoCameraIcon className="w-5 h-5 mr-2 text-gray-500"/> : <UsersIcon className="w-5 h-5 mr-2 text-gray-500"/>}
          <span>{appointment.type}</span>
        </div>
      </div>
       {isUpcoming && appointment.type === 'Virtual' && (
         <div className="mt-4">
            <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">
                Join Virtual Consult
            </button>
         </div>
       )}
       {appointment.visitSummary && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700">Visit Summary</h4>
                <p className="text-sm text-gray-600 mt-1">{appointment.visitSummary}</p>
            </div>
        )}
    </Card>
  );
};


const PatientAppointments: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useApp();

    const { upcoming, past } = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        return mockAppointments.reduce<{ upcoming: Appointment[]; past: Appointment[] }>((acc, appt) => {
            if (new Date(appt.date) >= today) {
                acc.upcoming.push(appt);
            } else {
                acc.past.push(appt);
            }
            return acc;
        }, { upcoming: [], past: [] });
    }, []);
    
    const handleSchedule = () => {
        showToast('Appointment requested successfully!', 'success');
        setIsModalOpen(false);
    }

    return (
        <div>
            <PageHeader
                title="My Appointments"
                buttonText="Schedule New Appointment"
                onButtonClick={() => setIsModalOpen(true)}
            />
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Appointments</h2>
                    {upcoming.length > 0 ? (
                        upcoming.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(appt => <AppointmentCard key={appt.id} appointment={appt} />)
                    ) : (
                        <Card><p className="text-gray-500">You have no upcoming appointments.</p></Card>
                    )}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Appointments</h2>
                    {past.length > 0 ? (
                        past.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(appt => <AppointmentCard key={appt.id} appointment={appt} />)
                    ) : (
                        <Card><p className="text-gray-500">You have no past appointments.</p></Card>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Schedule a New Appointment"
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={handleSchedule} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Request Appointment</button>
                    </>
                }
            >
                <form className="space-y-4">
                     <div>
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
                        <select id="provider" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                            <option>Dr. Jane Smith (Cardiology)</option>
                            <option>Dr. David Chen (Dermatology)</option>
                            <option>Dr. Emily White (Pediatrics)</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
                        <input type="date" id="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                        <textarea id="reason" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default PatientAppointments;