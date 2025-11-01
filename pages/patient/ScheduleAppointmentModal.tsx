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
var Modal_1 = require("../../components/shared/Modal");
var useAuth_1 = require("../../hooks/useAuth");
var types_1 = require("../../types");
var ToggleSwitch_1 = require("../../components/shared/ToggleSwitch");
var Icons_1 = require("../../components/shared/Icons");
var Calendar_1 = require("./Calendar");
var MOCK_SERVICES = ['Annual Check-up', 'Sick Visit', 'Follow-up', 'New Patient Consultation', 'Dermatology', 'Cardiology Consult'];
var MOCK_TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:00 PM'];
var ProgressIndicator = function (_a) {
    var step = _a.step, totalSteps = _a.totalSteps;
    return (<div className="flex items-center justify-center mb-4">
        {Array.from({ length: totalSteps }).map(function (_, index) { return (<react_1.default.Fragment key={index}>
                <div className={"w-8 h-8 rounded-full flex items-center justify-center font-bold ".concat(step > index ? 'bg-primary-600 text-white' : step === index + 1 ? 'bg-primary-200 text-primary-700' : 'bg-gray-200 text-gray-500')}>
                    {step > index ? '✓' : index + 1}
                </div>
                {index < totalSteps - 1 && <div className={"h-1 flex-1 ".concat(step > index + 1 ? 'bg-primary-600' : 'bg-gray-200')}/>}
            </react_1.default.Fragment>); })}
    </div>);
};
var ScheduleAppointmentModal = function (_a) {
    var _b;
    var isOpen = _a.isOpen, onClose = _a.onClose, onAppointmentScheduled = _a.onAppointmentScheduled;
    var _c = (0, useAuth_1.useAuth)(), user = _c.user, users = _c.users;
    var _d = (0, react_1.useState)(1), step = _d[0], setStep = _d[1];
    var _e = (0, react_1.useState)({
        reason: '',
        providerId: '',
        location: 'Clinic',
        date: null,
        time: '',
        reminders: {
            enabled: true,
            channels: { email: true, sms: !!(user === null || user === void 0 ? void 0 : user.phone) },
            timeOption: '24h',
            customDateTime: null,
        }
    }), formData = _e[0], setFormData = _e[1];
    var providers = (0, react_1.useMemo)(function () { return users.filter(function (u) { return u.role === types_1.UserRole.PROVIDER; }); }, [users]);
    var selectedProvider = (0, react_1.useMemo)(function () { return providers.find(function (p) { return p.id === formData.providerId; }); }, [providers, formData.providerId]);
    var handleNext = function () { return setStep(function (s) { return s + 1; }); };
    var handleBack = function () { return setStep(function (s) { return s - 1; }); };
    var handleSave = function () {
        if (!user || !selectedProvider || !formData.date)
            return;
        var newAppointment = {
            patientId: user.id,
            patientName: user.name,
            providerId: selectedProvider.id,
            providerName: selectedProvider.name,
            date: formData.date.toISOString().split('T')[0],
            time: formData.time,
            reason: formData.reason,
            location: formData.location,
            status: 'Pending',
            duration: 30, // Mock duration
        };
        var reminderSettings = formData.reminders.enabled ? {
            channels: formData.reminders.channels,
            timeOption: formData.reminders.timeOption,
            customDateTime: formData.reminders.timeOption === 'custom' ? formData.reminders.customDateTime : null,
        } : undefined;
        onAppointmentScheduled(newAppointment, reminderSettings);
    };
    var isStepComplete = function () {
        switch (step) {
            case 1: return !!formData.reason;
            case 2: return !!formData.providerId;
            case 3: return !!formData.location;
            case 4: return !!formData.date && !!formData.time;
            default: return true; // Final step is always "complete"
        }
    };
    var titles = ['Select a Service', 'Choose a Provider', 'Select Location', 'Pick a Date & Time', 'Confirm Appointment'];
    var totalSteps = 5;
    return (<Modal_1.default isOpen={isOpen} onClose={onClose} title={titles[step - 1]} size="xl">
            <ProgressIndicator step={step} totalSteps={totalSteps}/>
            <div className="mt-6 min-h-[300px]">
            {step === 1 && (<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {MOCK_SERVICES.map(function (service) { return (<button key={service} onClick={function () { setFormData(function (f) { return (__assign(__assign({}, f), { reason: service })); }); handleNext(); }} className="p-4 border rounded-lg text-center font-semibold hover:bg-primary-50 hover:border-primary-500 transition-all">
                            {service}
                        </button>); })}
                </div>)}
            {step === 2 && (<div className="space-y-3">
                    {providers.map(function (p) { return (<button key={p.id} onClick={function () { setFormData(function (f) { return (__assign(__assign({}, f), { providerId: p.id })); }); handleNext(); }} className="w-full p-4 border rounded-lg hover:bg-primary-50 hover:border-primary-500 text-left transition-all flex items-center space-x-3">
                           <img src={p.avatarUrl} alt={p.name} className="w-10 h-10 rounded-full"/>
                           <div>
                               <p className="font-semibold">{p.name}</p>
                               <p className="text-sm text-gray-500">{p.specialty}</p>
                           </div>
                        </button>); })}
                </div>)}
            {step === 3 && (<div>
                     <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Appointment Location</label>
                     <select id="location" value={formData.location} onChange={function (e) { return setFormData(function (f) { return (__assign(__assign({}, f), { location: e.target.value })); }); }} className="w-full p-3 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500">
                         <option value="Clinic">Clinic (In-person)</option>
                         <option value="Hospital">Hospital (In-person)</option>
                         <option value="Virtual">Virtual (Telehealth)</option>
                     </select>
                </div>)}
             {step === 4 && (<div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <Calendar_1.default selectedDate={formData.date} onDateChange={function (date) { return setFormData(function (f) { return (__assign(__assign({}, f), { date: date, time: '' })); }); }}/>
                    </div>
                    {formData.date && (<div className="flex-1 animate-fade-in">
                            <h4 className="font-semibold text-gray-800 mb-2">Available Times for {formData.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {MOCK_TIME_SLOTS.map(function (time) { return (<button key={time} onClick={function () { return setFormData(function (f) { return (__assign(__assign({}, f), { time: time })); }); }} className={"p-2 border rounded-md text-sm transition-all ".concat(formData.time === time ? 'bg-primary-600 text-white border-primary-600' : 'hover:bg-gray-100')}>
                                        {time}
                                    </button>); })}
                            </div>
                        </div>)}
                </div>)}
            {step === 5 && (<div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border">
                        <p><strong>Service:</strong> {formData.reason}</p>
                        <p><strong>Provider:</strong> {selectedProvider === null || selectedProvider === void 0 ? void 0 : selectedProvider.name}</p>
                        <p><strong>Location:</strong> {formData.location}</p>
                        <p><strong>Date:</strong> {(_b = formData.date) === null || _b === void 0 ? void 0 : _b.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p><strong>Time:</strong> {formData.time}</p>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between">
                            <label className="font-medium text-gray-700">Set Appointment Reminders</label>
                            <ToggleSwitch_1.default name="remindersEnabled" checked={formData.reminders.enabled} onChange={function (e) { return setFormData(function (f) { return (__assign(__assign({}, f), { reminders: __assign(__assign({}, f.reminders), { enabled: e.target.checked }) })); }); }}/>
                        </div>
                        {formData.reminders.enabled && (<div className="mt-4 space-y-3 pl-4 border-l-2 animate-fade-in">
                                <div className="flex items-center space-x-4">
                                     <label className="flex items-center"><input type="checkbox" checked={formData.reminders.channels.email} onChange={function (e) { return setFormData(function (f) { return (__assign(__assign({}, f), { reminders: __assign(__assign({}, f.reminders), { channels: __assign(__assign({}, f.reminders.channels), { email: e.target.checked }) }) })); }); }} className="h-4 w-4 text-primary-600 rounded"/> <span className="ml-2 text-sm">Email</span></label>
                                     <label className="flex items-center"><input type="checkbox" checked={formData.reminders.channels.sms} onChange={function (e) { return setFormData(function (f) { return (__assign(__assign({}, f), { reminders: __assign(__assign({}, f.reminders), { channels: __assign(__assign({}, f.reminders.channels), { sms: e.target.checked }) }) })); }); }} className="h-4 w-4 text-primary-600 rounded" disabled={!(user === null || user === void 0 ? void 0 : user.phone)}/> <span className={"ml-2 text-sm ".concat(!(user === null || user === void 0 ? void 0 : user.phone) ? 'text-gray-400' : '')}>SMS</span></label>
                                </div>
                                {!(user === null || user === void 0 ? void 0 : user.phone) && <p className="text-xs text-gray-500">Add a phone number to your profile to enable SMS reminders.</p>}
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Remind me:</label>
                                    <select value={formData.reminders.timeOption} onChange={function (e) { return setFormData(function (f) { return (__assign(__assign({}, f), { reminders: __assign(__assign({}, f.reminders), { timeOption: e.target.value }) })); }); }} className="w-full mt-1 p-2 border rounded-md">
                                        <option value="1h">1 hour before</option>
                                        <option value="24h">24 hours before</option>
                                        <option value="2d">2 days before</option>
                                        <option value="3d">3 days before</option>
                                        <option value="custom">Custom time</option>
                                    </select>
                                </div>
                                {formData.reminders.timeOption === 'custom' && (<input type="datetime-local" value={formData.reminders.customDateTime || ''} onChange={function (e) { return setFormData(function (f) { return (__assign(__assign({}, f), { reminders: __assign(__assign({}, f.reminders), { customDateTime: e.target.value }) })); }); }} className="w-full mt-1 p-2 border rounded-md bg-white"/>)}
                            </div>)}
                    </div>
                </div>)}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button onClick={step === 1 ? onClose : handleBack} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg flex items-center">
                    <Icons_1.ChevronLeftIcon className="w-4 h-4 mr-1"/> {step === 1 ? 'Cancel' : 'Back'}
                </button>
                {step < totalSteps && <button onClick={handleNext} disabled={!isStepComplete()} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">Next</button>}
                {step === totalSteps && <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg">Confirm Appointment</button>}
            </div>
        </Modal_1.default>);
};
exports.default = ScheduleAppointmentModal;
