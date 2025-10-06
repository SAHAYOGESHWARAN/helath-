import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { Appointment } from '../../types';
import { CalendarIcon, ChevronDownIcon } from '../../components/shared/Icons';

const initialAppointments: Appointment[] = [
  { id: 'appt1', patientName: 'John Doe', providerName: 'Dr. Jane Smith', date: '2024-09-15', time: '10:30 AM', reason: 'Annual Check-up', status: 'Confirmed' },
  { id: 'appt2', patientName: 'John Doe', providerName: 'Dr. David Chen', date: '2024-08-20', time: '02:00 PM', reason: 'Dermatology Follow-up', status: 'Confirmed' },
  { id: 'appt3', patientName: 'John Doe', providerName: 'Dr. Jane Smith', date: '2024-07-01', time: '09:00 AM', reason: 'Sick Visit', status: 'Confirmed' },
  { id: 'appt4', patientName: 'John Doe', providerName: 'Dr. Emily White', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '11:00 AM', reason: 'New Patient Consultation', status: 'Pending' },
];

const mockServices = ['Annual Check-up', 'Sick Visit', 'Follow-up', 'New Patient Consultation', 'Dermatology'];
const mockProviders = ['Dr. Jane Smith', 'Dr. David Chen', 'Dr. Emily White'];
const mockTimeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'];

const getStatusColor = (status: 'Confirmed' | 'Pending' | 'Cancelled') => {
  switch (status) {
    case 'Confirmed': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
  }
};

const CalendarPicker = ({ selectedDate, onDateChange }: { selectedDate: Date | null, onDateChange: (date: Date) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 text-center"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date() && !isToday;

      days.push(
        <button
          key={day}
          disabled={isPast}
          onClick={() => onDateChange(date)}
          className={`p-2 text-center rounded-full transition-colors w-10 h-10
            ${isSelected ? 'bg-primary-600 text-white' : ''}
            ${!isSelected && isToday ? 'bg-primary-100 text-primary-700' : ''}
            ${isPast ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-primary-100'}
          `}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  return (
    <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)}>&lt;</button>
            <h3 className="font-semibold">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={() => changeMonth(1)}>&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-sm text-center text-gray-500">
            <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
        </div>
        <div className="grid grid-cols-7 gap-2 mt-2">
            {renderDays()}
        </div>
    </div>
  );
};

const SchedulingModal = ({ isOpen, onClose, onAppointmentScheduled }: { isOpen: boolean, onClose: () => void, onAppointmentScheduled: (appt: Appointment) => void }) => {
    const [step, setStep] = useState(1);
    const [details, setDetails] = useState({ service: '', provider: '', date: null as Date | null, time: '' });

    if (!isOpen) return null;

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    
    const isStepValid = () => {
        if (step === 1) return !!details.service;
        if (step === 2) return !!details.provider;
        if (step === 3) return !!details.date && !!details.time;
        return false;
    };

    const handleSubmit = () => {
        if (!details.service || !details.provider || !details.date || !details.time) return;
        const newAppointment: Appointment = {
            id: `appt_${Date.now()}`,
            patientName: 'John Doe',
            providerName: details.provider,
            date: details.date.toISOString().split('T')[0],
            time: details.time,
            reason: details.service,
            status: 'Pending',
        };
        onAppointmentScheduled(newAppointment);
        setDetails({ service: '', provider: '', date: null, time: '' });
        setStep(1);
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Select a Service</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {mockServices.map(service => (
                                <button key={service} onClick={() => { setDetails({...details, service}); handleNext(); }} className="p-4 border rounded-lg hover:bg-primary-50 hover:border-primary-500 text-center transition-colors">
                                    {service}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Choose a Provider</h3>
                        <div className="space-y-3">
                           {mockProviders.map(provider => (
                                <button key={provider} onClick={() => { setDetails({...details, provider}); handleNext(); }} className="w-full p-4 border rounded-lg hover:bg-primary-50 hover:border-primary-500 text-left transition-colors">
                                    {provider}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Pick a Date & Time</h3>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <CalendarPicker selectedDate={details.date} onDateChange={(date) => setDetails({...details, date, time: ''})} />
                            </div>
                            {details.date && (
                                <div className="flex-1">
                                    <h4 className="font-semibold mb-2">Available Times</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {mockTimeSlots.map(time => (
                                            <button 
                                                key={time} 
                                                onClick={() => setDetails({...details, time})}
                                                className={`p-2 border rounded-md text-sm ${details.time === time ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Confirm Appointment</h3>
                        <div className="space-y-2 text-gray-700 p-4 bg-gray-50 rounded-lg">
                           <p><strong>Service:</strong> {details.service}</p>
                           <p><strong>Provider:</strong> {details.provider}</p>
                           <p><strong>Date:</strong> {details.date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                           <p><strong>Time:</strong> {details.time}</p>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
                {renderStepContent()}
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <button onClick={step === 1 ? onClose : handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                       {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    {step < 3 && <button onClick={handleNext} disabled={!isStepValid()} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-300">Next</button>}
                    {step === 3 && <button onClick={handleNext} disabled={!isStepValid()} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-300">Review</button>}
                    {step === 4 && <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Confirm Appointment</button>}
                </div>
            </div>
        </div>
    );
};


const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAppointmentScheduled = (newAppt: Appointment) => {
      setAppointments(prev => [...prev, newAppt]);
      setIsModalOpen(false);
      alert('Appointment scheduled successfully!');
  };

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      if (filter === 'Upcoming') {
        return apptDate >= now;
      } else {
        return apptDate < now;
      }
    }).sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`).getTime();
        const dateB = new Date(`${b.date} ${b.time}`).getTime();
        return filter === 'Upcoming' ? dateA - dateB : dateB - dateA;
    });
  }, [filter, appointments]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Schedule New Appointment
        </button>
      </div>
      <Card>
        <div className="mb-4">
          <div className="flex space-x-1 border-b">
            <button onClick={() => setFilter('Upcoming')} className={`py-2 px-4 text-sm font-medium ${filter === 'Upcoming' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}>Upcoming</button>
            <button onClick={() => setFilter('Past')} className={`py-2 px-4 text-sm font-medium ${filter === 'Past' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}>Past</button>
          </div>
        </div>
        <div className="space-y-4">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <div key={appt.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <p className="font-bold text-lg text-gray-800">{appt.reason}</p>
                  <p className="text-sm text-gray-600">with {appt.providerName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                    {appt.status}
                  </span>
                  {filter === 'Upcoming' && appt.status !== 'Cancelled' && (
                    <div className="flex space-x-2">
                      <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">Reschedule</button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">Cancel</button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>You have no {filter.toLowerCase()} appointments.</p>
            </div>
          )}
        </div>
      </Card>
      <SchedulingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAppointmentScheduled={handleAppointmentScheduled}
      />
    </div>
  );
};

export default PatientAppointments;