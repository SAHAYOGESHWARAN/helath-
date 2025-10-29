import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { useApp } from '../../App';
import { MailIcon, DeviceMobileIcon, SpinnerIcon } from '../../components/shared/Icons';
import ToggleSwitch from '../../components/shared/ToggleSwitch';

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    
    const [editMode, setEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });

    const [notificationSettings, setNotificationSettings] = useState(user?.notificationSettings || {
        emailAppointments: true,
        emailBilling: true,
        emailMessages: true,
        smsMessages: false,
        pushAll: false,
    });
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsSubmitting(true);
        updateUser(currentUser => ({ ...currentUser, ...formData })).then(() => {
            showToast('Profile updated successfully!', 'success');
            setEditMode(false);
            setIsSubmitting(false);
        });
    };
    
    const handleCancel = () => {
        if (!user) return;
        setFormData({ name: user.name, email: user.email, phone: user.phone || '', address: user.address || '' });
        setEditMode(false);
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotificationSettings(prev => ({ ...prev!, [name]: checked }));
    };

    const handleSaveNotifications = () => {
        setIsSavingNotifications(true);
        updateUser(currentUser => ({...currentUser, notificationSettings})).then(() => {
            showToast('Notification settings updated!', 'success');
            setIsSavingNotifications(false);
        });
    };

    const hasPhoneForSms = formData.phone && formData.phone.trim() !== '';


    if (!user) return <div>Loading profile...</div>;

    return (
        <div>
            <PageHeader title="My Profile" subtitle="View and manage your personal information." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <div className="flex flex-col items-center">
                             <div className="relative group mb-4">
                                <img src={user.avatarUrl} alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-primary-200" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <Card title="Personal Information">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                {editMode ? <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md" /> : <p className="text-lg text-gray-800">{formData.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Email Address</label>
                                <p className="text-lg text-gray-800 flex items-center"><MailIcon className="w-5 h-5 mr-2 text-gray-400"/>{formData.email}</p>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                                {editMode ? <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md" /> : <p className="text-lg text-gray-800 flex items-center"><DeviceMobileIcon className="w-5 h-5 mr-2 text-gray-400"/>{formData.phone || 'Not provided'}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Address</label>
                                {editMode ? <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border bg-white border-gray-300 rounded-md" /> : <p className="text-lg text-gray-800">{formData.address || 'Not provided'}</p>}
                            </div>
                        </div>
                         <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            {editMode ? (
                                <>
                                    <button onClick={handleCancel} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                                    <button onClick={handleSave} disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex items-center justify-center">
                                       {isSubmitting ? <SpinnerIcon/> : 'Save Changes'}
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setEditMode(true)} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Edit Profile</button>
                            )}
                        </div>
                    </Card>
                    <Card title="Notification Settings">
                        <div className="space-y-4 divide-y">
                            <div className="pt-4 first:pt-0">
                                <h3 className="font-semibold text-gray-800 mb-2">Email Notifications</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Appointment reminders & updates</p><ToggleSwitch name="emailAppointments" checked={notificationSettings.emailAppointments} onChange={handleNotificationChange} /></div>
                                    <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Billing alerts & invoices</p><ToggleSwitch name="emailBilling" checked={notificationSettings.emailBilling} onChange={handleNotificationChange} /></div>
                                    <div className="flex items-center justify-between"><p className="text-sm text-gray-600">New secure messages</p><ToggleSwitch name="emailMessages" checked={notificationSettings.emailMessages} onChange={handleNotificationChange} /></div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <h3 className="font-semibold text-gray-800 mb-2">SMS Notifications</h3>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <p className={`text-sm ${!hasPhoneForSms ? 'text-gray-400' : 'text-gray-600'}`}>Alerts for new messages</p>
                                        <ToggleSwitch name="smsMessages" checked={notificationSettings.smsMessages && hasPhoneForSms} onChange={handleNotificationChange} disabled={!hasPhoneForSms}/>
                                    </div>
                                    {!hasPhoneForSms && <p className="text-xs text-gray-500 mt-2">Please add a phone number in your personal information to enable SMS notifications.</p>}
                                </div>
                            </div>
                        </div>
                        <div className="text-right mt-6 border-t pt-4">
                            <button onClick={handleSaveNotifications} disabled={isSavingNotifications} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                                {isSavingNotifications ? <SpinnerIcon/> : 'Save Settings'}
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;