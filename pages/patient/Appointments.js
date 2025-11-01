"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
var App_1 = require("../../App");
var Icons_1 = require("../../components/shared/Icons");
var useAuth_1 = require("../../hooks/useAuth");
var VideoUpdateModal_1 = require("./VideoUpdateModal");
var ScheduleAppointmentModal_1 = require("./ScheduleAppointmentModal");
var Modal_1 = require("../../components/shared/Modal");
var getStatusPill = function (status) {
    switch (status) {
        case 'Confirmed': return 'bg-blue-100 text-blue-800';
        case 'Completed': return 'bg-emerald-100 text-emerald-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
var AppointmentDetails = function (_a) {
    var _b;
    var appointment = _a.appointment, onAddVideo = _a.onAddVideo;
    return (<div className="px-4 pb-4 border-t border-gray-200">
        <div className="mt-4 space-y-4 text-sm">
            {appointment.visitSummary && (<div>
                    <p className="font-medium text-gray-500">Visit Summary</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{appointment.visitSummary}</p>
                </div>)}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <p className="font-medium text-gray-500">Video Progress Updates ({((_b = appointment.videoUpdates) === null || _b === void 0 ? void 0 : _b.length) || 0})</p>
                    <button onClick={onAddVideo} className="flex items-center text-xs font-medium text-primary-600 hover:text-primary-800 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full">
                        <Icons_1.CameraIcon className="w-4 h-4 mr-1.5"/>
                        Add Video Update
                    </button>
                </div>
                {appointment.videoUpdates && appointment.videoUpdates.length > 0 ? (<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {appointment.videoUpdates.map(function (update) { return (<div key={update.id} className="group relative rounded-lg overflow-hidden border border-gray-200 hover:border-primary-400 transition-all duration-200 shadow-sm">
                                <video src={update.videoUrl} controls className="w-full h-24 object-cover bg-black"/>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 text-white text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    {new Date(update.date).toLocaleDateString()}
                                </div>
                            </div>); })}
                    </div>) : (<div className="text-center py-4 bg-gray-50 rounded-md">
                        <p className="text-gray-500 text-sm">No video updates for this appointment.</p>
                    </div>)}
            </div>
        </div>
    </div>);
};
var PatientAppointments = function () {
    var _a = (0, useAuth_1.useAuth)(), appointments = _a.appointments, addAppointment = _a.addAppointment, addVideoUpdateToAppointment = _a.addVideoUpdateToAppointment, cancelAppointment = _a.cancelAppointment;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)(null), selectedApptForVideo = _b[0], setSelectedApptForVideo = _b[1];
    var _c = (0, react_1.useState)(false), isScheduleModalOpen = _c[0], setIsScheduleModalOpen = _c[1];
    var _d = (0, react_1.useState)(null), cancellingAppt = _d[0], setCancellingAppt = _d[1];
    var _e = (0, react_1.useState)(false), isSubmitting = _e[0], setIsSubmitting = _e[1];
    var sortedAppointments = (0, react_1.useMemo)(function () {
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        var upcoming = __spreadArray([], appointments, true).filter(function (a) { return new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending'); }).sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); });
        var past = __spreadArray([], appointments, true).filter(function (a) { return new Date(a.date) < now || a.status === 'Completed' || a.status === 'Cancelled'; }).sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
        return { upcoming: upcoming, past: past };
    }, [appointments]);
    var handleAppointmentScheduled = function (newAppointment, reminder) {
        addAppointment(newAppointment, reminder);
        showToast('Appointment scheduled! It is now pending confirmation.', 'success');
        setIsScheduleModalOpen(false);
    };
    var handleSendVideo = function (videoBlobUrl) {
        if (selectedApptForVideo) {
            addVideoUpdateToAppointment(selectedApptForVideo.id, videoBlobUrl);
            showToast('Video update added successfully!', 'success');
            setSelectedApptForVideo(null);
        }
    };
    var handleAppointmentCancel = function () {
        if (!cancellingAppt)
            return;
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(function () {
            cancelAppointment(cancellingAppt.id);
            showToast('Your appointment has been cancelled.', 'success');
            setIsSubmitting(false);
            setCancellingAppt(null);
        }, 500);
    };
    return (<div>
            <PageHeader_1.default title="Appointments" buttonText="Schedule New Appointment" onButtonClick={function () { return setIsScheduleModalOpen(true); }}/>

            <div className="space-y-8">
                <Card_1.default>
                    <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
                    <div className="space-y-4">
                        {sortedAppointments.upcoming.length > 0 ? sortedAppointments.upcoming.map(function (appt) {
            var isVirtual = appt.location === 'Virtual';
            var appointmentDateTime = new Date("".concat(appt.date, "T").concat(appt.time, ":00"));
            var canJoin = isVirtual && appointmentDateTime.getTime() - Date.now() < 15 * 60 * 1000;
            return (<details key={appt.id} className="group border border-gray-200 rounded-lg bg-white transition-shadow hover:shadow-md">
                                 <summary className="p-4 flex flex-wrap justify-between items-center cursor-pointer list-none gap-y-3">
                                     <div className="flex items-center space-x-4 flex-grow min-w-[250px]">
                                         <div className="flex flex-col items-center justify-center bg-primary-50 text-primary-700 rounded-lg p-3 w-20 text-center">
                                             <span className="text-sm font-bold uppercase">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' })}</span>
                                             <span className="text-2xl font-extrabold">{new Date(appt.date).getUTCDate()}</span>
                                         </div>
                                         <div>
                                             <p className="font-bold text-lg text-gray-800">{appt.reason}</p>
                                             <p className="text-sm text-gray-600">with {appt.providerName}</p>
                                             <div className="flex items-center text-sm text-gray-500 mt-1">
                                                 <Icons_1.ClockIcon className="w-4 h-4 mr-1.5"/> {appt.time} ({appt.duration} min) <span className="mx-2">|</span> {isVirtual ? <Icons_1.VideoCameraIcon className="w-4 h-4 mr-1.5"/> : <Icons_1.UsersIcon className="w-4 h-4 mr-1.5"/>} {appt.location}
                                             </div>
                                         </div>
                                     </div>
                                     <div className="flex items-center justify-end space-x-3 w-full sm:w-auto">
                                         <span className={"px-3 py-1 text-xs font-semibold rounded-full ".concat(getStatusPill(appt.status))}>{appt.status}</span>
                                          {(appt.status === 'Confirmed' || appt.status === 'Pending') && (<>
                                                <button onClick={function (e) { e.stopPropagation(); showToast('Please call our office to reschedule.', 'info'); }} className="text-xs font-semibold text-primary-600 hover:underline">Reschedule</button>
                                                <button onClick={function (e) { e.stopPropagation(); setCancellingAppt(appt); }} className="text-xs font-semibold text-red-600 hover:underline">Cancel</button>
                                            </>)}
                                         {isVirtual && (<react_router_dom_1.Link to="/video-consults">
                                                <button disabled={!canJoin} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center disabled:bg-gray-300 disabled:cursor-not-allowed">
                                                    <Icons_1.VideoCameraIcon className="w-4 h-4 mr-2"/> Join Call
                                                </button>
                                            </react_router_dom_1.Link>)}
                                         <Icons_1.ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"/>
                                     </div>
                                 </summary>
                                 <AppointmentDetails appointment={appt} onAddVideo={function () { return setSelectedApptForVideo(appt); }}/>
                             </details>);
        }) : <p className="text-gray-500">You have no upcoming appointments.</p>}
                    </div>
                </Card_1.default>

                <Card_1.default>
                    <h2 className="text-xl font-bold mb-4">Past Appointments</h2>
                     <div className="space-y-4">
                        {sortedAppointments.past.length > 0 ? (sortedAppointments.past.map(function (appt) { return (<details key={appt.id} className="group border border-gray-200 rounded-lg bg-white transition-shadow hover:shadow-md">
                                    <summary className="p-4 flex justify-between items-center cursor-pointer list-none">
                                        <div>
                                            <p className="font-bold text-lg">{appt.providerName} - {new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                            <p className="text-sm text-gray-600">{appt.reason}</p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className={"px-3 py-1 text-xs font-semibold rounded-full ".concat(getStatusPill(appt.status))}>{appt.status}</span>
                                            <Icons_1.ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180"/>
                                        </div>
                                    </summary>
                                    <AppointmentDetails appointment={appt} onAddVideo={function () { return setSelectedApptForVideo(appt); }}/>
                                </details>); })) : (<p className="text-center text-gray-500 py-8">You have no past appointments to show.</p>)}
                    </div>
                </Card_1.default>
            </div>
            <ScheduleAppointmentModal_1.default isOpen={isScheduleModalOpen} onClose={function () { return setIsScheduleModalOpen(false); }} onAppointmentScheduled={handleAppointmentScheduled}/>
            <VideoUpdateModal_1.default isOpen={!!selectedApptForVideo} onClose={function () { return setSelectedApptForVideo(null); }} onSend={handleSendVideo}/>
            <Modal_1.default isOpen={!!cancellingAppt} onClose={function () { return setCancellingAppt(null); }} title="Confirm Appointment Cancellation" footer={<>
                    <button onClick={function () { return setCancellingAppt(null); }} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors hover:bg-gray-300">Go Back</button>
                    <button onClick={handleAppointmentCancel} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-48 flex justify-center items-center transition-colors hover:bg-red-700">
                        {isSubmitting ? <Icons_1.SpinnerIcon /> : 'Yes, Cancel Appointment'}
                    </button>
                </>}>
                {cancellingAppt && <p>Are you sure you want to cancel your appointment with <strong>{cancellingAppt.providerName}</strong> on <strong>{new Date(cancellingAppt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric' })}</strong> at {cancellingAppt.time}?</p>}
            </Modal_1.default>
        </div>);
};
exports.default = PatientAppointments;
