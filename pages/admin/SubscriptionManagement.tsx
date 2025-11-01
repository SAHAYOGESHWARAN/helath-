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
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var types_1 = require("../../types");
var react_router_dom_1 = require("react-router-dom");
var useTable_1 = require("../../hooks/useTable");
var PaginationControls_1 = require("../../components/shared/PaginationControls");
var Table_1 = require("../../components/shared/Table");
var getStatusPill = function (status) {
    switch (status) {
        case 'Active': return 'bg-emerald-100 text-emerald-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'Trialing': return 'bg-blue-100 text-blue-800';
    }
};
var SubscriptionManagement = function () {
    var _a = (0, useAuth_1.useAuth)(), users = _a.users, providerSubscriptionPlans = _a.providerSubscriptionPlans;
    var subscribedProviders = react_1.default.useMemo(function () {
        return users
            .filter(function (u) { return u.role === types_1.UserRole.PROVIDER && u.subscription; })
            .map(function (u) {
            var plan = providerSubscriptionPlans.find(function (p) { return p.id === u.subscription.planId; });
            return __assign(__assign({}, u), { planName: (plan === null || plan === void 0 ? void 0 : plan.name) || 'Unknown Plan', subscriptionStatus: u.subscription.status, renewalDate: u.subscription.renewalDate });
        });
    }, [users, providerSubscriptionPlans]);
    var _b = (0, useTable_1.useTable)(subscribedProviders, 10), paginatedItems = _b.paginatedItems, paginationProps = _b.paginationProps, requestSort = _b.requestSort, getSortArrow = _b.getSortArrow;
    var columns = [
        { accessorKey: 'name', header: 'Provider Name' },
        { accessorKey: 'planName', header: 'Plan' },
        { accessorKey: 'subscriptionStatus', header: 'Status', cell: function (row) { return (<span className={"px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusPill(row.subscriptionStatus))}>
                {row.subscriptionStatus}
            </span>); } },
        { accessorKey: 'renewalDate', header: 'Next Renewal' },
        { accessorKey: 'actions', header: 'Actions', cell: function () { return <button className="text-primary-600 hover:underline">Manage</button>; } }
    ];
    return (<div>
            <PageHeader_1.default title="Provider Subscriptions" subtitle="View and manage active provider subscriptions."/>
            <Card_1.default>
                <div className="flex justify-between items-center mb-4">
                    <p className="text-gray-600">A list of all providers with an active or past subscription plan.</p>
                    <react_router_dom_1.Link to="/plans" className="text-primary-600 font-semibold hover:underline">
                        Manage Subscription Plans &rarr;
                    </react_router_dom_1.Link>
                </div>
                <Table_1.Table columns={columns} data={paginatedItems} requestSort={requestSort} getSortArrow={getSortArrow}/>
                <PaginationControls_1.default {...paginationProps}/>
            </Card_1.default>
        </div>);
};
exports.default = SubscriptionManagement;
