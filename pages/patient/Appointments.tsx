import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment, User, UserRole } from '../../types';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import { CalendarIcon, ClockIcon, VideoCameraIcon, SpinnerIcon, UsersIcon, ChevronLeftIcon, ArrowLeftIcon, ArrowRightIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { MEDICAL_SPECIALTIES } from '../../constants';

const getStatusPill = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const STEPS = {
  SPECIALTY: 1,
  PROVIDER: 2,
  DATE_TIME: 3,
  CONFIRMATION: 4
};

const MOCK_TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30"];

const SchedulerModal: React.FC<{onClose: () => void, availableProviders: User[]}> = ({ onClose, availableProviders }) => {
    const { addAppointment } = useAuth();
    const { showToast } = useApp();
    const [step, setStep] = useState(STEPS.SPECIALTY);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedProvider, setSelectedProvider] = useState<User | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [reason, setReason] = useState('');

    const filteredProviders = useMemo(() => {
        return availableProviders.filter(p => p.specialty === selectedSpecialty);
    }, [selectedSpecialty, availableProviders]);

    const handleDateChange = (offset: number) => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + offset);
            return newDate;
        });
    };

    const handleConfirmBooking = () => {
      if (!selectedProvider || !selectedTime || !reason) return;

      const newAppointment = {
        providerName: selectedProvider.name,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        reason: reason,
        type: 'Virtual', // Defaulting for simplicity
        duration: 30
      };

      const success = addAppointment(newAppointment as Omit<Appointment, 'id' | 'status' | 'patientName'>);
      if(success) {
        showToast('Appointment requested successfully!', 'success');
        onClose();
      } else {
        showToast('This time slot is unavailable. Please select another.', 'error');
      }
    };

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setStep(s => s > 1 ? s - 1 : s)}
                  className={`text-primary-600 font-bold flex items-center ${step === 1 ? 'invisible' : ''}`}
                >
                  <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back
                </button>
                <h3 className="text-xl font-bold text-gray-800">Book an Appointment</h3>
                <div className="w-20"></div>
            </div>

            {/* Step 1: Specialty Selection */}
            {step === STEPS.SPECIALTY && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {MEDICAL_SPECIALTIES.map(spec => (
                      <button key={spec} onClick={() => { setSelectedSpecialty(spec); setStep(STEPS.PROVIDER); }}
                          className="p-4 bg-gray-50 rounded-lg text-center font-semibold hover:bg-primary-100 hover:text-primary-700 hover:shadow-md transition-all">
                          {spec}
                      </button>
                  ))}
              </div>
            )}

            {/* Step 2: Provider Selection */}
            {step === STEPS.PROVIDER && (
                <div className="space-y-3">
                    {filteredProviders.map(prov => (
                        <div key={prov.id} onClick={() => { setSelectedProvider(prov); setStep(STEPS.DATE_TIME); }}
                            className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-100">
                            <img src={prov.avatarUrl} alt={prov.name} className="w-14 h-14 rounded-full mr-4"/>
                            <div>
                                <p className="font-bold text-lg text-gray-900">{prov.name}</p>
                                <p className="text-sm text-gray-600">{prov.specialty}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {step === STEPS.DATE_TIME && (
              <div className="animate-fade-in">
                  <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg mb-4">
                      <button onClick={() => handleDateChange(-1)} className="p-2 rounded-full hover:bg-gray-200"><ArrowLeftIcon className="w-5 h-5"/></button>
                      <p className="font-bold text-lg">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                      <button onClick={() => handleDateChange(1)} className="p-2 rounded-full hover:bg-gray-200"><ArrowRightIcon className="w-5 h-5"/></button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 text-center">
                      {MOCK_TIME_SLOTS.map(time => (
                          <button key={time} onClick={() => setSelectedTime(time)}
                              className={`p-3 rounded-lg font-semibold transition-colors ${selectedTime === time ? 'bg-primary-600 text-white' : 'bg-gray-100 hover:bg-primary-100'}`}>
                              {time}
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setStep(STEPS.CONFIRMATION)} disabled={!selectedTime}
                    className="w-full mt-6 bg-primary-600 text-white font-bold py-3 rounded-lg disabled:bg-gray-300">
                    Next
                  </button>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === STEPS.CONFIRMATION && (
                <div className="space-y-4">
                    <p><strong>Provider:</strong> {selectedProvider?.name}</p>
                    <p><strong>Date & Time:</strong> {selectedDate.toLocaleDateString('en-US', {timeZone: 'UTC'})} at {selectedTime}</p>
                    <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason for your visit..." className="w-full p-2 border rounded-lg h-24"/>
                    <button onClick={handleConfirmBooking} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg">
                        Confirm Booking
                    </button>
                </div>
            )}
        </div>
    );
};

const PatientAppointments: React.FC = () => {
    const { user: patientUser, users, appointments, cancelAppointment, submitAppointmentFeedback } = useAuth();
    const { showToast } = useApp();

    const [modal, setModal] = useState<'request' | 'details' | 'cancel' | 'feedback' | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const availableProviders = useMemo(() => {
        if (!patientUser?.state) return [];
        return users.filter(u => u.role === UserRole.PROVIDER && u.isVerified && u.state === patientUser.state);
    }, [users, patientUser]);

    const sortedAppointments = useMemo(() => {
        const now = new Date();
        now.setHours(0,0,0,0);
        const upcoming = [...appointments].filter(a => new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending')).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const past = [...appointments].filter(a => new Date(a.date) < now || a.status === 'Completed' || a.status === 'Cancelled').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { upcoming, past };
    }, [appointments]);

    const handleOpenDetails = (appt: Appointment) => { setSelectedAppointment(appt); setModal('details'); };

    const handleConfirmCancel = () => {
        if (!selectedAppointment) return;
        setIsSubmitting(true);
        setTimeout(() => {
            cancelAppointment(selectedAppointment.id);
            showToast('Appointment cancelled successfully.', 'success');
            setIsSubmitting(false);
            setModal(null);
        }, 800);
    };

    const handleFeedbackSubmit = (values: { summary: string }) => {
        if (!selectedAppointment) return;
        setIsSubmitting(true);
        setTimeout(() => {
            submitAppointmentFeedback(selectedAppointment.id, values.summary);
            showToast('Feedback submitted. Thank you!', 'success');
            setIsSubmitting(false);
            setModal(null);
        }, 800);
    };

    return (
        <div>
            <PageHeader title="Appointments" buttonText="Book New Appointment" onButtonClick={() => setModal('request')} />
            
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
                                     <div className="flex items-center space-x-4 flex-grow cursor-pointer" onClick={() => handleOpenDetails(appt)}>
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
                        {sortedAppointments.past.map(appt => (
                             <div key={appt.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleOpenDetails(appt)}>
                                 <p className="font-bold text-lg">{appt.providerName} - {new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                                 <p className="text-sm">{appt.reason}</p>
                                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                             </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* --- MODALS --- */}
            {modal === 'request' && <Modal isOpen={true} onClose={() => setModal(null)} title=""><SchedulerModal onClose={() => setModal(null)} availableProviders={availableProviders}/></Modal>}

            <Modal isOpen={modal === 'details'} onClose={() => setModal(null)} title="Appointment Details">
                 {selectedAppointment && <div className="space-y-4">
                    <p><strong>Provider:</strong> {selectedAppointment.providerName}</p>
                    <p><strong>Date & Time:</strong> {new Date(selectedAppointment.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedAppointment.time}</p>
                    <p><strong>Duration:</strong> {selectedAppointment.duration} minutes</p>
                    <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                    {selectedAppointment.status === 'Completed' && !selectedAppointment.visitSummary && <button onClick={() => setModal('feedback')} className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg mt-4">Submit Feedback</button>}
                    {selectedAppointment.status === 'Completed' && selectedAppointment.visitSummary && <Link to="/history" className="block w-full text-center bg-primary-600 text-white font-bold py-2 px-4 rounded-lg mt-4">View Visit Summary</Link>}
                    {selectedAppointment.status === 'Confirmed' && <button onClick={() => setModal('cancel')} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg mt-4">Cancel Appointment</button>}
                </div>}
            </Modal>
            
            <Modal isOpen={modal === 'cancel'} onClose={() => setModal('details')} title="Confirm Cancellation" footer={<>
                    <button onClick={() => setModal('details')} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Go Back</button>
                    <button onClick={handleConfirmCancel} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-36">
                        {isSubmitting ? <SpinnerIcon/> : 'Yes, Cancel'}
                    </button>
                </>}>
                <p>Are you sure you want to cancel your appointment with <strong>{selectedAppointment?.providerName}</strong> on {new Date(selectedAppointment?.date || '').toLocaleDateString('en-US', { timeZone: 'UTC' })}?</p>
            </Modal>
        </div>
    );
};

export default PatientAppointments;