"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var useAuth_1 = require("../../hooks/useAuth");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var types_1 = require("../../types");
var recharts_1 = require("recharts");
var PatientChart = function () {
    var _a, _b, _c, _d;
    var patientId = (0, react_router_dom_1.useParams)().patientId;
    var _e = (0, useAuth_1.useAuth)(), users = _e.users, appointments = _e.appointments;
    var patient = (0, react_1.useMemo)(function () {
        return users.find(function (u) { return u.id === patientId && u.role === types_1.UserRole.PATIENT; });
    }, [users, patientId]);
    var patientAppointments = (0, react_1.useMemo)(function () {
        return appointments.filter(function (a) { return a.patientId === patientId; })
            .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
    }, [appointments, patientId]);
    var vitalsData = (0, react_1.useMemo)(function () {
        if (!(patient === null || patient === void 0 ? void 0 : patient.vitals))
            return [];
        return patient.vitals.slice().reverse().map(function (v) { return ({
            date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            systolic: parseInt(v.bloodPressure.split('/')[0]),
            diastolic: parseInt(v.bloodPressure.split('/')[1]),
            heartRate: v.heartRate,
        }); });
    }, [patient === null || patient === void 0 ? void 0 : patient.vitals]);
    if (!patient) {
        return (<div>
                <PageHeader_1.default title="Patient Not Found"/>
                <Card_1.default>
                    <p>The requested patient could not be found.</p>
                </Card_1.default>
            </div>);
    }
    return (<div className="animate-fade-in-up">
            <PageHeader_1.default title={patient.name} subtitle={"DOB: ".concat(patient.dob, " | Patient ID: ").concat(patient.id)}/>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card_1.default title="Patient Info">
                        <div className="space-y-2 text-sm">
                            <p><strong>Email:</strong> {patient.email}</p>
                            <p><strong>Phone:</strong> {patient.phone}</p>
                            <p><strong>Address:</strong> {patient.address}</p>
                        </div>
                    </Card_1.default>
                     <Card_1.default title="Conditions">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {((_a = patient.conditions) === null || _a === void 0 ? void 0 : _a.map(function (c) { return <li key={c.id}>{c.name} ({c.status})</li>; })) || <li>No conditions recorded.</li>}
                        </ul>
                    </Card_1.default>
                    <Card_1.default title="Allergies">
                         <ul className="list-disc list-inside space-y-1 text-sm">
                            {((_b = patient.allergies) === null || _b === void 0 ? void 0 : _b.map(function (a) { return <li key={a.id}><span className="font-semibold">{a.name}</span> ({a.severity})</li>; })) || <li>No allergies recorded.</li>}
                        </ul>
                    </Card_1.default>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <Card_1.default title="Vitals Trend">
                         <recharts_1.ResponsiveContainer width="100%" height={250}>
                            <recharts_1.LineChart data={vitalsData}>
                                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                                <recharts_1.XAxis dataKey="date"/>
                                <recharts_1.YAxis yAxisId="left"/>
                                <recharts_1.YAxis yAxisId="right" orientation="right"/>
                                <recharts_1.Tooltip />
                                <recharts_1.Legend />
                                <recharts_1.Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic"/>
                                <recharts_1.Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic"/>
                                <recharts_1.Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#10b981" name="Heart Rate"/>
                            </recharts_1.LineChart>
                        </recharts_1.ResponsiveContainer>
                    </Card_1.default>
                     <Card_1.default title="Recent Encounters">
                        <ul className="divide-y divide-gray-200">
                             {patientAppointments.slice(0, 3).map(function (appt) { return (<li key={appt.id} className="py-3">
                                    <p className="font-semibold">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC' })} - {appt.reason}</p>
                                    <p className="text-sm text-gray-600">{appt.visitSummary || 'No summary available.'}</p>
                                </li>); })}
                        </ul>
                    </Card_1.default>
                    <Card_1.default title="Current Medications">
                        <ul className="divide-y divide-gray-200">
                            {(((_c = patient.medications) === null || _c === void 0 ? void 0 : _c.filter(function (m) { return m.status === 'Active'; }).length) || 0) > 0 ? (_d = patient.medications) === null || _d === void 0 ? void 0 : _d.filter(function (m) { return m.status === 'Active'; }).map(function (med) { return (<li key={med.id} className="py-3">
                                    <p className="font-semibold">{med.name} - {med.dosage}</p>
                                    <p className="text-sm text-gray-600">{med.frequency}</p>
                                </li>); }) : <li>No active medications.</li>}
                        </ul>
                    </Card_1.default>
                </div>
            </div>
        </div>);
};
exports.default = PatientChart;
