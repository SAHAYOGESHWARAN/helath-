"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var App_1 = require("../../App");
var Tabs_1 = require("../../components/shared/Tabs");
var Icons_1 = require("../../components/shared/Icons");
var ToggleSwitch_1 = require("../../components/shared/ToggleSwitch");
var formik_1 = require("formik");
var Yup = require("yup");
var ProfileSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/, 'Invalid phone number format (e.g., 555-555-5555)'),
    bio: Yup.string().max(500, 'Bio cannot exceed 500 characters'),
});
var PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match').required('Please confirm your new password'),
});
var ProfileTab = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, updateUser = _a.updateUser;
    var showToast = (0, App_1.useApp)().showToast;
    return (<formik_1.Formik initialValues={{ name: (user === null || user === void 0 ? void 0 : user.name) || '', email: (user === null || user === void 0 ? void 0 : user.email) || '', phone: (user === null || user === void 0 ? void 0 : user.phone) || '', bio: (user === null || user === void 0 ? void 0 : user.bio) || '' }} validationSchema={ProfileSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting;
            updateUser(values).then(function () {
                showToast('Profile updated!', 'success');
                setSubmitting(false);
            });
        }}>
            {function (_a) {
            var errors = _a.errors, touched = _a.touched, isSubmitting = _a.isSubmitting;
            return (<formik_1.Form className="space-y-4">
                    <formik_1.Field name="name" placeholder="Full Name" className="w-full p-2 border rounded"/>
                    <formik_1.ErrorMessage name="name" component="p" className="text-red-500 text-xs"/>
                    <formik_1.Field name="email" type="email" placeholder="Email" className="w-full p-2 border rounded"/>
                    <formik_1.ErrorMessage name="email" component="p" className="text-red-500 text-xs"/>
                    <formik_1.Field name="phone" placeholder="Phone Number" className="w-full p-2 border rounded"/>
                    <formik_1.ErrorMessage name="phone" component="p" className="text-red-500 text-xs"/>
                    <formik_1.Field name="bio" as="textarea" rows={4} placeholder="Your professional biography..." className="w-full p-2 border rounded"/>
                     <div className="text-right">
                        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Profile</button>
                    </div>
                </formik_1.Form>);
        }}
        </formik_1.Formik>);
};
var NotificationsTab = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, updateUser = _a.updateUser;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)((user === null || user === void 0 ? void 0 : user.notificationSettings) || { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: false, pushAll: false }), settings = _b[0], setSettings = _b[1];
    var handleChange = function (e) {
        setSettings(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[e.target.name] = e.target.checked, _a)));
        });
    };
    var handleSave = function () {
        updateUser({ notificationSettings: settings }).then(function () {
            showToast('Notification settings saved!', 'success');
        });
    };
    return (<div className="space-y-4">
            <h4 className="font-semibold">Email</h4>
            <div className="flex justify-between items-center"><p>New messages</p><ToggleSwitch_1.default name="emailMessages" checked={settings.emailMessages} onChange={handleChange}/></div>
            <div className="flex justify-between items-center"><p>New appointment requests</p><ToggleSwitch_1.default name="emailAppointments" checked={settings.emailAppointments} onChange={handleChange}/></div>
            <h4 className="font-semibold pt-4 border-t">SMS</h4>
            <div className="flex justify-between items-center"><p>New messages</p><ToggleSwitch_1.default name="smsMessages" checked={settings.smsMessages} onChange={handleChange} disabled={!(user === null || user === void 0 ? void 0 : user.phone)}/></div>
            {!(user === null || user === void 0 ? void 0 : user.phone) && <p className="text-xs text-gray-500">Add a phone number to your profile to enable SMS.</p>}
             <div className="text-right pt-4 border-t">
                <button onClick={handleSave} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Save Notifications</button>
            </div>
        </div>);
};
var SecurityTab = function () {
    var showToast = (0, App_1.useApp)().showToast;
    return (<div className="space-y-8">
            <formik_1.Formik initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }} validationSchema={PasswordSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
            // Mock API call
            setTimeout(function () {
                showToast('Password changed successfully!', 'success');
                setSubmitting(false);
                resetForm();
            }, 500);
        }}>
             {function (_a) {
            var errors = _a.errors, touched = _a.touched, isSubmitting = _a.isSubmitting;
            return (<formik_1.Form className="space-y-4">
                    <h3 className="font-semibold text-lg">Change Password</h3>
                    <formik_1.Field type="password" name="currentPassword" placeholder="Current Password" className={"w-full p-2 border rounded ".concat(errors.currentPassword && touched.currentPassword ? 'border-red-500' : 'border-gray-300')}/>
                    <formik_1.Field type="password" name="newPassword" placeholder="New Password" className={"w-full p-2 border rounded ".concat(errors.newPassword && touched.newPassword ? 'border-red-500' : 'border-gray-300')}/>
                    <formik_1.Field type="password" name="confirmPassword" placeholder="Confirm New Password" className={"w-full p-2 border rounded ".concat(errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300')}/>
                    <div className="text-right">
                        <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Update Password</button>
                    </div>
                </formik_1.Form>);
        }}
            </formik_1.Formik>
             <div className="border-t pt-8">
                 <h3 className="font-semibold text-lg">Two-Factor Authentication (2FA)</h3>
                 <div className="flex items-center justify-between mt-4">
                    <p className="text-gray-600">Add an extra layer of security to your account.</p>
                    <ToggleSwitch_1.default name="2fa" checked={false} onChange={function () { }} disabled/>
                 </div>
            </div>
        </div>);
};
var ProviderSettings = function () {
    var tabs = [
        { name: 'Professional Details', icon: <Icons_1.UserCircleIcon />, content: <ProfileTab /> },
        { name: 'Notifications', icon: <Icons_1.BellIcon />, content: <NotificationsTab /> },
        { name: 'Security', icon: <Icons_1.ShieldCheckIcon />, content: <SecurityTab /> },
    ];
    return (<div>
      <PageHeader_1.default title="Provider Settings" subtitle="Manage your provider account preferences and security."/>
      <div className="max-w-3xl mx-auto">
        <Card_1.default className="p-0">
           <Tabs_1.default tabs={tabs}/>
        </Card_1.default>
      </div>
    </div>);
};
exports.default = ProviderSettings;
