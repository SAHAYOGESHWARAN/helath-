"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Card_1 = require("../../components/shared/Card");
var Icons_1 = require("../../components/shared/Icons");
var PageHeader_1 = require("../../components/shared/PageHeader");
var useAuth_1 = require("../../hooks/useAuth");
var Modal_1 = require("../../components/shared/Modal");
var react_router_dom_1 = require("react-router-dom");
var CalendarHeader = function (_a) {
    var currentDate = _a.currentDate, view = _a.view, onViewChange = _a.onViewChange, onDateChange = _a.onDateChange;
    var handlePrev = function () {
        var newDate = new Date(currentDate);
        if (view === 'month')
            newDate.setMonth(newDate.getMonth() - 1);
        else if (view === 'week')
            newDate.setDate(newDate.getDate() - 7);
        else
            newDate.setDate(newDate.getDate() - 1);
        onDateChange(newDate);
    };
    var handleNext = function () {
        var newDate = new Date(currentDate);
        if (view === 'month')
            newDate.setMonth(newDate.getMonth() + 1);
        else if (view === 'week')
            newDate.setDate(newDate.getDate() + 7);
        else
            newDate.setDate(newDate.getDate() + 1);
        onDateChange(newDate);
    };
    var handleToday = function () { return onDateChange(new Date()); };
    var getTitle = function () {
        if (view === 'month')
            return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (view === 'week') {
            var startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
            var endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return "".concat(startOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric' }), " - ").concat(endOfWeek.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' }));
        }
        return currentDate.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    };
    return (<div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <button onClick={handlePrev} className="p-2 rounded-full hover:bg-gray-100"><Icons_1.ChevronLeftIcon className="w-5 h-5"/></button>
            <button onClick={handleToday} className="px-4 py-2 text-sm font-semibold border rounded-md hover:bg-gray-50">Today</button>
            <button onClick={handleNext} className="p-2 rounded-full hover:bg-gray-100"><Icons_1.ChevronLeftIcon className="w-5 h-5 rotate-180"/></button>
            <h2 className="text-xl font-bold text-gray-800 ml-4">{getTitle()}</h2>
        </div>
        <div className="flex items-center space-x-1 bg-gray-200 p-1 rounded-md">
            {['month', 'week', 'day'].map(function (v) { return (<button key={v} onClick={function () { return onViewChange(v); }} className={"px-3 py-1 text-sm font-medium rounded-md capitalize ".concat(view === v ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:bg-white/50')}>{v}</button>); })}
        </div>
    </div>);
};
var MonthView = function (_a) {
    var currentDate = _a.currentDate, appointments = _a.appointments, onAppointmentClick = _a.onAppointmentClick;
    var days = (0, react_1.useMemo)(function () {
        var date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        var month = date.getMonth();
        var year = date.getFullYear();
        var firstDay = date.getDay();
        var daysInMonth = new Date(year, month + 1, 0).getDate();
        var dayCells = [];
        // Add blank cells for previous month
        for (var i = 0; i < firstDay; i++) {
            dayCells.push({ key: "prev-".concat(i), date: null, isCurrentMonth: false });
        }
        // Add cells for current month
        for (var i = 1; i <= daysInMonth; i++) {
            dayCells.push({ key: "current-".concat(i), date: new Date(year, month, i), isCurrentMonth: true });
        }
        var remainingCells = 7 - (dayCells.length % 7);
        if (remainingCells < 7) {
            for (var i = 0; i < remainingCells; i++) {
                dayCells.push({ key: "next-".concat(i), date: null, isCurrentMonth: false });
            }
        }
        return dayCells;
    }, [currentDate]);
    var today = new Date();
    return (<div className="grid grid-cols-7 flex-1">
            <div className="grid grid-cols-7 col-span-7 border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(function (day) { return (<div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase">{day}</div>); })}
            </div>
            <div className="grid grid-cols-7 col-span-7 auto-rows-fr">
                {days.map(function (_a, index) {
            var key = _a.key, date = _a.date;
            var isToday = date && date.toDateString() === today.toDateString();
            var dayAppointments = date
                ? appointments.filter(function (a) { return a.start.toDateString() === date.toDateString(); })
                : [];
            return (<div key={key} className={"p-2 border-t border-gray-200 flex flex-col min-h-[120px] ".concat(index % 7 !== 0 ? 'border-l' : '', " ").concat(!date ? 'bg-gray-50' : '')}>
                            {date && (<span className={"self-start text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ".concat(isToday ? 'bg-primary-600 text-white' : 'text-gray-700')}>
                                    {date.getDate()}
                                </span>)}
                             <div className="flex-1 space-y-1 overflow-y-auto">
                                {dayAppointments.map(function (appt) { return (<div key={appt.id} onClick={function () { return onAppointmentClick(appt); }} className="bg-primary-100 text-primary-800 p-1.5 rounded-md text-xs truncate cursor-pointer hover:bg-primary-200 transition-colors">
                                        {appt.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })} {appt.title}
                                    </div>); })}
                            </div>
                        </div>);
        })}
            </div>
        </div>);
};
var TimeGridView = function (_a) {
    var dates = _a.dates, appointments = _a.appointments, onAppointmentClick = _a.onAppointmentClick;
    var hours = Array.from({ length: 24 }, function (_, i) { return i; });
    var getPositionAndHeight = function (start, end) {
        var top = (start.getHours() * 60 + start.getMinutes()) / (24 * 60) * 100;
        var durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
        var height = (durationMinutes / (24 * 60)) * 100;
        return { top: "".concat(top, "%"), height: "".concat(Math.max(height, 2), "%") }; // Min height for visibility
    };
    return (<div className="flex-1 flex overflow-auto">
            <div className="w-16 border-r border-gray-200 text-right">
                {hours.map(function (hour) { return (<div key={hour} className="h-24 -mt-3 pr-2 pt-1 relative">
                        {hour > 0 && <span className="text-xs text-gray-500">{"".concat(hour % 12 === 0 ? 12 : hour % 12, " ").concat(hour < 12 ? 'AM' : 'PM')}</span>}
                    </div>); })}
            </div>
            <div className="flex-1 grid" style={{ gridTemplateColumns: "repeat(".concat(dates.length, ", 1fr)") }}>
                {dates.map(function (date, index) {
            var dayAppointments = appointments.filter(function (a) { return a.start.toDateString() === date.toDateString(); });
            return (<div key={index} className="relative border-r border-gray-200">
                            {hours.map(function (hour) { return (<div key={hour} className="h-24 border-b border-gray-200"></div>); })}
                            {dayAppointments.map(function (appt) {
                    var _a = getPositionAndHeight(appt.start, appt.end), top = _a.top, height = _a.height;
                    return (<div key={appt.id} className="absolute left-2 right-2 p-2 bg-primary-100 border-l-4 border-primary-500 rounded-r-md flex flex-col overflow-hidden cursor-pointer hover:bg-primary-200 transition-colors" style={{ top: top, height: height, minHeight: '24px' }} onClick={function () { return onAppointmentClick(appt); }}>
                                        <p className="text-xs font-semibold text-primary-800 truncate">{appt.title}</p>
                                        <p className="text-xs text-primary-600">
                                            {appt.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appt.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>);
                })}
                        </div>);
        })}
            </div>
        </div>);
};
var AppointmentDetailsModal = function (_a) {
    var appointment = _a.appointment, onClose = _a.onClose;
    var navigate = (0, react_router_dom_1.useNavigate)();
    if (!appointment)
        return null;
    var _b = appointment.title.includes(' - ') ? appointment.title.split(' - ') : [appointment.title, 'General Visit'], patientName = _b[0], reason = _b[1];
    var viewChart = function () {
        onClose();
        navigate("/patients/".concat(appointment.patientId));
    };
    return (<Modal_1.default isOpen={!!appointment} onClose={onClose} title="Appointment Details">
             <div className="space-y-4">
                <p><strong>Patient:</strong> <span className="font-semibold text-gray-800">{patientName}</span></p>
                <p><strong>Reason for Visit:</strong> <span className="font-semibold text-gray-800">{reason}</span></p>
                <p><strong>Time:</strong> <span className="font-semibold text-gray-800">{appointment.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appointment.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Close</button>
                <button onClick={viewChart} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">View Patient Chart</button>
            </div>
        </Modal_1.default>);
};
var ProviderCalendar = function () {
    var rawAppointments = (0, useAuth_1.useAuth)().appointments;
    var _a = (0, react_1.useState)(new Date()), currentDate = _a[0], setCurrentDate = _a[1];
    var _b = (0, react_1.useState)('month'), view = _b[0], setView = _b[1];
    var _c = (0, react_1.useState)(null), selectedAppointment = _c[0], setSelectedAppointment = _c[1];
    var appointments = (0, react_1.useMemo)(function () {
        return rawAppointments
            .filter(function (appt) { return appt.status !== 'Cancelled'; })
            .map(function (appt) {
            var start = new Date("".concat(appt.date, "T").concat(appt.time, ":00"));
            var end = new Date(start.getTime() + appt.duration * 60000);
            return {
                id: appt.id,
                patientId: appt.patientId,
                title: "".concat(appt.patientName, " - ").concat(appt.reason),
                start: start,
                end: end,
            };
        });
    }, [rawAppointments]);
    var weekDates = (0, react_1.useMemo)(function () {
        var startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        return Array.from({ length: 7 }, function (_, i) {
            var date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    }, [currentDate]);
    var renderView = function () {
        switch (view) {
            case 'week':
                return <TimeGridView dates={weekDates} appointments={appointments} onAppointmentClick={setSelectedAppointment}/>;
            case 'day':
                return <TimeGridView dates={[currentDate]} appointments={appointments} onAppointmentClick={setSelectedAppointment}/>;
            case 'month':
            default:
                return <MonthView currentDate={currentDate} appointments={appointments} onAppointmentClick={setSelectedAppointment}/>;
        }
    };
    return (<div>
            <PageHeader_1.default title="My Calendar"/>
            <Card_1.default className="p-0 flex flex-col h-[calc(100vh-14rem)]">
                <CalendarHeader currentDate={currentDate} view={view} onViewChange={setView} onDateChange={setCurrentDate}/>
                {appointments.length > 0 ? renderView() : (<div className="flex-1 flex items-center justify-center text-gray-500">
                        No appointments to display.
                    </div>)}
            </Card_1.default>
            <AppointmentDetailsModal appointment={selectedAppointment} onClose={function () { return setSelectedAppointment(null); }}/>
        </div>);
};
exports.default = ProviderCalendar;
