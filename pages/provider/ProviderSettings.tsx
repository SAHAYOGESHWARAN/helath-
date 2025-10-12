import React, { useState, useEffect } from 'react';
import Card from '../../components/shared/Card';
import { useApp } from '../../App';
import ToggleSwitch from '../../components/shared/ToggleSwitch';

const ProviderSettings: React.FC = () => {
    const { showToast } = useApp();

    // Current state
    const [availabilityStatus, setAvailabilityStatus] = useState<'Available' | 'Busy' | 'Away'>('Available');
    const [reminderSettings, setReminderSettings] = useState({
        twentyFourHours: true,
        oneHour: true,
    });
    const [notificationPreferences, setNotificationPreferences] = useState({
        appointmentReminders: { email: true, sms: false },
        newMessages: { email: true, sms: true },
    });

    // State to track initial values for 'dirty' check
    const [initialState, setInitialState] = useState({
        availabilityStatus: 'Available',
        reminderSettings: { twentyFourHours: true, oneHour: true },
        notificationPreferences: {
            appointmentReminders: { email: true, sms: false },
            newMessages: { email: true, sms: true },
        },
    });

    const [isDirty, setIsDirty] = useState(false);

    // Effect to check for changes
    useEffect(() => {
        const hasChanged =
            JSON.stringify({ availabilityStatus, reminderSettings, notificationPreferences }) !==
            JSON.stringify(initialState);
        setIsDirty(hasChanged);
    }, [availabilityStatus, reminderSettings, notificationPreferences, initialState]);

    const handleReminderToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReminderSettings({ ...reminderSettings, [e.target.name]: e.target.checked });
    };

    const handleNotificationToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const [category, type] = name.split('-') as [keyof typeof notificationPreferences, 'email' | 'sms'];

        setNotificationPreferences(prev => ({
            ...prev,
            [category]: { ...prev[category], [type]: checked },
        }));
    };

    const handleSaveChanges = () => {
        const newState = { availabilityStatus, reminderSettings, notificationPreferences };
        console.log("Saving new state:", newState);
        showToast(`Settings have been updated successfully!`, 'success');
        
        // Update the initial state to the new saved state
        setInitialState(newState);
    };

    const availabilityOptions = [
        { status: 'Available', color: 'bg-emerald-500', description: 'Ready to take appointments and messages.' },
        { status: 'Busy', color: 'bg-amber-500', description: 'Currently with a patient, responses may be delayed.' },
        { status: 'Away', color: 'bg-slate-500', description: 'Out of office, will respond upon return.' },
    ] as const;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
            <div className="max-w-2xl space-y-8">
                <Card title="General Availability">
                    <p className="text-sm text-gray-500 -mt-2 mb-4">
                        This status is displayed to patients on your profile.
                    </p>
                    <fieldset>
                        <legend className="sr-only">Availability Status</legend>
                        <div className="space-y-3">
                            {availabilityOptions.map((option) => (
                                <label
                                    key={option.status}
                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${availabilityStatus === option.status ? 'bg-primary-50 border-primary-400 ring-2 ring-primary-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center">
                                         <span className={`inline-block w-3 h-3 rounded-full mr-3 ${option.color}`}></span>
                                        <div>
                                           <span className="font-medium text-gray-800">{option.status}</span>
                                           <p className="text-xs text-gray-500">{option.description}</p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="availabilityStatus"
                                        value={option.status}
                                        checked={availabilityStatus === option.status}
                                        onChange={() => setAvailabilityStatus(option.status)}
                                        className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                    />
                                </label>
                            ))}
                        </div>
                    </fieldset>
                </Card>

                <Card title="Reminders & Notifications">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Appointment Reminder Settings</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">Configure your preferred reminder timings for appointments.</p>
                             <div className="space-y-3 pl-2">
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-800">24 hours before appointment</p>
                                    <ToggleSwitch name="twentyFourHours" checked={reminderSettings.twentyFourHours} onChange={handleReminderToggle} />
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-800">1 hour before appointment</p>
                                    <ToggleSwitch name="oneHour" checked={reminderSettings.oneHour} onChange={handleReminderToggle} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">Choose how you want to receive notifications.</p>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-sm text-gray-700 mb-2">For Appointment Reminders</p>
                                    <div className="space-y-3 pl-2">
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                            <p className="text-sm text-gray-800">Email Notifications</p>
                                            <ToggleSwitch name="appointmentReminders-email" checked={notificationPreferences.appointmentReminders.email} onChange={handleNotificationToggle} />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                            <p className="text-sm text-gray-800">SMS Notifications</p>
                                            <ToggleSwitch name="appointmentReminders-sms" checked={notificationPreferences.appointmentReminders.sms} onChange={handleNotificationToggle} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-gray-700 mb-2">For New Messages</p>
                                    <div className="space-y-3 pl-2">
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                            <p className="text-sm text-gray-800">Email Notifications</p>
                                            <ToggleSwitch name="newMessages-email" checked={notificationPreferences.newMessages.email} onChange={handleNotificationToggle} />
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                                            <p className="text-sm text-gray-800">SMS Notifications</p>
                                            <ToggleSwitch name="newMessages-sms" checked={notificationPreferences.newMessages.sms} onChange={handleNotificationToggle} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
                
                <div className="flex justify-end">
                    <button 
                        onClick={handleSaveChanges} 
                        disabled={!isDirty}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Save All Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProviderSettings;