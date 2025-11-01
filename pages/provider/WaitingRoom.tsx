"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Card_1 = require("../../components/shared/Card");
var Icons_1 = require("../../components/shared/Icons");
var PageHeader_1 = require("../../components/shared/PageHeader");
// Mock data - Populated
var initialPatients = [
    { id: 1, name: 'Alice Johnson', reason: 'Follow-up', checkInTime: new Date(Date.now() - 5 * 60000) },
    { id: 2, name: 'Charlie Brown', reason: 'Sick Visit', checkInTime: new Date(Date.now() - 2 * 60000) },
];
var getInitials = function (name) {
    var parts = name.split(' ').filter(Boolean);
    if (parts.length > 1) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.length > 0 ? name[0].toUpperCase() : '?';
};
var WaitingRoom = function () {
    var patients = (0, react_1.useState)(initialPatients)[0];
    var _a = (0, react_1.useState)(new Date()), currentTime = _a[0], setCurrentTime = _a[1];
    (0, react_1.useEffect)(function () {
        var timer = setInterval(function () { return setCurrentTime(new Date()); }, 1000); // Update every second
        return function () { return clearInterval(timer); };
    }, []);
    var calculateWaitTime = function (checkInTime) {
        var diff = currentTime.getTime() - checkInTime.getTime();
        var minutes = Math.floor(diff / 60000);
        var seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        return "".concat(minutes, ":").concat(seconds);
    };
    return (<div>
      <PageHeader_1.default title="Virtual Waiting Room"/>
      <Card_1.default>
        <div className="flex items-center text-lg font-semibold text-gray-700 mb-4">
          <Icons_1.UsersIcon />
          <span className="ml-2">{patients.length} Patient(s) Waiting</span>
        </div>
        <div className="space-y-4">
          {patients.length > 0 ? (patients.map(function (patient) { return (<div key={patient.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xl flex-shrink-0">
                    {getInitials(patient.name)}
                    </div>
                    <div>
                    <p className="font-bold text-lg text-gray-800">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.reason}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="flex items-center text-gray-600">
                    <Icons_1.ClockIcon />
                    <span className="ml-2 font-mono text-lg">{calculateWaitTime(patient.checkInTime)}</span>
                    </div>
                    <div className="space-x-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm">
                        Notify
                        </button>
                        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                        Start Session
                        </button>
                    </div>
                </div>
                </div>); })) : (<div className="text-center py-10 text-gray-500">
                <Icons_1.UsersIcon className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
                <p className="font-semibold">The waiting room is empty.</p>
            </div>)}
        </div>
      </Card_1.default>
    </div>);
};
exports.default = WaitingRoom;
