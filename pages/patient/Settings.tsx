import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { useApp } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import Tabs from '../../components/shared/Tabs';
import { ShieldCheckIcon, BellIcon, ProfileIcon, GlobeAltIcon } from '../../components/shared/Icons';
import ToggleSwitch from '../../components/shared/ToggleSwitch';

const SETTINGS_KEY = 'tangerine-notification-prefs';

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
    if (savedState) return { ...defaultState, ...JSON.parse(savedState) };
  } catch (error) { console.error('Failed to load settings', error); }
  return defaultState;
};

const ProfileSettings = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '555-123-4567',
        address: user?.address || '123 Main St, Anytown, USA'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({...profile, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(profile);
        showToast('Profile updated!', 'success');
    };

    return (
        <Card title="Personal Information">
             <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Full Name</label>
                    <input name="name" value={profile.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                 <div>
                    <label>Email Address</label>
                    <input name="email" value={profile.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                 <div>
                    <label>Phone Number</label>
                    <input name="phone" value={profile.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                 <div>
                    <label>Address</label>
                    <input name="address" value={profile.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
                </div>
                 <div className="text-right">
                    <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save Profile</button>
                </div>
            </form>
        </Card>
    )
}

const NotificationSettings = () => {
    const [notifications, setNotifications] = useState(getInitialState);
    const { showToast } = useApp();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checkedValue = (e.target as HTMLInputElement).checked;
        setNotifications(prev => ({...prev, [name]: isCheckbox ? checkedValue : value }));
    };

    const handleSave = () => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(notifications));
        showToast('Notification settings saved!', 'success');
    };

    return (
        <Card title="Notification Preferences">
            <div className="space-y-6">
                 <div className="flex items-center justify-between"><span className="flex-grow flex flex-col"><span className="font-medium">Email for Appointments</span><span className="text-sm text-gray-500">Confirmations and updates.</span></span><ToggleSwitch name="emailAppointments" checked={notifications.emailAppointments} onChange={handleChange}/></div>
                 <div className="flex items-center justify-between"><span className="flex-grow flex flex-col"><span className="font-medium">SMS for Reminders</span><span className="text-sm text-gray-500">Get texts before appointments.</span></span><ToggleSwitch name="smsReminders" checked={notifications.smsReminders} onChange={handleChange}/></div>
                 <div className="flex items-center justify-between"><span className="flex-grow flex flex-col"><span className="font-medium">Email for Lab Results</span><span className="text-sm text-gray-500">Get notified for new results.</span></span><ToggleSwitch name="emailLabs" checked={notifications.emailLabs} onChange={handleChange}/></div>
                 <div className="flex items-center justify-between"><span className="flex-grow flex flex-col"><span className="font-medium">SMS for Medication Reminders</span><span className="text-sm text-gray-500">Receive texts for medications.</span></span><ToggleSwitch name="smsMedications" checked={notifications.smsMedications} onChange={handleChange}/></div>
                <div className="border-t pt-6">
                    <label htmlFor="defaultReminderTime" className="block font-medium">Default Reminder Time</label>
                    <p className="text-sm text-gray-500 mb-2">Set a default for new appointments.</p>
                    <select name="defaultReminderTime" id="defaultReminderTime" value={notifications.defaultReminderTime} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md">
                        <option value="1h">1 hour before</option>
                        <option value="24h">24 hours before</option>
                        <option value="2d">2 days before</option>
                    </select>
                </div>
                <div className="text-right">
                    <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Save Notifications</button>
                </div>
            </div>
        </Card>
    );
};

const SecuritySettings = () => {
     const { showToast } = useApp();
     const handlePasswordChange = (e: React.FormEvent) => { e.preventDefault(); showToast('Password changed successfully!', 'success'); };
     const handle2FA = () => { showToast('2FA setup flow started!', 'info'); };
    return (
        <div className="space-y-8">
            <Card title="Change Password">
                 <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div><label>Current Password</label><input type="password" id="currentPassword" className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div><label>New Password</label><input type="password" id="newPassword" className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div><label>Confirm New Password</label><input type="password" id="confirmPassword" className="mt-1 block w-full p-2 border rounded-md"/></div>
                    <div className="text-right pt-2"><button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Update Password</button></div>
                </form>
            </Card>
             <Card title="Two-Factor Authentication (2FA)">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">Enable 2FA</h3>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                    <button onClick={handle2FA} className="font-bold py-2 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Enable</button>
                </div>
            </Card>
        </div>
    );
}

const PrivacySettings = () => {
    const { showToast } = useApp();
    return (
        <Card title="Data & Privacy">
            <div className="space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="font-medium">Download Your Data</h3>
                        <p className="text-sm text-gray-500">Export a copy of your personal and health information.</p>
                    </div>
                    <button onClick={() => showToast('Data export started. It will be emailed to you.', 'info')} className="font-bold py-2 px-4 rounded-lg bg-primary-600 text-white hover:bg-primary-700">Request Export</button>
                </div>
                 <div className="flex items-start justify-between border-t pt-6">
                    <div>
                        <h3 className="font-medium text-red-700">Delete Your Account</h3>
                        <p className="text-sm text-gray-500">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    </div>
                    <button onClick={() => showToast('Account deletion initiated.', 'error')} className="font-bold py-2 px-4 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete Account</button>
                </div>
            </div>
        </Card>
    );
}


const Settings: React.FC = () => {
    const TABS = [
        { name: 'Profile', icon: <ProfileIcon />, content: <ProfileSettings /> },
        { name: 'Security', icon: <ShieldCheckIcon />, content: <SecuritySettings /> },
        { name: 'Notifications', icon: <BellIcon />, content: <NotificationSettings /> },
        { name: 'Data & Privacy', icon: <GlobeAltIcon />, content: <PrivacySettings /> },
    ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
      <Tabs tabs={TABS} />
    </div>
  );
};

export default Settings;