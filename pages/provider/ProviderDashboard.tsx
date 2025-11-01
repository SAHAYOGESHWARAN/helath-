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
var useAuth_1 = require("../../hooks/useAuth");
var Icons_1 = require("../../components/shared/Icons");
var recharts_1 = require("recharts");
var SkeletonCard_1 = require("../../components/shared/skeletons/SkeletonCard");
var PageHeader_1 = require("../../components/shared/PageHeader");
var react_router_dom_1 = require("react-router-dom");
var Card_1 = require("../../components/shared/Card");
var KpiCard = function (_a) {
    var icon = _a.icon, title = _a.title, value = _a.value, color = _a.color;
    return (<Card_1.default className={"flex items-center p-4 border-l-4 ".concat(color)}>
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-500 text-sm">{title}</p>
      </div>
    </Card_1.default>);
};
var AppointmentStatusChart = function (_a) {
    var appointments = _a.appointments;
    var data = (0, react_1.useMemo)(function () {
        var counts = appointments.reduce(function (acc, appt) {
            var status = appt.checkInStatus || appt.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(function (_a) {
            var name = _a[0], value = _a[1];
            return ({ name: name, value: value });
        });
    }, [appointments]);
    var COLORS = {
        'Scheduled': '#3b82f6',
        'Checked-In': '#10b981',
        'Complete': '#6b7281',
        'Waiting': '#f59e0b',
        'Confirmed': '#3b82f6',
        'Pending': '#f59e0b',
    };
    return (<div className="h-64">
            <recharts_1.ResponsiveContainer width="100%" height="100%">
                <recharts_1.PieChart>
                    <recharts_1.Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name">
                        {data.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[entry.name] || '#cccccc'}/>); })}
                    </recharts_1.Pie>
                    <recharts_1.Tooltip />
                </recharts_1.PieChart>
            </recharts_1.ResponsiveContainer>
        </div>);
};
var getStatusPill = function (status) {
    switch (status) {
        case 'Checked-In': return 'bg-emerald-100 text-emerald-800';
        case 'Pending': return 'bg-amber-100 text-amber-800';
        case 'Confirmed': return 'bg-blue-100 text-blue-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
var getUrgencyBorder = function (urgency) {
    switch (urgency) {
        case 'High': return 'border-l-4 border-red-500';
        case 'Medium': return 'border-l-4 border-amber-500';
        case 'Low': return 'border-l-4 border-blue-500';
        default: return 'border-l-4 border-gray-300';
    }
};
var ProviderDashboard = function () {
    var _a;
    var _b = (0, useAuth_1.useAuth)(), user = _b.user, appointments = _b.appointments, progressNotes = _b.progressNotes, prescriptions = _b.prescriptions, messages = _b.messages, users = _b.users;
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () { return setIsLoading(false); }, 350);
        return function () { return clearTimeout(timer); };
    }, []);
    var todaysAppointments = (0, react_1.useMemo)(function () {
        var todayStr = new Date().toISOString().split('T')[0];
        return appointments.filter(function (a) { return a.date === todayStr && a.providerId === (user === null || user === void 0 ? void 0 : user.id) && a.status !== 'Cancelled'; });
    }, [appointments, user]);
    var waitingRoom = (0, react_1.useMemo)(function () {
        return todaysAppointments.filter(function (a) { return a.checkInStatus === 'Waiting'; });
    }, [todaysAppointments]);
    var recentActivity = (0, react_1.useMemo)(function () {
        var allMessages = [].concat.apply([], Object.values(messages)).sort(function (a, b) { return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(); })
            .map(function (m) {
            var patient = users.find(function (u) { return u.id === m.senderId; });
            return __assign(__assign({}, m), { patientName: patient ? patient.name : 'Unknown Patient' });
        });
        var activities = __spreadArray(__spreadArray(__spreadArray([], allMessages.slice(0, 2).map(function (m) { return ({ id: "msg-".concat(m.id), type: 'New Message', description: "From ".concat(m.patientName), time: '5m ago', icon: <Icons_1.ChatBubbleLeftRightIcon className="w-5 h-5 text-sky-600"/>, link: '/messaging' }); }), true), progressNotes.filter(function (n) { return n.status === "Signed"; }).slice(0, 1).map(function (n) { return ({ id: "note-".concat(n.id), type: 'Note Signed', description: "For ".concat(n.patientName), time: '45m ago', icon: <Icons_1.CheckCircleIcon className="w-5 h-5 text-emerald-600"/>, link: "/patients/".concat(n.patientId) }); }), true), appointments.filter(function (a) { return a.status === 'Completed'; }).slice(0, 2).map(function (a) { return ({ id: "appt-".concat(a.id), type: 'Appointment Complete', description: "".concat(a.patientName, " - ").concat(a.reason), time: '2h ago', icon: <Icons_1.CalendarIcon className="w-5 h-5 text-gray-500"/>, link: "/patients/".concat(a.patientId) }); }), true);
        return activities.sort(function () { return Math.random() - 0.5; }); // Randomize for demo
    }, [messages, progressNotes, appointments, users]);
    if (isLoading) {
        return (<div>
                <div className="h-10 w-3/5 rounded-lg shimmer-bg mb-2"></div>
                <div className="h-6 w-2/5 rounded-lg shimmer-bg mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {__spreadArray([], Array(4), true).map(function (_, i) { return <SkeletonCard_1.default key={i} className="h-28"/>; })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <SkeletonCard_1.default className="lg:col-span-2 h-96"/>
                    <SkeletonCard_1.default className="h-96"/>
                </div>
            </div>);
    }
    var unsignedNotes = progressNotes.filter(function (n) { return n.status === 'Pending Signature'; }).length;
    var mockInbox = [];
    return (<div>
      <PageHeader_1.default title={"Welcome back, Dr. ".concat((_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.split(' ').slice(-1).join(' '))} subtitle="Here’s a snapshot of your practice today."/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KpiCard icon={<Icons_1.CalendarIcon className="w-8 h-8 text-blue-500"/>} title="Appointments Today" value={todaysAppointments.length} color="border-blue-500"/>
        <KpiCard icon={<Icons_1.HandThumbUpIcon className="w-8 h-8 text-emerald-500"/>} title="Patient Satisfaction" value="N/A" color="border-emerald-500"/>
        <KpiCard icon={<Icons_1.ClockIcon className="w-8 h-8 text-amber-500"/>} title="Avg. Wait Time" value="0 min" color="border-amber-500"/>
        <KpiCard icon={<Icons_1.UserMinusIcon className="w-8 h-8 text-red-500"/>} title="No-Show Rate" value="0%" color="border-red-500"/>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Today's Appointments</h3>
                     <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {todaysAppointments.length > 0 ? todaysAppointments.sort(function (a, b) { return a.time.localeCompare(b.time); }).map(function (appt) { return (<div key={appt.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-primary-50 hover:shadow-sm transition-all">
                                <div className="w-20 text-sm font-bold text-gray-800">{appt.time}</div>
                                <div className="flex-1 border-l-2 border-gray-300 pl-4">
                                    <p className="font-semibold text-gray-900">{appt.patientName}</p>
                                    <p className="text-sm text-gray-600">{appt.reason}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                     <span className={"px-3 py-1 text-xs font-semibold rounded-full ".concat(getStatusPill(appt.checkInStatus || appt.status))}>{appt.checkInStatus || appt.status}</span>
                                     <react_router_dom_1.Link to={"/patients/".concat(appt.patientId)} className="text-primary-600 hover:underline text-xs font-semibold">View Chart</react_router_dom_1.Link>
                                     {appt.location === 'Virtual' && (<react_router_dom_1.Link to="/video-consults" className="bg-emerald-500 text-white px-2 py-1 rounded-md text-xs font-bold hover:bg-emerald-600">
                                             Start Visit
                                         </react_router_dom_1.Link>)}
                                </div>
                            </div>); }) : <p className="text-center text-gray-500 py-8">No appointments scheduled for today.</p>}
                    </div>
                </div>
            </div>
            <div>
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-full flex flex-col">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Appointment Status</h3>
                    {todaysAppointments.length > 0 ? <AppointmentStatusChart appointments={todaysAppointments}/> : <p className="text-sm text-center text-gray-500 flex-grow flex items-center justify-center">No appointment data for today.</p>}
                </div>
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div>
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Task Inbox ({mockInbox.length})</h3>
                    <div className="space-y-3">
                        {mockInbox.length > 0 ? mockInbox.map(function (item) { return (<react_router_dom_1.Link to={item.link} key={item.id} className={"flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer ".concat(getUrgencyBorder(item.urgency))}>
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">{item.icon}</div>
                                <div className="flex-1 ml-3">
                                    <p className="font-semibold text-gray-800 text-sm">{item.description}</p>
                                </div>
                            </react_router_dom_1.Link>); }) : <p className="text-sm text-center text-gray-500 py-4">Inbox is empty.</p>}
                    </div>
                </div>
            </div>
             <div className="lg:col-span-2">
                 <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {recentActivity.map(function (item) { return (<react_router_dom_1.Link to={item.link} key={item.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">{item.icon}</div>
                                <div className="flex-1 ml-3">
                                    <p className="font-semibold text-gray-800 text-sm">{item.type}</p>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                                <span className="text-xs text-gray-400">{item.time}</span>
                            </react_router_dom_1.Link>); })}
                    </div>
                </div>
            </div>
       </div>
    </div>);
};
exports.default = ProviderDashboard;
