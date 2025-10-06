import React, { useState } from 'react';
import Card from '../../components/shared/Card';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    emailAppointments: true,
    emailBilling: true,
    smsReminders: false,
  });

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Password changed successfully! (mock)');
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Notification Preferences">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">Appointment Updates</span>
                <span className="text-sm text-gray-500">Get email notifications for new appointments and changes.</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="emailAppointments" checked={notifications.emailAppointments} onChange={handleToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
               <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">Billing Alerts</span>
                <span className="text-sm text-gray-500">Get email notifications for new statements and payments.</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="emailBilling" checked={notifications.emailBilling} onChange={handleToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
             <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">SMS Reminders</span>
                <span className="text-sm text-gray-500">Receive text message reminders 24 hours before appointments.</span>
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="smsReminders" checked={notifications.smsReminders} onChange={handleToggle} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </Card>
        <Card title="Change Password">
          <form onSubmit={handlePasswordChange} className="space-y-4">
             <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" id="currentPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>
            <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" id="newPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>
             <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" id="confirmPassword" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"/>
            </div>
            <div className="text-right pt-2">
                <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Update Password</button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;