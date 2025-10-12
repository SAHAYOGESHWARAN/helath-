import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { useApp } from '../../App';
import { SpinnerIcon } from '../../components/shared/Icons';

const ProviderSettings: React.FC = () => {
    const { showToast } = useApp();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notifications, setNotifications] = useState({
        newAppointments: true,
        appointmentCancellations: true,
        newMessages: true,
        refillRequests: true,
    });

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({ ...prev, [name]: checked }));
    };

    const handleSave = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            // In a real app, this would call a context function `updateProviderSettings(settings)`
            console.log("Saving settings:", notifications);
            showToast('Settings saved successfully!', 'success');
            setIsSubmitting(false);
        }, 1000);
    };

    const handleCalendarConnect = (calendar: 'Google' | 'Outlook') => {
        showToast(`Connecting to ${calendar} Calendar... (mock)`, 'info');
        setTimeout(() => {
            showToast(`Successfully connected to ${calendar} Calendar!`, 'success');
        }, 1500);
    }

    return (
        <div>
            <PageHeader title="Settings" subtitle="Manage your practice and account preferences." />

            <div className="space-y-8 max-w-3xl mx-auto">
                <Card title="Notification Settings">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50"><p>New appointment bookings</p><ToggleSwitch name="newAppointments" checked={notifications.newAppointments} onChange={handleNotificationChange} /></div>
                        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50"><p>Appointment cancellations</p><ToggleSwitch name="appointmentCancellations" checked={notifications.appointmentCancellations} onChange={handleNotificationChange} /></div>
                        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50"><p>New patient messages</p><ToggleSwitch name="newMessages" checked={notifications.newMessages} onChange={handleNotificationChange} /></div>
                         <div className="flex items-center justify-between p-3 rounded-md bg-gray-50"><p>Prescription refill requests</p><ToggleSwitch name="refillRequests" checked={notifications.refillRequests} onChange={handleNotificationChange} /></div>
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