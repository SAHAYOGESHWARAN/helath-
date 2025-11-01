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
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var recharts_1 = require("recharts");
var Icons_1 = require("../../components/shared/Icons");
var useAuth_1 = require("../../hooks/useAuth");
var types_1 = require("../../types");
var exportToCsv = function (filename, rows) {
    if (!rows || rows.length === 0) {
        return;
    }
    var separator = ',';
    var keys = Object.keys(rows[0]);
    var csvContent = keys.join(separator) +
        '\n' +
        rows.map(function (row) {
            return keys.map(function (k) {
                var cell = row[k] === null || row[k] === undefined ? '' : row[k];
                cell = String(cell).replace(/"/g, '""');
                if (String(cell).includes(separator) || String(cell).includes('\n')) {
                    cell = "\"".concat(cell, "\"");
                }
                return cell;
            }).join(separator);
        }).join('\n');
    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement('a');
    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
var KpiCard = function (_a) {
    var title = _a.title, value = _a.value, change = _a.change, icon = _a.icon;
    return (<Card_1.default>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            {icon}
        </div>
        <p className={"text-sm mt-2 flex items-center ".concat(change.startsWith('+') ? 'text-emerald-600' : 'text-red-600')}>
            <Icons_1.ArrowTrendingUpIcon className={"w-4 h-4 mr-1 ".concat(change.startsWith('-') ? 'rotate-180' : '')}/>
            {change} vs. last month
        </p>
    </Card_1.default>);
};
var AdminReports = function () {
    var _a = (0, useAuth_1.useAuth)(), users = _a.users, invoices = _a.invoices, appointments = _a.appointments;
    var reportData = (0, react_1.useMemo)(function () {
        var now = new Date();
        var lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        var newUsersThisMonth = users.filter(function (u) { return u.createdAt && new Date(u.createdAt) > lastMonth; }).length;
        var revenueThisMonth = invoices.filter(function (i) { return i.status === 'Paid' && new Date(i.date) > lastMonth; }).reduce(function (sum, i) { return sum + i.totalAmount; }, 0);
        var appointmentsThisMonth = appointments.filter(function (a) { return new Date(a.date) > lastMonth; }).length;
        var userGrowthData = Array.from({ length: 6 }, function (_, i) {
            var d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
            var monthName = d.toLocaleString('default', { month: 'short' });
            return {
                name: monthName,
                Patients: users.filter(function (u) { return u.role === types_1.UserRole.PATIENT && u.createdAt && new Date(u.createdAt) <= d; }).length,
                Providers: users.filter(function (u) { return u.role === types_1.UserRole.PROVIDER && u.createdAt && new Date(u.createdAt) <= d; }).length
            };
        });
        var revenueData = Array.from({ length: 6 }, function (_, i) {
            var d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
            var monthName = d.toLocaleString('default', { month: 'short' });
            var monthRevenue = invoices.filter(function (inv) { return inv.status === 'Paid' && new Date(inv.date).getMonth() === d.getMonth() && new Date(inv.date).getFullYear() === d.getFullYear(); }).reduce(function (sum, inv) { return sum + inv.totalAmount; }, 0);
            return { name: monthName, MRR: monthRevenue };
        });
        var appointmentTypeData = appointments.reduce(function (acc, appt) {
            var week = "Week ".concat(Math.ceil(new Date(appt.date).getDate() / 7));
            var weekData = acc.find(function (w) { return w.name === week; });
            if (!weekData) {
                weekData = { name: week, 'In-Person': 0, Virtual: 0 };
                acc.push(weekData);
            }
            if (appt.location === 'Virtual')
                weekData.Virtual++;
            else
                weekData['In-Person']++;
            return acc;
        }, []);
        var engagementData = [
            { name: 'Active', value: users.filter(function (u) { return u.status === 'Active'; }).length },
            { name: 'Inactive', value: users.filter(function (u) { return u.status !== 'Active'; }).length },
        ];
        return { newUsersThisMonth: newUsersThisMonth, revenueThisMonth: revenueThisMonth, appointmentsThisMonth: appointmentsThisMonth, userGrowthData: userGrowthData, revenueData: revenueData, appointmentTypeData: appointmentTypeData, engagementData: engagementData };
    }, [users, invoices, appointments]);
    var handleExport = (0, react_1.useCallback)(function () {
        var dataToExport = __spreadArray(__spreadArray([
            __assign({ Report: 'Key Performance Indicators' }, reportData)
        ], reportData.userGrowthData.map(function (d) { return (__assign({ Report: 'User Growth' }, d)); }), true), reportData.revenueData.map(function (d) { return (__assign({ Report: 'Revenue' }, d)); }), true);
        exportToCsv('admin_report.csv', dataToExport);
    }, [reportData]);
    var COLORS = ['#10b981', '#f87171'];
    return (<div className="animate-fade-in-up">
            <PageHeader_1.default title="Analytics & Reports" subtitle="Monitor platform growth, revenue, and user engagement." buttonText="Export Report" onButtonClick={handleExport}/>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard title="New Users" value={String(reportData.newUsersThisMonth)} change="+5.2%" icon={<Icons_1.UserPlusIcon className="w-8 h-8 text-blue-500"/>}/>
                <KpiCard title="Total Revenue" value={"$".concat(reportData.revenueThisMonth.toLocaleString())} change="+12.1%" icon={<Icons_1.BanknotesIcon className="w-8 h-8 text-emerald-500"/>}/>
                <KpiCard title="Appointments Booked" value={String(reportData.appointmentsThisMonth)} change="+8.3%" icon={<Icons_1.CalendarIcon className="w-8 h-8 text-primary-500"/>}/>
                <KpiCard title="Avg. Session Duration" value="12 min" change="-1.5%" icon={<Icons_1.ClockIcon className="w-8 h-8 text-amber-500"/>}/>
            </div>

            <div className="space-y-8">
                <Card_1.default title="User Growth Over Time">
                    <recharts_1.ResponsiveContainer width="100%" height={300}>
                        <recharts_1.LineChart data={reportData.userGrowthData}>
                            <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                            <recharts_1.XAxis dataKey="name"/>
                            <recharts_1.YAxis />
                            <recharts_1.Tooltip />
                            <recharts_1.Legend />
                            <recharts_1.Line type="monotone" dataKey="Patients" stroke="#3b82f6" strokeWidth={2}/>
                            <recharts_1.Line type="monotone" dataKey="Providers" stroke="#f59e0b" strokeWidth={2}/>
                        </recharts_1.LineChart>
                    </recharts_1.ResponsiveContainer>
                </Card_1.default>

                 <Card_1.default title="Monthly Recurring Revenue (MRR)">
                    <recharts_1.ResponsiveContainer width="100%" height={300}>
                        <recharts_1.AreaChart data={reportData.revenueData}>
                             <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                            <recharts_1.XAxis dataKey="name"/>
                            <recharts_1.YAxis tickFormatter={function (value) { return "$".concat(value / 1000, "k"); }}/>
                            <recharts_1.Tooltip formatter={function (value) { return "$".concat(value.toLocaleString()); }}/>
                            <recharts_1.Legend />
                            <recharts_1.Area type="monotone" dataKey="MRR" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)"/>
                        </recharts_1.AreaChart>
                    </recharts_1.ResponsiveContainer>
                </Card_1.default>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <Card_1.default title="Appointment Volume by Type">
                         <recharts_1.ResponsiveContainer width="100%" height={300}>
                            <recharts_1.BarChart data={reportData.appointmentTypeData}>
                                <recharts_1.CartesianGrid strokeDasharray="3 3"/>
                                <recharts_1.XAxis dataKey="name"/>
                                <recharts_1.YAxis />
                                <recharts_1.Tooltip />
                                <recharts_1.Legend />
                                <recharts_1.Bar dataKey="In-Person" stackId="a" fill="#3b82f6"/>
                                <recharts_1.Bar dataKey="Virtual" stackId="a" fill="#84cc16"/>
                            </recharts_1.BarChart>
                        </recharts_1.ResponsiveContainer>
                    </Card_1.default>
                     <Card_1.default title="Platform Engagement">
                        <recharts_1.ResponsiveContainer width="100%" height={300}>
                            <recharts_1.PieChart>
                                <recharts_1.Pie data={reportData.engagementData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                                     {reportData.engagementData.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>); })}
                                </recharts_1.Pie>
                                <recharts_1.Tooltip />
                                <recharts_1.Legend />
                            </recharts_1.PieChart>
                        </recharts_1.ResponsiveContainer>
                    </Card_1.default>
                </div>
            </div>
        </div>);
};
exports.default = AdminReports;
