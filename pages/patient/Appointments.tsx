import React, { useState, useMemo, useEffect } from 'react';
import Card from '../../components/shared/Card';
import { Appointment } from '../../types';
import { CalendarIcon, BellIcon, ClockIcon, MailIcon, DeviceMobileIcon, CheckIcon } from '../../components/shared/Icons';

const initialAppointments: Appointment[] = [
  { id: 'appt1', patientName: 'John Doe', providerName: 'Dr. Jane Smith', date: '2024-09-15', time: '10:30 AM', reason: 'Annual Check-up', type: 'In-Person', status: 'Confirmed' },
  { id: 'appt2', patientName: 'John Doe', providerName: 'Dr. David Chen', date: '2024-08-20', time: '02:00 PM', reason: 'Dermatology Follow-up', type: 'In-Person', status: 'Confirmed' },
  { id: 'appt3', patientName: 'John Doe', providerName: 'Dr. Jane Smith', date: '2024-07-01', time: '09:00 AM', reason: 'Sick Visit', type: 'Virtual', status: 'Confirmed' },
  { id: 'appt4', patientName: 'John Doe', providerName: 'Dr. Emily White', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '11:00 AM', reason: 'New Patient Consultation', type: 'In-Person', status: 'Pending' },
];

const mockServices = ['Annual Check-up', 'Sick Visit', 'Follow-up', 'New Patient Consultation', 'Dermatology'];
const mockProviders = ['Dr. Jane Smith', 'Dr. David Chen', 'Dr. Emily White'];
const mockTimeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'];

const NOTIFICATION_PREFS_KEY = 'tangerine-notification-prefs';
const APPOINTMENT_REMINDERS_KEY = 'tangerine-appointment-reminders';

