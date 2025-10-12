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
    const { notificationSettings, updateNotificationSettings, changePassword } = useAuth();
    
    const [notifSettings, setNotifSettings] = useState(notificationSettings);
    const [isNotifSubmitting, setIsNotifSubmitting] = useState(false);

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotifSettings(prev => ({ ...prev, [name]: checked }));
    };

    const handleSaveNotifications = () => {
        setIsNotifSubmitting(true);
        updateNotificationSettings(notifSettings).then(() => {
            showToast('Notification settings saved!', 'success');
            setIsNotifSubmitting(false);
        });
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
                                <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Appointment reminders</p><ToggleSwitch name="emailAppointments" checked={notifSettings.emailAppointments} onChange={handleNotificationChange} /></div>
                                <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Billing alerts</p><ToggleSwitch name="emailBilling" checked={notifSettings.emailBilling} onChange={handleNotificationChange} /></div>
                                <div className="flex items-center justify-between"><p className="text-sm text-gray-600">New messages</p><ToggleSwitch name="emailMessages" checked={notifSettings.emailMessages} onChange={handleNotificationChange} /></div>
                            </div>
                        </div>
                         <div className="pt-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Push Notifications</h3>
                            <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Enable all</p><ToggleSwitch name="pushAll" checked={notifSettings.pushAll} onChange={handleNotificationChange} /></div>
                        </div>
                    </div>
                    <div className="text-right mt-6 border-t pt-4">
                        <button onClick={handleSaveNotifications} disabled={isNotifSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                            {isNotifSubmitting ? <SpinnerIcon/> : 'Save Changes'}
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
                                    <Field type="password" name="current" className={`w-full p-2 border rounded ${errors.current && touched.current ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="current" component="p" className="text-red-500 text-xs"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                    <Field type="password" name="newPass" className={`w-full p-2 border rounded ${errors.newPass && touched.newPass ? 'border-red-500' : 'border-gray-300'}`} />
                                    <ErrorMessage name="newPass" component="p" className="text-red-500 text-xs"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                    <Field type="password" name="confirm" className={`w-full p-2 border rounded ${errors.confirm && touched.confirm ? 'border-red-500' : 'border-gray-300'}`} />
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
