
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { useApp } from '../../App';

const Settings: React.FC = () => {
    const { showToast } = useApp();
    const [notifications, setNotifications] = useState({
        emailAppointments: true,
        emailBilling: true,
        emailMessages: true,
        pushAll: false,
    });
     const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotifications(prev => ({ ...prev, [name]: checked }));
    };

    const handleSaveNotifications = () => {
        showToast('Notification settings saved!', 'success');
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (password.new !== password.confirm) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        if(password.new.length < 8) {
             showToast('New password must be at least 8 characters.', 'error');
            return;
        }
        showToast('Password changed successfully!', 'success');
        setPassword({ current: '', new: '', confirm: '' });
    };

    return (
        <div>
            <PageHeader title="Settings" subtitle="Manage your account preferences and security." />

            <div className="space-y-8">
                <Card title="Notification Settings">
                    <div className="space-y-4 divide-y">
                        <div className="pt-4 first:pt-0">
                            <h3 className="font-semibold text-gray-800 mb-2">Email Notifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Appointment reminders and updates</p>
                                    <ToggleSwitch name="emailAppointments" checked={notifications.emailAppointments} onChange={handleNotificationChange} />
                                </div>
                                 <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">Billing and payment alerts</p>
                                    <ToggleSwitch name="emailBilling" checked={notifications.emailBilling} onChange={handleNotificationChange} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">New messages from providers</p>
                                    <ToggleSwitch name="emailMessages" checked={notifications.emailMessages} onChange={handleNotificationChange} />
                                </div>
                            </div>
                        </div>
                         <div className="pt-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Push Notifications (Mobile App)</h3>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">Enable all push notifications</p>
                                <ToggleSwitch name="pushAll" checked={notifications.pushAll} onChange={handleNotificationChange} />
                            </div>
                        </div>
                    </div>
                    <div className="text-right mt-6 border-t pt-4">
                        <button onClick={handleSaveNotifications} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Changes</button>
                    </div>
                </Card>

                <Card title="Change Password">
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input type="password" value={password.current} onChange={e => setPassword(p => ({...p, current: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input type="password" value={password.new} onChange={e => setPassword(p => ({...p, new: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input type="password" value={password.confirm} onChange={e => setPassword(p => ({...p, confirm: e.target.value}))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                         <div className="text-right pt-2">
                            <button type="submit" className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Update Password</button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Settings;
