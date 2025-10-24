
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { useApp } from '../../App';
import { useAuth } from '../../hooks/useAuth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { SpinnerIcon, CreditCardIcon, ShieldCheckIcon, BellIcon } from '../../components/shared/Icons';
import Tabs from '../../components/shared/Tabs';
import { InsuranceInfo } from '../../types';

const PasswordSchema = Yup.object().shape({
  current: Yup.string().required('Current password is required'),
  newPass: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirm: Yup.string().oneOf([Yup.ref('newPass'), undefined], 'Passwords must match').required('Please confirm your new password'),
});

const InsuranceSchema = Yup.object().shape({
  provider: Yup.string().required('Provider name is required'),
  planName: Yup.string().required('Plan name is required'),
  memberId: Yup.string().required('Member ID is required'),
  groupId: Yup.string().required('Group ID is required'),
});

const NotificationsTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    const [settings, setSettings] = useState(user?.notificationSettings);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    if (!settings) return null;

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSettings(prev => ({ ...prev!, [name]: checked }));
    };

    const handleSave = () => {
        setIsSubmitting(true);
        updateUser(currentUser => ({...currentUser, notificationSettings: settings}))
        .then(() => {
            showToast('Notification settings saved!', 'success');
            setIsSubmitting(false);
        });
    };
    
    const hasPhoneForSms = user?.phone && user.phone.trim() !== '';

    return (
        <Card>
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
                    <div className="flex items-center justify-between">
                        <p className={`text-sm ${!hasPhoneForSms ? 'text-gray-400' : 'text-gray-600'}`}>New messages</p>
                        <ToggleSwitch name="smsMessages" checked={settings.smsMessages && hasPhoneForSms} onChange={handleNotificationChange} disabled={!hasPhoneForSms}/>
                    </div>
                    {!hasPhoneForSms && <p className="text-xs text-gray-500 mt-2">Please add a phone number to your <a href="#/profile" className="text-primary-600 underline">profile</a> to enable SMS notifications.</p>}
                </div>
            </div>
            <div className="text-right mt-6 border-t pt-4">
                <button onClick={handleSave} disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                    {isSubmitting ? <SpinnerIcon/> : 'Save Changes'}
                </button>
            </div>
        </Card>
    );
};

const SecurityTab: React.FC = () => {
    const { showToast } = useApp();
    const { changePassword } = useAuth();

    return (
        <div className="space-y-8">
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
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <Field type="password" name="newPass" className={`w-full p-2 border bg-white rounded ${errors.newPass && touched.newPass ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="newPass" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <Field type="password" name="confirm" className={`w-full p-2 border bg-white rounded ${errors.confirm && touched.confirm ? 'border-red-500' : 'border-gray-300'}`} />
                                <ErrorMessage name="confirm" component="p" className="text-red-500 text-xs mt-1"/>
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
             <Card title="Two-Factor Authentication (2FA)">
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium text-gray-700">Enable 2FA</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                     </div>
                     <ToggleSwitch name="2fa" checked={false} onChange={() => showToast('This is a demo feature.', 'info')} />
                 </div>
            </Card>
        </div>
    );
};

const InsuranceTab: React.FC = () => {
    const { insurance, updateInsurance } = useAuth();
    const { showToast } = useApp();
    const [isEditing, setIsEditing] = useState(!insurance);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = (data: InsuranceInfo) => {
        setIsSubmitting(true);
        updateInsurance(data).then(() => {
            showToast('Insurance information saved!', 'success');
            setIsEditing(false);
            setIsSubmitting(false);
        });
    };

    return (
        <Card>
            {isEditing ? (
                 <Formik
                    initialValues={insurance || { provider: '', planName: '', memberId: '', groupId: '' }}
                    validationSchema={InsuranceSchema}
                    onSubmit={handleSave}
                >
                {({ errors, touched }) => (
                    <Form className="space-y-4">
                        <Field name="provider" placeholder="Insurance Provider" className={`w-full p-2 border rounded ${errors.provider && touched.provider ? 'border-red-500' : 'border-gray-300'}`} />
                        <Field name="planName" placeholder="Plan Name" className={`w-full p-2 border rounded ${errors.planName && touched.planName ? 'border-red-500' : 'border-gray-300'}`} />
                        <Field name="memberId" placeholder="Member ID" className={`w-full p-2 border rounded ${errors.memberId && touched.memberId ? 'border-red-500' : 'border-gray-300'}`} />
                        <Field name="groupId" placeholder="Group ID" className={`w-full p-2 border rounded ${errors.groupId && touched.groupId ? 'border-red-500' : 'border-gray-300'}`} />
                        <div className="flex justify-end space-x-2 pt-2">
                            {insurance && <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>}
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-32 flex justify-center">
                                {isSubmitting ? <SpinnerIcon /> : 'Save'}
                            </button>
                        </div>
                    </Form>
                )}
                </Formik>
            ) : (
                <>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span className="font-medium text-gray-600">Provider:</span><span className="font-semibold text-gray-800">{insurance?.provider}</span></div>
                        <div className="flex justify-between"><span className="font-medium text-gray-600">Plan Name:</span><span className="font-semibold text-gray-800">{insurance?.planName}</span></div>
                        <div className="flex justify-between"><span className="font-medium text-gray-600">Member ID:</span><span className="font-semibold text-gray-800">{insurance?.memberId}</span></div>
                        <div className="flex justify-between"><span className="font-medium text-gray-600">Group ID:</span><span className="font-semibold text-gray-800">{insurance?.groupId}</span></div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="w-full mt-6 bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold py-2 px-4 rounded-lg text-sm">
                        Update Insurance Information
                    </button>
                </>
            )}
        </Card>
    );
};

const Settings: React.FC = () => {
    const tabs = [
        { name: 'Notifications', icon: <BellIcon/>, content: <NotificationsTab /> },
        { name: 'Security', icon: <ShieldCheckIcon/>, content: <SecurityTab /> },
        { name: 'Insurance', icon: <CreditCardIcon/>, content: <InsuranceTab /> },
    ];
    
    return (
        <div>
            <PageHeader title="Settings" subtitle="Manage your account preferences and security." />
             <div className="max-w-3xl mx-auto">
                 <Card className="p-0">
                    <Tabs tabs={tabs} />
                </Card>
             </div>
        </div>
    );
};

export default Settings;