
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import Tabs from '../../components/shared/Tabs';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { UserCircleIcon, BellIcon, ShieldCheckIcon } from '../../components/shared/Icons';
import ToggleSwitch from '../../components/shared/ToggleSwitch';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProfileSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/, 'Invalid phone number format (e.g., 555-555-5555)'),
    bio: Yup.string().max(500, 'Bio cannot exceed 500 characters'),
});

const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match').required('Please confirm your new password'),
});


const ProfileTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();

    return (
        <Formik
            initialValues={{ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: user?.bio || '' }}
            validationSchema={ProfileSchema}
            onSubmit={(values, { setSubmitting }) => {
                updateUser(values).then(() => {
                    showToast('Profile updated!', 'success');
                    setSubmitting(false);
                });
            }}
        >
            {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                    <Field name="name" placeholder="Full Name" className="w-full p-2 border rounded" />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-xs" />
                    <Field name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" />
                    <ErrorMessage name="email" component="p" className="text-red-500 text-xs" />
                    <Field name="phone" placeholder="Phone Number" className="w-full p-2 border rounded" />
                    <ErrorMessage name="phone" component="p" className="text-red-500 text-xs" />
                    <Field name="bio" as="textarea" rows={4} placeholder="Your professional biography..." className="w-full p-2 border rounded" />
                     <div className="text-right">
                        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Profile</button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

const NotificationsTab: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { showToast } = useApp();
    const [settings, setSettings] = useState(user?.notificationSettings || { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: false, pushAll: false });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({...prev!, [e.target.name]: e.target.checked}));
    };

    const handleSave = () => {
        updateUser({ notificationSettings: settings }).then(() => {
            showToast('Notification settings saved!', 'success');
        });
    };

    return (
        <div className="space-y-4">
            <h4 className="font-semibold">Email</h4>
            <div className="flex justify-between items-center"><p>New messages</p><ToggleSwitch name="emailMessages" checked={settings.emailMessages} onChange={handleChange} /></div>
            <div className="flex justify-between items-center"><p>New appointment requests</p><ToggleSwitch name="emailAppointments" checked={settings.emailAppointments} onChange={handleChange} /></div>
            <h4 className="font-semibold pt-4 border-t">SMS</h4>
            <div className="flex justify-between items-center"><p>New messages</p><ToggleSwitch name="smsMessages" checked={settings.smsMessages} onChange={handleChange} disabled={!user?.phone} /></div>
            {!user?.phone && <p className="text-xs text-gray-500">Add a phone number to your profile to enable SMS.</p>}
             <div className="text-right pt-4 border-t">
                <button onClick={handleSave} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Notifications</button>
            </div>
        </div>
    );
};

const SecurityTab: React.FC = () => {
    const { showToast } = useApp();
    return (
        <div className="space-y-8">
            <Formik
                initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                validationSchema={PasswordSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    // Mock API call
                    setTimeout(() => {
                        showToast('Password changed successfully!', 'success');
                        setSubmitting(false);
                        resetForm();
                    }, 500);
                }}
            >
             {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                    <h3 className="font-semibold text-lg">Change Password</h3>
                    <Field type="password" name="currentPassword" placeholder="Current Password" className={`w-full p-2 border rounded ${errors.currentPassword && touched.currentPassword ? 'border-red-500' : 'border-gray-300'}`} />
                    <Field type="password" name="newPassword" placeholder="New Password" className={`w-full p-2 border rounded ${errors.newPassword && touched.newPassword ? 'border-red-500' : 'border-gray-300'}`} />
                    <Field type="password" name="confirmPassword" placeholder="Confirm New Password" className={`w-full p-2 border rounded ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
                    <div className="text-right">
                        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Update Password</button>
                    </div>
                </Form>
             )}
            </Formik>
             <div className="border-t pt-8">
                 <h3 className="font-semibold text-lg">Two-Factor Authentication (2FA)</h3>
                 <div className="flex items-center justify-between mt-4">
                    <p className="text-gray-600">Add an extra layer of security to your account.</p>
                    <ToggleSwitch name="2fa" checked={false} onChange={() => {}} disabled />
                 </div>
            </div>
        </div>
    );
}

const ProviderSettings: React.FC = () => {

    const tabs = [
        { name: 'Professional Details', icon: <UserCircleIcon />, content: <ProfileTab /> },
        { name: 'Notifications', icon: <BellIcon />, content: <NotificationsTab /> },
        { name: 'Security', icon: <ShieldCheckIcon />, content: <SecurityTab /> },
    ];

  return (
    <div>
      <PageHeader title="Provider Settings" subtitle="Manage your provider account preferences and security." />
      <div className="max-w-3xl mx-auto">
        <Card className="p-0">
           <Tabs tabs={tabs} />
        </Card>
      </div>
    </div>
  );
};

export default ProviderSettings;