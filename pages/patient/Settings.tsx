
import React, { useState, useEffect } from 'react';
import Card from '../../components/shared/Card';
import { useApp } from '../../App';

const SETTINGS_KEY = 'tangerine-notification-prefs';

// This function safely initializes the state from localStorage, falling back to defaults.
const getInitialState = () => {
  const defaultState = {
    emailAppointments: true,
    smsReminders: false,
    emailLabs: true,
    smsMedications: true,
    defaultReminderTime: '24h',
  };

  try {
    const savedState = localStorage.getItem(SETTINGS_KEY);
    if (savedState) {
      // Merge saved state over defaults to ensure all keys are present
      return { ...defaultState, ...JSON.parse(savedState) };
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage', error);
  }

  return defaultState;
};

const ToggleSwitch: React.FC<{name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ name, checked, onChange}) => (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
    </label>
);

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(getInitialState);
  const { showToast } = useApp();

  // This effect synchronizes the state with localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notification settings to localStorage', error);
    }
  }, [notifications]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setNotifications(prev => ({ ...prev, [name]: checked }));
    } else {
        setNotifications(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSaveChanges = () => {
      showToast('Settings saved successfully!', 'success');
  }

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Password changed successfully!', 'success');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <Card title="Notification Preferences">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                <span className="flex-grow flex flex-col pr-4">
                    <span className="text-sm font-medium text-gray-900">Email for Appointments</span>
                    <span className="text-sm text-gray-500">Confirmations and updates.</span>
                </span>
                <ToggleSwitch name="emailAppointments" checked={notifications.emailAppointments} onChange={handleSettingsChange}/>
                </div>
                <div className="flex items-center justify-between">
                <span className="flex-grow flex flex-col pr-4">
                    <span className="text-sm font-medium text-gray-900">SMS for Appointment Reminders</span>
                    <span className="text-sm text-gray-500">Get texts before your appointments.</span>
                </span>
                <ToggleSwitch name="smsReminders" checked={notifications.smsReminders} onChange={handleSettingsChange}/>
                </div>
                 <div className="flex items-center justify-between">
                <span className="flex-grow flex flex-col pr-4">
                    <span className="text-sm font-medium text-gray-900">Email for Lab Results</span>
                    <span className="text-sm text-gray-500">Get notified when new results are available.</span>
                </span>
                <ToggleSwitch name="emailLabs" checked={notifications.emailLabs} onChange={handleSettingsChange}/>
                </div>
                 <div className="flex items-center justify-between">
                <span className="flex-grow flex flex-col pr-4">
                    <span className="text-sm font-medium text-gray-900">SMS for Medication Reminders</span>
                    <span className="text-sm text-gray-500">Receive texts when it's time to take medication.</span>
                </span>
                <ToggleSwitch name="smsMedications" checked={notifications.smsMedications} onChange={handleSettingsChange}/>
                </div>
                <div className="border-t border-gray-200 pt-6">
                    <label htmlFor="defaultReminderTime" className="block text-sm font-medium text-gray-900">Default Reminder Time</label>
                    <p className="text-sm text-gray-500 mb-2">Set a default for all new appointments.</p>
                    <select
                        name="defaultReminderTime"
                        id="defaultReminderTime"
                        value={notifications.defaultReminderTime}
                        onChange={handleSettingsChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                        <option value="1h">1 hour before</option>
                        <option value="24h">24 hours before</option>
                        <option value="2d">2 days before</option>
                        <option value="3d">3 days before</option>
                    </select>
                </div>
                <div className="text-right">
                    <button onClick={handleSaveChanges} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save Notifications</button>
                </div>
            </div>
            </Card>
            <Card title="Connected Devices" className="mt-8">
                <p className="text-sm text-gray-600 mb-4">Connect your health devices to automatically sync your data. (This is a mock interface)</p>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>Apple Health</span>
                        <button className="text-sm font-bold text-white bg-gray-800 hover:bg-black px-3 py-1.5 rounded-md">Connect</button>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>Fitbit</span>
                        <button className="text-sm font-bold text-white bg-teal-500 hover:bg-teal-600 px-3 py-1.5 rounded-md">Connect</button>
                    </div>
                </div>
            </Card>
        </div>
        <div>
            <Card title="Security">
            <form onSubmit={handlePasswordChange} className="space-y-4">
                <h3 className="font-semibold text-lg">Change Password</h3>
                <div>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                </div>
                <div>
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" id="newPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input type="password" id="confirmPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
                </div>
                <div className="text-right pt-2">
                    <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Update Password</button>
                </div>
            </form>
            </Card>
             <Card title="Two-Factor Authentication (2FA)" className="mt-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-medium text-gray-900">Enable 2FA</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="font-bold py-2 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                        Enable
                    </button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
