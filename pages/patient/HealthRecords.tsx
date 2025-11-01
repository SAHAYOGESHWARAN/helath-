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
var react_router_dom_1 = require("react-router-dom");
var formik_1 = require("formik");
var Yup = require("yup");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var recharts_1 = require("recharts");
var Icons_1 = require("../../components/shared/Icons");
var Tabs_1 = require("../../components/shared/Tabs");
var Modal_1 = require("../../components/shared/Modal");
var App_1 = require("../../App");
var VitalsChart = function (_a) {
    var data = _a.data;
    var chartData = data.slice(0, 7).reverse().map(function (v) { return ({
        date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
        systolic: parseInt(v.bloodPressure.split('/')[0]),
        diastolic: parseInt(v.bloodPressure.split('/')[1]),
        heartRate: v.heartRate,
    }); });
    return (<recharts_1.ResponsiveContainer width="100%" height={250}>
            <recharts_1.LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                <recharts_1.XAxis dataKey="date" tick={{ fontSize: 12 }}/>
                <recharts_1.YAxis yAxisId="left" domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 12 }} stroke="#ef4444"/>
                <recharts_1.YAxis yAxisId="right" orientation="right" domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 12 }} stroke="#f97316"/>
                <recharts_1.Tooltip />
                <recharts_1.Legend />
                <recharts_1.Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic"/>
                <recharts_1.Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic"/>
                <recharts_1.Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#f97316" name="Heart Rate (bpm)"/>
            </recharts_1.LineChart>
        </recharts_1.ResponsiveContainer>);
};
var LabResultCard = function (_a) {
    var result = _a.result;
    return (<Card_1.default title={"".concat(result.testName, " - ").concat(new Date(result.date).toLocaleDateString('en-US', { timeZone: 'UTC' }))} className="bg-white">
        <table className="w-full text-sm">
            <tbody>
                {result.components.map(function (c) { return (<tr key={c.name} className={"border-b last:border-b-0 ".concat(c.isAbnormal ? 'font-bold text-red-600' : '')}>
                        <td className="py-1">{c.name}</td>
                        <td className="py-1">{c.value}</td>
                        <td className="py-1 text-gray-500">{c.referenceRange}</td>
                    </tr>); })}
            </tbody>
        </table>
    </Card_1.default>);
};
var ConditionSchema = Yup.object().shape({
    name: Yup.string().required('Condition name is required'),
    ageOfOnset: Yup.number().positive('Age must be a positive number').typeError('Age must be a number'),
});
var AllergySchema = Yup.object().shape({
    name: Yup.string().required('Allergy name is required'),
    severity: Yup.string().required('Severity is required'),
});
var SelfReportModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, useAuth_1.useAuth)(), addCondition = _b.addCondition, addAllergy = _b.addAllergy;
    var showToast = (0, App_1.useApp)().showToast;
    var _c = (0, react_1.useState)('condition'), reportType = _c[0], setReportType = _c[1];
    return (<Modal_1.default isOpen={isOpen} onClose={onClose} title="Self-Report Condition or Allergy">
            <div className="flex justify-center mb-4 border border-gray-200 rounded-lg p-1">
                <button onClick={function () { return setReportType('condition'); }} className={"w-1/2 py-2 text-sm font-semibold rounded-md ".concat(reportType === 'condition' ? 'bg-primary-600 text-white' : 'text-gray-600')}>Condition</button>
                <button onClick={function () { return setReportType('allergy'); }} className={"w-1/2 py-2 text-sm font-semibold rounded-md ".concat(reportType === 'allergy' ? 'bg-primary-600 text-white' : 'text-gray-600')}>Allergy</button>
            </div>
            {reportType === 'condition' ? (<formik_1.Formik initialValues={{ name: '', status: 'Active', ageOfOnset: '', notes: '' }} validationSchema={ConditionSchema} onSubmit={function (values) {
                addCondition(__assign(__assign({}, values), { ageOfOnset: Number(values.ageOfOnset) || undefined, status: 'Active' }));
                showToast('Condition reported successfully.', 'success');
                onClose();
            }}>
                    {function (_a) {
                var isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
                return (<formik_1.Form className="space-y-4">
                            <formik_1.Field name="name" placeholder="Condition Name (e.g., Asthma)" className={"w-full p-2 border rounded ".concat(errors.name && touched.name ? 'border-red-500' : 'border-gray-300')}/>
                            <formik_1.Field name="ageOfOnset" type="number" placeholder="Age of Onset (optional)" className="w-full p-2 border rounded"/>
                            <formik_1.Field name="notes" as="textarea" rows={2} placeholder="Additional notes (optional)" className="w-full p-2 border rounded"/>
                            <div className="flex justify-end"><button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Submit for Review</button></div>
                        </formik_1.Form>);
            }}
                </formik_1.Formik>) : (<formik_1.Formik initialValues={{ name: '', severity: 'Mild', reaction: '', notes: '', status: 'Active' }} validationSchema={AllergySchema} onSubmit={function (values) {
                addAllergy(values);
                showToast('Allergy reported successfully.', 'success');
                onClose();
            }}>
                    {function (_a) {
                var isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
                return (<formik_1.Form className="space-y-4">
                            <formik_1.Field name="name" placeholder="Allergy Name (e.g., Peanuts)" className={"w-full p-2 border rounded ".concat(errors.name && touched.name ? 'border-red-500' : 'border-gray-300')}/>
                            <formik_1.Field as="select" name="severity" className="w-full p-2 border rounded">
                                <option>Mild</option><option>Moderate</option><option>Severe</option>
                            </formik_1.Field>
                            <formik_1.Field name="reaction" placeholder="Reaction (optional)" className="w-full p-2 border rounded"/>
                            <formik_1.Field name="notes" as="textarea" rows={2} placeholder="Additional notes (optional)" className="w-full p-2 border rounded"/>
                            <div className="flex justify-end"><button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Submit for Review</button></div>
                        </formik_1.Form>);
            }}
                </formik_1.Formik>)}
        </Modal_1.default>);
};
var getSeverityPill = function (severity) {
    switch (severity) {
        case 'Mild': return 'bg-yellow-100 text-yellow-800';
        case 'Moderate': return 'bg-orange-100 text-orange-800';
        case 'Severe': return 'bg-red-100 text-red-800';
    }
};
var GoalProgress = function (_a) {
    var goal = _a.goal;
    var progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
    return (<div>
            <div className="flex justify-between items-baseline mb-1">
                <p className="font-medium text-gray-700 text-sm">{goal.title}</p>
                <p className="text-xs font-semibold text-gray-500">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full" style={{ width: "".concat(progress, "%") }}></div></div>
        </div>);
};
var TaskSummary = function (_a) {
    var task = _a.task;
    return (<div className="flex items-center text-sm">
        <input type="checkbox" readOnly checked={task.completed} className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"/>
        <span className={"ml-2 ".concat(task.completed ? 'line-through text-gray-400' : 'text-gray-700')}>{task.text}</span>
    </div>);
};
var HealthRecords = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var user = (0, useAuth_1.useAuth)().user;
    var _j = (0, react_1.useState)(false), isReportModalOpen = _j[0], setIsReportModalOpen = _j[1];
    var clinicalTabs = [
        { name: 'Conditions & Allergies', icon: <Icons_1.HeartIcon />, content: <div>
                <h4 className="font-semibold mb-2">Conditions</h4>
                <ul className="space-y-2 text-sm mb-4">
                    {(((_a = user === null || user === void 0 ? void 0 : user.conditions) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0 ? (_b = user === null || user === void 0 ? void 0 : user.conditions) === null || _b === void 0 ? void 0 : _b.map(function (c) { return (<li key={c.id} className="flex justify-between p-2 rounded-md hover:bg-gray-50">
                            <span className="font-medium text-gray-800">{c.name}</span>
                            <span className="font-medium text-gray-500">{c.status}</span>
                        </li>); }) : <li className="text-center text-gray-500 py-2">No conditions reported.</li>}
                </ul>
                <h4 className="font-semibold mb-2 pt-4 border-t">Allergies</h4>
                <ul className="space-y-2 text-sm">
                    {(((_c = user === null || user === void 0 ? void 0 : user.allergies) === null || _c === void 0 ? void 0 : _c.length) || 0) > 0 ? (_d = user === null || user === void 0 ? void 0 : user.allergies) === null || _d === void 0 ? void 0 : _d.map(function (a) { return (<li key={a.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                            <span className="font-medium text-gray-800">{a.name}</span>
                            <span className={"px-2 py-0.5 text-xs font-semibold rounded-full ".concat(getSeverityPill(a.severity))}>{a.severity}</span>
                        </li>); }) : <li className="text-center text-gray-500 py-2">No allergies reported.</li>}
                </ul>
            </div>
        },
        { name: 'Medications', icon: <Icons_1.PillIcon />, content: <div>
                <ul className="space-y-2 text-sm">
                    {(((_e = user === null || user === void 0 ? void 0 : user.medications) === null || _e === void 0 ? void 0 : _e.filter(function (m) { return m.status === 'Active'; }).length) || 0) > 0 ? (_f = user === null || user === void 0 ? void 0 : user.medications) === null || _f === void 0 ? void 0 : _f.filter(function (m) { return m.status === 'Active'; }).map(function (m) { return (<li key={m.id} className="p-2 rounded-md hover:bg-gray-50">
                            <p className="font-medium">{m.name}</p>
                            <p className="text-xs text-gray-500">{m.dosage}, {m.frequency}</p>
                        </li>); }) : <li className="text-center text-gray-500 py-4">No active medications.</li>}
                </ul>
                <react_router_dom_1.Link to="/medications" className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:underline">Manage All Medications &rarr;</react_router_dom_1.Link>
            </div>
        },
        { name: 'Vitals History', icon: <Icons_1.HeartIcon />, content: (user === null || user === void 0 ? void 0 : user.vitals) && user.vitals.length > 0 ? <VitalsChart data={user.vitals}/> : <p className="text-center text-gray-500 py-4">No vitals recorded.</p>
        },
    ];
    return (<div className="animate-fade-in-up">
            <PageHeader_1.default title="EMR Overview" subtitle="A comprehensive summary of your electronic medical record."/>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card_1.default className="p-0">
                        <div className="px-6 py-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800 tracking-wide">Clinical Summary</h2>
                            <button onClick={function () { return setIsReportModalOpen(true); }} className="text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full">+ Self-Report</button>
                        </div>
                        <div className="p-6">
                             <Tabs_1.default tabs={clinicalTabs}/>
                        </div>
                    </Card_1.default>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <Card_1.default title="Health Goals">
                        <div className="space-y-3">
                            {(((_g = user === null || user === void 0 ? void 0 : user.healthGoals) === null || _g === void 0 ? void 0 : _g.length) || 0) > 0 ? user.healthGoals.map(function (goal) { return <GoalProgress key={goal.id} goal={goal}/>; })
            : <p className="text-center text-gray-500 text-sm py-2">No goals set.</p>}
                        </div>
                        <react_router_dom_1.Link to="/goals" className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:underline">Manage Goals &rarr;</react_router_dom_1.Link>
                    </Card_1.default>
                    <Card_1.default title="My Tasks">
                         <div className="space-y-3">
                            {(((_h = user === null || user === void 0 ? void 0 : user.tasks) === null || _h === void 0 ? void 0 : _h.length) || 0) > 0 ? user.tasks.filter(function (t) { return !t.completed; }).slice(0, 3).map(function (task) { return <TaskSummary key={task.id} task={task}/>; })
            : <p className="text-center text-gray-500 text-sm py-2">No pending tasks.</p>}
                        </div>
                        <react_router_dom_1.Link to="/tasks" className="mt-4 block text-center text-sm font-semibold text-primary-600 hover:underline">Manage All Tasks &rarr;</react_router_dom_1.Link>
                    </Card_1.default>
                    <Card_1.default title="Recent Lab Results">
                        {(user === null || user === void 0 ? void 0 : user.labResults) && user.labResults.length > 0 ? (<LabResultCard result={user.labResults[0]}/>) : (<p className="text-center text-gray-500 text-sm py-2">No lab results available.</p>)}
                    </Card_1.default>
                </div>
            </div>

            <SelfReportModal isOpen={isReportModalOpen} onClose={function () { return setIsReportModalOpen(false); }}/>
        </div>);
};
exports.default = HealthRecords;
