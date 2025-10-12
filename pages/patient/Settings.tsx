
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import { useApp } from '../../App';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import PageHeader from '../../components/shared/PageHeader';
import { ShieldCheckIcon, BellIcon, ProfileIcon } from '../../components/shared/Icons';
import Tabs from '../../components/shared/Tabs';
import { Link } from 'react-router-dom';

const NotificationSettings = () => {
    const [notifications, setNotifications] = useState({
        appointmentReminders: true,
        labResults: true,
        messages: true,
        promotions: false,
    });

    const [reminderTimings, setReminderTimings] = useState({
        twentyFourHours: true,
        oneHour: true,
    });

    const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications({ ...notifications, [e.target.name]: e.target.checked });
    };

    const handleReminderToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReminderTimings({ ...reminderTimings, [e.target.name]: e.target.checked });
    };


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <p className="font-medium text-gray-800">Appointment Reminders</p>
                    <p className="text-sm text-gray-500">Get notified about upcoming appointments.</p>
                </div>
                <ToggleSwitch name="appointmentReminders" checked={notifications.appointmentReminders} onChange={handleToggle} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <p className="font-medium text-gray-800">New Lab Results</p>
                    <p className="text-sm text-gray-500">Receive alerts when lab results are available.</p>
                </div>
                <ToggleSwitch name="labResults" checked={notifications.labResults} onChange={handleToggle} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <p className="font-medium text-gray-800">New Messages</p>
                    <p className="text-sm text-gray-500">Get notified about new messages from your provider.</p>
                </div>
                <ToggleSwitch name="messages" checked={notifications.messages} onChange={handleToggle} />
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <p className="font-medium text-gray-800">Promotions & News</p>
                    <p className="text-sm text-gray-500">Receive updates about new services and offers.</p>
                </div>
                <ToggleSwitch name="promotions" checked={notifications.promotions} onChange={handleToggle} />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800">Reminder Timing</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Choose when to be reminded about upcoming appointments.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800">24 hours before</p>
                        </div>
                        <ToggleSwitch 
                            name="twentyFourHours" 
                            checked={reminderTimings.twentyFourHours} 
                            onChange={handleReminderToggle} 
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium text-gray-800">1 hour before</p>
                        </div>
                        <ToggleSwitch 
                            name="oneHour" 
                            checked={reminderTimings.oneHour} 
                            onChange={handleReminderToggle} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SecuritySettings = () => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" className="mt-1 block w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" className="mt-1 block w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" className="mt-1 block w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
        </div>
    )
};


const AccountSettings = () => {
    const { showToast } = useApp();
    return (
        <div>
            <p className="text-gray-600 mb-4">Manage your personal information on the profile page.</p>
            <Link
                to="/profile"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
                Go to My Profile
            </Link>

            <div className="mt-8 pt-6 border-t border-red-200">
                <h3 className="text-lg font-semibold text-red-700">Deactivate Account</h3>
                <p className="text-sm text-gray-600 mt-2">This action is permanent and cannot be undone. All your health data will be archived according to medical record retention laws.</p>
                 <button onClick={() => showToast('Account deactivation request sent.', 'info')} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                    Request Account Deactivation
                </button>
            </div>
        </div>
    )
};


const Settings: React.FC = () => {
    const { showToast } = useApp();

    const tabs = [
        { name: 'Account', icon: <ProfileIcon />, content: <AccountSettings /> },
        { name: 'Notifications', icon: <BellIcon />, content: <NotificationSettings /> },
        { name: 'Security', icon: <ShieldCheckIcon />, content: <SecuritySettings /> },
    ];
    
    const handleSave = () => {
        showToast('Settings saved successfully!', 'success');
    };

    return (
        <div>
            <PageHeader title="Settings" />
            
            <Card>
                <Tabs tabs={tabs} />
                 <div className="text-right border-t border-gray-200 mt-6 pt-4">
                    <button 
                        onClick={handleSave} 
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Save All Changes
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default Settings;
