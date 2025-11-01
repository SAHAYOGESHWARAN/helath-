"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var react_router_dom_1 = require("react-router-dom");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var Icons_1 = require("../../components/shared/Icons");
var PageHeader_1 = require("../../components/shared/PageHeader");
var genai_1 = require("@google/genai");
var recharts_1 = require("recharts");
var Tabs_1 = require("../../components/shared/Tabs");
var GoalProgress = function (_a) {
    var goal = _a.goal;
    var progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
    var isAchieved = goal.current >= goal.target;
    return (<div>
            <div className="flex justify-between items-baseline mb-1">
                <p className="font-semibold text-gray-700">{goal.title}</p>
                <p className="text-sm font-medium text-gray-500">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={"h-2.5 rounded-full ".concat(isAchieved ? 'bg-emerald-500' : 'bg-primary-600')} style={{ width: "".concat(progress, "%") }}></div>
            </div>
        </div>);
};
var StatCard = function (_a) {
    var icon = _a.icon, title = _a.title, value = _a.value, label = _a.label, link = _a.link, color = _a.color;
    return (<react_router_dom_1.Link to={link}>
        <Card_1.default className={"hover:shadow-lg transition-shadow hover:border-".concat(color, "-200 h-full")}>
            <div className="flex items-center">
                <div className={"p-3 rounded-full bg-".concat(color, "-100 mr-4")}>{icon}</div>
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <div className="flex items-baseline space-x-2">
                        <p className="text-2xl font-bold text-gray-800">{value}</p>
                        <p className="text-sm font-medium text-gray-600">{label}</p>
                    </div>
                </div>
            </div>
        </Card_1.default>
    </react_router_dom_1.Link>);
};
var PatientDashboard = function () {
    var _a;
    var _b = (0, useAuth_1.useAuth)(), user = _b.user, appointments = _b.appointments, messages = _b.messages;
    var _c = (0, react_1.useState)(''), summary = _c[0], setSummary = _c[1];
    var _d = (0, react_1.useState)(false), isSummaryLoading = _d[0], setIsSummaryLoading = _d[1];
    var _e = (0, react_1.useState)(''), summaryError = _e[0], setSummaryError = _e[1];
    var nextAppointment = (0, react_1.useMemo)(function () {
        var now = new Date();
        return __spreadArray([], appointments, true).filter(function (a) { return new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending'); })
            .sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); })[0];
    }, [appointments]);
    var activeMedicationsCount = (0, react_1.useMemo)(function () { var _a; return ((_a = user === null || user === void 0 ? void 0 : user.medications) === null || _a === void 0 ? void 0 : _a.filter(function (m) { return m.status === 'Active'; }).length) || 0; }, [user]);
    var primaryGoal = (0, react_1.useMemo)(function () { var _a; return (_a = user === null || user === void 0 ? void 0 : user.healthGoals) === null || _a === void 0 ? void 0 : _a[0]; }, [user]);
    var unreadMessages = (0, react_1.useMemo)(function () { return Object.values(messages).flat().filter(function (m) { return !m.isRead && m.senderId !== (user === null || user === void 0 ? void 0 : user.id); }).length; }, [messages, user]);
    var vitalsChartData = (0, react_1.useMemo)(function () {
        if (!(user === null || user === void 0 ? void 0 : user.vitals))
            return [];
        return user.vitals.slice(0, 7).reverse().map(function (v) { return ({
            date: new Date(v.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            weight: v.weight,
            systolic: parseInt(v.bloodPressure.split('/')[0]),
            diastolic: parseInt(v.bloodPressure.split('/')[1]),
            heartRate: v.heartRate,
        }); });
    }, [user === null || user === void 0 ? void 0 : user.vitals]);
    var generateSummary = function () { return __awaiter(void 0, void 0, void 0, function () {
        var ai, systemInstruction, result, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!user) {
                        setSummaryError('User data is not available to generate a summary.');
                        return [2 /*return*/];
                    }
                    setIsSummaryLoading(true);
                    setSummary('');
                    setSummaryError('');
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    ai = new genai_1.GoogleGenAI({ apiKey: process.env.API_KEY });
                    systemInstruction = "You are an AI Health Assistant for NovoPath Medical. Your role is to provide a patient-friendly summary of their electronic medical record. Analyze the provided health data and generate a clear, concise summary covering key health highlights, medications, and general wellness tips. CRITICAL: You MUST end EVERY response with the exact disclaimer: \"**Disclaimer: I am an AI assistant... consult with your doctor.**\"";
                    return [4 /*yield*/, ai.models.generateContent({
                            model: "gemini-2.5-flash",
                            contents: "Please summarize this health data for the patient, ".concat(user.name, ": Conditions: ").concat(((_a = user.conditions) === null || _a === void 0 ? void 0 : _a.map(function (c) { return c.name; }).join(', ')) || 'None', ". Medications: ").concat(((_b = user.medications) === null || _b === void 0 ? void 0 : _b.filter(function (m) { return m.status === 'Active'; }).map(function (m) { return m.name; }).join(', ')) || 'None', "."),
                            config: { systemInstruction: systemInstruction }
                        })];
                case 2:
                    result = _c.sent();
                    setSummary(result.text);
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    console.error("Error generating health summary:", error_1);
                    setSummaryError('Sorry, I was unable to generate your summary at this time.');
                    return [3 /*break*/, 5];
                case 4:
                    setIsSummaryLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var BPChart = function () { return (<recharts_1.ResponsiveContainer width="100%" height={250}>
      <recharts_1.LineChart data={vitalsChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
        <recharts_1.XAxis dataKey="date" tick={{ fontSize: 12 }}/>
        <recharts_1.YAxis yAxisId="left" domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 12 }} stroke="#ef4444" label={{ value: 'BP (mmHg)', angle: -90, position: 'insideLeft' }}/>
        <recharts_1.YAxis yAxisId="right" orientation="right" domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 12 }} stroke="#f97316"/>
        <recharts_1.Tooltip />
        <recharts_1.Legend />
        <recharts_1.Line yAxisId="left" type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic"/>
        <recharts_1.Line yAxisId="left" type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic"/>
        <recharts_1.Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#f97316" name="Heart Rate (bpm)"/>
      </recharts_1.LineChart>
    </recharts_1.ResponsiveContainer>); };
    var WeightChart = function () { return (<recharts_1.ResponsiveContainer width="100%" height={250}>
          <recharts_1.BarChart data={vitalsChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
              <recharts_1.XAxis dataKey="date" tick={{ fontSize: 12 }}/>
              <recharts_1.YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 12 }}/>
              <recharts_1.Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }}/>
              <recharts_1.Bar dataKey="weight" fill="#3b82f6" name="Weight (lbs)" barSize={30} radius={[4, 4, 0, 0]}/>
          </recharts_1.BarChart>
      </recharts_1.ResponsiveContainer>); };
    var vitalsTabs = [
        { name: 'BP & Heart Rate', icon: <Icons_1.HeartIcon />, content: <BPChart /> },
        { name: 'Weight', icon: <Icons_1.DumbbellIcon />, content: <WeightChart /> },
    ];
    var quickActions = [
        { name: 'Schedule Appointment', href: '/appointments', icon: <Icons_1.CalendarIcon className="w-5 h-5 text-primary-600"/> },
        { name: 'View Health Records', href: '/emr', icon: <Icons_1.DocumentTextIcon className="w-5 h-5 text-emerald-600"/> },
        { name: 'Message My Provider', href: '/messaging', icon: <Icons_1.ChatBubbleLeftRightIcon className="w-5 h-5 text-sky-600"/> },
        { name: 'Pay My Bill', href: '/payments', icon: <Icons_1.CurrencyDollarIcon className="w-5 h-5 text-amber-600"/> },
        { name: 'Start a Video Visit', href: '/video-consults', icon: <Icons_1.VideoCameraIcon className="w-5 h-5 text-rose-600"/> },
    ];
    return (<div>
      <PageHeader_1.default title={"Welcome back, ".concat((_a = user === null || user === void 0 ? void 0 : user.name) === null || _a === void 0 ? void 0 : _a.split(' ')[0], "!")} subtitle="Here’s your health summary for today."/>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Icons_1.CalendarIcon className="w-6 h-6 text-primary-600"/>} title="Next Appointment" value={nextAppointment ? new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'} label={(nextAppointment === null || nextAppointment === void 0 ? void 0 : nextAppointment.time) || ''} link="/appointments" color="primary"/>
             <StatCard icon={<Icons_1.PillIcon className="w-6 h-6 text-emerald-600"/>} title="Active Medications" value={activeMedicationsCount} label="meds" link="/emr" color="emerald"/>
             <StatCard icon={<Icons_1.DumbbellIcon className="w-6 h-6 text-amber-600"/>} title={(primaryGoal === null || primaryGoal === void 0 ? void 0 : primaryGoal.title) || "No Goals Set"} value={(primaryGoal === null || primaryGoal === void 0 ? void 0 : primaryGoal.current) || 0} label={(primaryGoal === null || primaryGoal === void 0 ? void 0 : primaryGoal.unit) || 'goals'} link="/emr" color="amber"/>
             <StatCard icon={<Icons_1.ChatBubbleLeftRightIcon className="w-6 h-6 text-sky-600"/>} title="Unread Messages" value={unreadMessages} label="messages" link="/messaging" color="sky"/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
                 <Card_1.default title="Your AI Health Summary">
                    {isSummaryLoading ? (<div className="space-y-3 animate-pulse p-4">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>) : summary ? (<div className="text-sm text-gray-700 space-y-2 p-4" style={{ whiteSpace: 'pre-wrap' }}>{summary}</div>) : (<div className="text-center p-4">
                            <p className="text-gray-600 mb-4">Get a quick, easy-to-understand overview of your health records.</p>
                            {summaryError && <p className="text-red-500 text-sm mb-4">{summaryError}</p>}
                            <button onClick={generateSummary} disabled={isSummaryLoading} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm inline-flex items-center">
                                <Icons_1.SparklesIcon className="w-5 h-5 mr-2"/> Generate My Summary
                            </button>
                        </div>)}
                </Card_1.default>
                <Card_1.default title="Your Vitals">
                    <Tabs_1.default tabs={vitalsTabs}/>
                </Card_1.default>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <Card_1.default title="Quick Actions">
                    <div className="space-y-2">
                        {quickActions.map(function (action) { return (<react_router_dom_1.Link key={action.name} to={action.href} className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="p-2 bg-gray-100 rounded-lg">{action.icon}</div>
                                <span className="ml-4 font-semibold text-gray-700">{action.name}</span>
                                <Icons_1.ArrowRightIcon className="w-4 h-4 ml-auto text-gray-400"/>
                            </react_router_dom_1.Link>); })}
                    </div>
                </Card_1.default>
                <Card_1.default title="Health Goals">
                    <div className="space-y-4">
                        {(user === null || user === void 0 ? void 0 : user.healthGoals) && user.healthGoals.length > 0 ? (user.healthGoals.map(function (goal) { return <GoalProgress key={goal.id} goal={goal}/>; })) : (<div className="text-center py-4 text-gray-500">
                                <p className="font-semibold text-gray-700">No Health Goals Yet</p>
                                <react_router_dom_1.Link to="/emr" className="mt-2 inline-block text-primary-600 font-semibold hover:underline text-sm">
                                    Set Goals
                                </react_router_dom_1.Link>
                            </div>)}
                    </div>
                </Card_1.default>
            </div>
        </div>
    </div>);
};
exports.default = PatientDashboard;
