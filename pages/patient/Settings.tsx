import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { useApp } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SpinnerIcon } from '../../components/shared/Icons';

const PasswordSchema = Yup.object().shape({
  current: Yup.string().required('Current password is required'),
  newPass: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirm: Yup.string().oneOf([Yup.ref('newPass'), undefined], 'Passwords must match').required('Please confirm your new password'),
});

const Settings: React.FC = () => {
    const { showToast } = useApp();
    const { user, updateUser, changePassword } = useAuth();
    
    const [settings, setSettings] = useState(user?.notificationSettings);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!settings) return null;

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSettings(prev => ({ ...prev!, [name]: checked }));
    };

    const handleSaveNotifications = () => {
        setIsSubmitting(true);
        updateUser(currentUser => ({...currentUser, notificationSettings: settings}))
        .then(() => {
            showToast('Notification settings saved!', 'success');
            setIsSubmitting(false);
        });
    };

    const hasPhoneForSms = user?.phone && user.phone.trim() !== '';

    return (
        <div>
            <PageHeader title="Settings" subtitle="Manage your account preferences and security." />

            <div className="space-y-8">
                <Card title="Notification Settings">
                    <div className="space-y-4 divide-y">
                         <div className="pt-4 first:pt-0">
                            <h3 className="font-semibold text-gray-800 mb-2">Email Notifications</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Appointment reminders</p><ToggleSwitch name="emailAppointments" checked={settings.emailAppointments} onChange={handleNotificationChange} /></div>
                                <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Billing alerts</p><ToggleSwitch name="emailBilling" checked={settings.emailBilling} onChange={handleNotificationChange} /></div>
                                <div className="flex items-center justify-between"><p className="text-sm text-gray-600">New messages</p><ToggleSwitch name="emailMessages" checked={settings.emailMessages} onChange={handleNotificationChange} /></div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <h3 className="font-semibold text-gray-800 mb-2">SMS Notifications</h3>
                            <div className={`p-3 rounded-md ${!hasPhoneForSms ? 'bg-white border' : ''}`}>
                                <div className="flex items-center justify-between">
                                    <p className={`text-sm ${!hasPhoneForSms ? 'text-gray-400' : 'text-gray-600'}`}>New messages</p>
                                    <ToggleSwitch name="smsMessages" checked={settings.smsMessages && hasPhoneForSms} onChange={handleNotificationChange} />
                                </div>
                                {!hasPhoneForSms && <p className="text-xs text-gray-500 mt-2">Please add a phone number to your <a href="#/profile" className="text-primary-600 underline">profile</a> to enable SMS notifications.</p>}
                            </div>
                        </div>
                         <div className="pt-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Push Notifications</h3>
                            <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Enable all</p><ToggleSwitch name="pushAll" checked={settings.pushAll} onChange={handleNotificationChange} /></div>
                        </div>
                    </div>
                    <div className="text-right mt-6 border-t pt-4">
                        <button onClick={handleSaveNotifications} disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                            {isSubmitting ? <SpinnerIcon/> : 'Save Changes'}
                        </button>
                    </div>
                </Card>

                <Card title="Change Password">
                    <Formik
                        initialValues={{ current: '', newPass: '', confirm: '' }}
                        validationSchema={PasswordSchema}
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            changePassword(values.current, values.newPass).then((success) => {
                                if (success) {
                                    showToast('Password changed successfully!', 'success');
                                    resetForm();
                                } else {
                                    showToast('Failed to change password. Check current password.', 'error');
                                }
                                setSubmitting(false);
                            });
                        }}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                    <Field type="password" name="current" className={`w-full p-2 border bg-white rounded ${errors.current && touched.current ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="current" component="p" className="text-red-500 text-xs"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <Field type="password" name="newPass" className={`w-full p-2 border bg-white rounded ${errors.newPass && touched.newPass ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="newPass" component="p" className="text-red-500 text-xs"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <Field type="password" name="confirm" className={`w-full p-2 border bg-white rounded ${errors.confirm && touched.confirm ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="confirm" component="p" className="text-red-500 text-xs"/>
                                </div>
                                <div className="text-right pt-2">
                                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-40 flex justify-center items-center">
                                       {isSubmitting ? <SpinnerIcon/> : 'Update Password'}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </div>
        </div>
    );
};

export default Settings;