const getStatusPill = (status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed') => {
  let baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (status) {
    case 'Confirmed': return `${baseClasses} bg-emerald-100 text-emerald-800`;
    case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'Cancelled': return `${baseClasses} bg-red-100 text-red-800`;
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
      const today = new Date();
      today.setHours(0,0,0,0);
      const isToday = today.getTime() === date.getTime();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < today;

      days.push(
        <button
          key={day}
          disabled={isPast}
          onClick={() => onDateChange(date)}
          className={`p-2 text-center rounded-full transition-all duration-200 w-10 h-10
            ${isSelected ? 'bg-primary-600 text-white font-bold scale-110' : ''}
            ${!isSelected && isToday ? 'border border-primary-500 text-primary-600' : ''}
            ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
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
    <div className="w-full max-w-sm mx-auto text-gray-800">
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100">&lt;</button>
            <h3 className="font-semibold text-lg">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100">&gt;</button>
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

const SchedulingModal = ({ isOpen, onClose, onAppointmentScheduled }: { isOpen: boolean, onClose: () => void, onAppointmentScheduled: (data: { appointment: Appointment; reminder: any | null }) => void }) => {
    const [step, setStep] = useState(1);
    const [details, setDetails] = useState({ 
        service: '', 
        provider: '', 
        date: null as Date | null, 
        time: '',
        setReminder: true,
        reminderChannels: { email: true, sms: false },
        reminderTimeOption: '24h'
    });

    useEffect(() => {
        if (isOpen) {
            try {
                const prefsRaw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
                const prefs = prefsRaw ? JSON.parse(prefsRaw) : {};
                setDetails(d => ({
                    ...d,
                    setReminder: (prefs.emailAppointments || prefs.smsReminders) ?? true,
                    reminderChannels: {
                        email: prefs.emailAppointments ?? true,
                        sms: prefs.smsReminders ?? false,
                    },
                    reminderTimeOption: prefs.defaultReminderTime || '24h'
                }));
            } catch (e) { console.error("Failed to load notification preferences for modal.", e); }
        } else {
            // Reset state on close to ensure it's fresh next time
            setDetails({
                service: '', provider: '', date: null, time: '',
                setReminder: true,
                reminderChannels: { email: true, sms: false },
                reminderTimeOption: '24h'
            });
            setStep(1);
        }
    }, [isOpen]);


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
            type: 'Virtual',
            status: 'Pending',
        };
        const reminderSettings = details.setReminder ? {
            channels: details.reminderChannels,
            timeOption: details.reminderTimeOption,
            customDateTime: null
        } : null;

        onAppointmentScheduled({
            appointment: newAppointment,
            reminder: reminderSettings,
        });
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Select a Service</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {mockServices.map(service => (
                                <button key={service} onClick={() => { setDetails({...details, service}); handleNext(); }} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-500 text-center transition-all">
                                    {service}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                     <div>
                        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Choose a Provider</h3>
                        <div className="space-y-3">
                           {mockProviders.map(provider => (
                                <button key={provider} onClick={() => { setDetails({...details, provider}); handleNext(); }} className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-500 text-left transition-all">
                                    {provider}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Pick a Date & Time</h3>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1">
                                <CalendarPicker selectedDate={details.date} onDateChange={(date) => setDetails({...details, date, time: ''})} />
                            </div>
                            {details.date && (
                                <div className="flex-1">
                                    <h4 className="font-semibold mb-2 text-gray-800">Available Times</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {mockTimeSlots.map(time => (
                                            <button 
                                                key={time} 
                                                onClick={() => setDetails({...details, time})}
                                                className={`p-2 border rounded-md text-sm transition-all ${details.time === time ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 hover:bg-gray-100'}`}
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
                        <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">Confirm Appointment</h3>
                        <div className="space-y-2 text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200">
                           <p><strong>Service:</strong> <span className="text-gray-800">{details.service}</span></p>
                           <p><strong>Provider:</strong> <span className="text-gray-800">{details.provider}</span></p>
                           <p><strong>Date:</strong> <span className="text-gray-800">{details.date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                           <p><strong>Time:</strong> <span className="text-gray-800">{details.time}</span></p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={details.setReminder}
                                    onChange={e => setDetails({...details, setReminder: e.target.checked})}
                                    className="h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="ml-3 font-semibold text-gray-800">Set a reminder for this appointment</span>
                            </label>

                            {details.setReminder && (
                                <div className="mt-3 pl-8 space-y-4 animate-fade-in">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notification Channels:</label>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={details.reminderChannels.email} onChange={e => setDetails({...details, reminderChannels: {...details.reminderChannels, email: e.target.checked}})} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                                                <span className="ml-2 text-sm">Email</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" checked={details.reminderChannels.sms} onChange={e => setDetails({...details, reminderChannels: {...details.reminderChannels, sms: e.target.checked}})} className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                                                <span className="ml-2 text-sm">SMS</span>
                                            </label>
                                        </div>
                                    </div>
                                     <div>
                                        <label htmlFor="reminderTimeOption" className="block text-sm font-medium text-gray-700">Send Reminder:</label>
                                        <select
                                            id="reminderTimeOption"
                                            value={details.reminderTimeOption}
                                            onChange={e => setDetails({...details, reminderTimeOption: e.target.value})}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                        >
                                            <option value="1h">1 hour before</option>
                                            <option value="24h">24 hours before</option>
                                            <option value="2d">2 days before</option>
                                            <option value="3d">3 days before</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-6 relative transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                {renderStepContent()}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <button onClick={step === 1 ? onClose : handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                       {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    {step < 3 && <button onClick={handleNext} disabled={!isStepValid()} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">Next</button>}
                    {step === 3 && <button onClick={handleNext} disabled={!isStepValid()} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">Review</button>}
                    {step === 4 && <button onClick={handleSubmit} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg">Confirm Appointment</button>}
                </div>
            </div>
        </div>
    );
};

const SendReminderConfirmationModal: React.FC<{
    appointment: Appointment | null;
    onClose: () => void;
    onConfirm: () => void;
}> = ({ appointment, onClose, onConfirm }) => {
    if (!appointment) return null;

    const [channels, setChannels] = useState<string[]>([]);

    useEffect(() => {
        try {
            const prefsRaw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
            const prefs = prefsRaw ? JSON.parse(prefsRaw) : { emailAppointments: true, smsReminders: false };
            const enabledChannels: string[] = [];
            if (prefs.emailAppointments) enabledChannels.push('Email');
            if (prefs.smsReminders) enabledChannels.push('SMS');
            setChannels(enabledChannels);
        } catch (e) {
            console.error("Failed to parse notification preferences.", e);
            setChannels(['Email']); // Fallback to email
        }
    }, [appointment]);

    const channelText = channels.length > 0 ? channels.join(' and ') : 'your configured channels';
    const message = channels.length > 0
        ? `This will send a reminder for your appointment with ${appointment.providerName} via ${channelText}. Do you want to proceed?`
        : `You have no notification channels enabled. Please enable Email or SMS reminders in your settings to send reminders.`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-slide-in-up">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Send Appointment Reminder</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
                        {channels.length > 0 ? 'Cancel' : 'Close'}
                    </button>
                    {channels.length > 0 && (
                        <button 
                            onClick={onConfirm} 
                            className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg transition-colors hover:bg-primary-700"
                        >
                            Send Reminder
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


const ActionConfirmationModal: React.FC<{
    appointment: Appointment | null;
    action: 'Reschedule' | 'Cancel' | null;
    onClose: () => void;
    onConfirm: (appointment: Appointment, action: 'Reschedule' | 'Cancel') => void;
}> = ({ appointment, action, onClose, onConfirm }) => {
    if (!appointment || !action) return null;

    const isCancel = action === 'Cancel';
    const title = isCancel ? 'Confirm Cancellation' : 'Reschedule Appointment';
    
    let message;
    if (isCancel) {
        const appointmentDate = new Date(appointment.date).toLocaleDateString('en-US', {
            timeZone: 'UTC',
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
        message = (
          <span className="text-gray-600">
            Are you sure you want to cancel your appointment with{' '}
            <strong className="text-gray-800">{appointment.providerName}</strong> on{' '}
            <strong className="text-gray-800">{appointmentDate}</strong> at <strong className="text-gray-800">{appointment.time}</strong>?
            <br />
            This action cannot be undone.
          </span>
        );
    } else {
        message = `To reschedule your appointment with ${appointment.providerName}, please call our office. This will cancel your current appointment slot.`;
    }

    const confirmText = isCancel ? 'Yes, Cancel Appointment' : 'Proceed & Cancel';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-slide-in-up">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
                <div className="text-sm mb-6 leading-relaxed">{message}</div>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
                        Go Back
                    </button>
                    <button 
                        onClick={() => onConfirm(appointment, action)} 
                        className={`font-bold py-2 px-4 rounded-lg transition-colors ${isCancel ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AppointmentDetailModal: React.FC<{
    appointment: Appointment | null;
    onClose: () => void;
}> = ({ appointment, onClose }) => {
    if (!appointment) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-slide-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-800">Appointment Details</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                </div>
                
                <div className="mt-4 space-y-4">
                    <div>
                        <p className="text-sm text-gray-500">Patient</p>
                        <p className="font-semibold text-lg text-gray-800">{appointment.patientName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Provider</p>
                        <p className="font-semibold text-lg text-gray-800">{appointment.providerName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Reason for Visit</p>
                        <p className="font-semibold text-lg text-gray-800">{appointment.reason}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-semibold text-lg text-gray-800">
                            {new Date(appointment.date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric' })} at {appointment.time}
                        </p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p>
                            <span className={getStatusPill(appointment.status)}>{appointment.status}</span>
                        </p>
                    </div>
                </div>

                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const SetReminderModal: React.FC<{
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (reminderSettings: any) => void;
  existingReminder: any | null;
}> = ({ appointment, onClose, onSave, existingReminder }) => {
  if (!appointment) return null;

  const reminderTimeOptions = [
    { value: '1h', label: '1 hour before' },
    { value: '24h', label: '24 hours before' },
    { value: '2d', label: '2 days before' },
    { value: '3d', label: '3 days before' }
  ];

  const [channels, setChannels] = useState({ email: true, sms: false });
  const [timeOption, setTimeOption] = useState('24h');
  const [customDateTime, setCustomDateTime] = useState('');

  const isPastAppointment = useMemo(() => {
    if (!appointment) return false;
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.time}`);
    return appointmentDateTime < new Date();
  }, [appointment]);

  useEffect(() => {
    if (existingReminder) {
      setChannels(existingReminder.channels);
      setTimeOption(existingReminder.timeOption);
      if (existingReminder.timeOption === 'custom') {
        setCustomDateTime(existingReminder.customDateTime || '');
      }
    } else {
      try {
        const prefsRaw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
        const prefs = prefsRaw ? JSON.parse(prefsRaw) : {};
        setChannels({
          email: prefs.emailAppointments ?? true,
          sms: prefs.smsReminders ?? false,
        });
        setTimeOption(isPastAppointment ? 'custom' : (prefs.defaultReminderTime || '24h'));
      } catch (e) {
        console.error("Failed to load notification preferences, using system defaults.", e);
        setChannels({ email: true, sms: false });
        setTimeOption(isPastAppointment ? 'custom' : '24h');
      }
    }
  }, [appointment, existingReminder, isPastAppointment]);


  const handleSave = () => {
    if (!channels.email && !channels.sms) {
      alert("Please select at least one notification channel (Email or SMS).");
      return;
    }
    if (timeOption === 'custom' && !customDateTime) {
      alert("Please select a custom date and time.");
      return;
    }
    onSave({
      appointmentId: appointment.id,
      channels,
      timeOption,
      customDateTime: timeOption === 'custom' ? customDateTime : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 animate-slide-in-up">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Set Reminder</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="mt-4 space-y-2 text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200 mb-6">
           <p><strong>Provider:</strong> <span className="text-gray-800">{appointment.providerName}</span></p>
           <p><strong>Date:</strong> <span className="text-gray-800">{new Date(appointment.date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appointment.time}</span></p>
        </div>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Notification Channels</label>
                <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setChannels(c => ({ ...c, email: !c.email }))}
                        className={`w-1/2 p-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:z-10 relative flex items-center justify-center gap-2 ${
                            channels.email ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <MailIcon className="w-5 h-5" />
                        <span>Email</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setChannels(c => ({ ...c, sms: !c.sms }))}
                        className={`w-1/2 p-3 text-sm font-medium transition-colors border-l border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:z-10 relative flex items-center justify-center gap-2 ${
                            channels.sms ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <DeviceMobileIcon className="w-5 h-5" />
                        <span>SMS</span>
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-900">When to Send</label>
                {isPastAppointment && (
                    <p className="text-sm text-gray-500 mt-1 mb-2 bg-yellow-50 p-2 rounded-md border border-yellow-200">
                        You are setting a reminder for a past appointment. Please select a future date and time for the notification.
                    </p>
                )}
                 <div className="mt-2 grid grid-cols-2 gap-2">
                    {!isPastAppointment && reminderTimeOptions.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setTimeOption(opt.value)}
                            className={`p-3 text-sm rounded-md border text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 flex items-center justify-center gap-2 ${
                                timeOption === opt.value ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {timeOption === opt.value && <CheckIcon className="w-4 h-4" />}
                            <span>{opt.label}</span>
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setTimeOption('custom')}
                        className={`p-3 text-sm rounded-md border text-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 col-span-2 flex items-center justify-center gap-2 ${
                            timeOption === 'custom' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        {timeOption === 'custom' && <CheckIcon className="w-4 h-4" />}
                        <span>Custom time</span>
                    </button>
                </div>
                {timeOption === 'custom' && (
                    <input 
                        type="datetime-local" 
                        value={customDateTime}
                        onChange={e => setCustomDateTime(e.target.value)}
                        className="mt-2 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md animate-fade-in"
                    />
                )}
            </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
            <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Set Reminder</button>
        </div>
      </div>
    </div>
  );
};


const PatientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filter, setFilter] = useState<'Upcoming' | 'Past'>('Upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendingReminderFor, setSendingReminderFor] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [reminders, setReminders] = useState<Record<string, any>>({});
  const [reminderModal, setReminderModal] = useState<{ isOpen: boolean; appointment: Appointment | null }>({ isOpen: false, appointment: null });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
   const [modalState, setModalState] = useState<{
        isOpen: boolean;
        appointment: Appointment | null;
        action: 'Reschedule' | 'Cancel' | null;
    }>({ isOpen: false, appointment: null, action: null });

  useEffect(() => {
    try {
      const savedReminders = localStorage.getItem(APPOINTMENT_REMINDERS_KEY);
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    } catch (error) {
      console.error('Failed to load reminders from localStorage', error);
    }
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAppointmentScheduled = (data: { appointment: Appointment; reminder: any | null }) => {
      const { appointment, reminder } = data;
      setAppointments(prev => [...prev, appointment]);

      if (reminder) {
          const newReminders = {
              ...reminders,
              [appointment.id]: {
                  appointmentId: appointment.id,
                  ...reminder,
              },
          };
          setReminders(newReminders);
          try {
              localStorage.setItem(APPOINTMENT_REMINDERS_KEY, JSON.stringify(newReminders));
          } catch (error) {
              console.error('Failed to save reminder to localStorage', error);
          }
      }
      
      setIsModalOpen(false);
      setToastMessage('Appointment scheduled successfully!');
  };


  const handleConfirmSendReminder = () => {
        if (!sendingReminderFor) return;

        try {
            const prefsRaw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
            const prefs = prefsRaw ? JSON.parse(prefsRaw) : { emailAppointments: true, smsReminders: false };
            const enabledChannels: string[] = [];
            if (prefs.emailAppointments) enabledChannels.push('Email');
            if (prefs.smsReminders) enabledChannels.push('SMS');
            
            if (enabledChannels.length > 0) {
                 setToastMessage(`Reminder sent successfully via ${enabledChannels.join(' and ')}!`);
            } else {
                 setToastMessage(`Cannot send reminder. No notification channels are enabled in settings.`);
            }
        } catch(e) {
            console.error("Failed to process reminder:", e);
            setToastMessage(`Reminder sent successfully via Email! (default)`);
        }
        
        setSendingReminderFor(null);
    };
  
  const handleModalOpen = (appointment: Appointment, action: 'Reschedule' | 'Cancel') => {
    setModalState({ isOpen: true, appointment, action });
  };

  const handleModalClose = () => {
      setModalState({ isOpen: false, appointment: null, action: null });
  };
  
  const handleSaveReminder = (reminderSettings: any) => {
    const newReminders = {
      ...reminders,
      [reminderSettings.appointmentId]: reminderSettings,
    };
    setReminders(newReminders);
    try {
      localStorage.setItem(APPOINTMENT_REMINDERS_KEY, JSON.stringify(newReminders));
      setToastMessage('Reminder has been set successfully!');
    } catch (error) {
      console.error('Failed to save reminder to localStorage', error);
      setToastMessage('Error: Could not save reminder.');
    }
    setReminderModal({ isOpen: false, appointment: null });
  };


  const handleConfirmAction = (appointment: Appointment, action: 'Reschedule' | 'Cancel') => {
      setAppointments(prev => prev.map(appt => 
          appt.id === appointment.id ? { ...appt, status: 'Cancelled' } : appt
      ));

      if (action === 'Cancel') {
          setToastMessage(`Your appointment with ${appointment.providerName} has been cancelled.`);
      } else if (action === 'Reschedule') {
          setToastMessage(`Appointment with ${appointment.providerName} cancelled. Please call to reschedule.`);
      }
      handleModalClose();
  };

  const filteredAppointments = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      apptDate.setMinutes(apptDate.getMinutes() + apptDate.getTimezoneOffset());
      
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
        <h1 className="text-4xl font-bold text-gray-800">My Appointments</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105"
        >
          Schedule New
        </button>
      </div>
      <Card>
        <div className="mb-4">
          <div className="flex space-x-1 border-b border-gray-200">
            <button onClick={() => setFilter('Upcoming')} className={`py-2 px-4 text-sm font-medium transition-colors ${filter === 'Upcoming' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}>Upcoming</button>
            <button onClick={() => setFilter('Past')} className={`py-2 px-4 text-sm font-medium transition-colors ${filter === 'Past' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}>Past</button>
          </div>
        </div>
        <div className="space-y-4 stagger-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt, index) => {
              const apptDateTime = new Date(`${appt.date} ${appt.time}`);
              const hoursUntil = (apptDateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
              const canManage = hoursUntil > 24;
              const reminderIsSet = !!reminders[appt.id];

              return (
              <div 
                key={appt.id} 
                className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row justify-between sm:items-center cursor-pointer hover:bg-gray-50 hover:border-primary-300 transition-all" 
                style={{'--stagger-index': index} as React.CSSProperties}
                onClick={() => setSelectedAppointment(appt)}
              >
                <div>
                  <p className="font-bold text-lg text-gray-800">{appt.reason}</p>
                  <p className="text-sm text-gray-600">with {appt.providerName}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}
                  </p>
                </div>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                  <span className={getStatusPill(appt.status)}>{appt.status}</span>
                  {appt.status !== 'Cancelled' && (
                    <div className="flex items-center space-x-3">
                      {filter === 'Upcoming' && (
                         <button
                            onClick={(e) => { e.stopPropagation(); setSendingReminderFor(appt); }}
                            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary-600 transition-colors"
                            title="Send reminder now"
                            aria-label="Send reminder now"
                          >
                            <BellIcon className="w-5 h-5" />
                          </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setReminderModal({ isOpen: true, appointment: appt }); }}
                        className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${reminderIsSet ? 'text-tangerine hover:text-tangerine-dark' : 'text-gray-500 hover:text-primary-600'}`}
                        title={reminderIsSet ? "Edit scheduled reminder" : "Set scheduled reminder"}
                        aria-label={reminderIsSet ? "Edit scheduled reminder" : "Set scheduled reminder"}
                      >
                          <ClockIcon className="w-5 h-5" />
                      </button>
                      {filter === 'Upcoming' && canManage && (
                        <>
                           <button onClick={(e) => { e.stopPropagation(); handleModalOpen(appt, 'Reschedule'); }} className="text-primary-600 hover:underline text-sm font-medium">Reschedule</button>
                           <button onClick={(e) => { e.stopPropagation(); handleModalOpen(appt, 'Cancel'); }} className="text-red-600 hover:underline text-sm font-medium">Cancel</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )})
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>You have no {filter.toLowerCase()} appointments.</p>
            </div>
          )}
        </div>
      </Card>
      {isModalOpen && (
        <SchedulingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAppointmentScheduled={handleAppointmentScheduled}
        />
      )}
      <SendReminderConfirmationModal
          appointment={sendingReminderFor}
          onClose={() => setSendingReminderFor(null)}
          onConfirm={handleConfirmSendReminder}
      />
       <ActionConfirmationModal
          appointment={modalState.appointment}
          action={modalState.action}
          onClose={handleModalClose}
          onConfirm={handleConfirmAction}
      />
      <AppointmentDetailModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
      <SetReminderModal
        appointment={reminderModal.appointment}
        onClose={() => setReminderModal({ isOpen: false, appointment: null })}
        onSave={handleSaveReminder}
        existingReminder={reminderModal.appointment ? reminders[reminderModal.appointment.id] : null}
      />
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white py-2 px-6 rounded-full shadow-lg animate-fade-in z-[100]">
            {toastMessage}
        </div>
       )}
    </div>
  );
};

export default PatientAppointments;