import React, { useState, useMemo } from 'react';
import Modal from '../../components/shared/Modal';
import { useAuth } from '../../hooks/useAuth';
import { Appointment, ReminderSettings, UserRole } from '../../types';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { ChevronLeftIcon } from '../../components/shared/Icons';
import Calendar from './Calendar';

interface ScheduleAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAppointmentScheduled: (appointment: Omit<Appointment, 'id'>, reminder?: ReminderSettings) => void;
}

const MOCK_SERVICES = ['Annual Check-up', 'Sick Visit', 'Follow-up', 'New Patient Consultation', 'Dermatology', 'Cardiology Consult'];
const MOCK_TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'];

const ProgressIndicator: React.FC<{ step: number, totalSteps: number }> = ({ step, totalSteps }) => (
    <div className="flex items-center justify-center mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step > index ? 'bg-primary-600 text-white' : step === index + 1 ? 'bg-primary-200 text-primary-700' : 'bg-gray-200 text-gray-500'}`}>
                    {step > index ? '✓' : index + 1}
                </div>
                {index < totalSteps - 1 && <div className={`h-1 flex-1 ${step > index + 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </React.Fragment>
        ))}
    </div>
);


const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({ isOpen, onClose, onAppointmentScheduled }) => {
    const { user, users } = useAuth();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        reason: '',
        providerId: '',
        location: 'Clinic' as Appointment['location'],
        date: null as Date | null,
        time: '',
        reminders: {
            enabled: true,
            channels: { email: true, sms: !!user?.phone },
            timeOption: '24h' as ReminderSettings['timeOption'],
            customDateTime: null as string | null,
        }
    });

    const providers = useMemo(() => users.filter(u => u.role === UserRole.PROVIDER), [users]);
    const selectedProvider = useMemo(() => providers.find(p => p.id === formData.providerId), [providers, formData.providerId]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSave = () => {
        if (!user || !selectedProvider || !formData.date) return;

        const newAppointment: Omit<Appointment, 'id'> = {
            patientId: user.id,
            patientName: user.name,
            providerId: selectedProvider.id,
            providerName: selectedProvider.name,
            date: formData.date.toISOString().split('T')[0],
            time: formData.time,
            reason: formData.reason,
            location: formData.location,
            status: 'Pending',
            duration: 30, // Mock duration
        };

        const reminderSettings: ReminderSettings | undefined = formData.reminders.enabled ? {
            channels: formData.reminders.channels,
            timeOption: formData.reminders.timeOption,
            customDateTime: formData.reminders.timeOption === 'custom' ? formData.reminders.customDateTime : null,
        } : undefined;

        onAppointmentScheduled(newAppointment, reminderSettings);
    };
    
    const isStepComplete = () => {
        switch (step) {
            case 1: return !!formData.reason;
            case 2: return !!formData.providerId;
            case 3: return !!formData.location;
            case 4: return !!formData.date && !!formData.time;
            default: return true; // Final step is always "complete"
        }
    };

    const titles = ['Select a Service', 'Choose a Provider', 'Select Location', 'Pick a Date & Time', 'Confirm Appointment'];
    const totalSteps = 5;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={titles[step-1]} size="xl">
            <ProgressIndicator step={step} totalSteps={totalSteps} />
            <div className="mt-6 min-h-[300px]">
            {step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {MOCK_SERVICES.map(service => (
                        <button key={service} onClick={() => { setFormData(f => ({...f, reason: service})); handleNext(); }} className="p-4 border rounded-lg text-center font-semibold hover:bg-primary-50 hover:border-primary-500 transition-all">
                            {service}
                        </button>
                    ))}
                </div>
            )}
            {step === 2 && (
                 <div className="space-y-3">
                    {providers.map(p => (
                        <button key={p.id} onClick={() => { setFormData(f => ({...f, providerId: p.id})); handleNext(); }} className="w-full p-4 border rounded-lg hover:bg-primary-50 hover:border-primary-500 text-left transition-all flex items-center space-x-3">
                           <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-full" />
                           <div>
                               <p className="font-semibold">{p.name}</p>
                               <p className="text-sm text-gray-500">{p.specialty}</p>
                           </div>
                        </button>
                    ))}
                </div>
            )}
            {step === 3 && (
                <div>
                     <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Appointment Location</label>
                     <select id="location" value={formData.location} onChange={e => setFormData(f => ({...f, location: e.target.value as Appointment['location']}))} className="w-full p-3 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
                         <option value="Clinic">Clinic (In-person)</option>
                         <option value="Hospital">Hospital (In-person)</option>
                         <option value="Virtual">Virtual (Telehealth)</option>
                     </select>
                </div>
            )}
             {step === 4 && (
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <Calendar 
                            selectedDate={formData.date} 
                            onDateChange={(date) => setFormData(f => ({...f, date, time: ''}))} 
                        />
                    </div>
                    {formData.date && (
                        <div className="flex-1 animate-fade-in">
                            <h4 className="font-semibold text-gray-800 mb-2">Available Times for {formData.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric'})}</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {MOCK_TIME_SLOTS.map(time => (
                                    <button key={time} onClick={() => setFormData(f => ({...f, time}))} className={`p-2 border rounded-md text-sm transition-all ${formData.time === time ? 'bg-primary-600 text-white border-primary-600' : 'hover:bg-gray-100'}`}>
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            {step === 5 && (
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <p><strong>Service:</strong> {formData.reason}</p>
                        <p><strong>Provider:</strong> {selectedProvider?.name}</p>
                        <p><strong>Location:</strong> {formData.location}</p>
                        <p><strong>Date:</strong> {formData.date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><strong>Time:</strong> {formData.time}</p>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                            <label className="font-medium text-gray-700">Set Appointment Reminders</label>
                            <ToggleSwitch name="remindersEnabled" checked={formData.reminders.enabled} onChange={(checked, name) => setFormData(f => ({...f, reminders: {...f.reminders, enabled: checked}}))} />
                        </div>
                        {formData.reminders.enabled && (
                            <div className="mt-4 space-y-3 pl-4 border-l-2 animate-fade-in">
                                <div className="flex items-center space-x-4">
                                     <label className="flex items-center"><input type="checkbox" checked={formData.reminders.channels.email} onChange={e => setFormData(f => ({...f, reminders: {...f.reminders, channels: {...f.reminders.channels, email: e.target.checked}} }))} className="h-4 w-4 text-primary-600 rounded" /> <span className="ml-2 text-sm">Email</span></label>
                                     <label className="flex items-center"><input type="checkbox" checked={formData.reminders.channels.sms} onChange={e => setFormData(f => ({...f, reminders: {...f.reminders, channels: {...f.reminders.channels, sms: e.target.checked}} }))} className="h-4 w-4 text-primary-600 rounded" disabled={!user?.phone} /> <span className={`ml-2 text-sm ${!user?.phone ? 'text-gray-400': ''}`}>SMS</span></label>
                                </div>
                                {!user?.phone && <p className="text-xs text-gray-500">Add a phone number to your profile to enable SMS reminders.</p>}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Remind me:</label>
                                    <select value={formData.reminders.timeOption} onChange={e => setFormData(f => ({...f, reminders: {...f.reminders, timeOption: e.target.value as ReminderSettings['timeOption']}}))} className="w-full mt-1 p-2 border rounded-md">
                                        <option value="1h">1 hour before</option>
                                        <option value="24h">24 hours before</option>
                                        <option value="2d">2 days before</option>
                                        <option value="3d">3 days before</option>
                                        <option value="custom">Custom time</option>
                                    </select>
                                </div>
                                {formData.reminders.timeOption === 'custom' && (
                                    <input
                                        type="datetime-local"
                                        value={formData.reminders.customDateTime || ''}
                                        onChange={e => setFormData(f => ({...f, reminders: {...f.reminders, customDateTime: e.target.value}}))}
                                        className="w-full mt-1 p-2 border rounded-md bg-white"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button onClick={step === 1 ? onClose : handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center">
                    <ChevronLeftIcon className="w-4 h-4 mr-1" /> {step === 1 ? 'Cancel' : 'Back'}
                </button>
                {step < totalSteps && <button onClick={handleNext} disabled={!isStepComplete()} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">Next</button>}
                {step === totalSteps && <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg">Confirm Appointment</button>}
            </div>
        </Modal>
    );
};

export default ScheduleAppointmentModal;
