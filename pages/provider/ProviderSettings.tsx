
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { useApp } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { SpinnerIcon } from '../../components/shared/Icons';

const ProviderSettings: React.FC = () => {
    const { showToast } = useApp();
    const { user, updateUser } = useAuth();
    
    const [settings, setSettings] = useState(user?.notificationSettings);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!settings) return null;

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSettings(prev => ({ ...prev!, [name]: checked }));
    };

    const handleSave = () => {
        setIsSubmitting(true);
        updateUser(currentUser => ({ ...currentUser, notificationSettings: settings }))
        .then(() => {
            showToast('Settings saved successfully!', 'success');
            setIsSubmitting(false);
        });
    };

    const handleCalendarConnect = (calendar: 'Google' | 'Outlook') => {
        showToast(`Connecting to ${calendar} Calendar... (mock)`, 'info');
        setTimeout(() => {
            showToast(`Successfully connected to ${calendar} Calendar!`, 'success');
        }, 1500);
    }
    
    const hasPhoneForSms = user?.phone && user.phone.trim() !== '';

    return (
        <div>
            <PageHeader title="Settings" subtitle="Manage your practice and account preferences." />

            <div className="space-y-8 max-w-3xl mx-auto">
                <Card title="Notification Settings">
                    <div className="space-y-4 divide-y">
                        <div className="pt-4 first:pt-0">
                             <h3 className="font-semibold text-gray-800 mb-2">Email Notifications</h3>
                             <div className="space-y-3">
                                <div className="flex items-center justify-between"><p>New appointment bookings</p><ToggleSwitch name="emailAppointments" checked={settings.emailAppointments} onChange={handleNotificationChange} /></div>
                                <div className="flex items-center justify-between"><p>Appointment cancellations</p><ToggleSwitch name="emailBilling" checked={settings.emailBilling} onChange={handleNotificationChange} /></div>
                                <div className="flex items-center justify-between"><p>New patient messages</p><ToggleSwitch name="emailMessages" checked={settings.emailMessages} onChange={handleNotificationChange} /></div>
                            </div>
                        </div>
                         <div className="pt-4">
                            <h3 className="font-semibold text-gray-800 mb-2">SMS Notifications</h3>
                            <div className={`p-3 rounded-md ${!hasPhoneForSms ? 'bg-white border' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <p className={`text-sm ${!hasPhoneForSms ? 'text-gray-400' : 'text-gray-600'}`}>New patient messages</p>
                                    <ToggleSwitch name="smsMessages" checked={settings.smsMessages && hasPhoneForSms} onChange={handleNotificationChange} />
                                </div>
                                {!hasPhoneForSms && <p className="text-xs text-gray-500 mt-2">Please add a phone number to your <a href="#/profile" className="text-primary-600 underline">profile</a> to enable SMS notifications.</p>}
                            </div>
                        </div>
                    </div>
                </Card>

                 <Card title="Calendar Integration">
                    <p className="text-sm text-gray-600 mb-4">Sync your NovoPath calendar with your external calendar application.</p>
                    <div className="flex space-x-4">
                        <button onClick={() => handleCalendarConnect('Google')} className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg text-sm">Connect Google Calendar</button>
                        <button onClick={() => handleCalendarConnect('Outlook')} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm">Connect Outlook Calendar</button>
                    </div>
                </Card>

                <div className="flex justify-end">
                    <button onClick={handleSave} disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg w-48 flex justify-center items-center">
                        {isSubmitting ? <SpinnerIcon/> : 'Save All Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderSettings;