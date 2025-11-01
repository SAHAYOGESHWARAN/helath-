"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useAuth_1 = require("../../hooks/useAuth");
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
var types_1 = require("../../types");
var Icons_1 = require("../../components/shared/Icons");
var recharts_1 = require("recharts");
var react_router_dom_1 = require("react-router-dom");
var AdminDashboard = function () {
    var _a = (0, useAuth_1.useAuth)(), users = _a.users, invoices = _a.invoices, providerSubscriptionPlans = _a.providerSubscriptionPlans;
    var stats = (0, react_1.useMemo)(function () {
        var providers = users.filter(function (u) { return u.role === types_1.UserRole.PROVIDER; });
        var patients = users.filter(function (u) { return u.role === types_1.UserRole.PATIENT; });
        var totalRevenue = providers.reduce(function (acc, provider) {
            var plan = providerSubscriptionPlans.find(function (p) { var _a; return p.id === ((_a = provider.subscription) === null || _a === void 0 ? void 0 : _a.planId); });
            if (plan && plan.price.startsWith('$')) {
                var price = parseFloat(plan.price.replace(/[^0-9.-]+/g, ""));
                if (!isNaN(price)) {
                    return acc + price;
                }
            }
            return acc;
        }, 0);
        return {
            totalUsers: users.length,
            totalProviders: providers.length,
            totalPatients: patients.length,
            pendingVerifications: providers.filter(function (p) { return !p.isVerified; }).length,
            monthlyRevenue: totalRevenue,
        };
    }, [users, providerSubscriptionPlans]);
    var userRoleData = (0, react_1.useMemo)(function () { return [
        { name: 'Patients', value: stats.totalPatients },
        { name: 'Providers', value: stats.totalProviders },
        { name: 'Admins', value: users.filter(function (u) { return u.role === types_1.UserRole.ADMIN; }).length },
    ]; }, [stats, users]);
    var revenueData = (0, react_1.useMemo)(function () {
        var months = {};
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        invoices.forEach(function (invoice) {
            if (invoice.status === 'Paid') {
                var date = new Date(invoice.date);
                var month = monthNames[date.getMonth()];
                months[month] = (months[month] || 0) + invoice.totalAmount;
            }
        });
        // Add current month's estimated revenue from subscriptions
        var currentMonthName = monthNames[new Date().getMonth()];
        months[currentMonthName] = (months[currentMonthName] || 0) + stats.monthlyRevenue;
        return monthNames.slice(0, new Date().getMonth() + 1).map(function (month) { return ({
            month: month,
            revenue: months[month] || 0,
        }); });
    }, [invoices, stats.monthlyRevenue]);
    var COLORS = ['#3b82f6', '#14B8A6', '#6366f1'];
    return (<div className="animate-fade-in-up">
            <PageHeader_1.default title="Administrator Dashboard" subtitle="Oversee and manage the NovoPath Medical platform."/>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card_1.default className="flex items-center p-4">
                    <div className="p-3 bg-blue-100 rounded-full mr-4"><Icons_1.UsersIcon className="w-6 h-6 text-blue-600"/></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p><p className="text-gray-500">Total Users</p></div>
                </Card_1.default>
                <Card_1.default className="flex items-center p-4">
                    <div className="p-3 bg-teal-100 rounded-full mr-4"><Icons_1.CollectionIcon className="w-6 h-6 text-teal-600"/></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.totalProviders}</p><p className="text-gray-500">Active Providers</p></div>
                </Card_1.default>
                 <Card_1.default className="flex items-center p-4">
                    <div className="p-3 bg-emerald-100 rounded-full mr-4"><Icons_1.CurrencyDollarIcon className="w-6 h-6 text-emerald-600"/></div>
                    <div><p className="text-3xl font-bold text-gray-800">${stats.monthlyRevenue.toFixed(2)}</p><p className="text-gray-500">Est. Monthly Revenue</p></div>
                </Card_1.default>
                <Card_1.default className="flex items-center p-4">
                    <div className="p-3 bg-amber-100 rounded-full mr-4"><Icons_1.ShieldExclamationIcon className="w-6 h-6 text-amber-600"/></div>
                    <div><p className="text-3xl font-bold text-gray-800">{stats.pendingVerifications}</p><p className="text-gray-500">Pending Verifications</p></div>
                </Card_1.default>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card_1.default title="Revenue Growth (Monthly)">
                        <recharts_1.ResponsiveContainer width="100%" height={300}>
                            <recharts_1.BarChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <recharts_1.CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                <recharts_1.XAxis dataKey="month" tick={{ fontSize: 12 }}/>
                                <recharts_1.YAxis tick={{ fontSize: 12 }} tickFormatter={function (value) { return "$".concat(value); }}/>
                                <recharts_1.Tooltip cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }} formatter={function (value) { return "$".concat(value.toFixed(2)); }}/>
                                <recharts_1.Bar dataKey="revenue" fill="#3b82f6" name="Revenue" barSize={30} radius={[4, 4, 0, 0]}/>
                            </recharts_1.BarChart>
                        </recharts_1.ResponsiveContainer>
                    </Card_1.default>
                </div>
                <div className="lg:col-span-2">
                    <Card_1.default title="User Distribution">
                         <recharts_1.ResponsiveContainer width="100%" height={300}>
                            <recharts_1.PieChart>
                                <recharts_1.Pie data={userRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {userRoleData.map(function (entry, index) { return <recharts_1.Cell key={"cell-".concat(index)} fill={COLORS[index % COLORS.length]}/>; })}
                                </recharts_1.Pie>
                                <recharts_1.Tooltip />
                                <recharts_1.Legend />
                            </recharts_1.PieChart>
                        </recharts_1.ResponsiveContainer>
                    </Card_1.default>
                </div>
            </div>
             <div className="mt-8">
                <Card_1.default title="Quick Actions">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <react_router_dom_1.Link to="/users" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Manage Users</react_router_dom_1.Link>
                        <react_router_dom_1.Link to="/subscriptions" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">View Subscriptions</react_router_dom_1.Link>
                        <react_router_dom_1.Link to="/billing" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Go to Billing</react_router_dom_1.Link>
                        <react_router_dom_1.Link to="/reports" className="block p-4 text-center bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Generate Reports</react_router_dom_1.Link>
                    </div>
                </Card_1.default>
            </div>
        </div>);
};
exports.default = AdminDashboard;
