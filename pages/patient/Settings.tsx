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
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
var ToggleSwitch_1 = require("../../components/shared/ToggleSwitch");
var App_1 = require("../../App");
var useAuth_1 = require("../../hooks/useAuth");
var formik_1 = require("formik");
var Yup = require("yup");
var Icons_1 = require("../../components/shared/Icons");
var Tabs_1 = require("../../components/shared/Tabs");
var PasswordSchema = Yup.object().shape({
    current: Yup.string().required('Current password is required'),
    newPass: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
    confirm: Yup.string().oneOf([Yup.ref('newPass'), undefined], 'Passwords must match').required('Please confirm your new password'),
});
var InsuranceSchema = Yup.object().shape({
    provider: Yup.string().required('Provider name is required'),
    planName: Yup.string().required('Plan name is required'),
    memberId: Yup.string().required('Member ID is required'),
    groupId: Yup.string().required('Group ID is required'),
});
var NotificationsTab = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, updateUser = _a.updateUser;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)(user === null || user === void 0 ? void 0 : user.notificationSettings), settings = _b[0], setSettings = _b[1];
    var _c = (0, react_1.useState)(false), isSubmitting = _c[0], setIsSubmitting = _c[1];
    if (!settings)
        return null;
    var handleNotificationChange = function (e) {
        var _a = e.target, name = _a.name, checked = _a.checked;
        setSettings(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = checked, _a)));
        });
    };
    var handleSave = function () {
        setIsSubmitting(true);
        updateUser(function (currentUser) { return (__assign(__assign({}, currentUser), { notificationSettings: settings })); })
            .then(function () {
            showToast('Notification settings saved!', 'success');
            setIsSubmitting(false);
        });
    };
    var hasPhoneForSms = (user === null || user === void 0 ? void 0 : user.phone) && user.phone.trim() !== '';
    return (<Card_1.default>
            <div className="space-y-4 divide-y">
                <div className="pt-4 first:pt-0">
                    <h3 className="font-semibold text-gray-800 mb-2">Email Notifications</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Appointment reminders & updates</p><ToggleSwitch_1.default name="emailAppointments" checked={settings.emailAppointments} onChange={handleNotificationChange}/></div>
                        <div className="flex items-center justify-between"><p className="text-sm text-gray-600">Billing alerts & invoices</p><ToggleSwitch_1.default name="emailBilling" checked={settings.emailBilling} onChange={handleNotificationChange}/></div>
                        <div className="flex items-center justify-between"><p className="text-sm text-gray-600">New secure messages</p><ToggleSwitch_1.default name="emailMessages" checked={settings.emailMessages} onChange={handleNotificationChange}/></div>
                    </div>
                </div>
                <div className="pt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">SMS Notifications</h3>
                    <div className="flex items-center justify-between">
                        <p className={"text-sm ".concat(!hasPhoneForSms ? 'text-gray-400' : 'text-gray-600')}>New messages</p>
                        <ToggleSwitch_1.default name="smsMessages" checked={settings.smsMessages && hasPhoneForSms} onChange={handleNotificationChange} disabled={!hasPhoneForSms}/>
                    </div>
                    {!hasPhoneForSms && <p className="text-xs text-gray-500 mt-2">Please add a phone number to your <a href="#/profile" className="text-primary-600 underline">profile</a> to enable SMS notifications.</p>}
                </div>
            </div>
            <div className="text-right mt-6 border-t pt-4">
                <button onClick={handleSave} disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center items-center">
                    {isSubmitting ? <Icons_1.SpinnerIcon /> : 'Save Changes'}
                </button>
            </div>
        </Card_1.default>);
};
var SecurityTab = function () {
    var showToast = (0, App_1.useApp)().showToast;
    var changePassword = (0, useAuth_1.useAuth)().changePassword;
    return (<div className="space-y-8">
            <Card_1.default title="Change Password">
                 <formik_1.Formik initialValues={{ current: '', newPass: '', confirm: '' }} validationSchema={PasswordSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
            changePassword(values.current, values.newPass).then(function (success) {
                if (success) {
                    showToast('Password changed successfully!', 'success');
                    resetForm();
                }
                else {
                    showToast('Failed to change password. Check current password.', 'error');
                }
                setSubmitting(false);
            });
        }}>
                    {function (_a) {
            var isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
            return (<formik_1.Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <formik_1.Field type="password" name="current" className={"w-full p-2 border bg-white rounded ".concat(errors.current && touched.current ? 'border-red-500' : 'border-gray-300')}/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <formik_1.Field type="password" name="newPass" className={"w-full p-2 border bg-white rounded ".concat(errors.newPass && touched.newPass ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="newPass" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <formik_1.Field type="password" name="confirm" className={"w-full p-2 border bg-white rounded ".concat(errors.confirm && touched.confirm ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="confirm" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                            <div className="text-right pt-2">
                                <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-40 flex justify-center items-center">
                                   {isSubmitting ? <Icons_1.SpinnerIcon /> : 'Update Password'}
                                </button>
                            </div>
                        </formik_1.Form>);
        }}
                </formik_1.Formik>
            </Card_1.default>
             <Card_1.default title="Two-Factor Authentication (2FA)">
                 <div className="flex items-center justify-between">
                     <div>
                        <p className="font-medium text-gray-700">Enable 2FA</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account. (Coming soon)</p>
                     </div>
                     <ToggleSwitch_1.default name="2fa" checked={false} onChange={function () { }} disabled/>
                 </div>
            </Card_1.default>
        </div>);
};
var InsuranceTab = function () {
    var _a = (0, useAuth_1.useAuth)(), insurance = _a.insurance, updateInsurance = _a.updateInsurance;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)(!insurance), isEditing = _b[0], setIsEditing = _b[1];
    var _c = (0, react_1.useState)(false), isSubmitting = _c[0], setIsSubmitting = _c[1];
    var handleSave = function (data) {
        setIsSubmitting(true);
        updateInsurance(data).then(function () {
            showToast('Insurance information saved!', 'success');
            setIsEditing(false);
            setIsSubmitting(false);
        });
    };
    return (<Card_1.default>
            {isEditing ? (<formik_1.Formik initialValues={insurance || { provider: '', planName: '', memberId: '', groupId: '' }} validationSchema={InsuranceSchema} onSubmit={handleSave}>
                {function (_a) {
                var errors = _a.errors, touched = _a.touched;
                return (<formik_1.Form className="space-y-4">
                        <formik_1.Field name="provider" placeholder="Insurance Provider" className={"w-full p-2 border rounded ".concat(errors.provider && touched.provider ? 'border-red-500' : 'border-gray-300')}/>
                        <formik_1.Field name="planName" placeholder="Plan Name" className={"w-full p-2 border rounded ".concat(errors.planName && touched.planName ? 'border-red-500' : 'border-gray-300')}/>
                        <formik_1.Field name="memberId" placeholder="Member ID" className={"w-full p-2 border rounded ".concat(errors.memberId && touched.memberId ? 'border-red-500' : 'border-gray-300')}/>
                        <formik_1.Field name="groupId" placeholder="Group ID" className={"w-full p-2 border rounded ".concat(errors.groupId && touched.groupId ? 'border-red-500' : 'border-gray-300')}/>
                        <div className="flex justify-end space-x-2 pt-2">
                            {insurance && <button type="button" onClick={function () { return setIsEditing(false); }} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>}
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-32 flex justify-center">
                                {isSubmitting ? <Icons_1.SpinnerIcon /> : 'Save'}
                            </button>
                        </div>
                    </formik_1.Form>);
            }}
                </formik_1.Formik>) : (<>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span className="font-medium text-gray-600">Provider:</span><span className="font-semibold text-gray-800">{insurance === null || insurance === void 0 ? void 0 : insurance.provider}</span></div>
                        <div className="flex justify-between"><span className="font-medium text-gray-600">Plan Name:</span><span className="font-semibold text-gray-800">{insurance === null || insurance === void 0 ? void 0 : insurance.planName}</span></div>
                        <div className="flex justify-between"><span className="font-medium text-gray-600">Member ID:</span><span className="font-semibold text-gray-800">{insurance === null || insurance === void 0 ? void 0 : insurance.memberId}</span></div>
                        <div className="flex justify-between"><span className="font-medium text-gray-600">Group ID:</span><span className="font-semibold text-gray-800">{insurance === null || insurance === void 0 ? void 0 : insurance.groupId}</span></div>
                    </div>
                    <button onClick={function () { return setIsEditing(true); }} className="w-full mt-6 bg-primary-100 hover:bg-primary-200 text-primary-700 font-bold py-2 px-4 rounded-lg text-sm">
                        Update Insurance Information
                    </button>
                </>)}
        </Card_1.default>);
};
var Settings = function () {
    var tabs = [
        { name: 'Notifications', icon: <Icons_1.BellIcon />, content: <NotificationsTab /> },
        { name: 'Security', icon: <Icons_1.ShieldCheckIcon />, content: <SecurityTab /> },
        { name: 'Insurance', icon: <Icons_1.CreditCardIcon />, content: <InsuranceTab /> },
    ];
    return (<div>
            <PageHeader_1.default title="Settings" subtitle="Manage your account preferences and security."/>
             <div className="max-w-3xl mx-auto">
                 <Card_1.default className="p-0">
                    <Tabs_1.default tabs={tabs}/>
                </Card_1.default>
             </div>
        </div>);
};
exports.default = Settings;
