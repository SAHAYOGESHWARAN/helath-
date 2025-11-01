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
var useTable_1 = require("../../hooks/useTable");
var PaginationControls_1 = require("../../components/shared/PaginationControls");
var Table_1 = require("../../components/shared/Table");
var getRolePill = function (role) {
    switch (role) {
        case types_1.UserRole.PATIENT: return 'bg-blue-100 text-blue-800';
        case types_1.UserRole.PROVIDER: return 'bg-emerald-100 text-emerald-800';
        case types_1.UserRole.ADMIN: return 'bg-purple-100 text-purple-800';
    }
};
var UserManagement = function () {
    var users = (0, useAuth_1.useAuth)().users;
    var _a = (0, react_1.useState)('All'), roleFilter = _a[0], setRoleFilter = _a[1];
    var _b = (0, useTable_1.useTable)(users, 10), paginatedItems = _b.paginatedItems, paginationProps = _b.paginationProps, requestSort = _b.requestSort, getSortArrow = _b.getSortArrow, setColumnFilters = _b.setColumnFilters;
    (0, react_1.useEffect)(function () {
        setColumnFilters(function (prev) { return (__assign(__assign({}, prev), { role: roleFilter === 'All' ? '' : roleFilter })); });
    }, [roleFilter, setColumnFilters]);
    var columns = [
        { accessorKey: 'name', header: 'Name', cell: function (row) { return <span className="font-medium text-gray-900">{row.name}</span>; } },
        { accessorKey: 'email', header: 'Email' },
        { accessorKey: 'role', header: 'Role', cell: function (row) { return (<span className={"px-2 py-1 text-xs font-semibold rounded-full ".concat(getRolePill(row.role))}>{row.role}</span>); } },
        { accessorKey: 'status', header: 'Status', cell: function (row) { return row.status; } },
        { accessorKey: 'actions', header: 'Actions', cell: function () { return (<button className="text-primary-600 hover:underline">Edit</button>); } },
    ];
    return (<div>
            <PageHeader_1.default title="User Management" subtitle="View and manage all users on the platform."/>
            <Card_1.default>
                <div className="flex items-center justify-between mb-4">
                     <div className="flex space-x-2">
                        <button onClick={function () { return setRoleFilter('All'); }} className={"px-3 py-1 text-sm rounded-md ".concat(roleFilter === 'All' ? 'bg-primary-600 text-white' : 'bg-gray-200')}>All Roles</button>
                        <button onClick={function () { return setRoleFilter(types_1.UserRole.PATIENT); }} className={"px-3 py-1 text-sm rounded-md ".concat(roleFilter === types_1.UserRole.PATIENT ? 'bg-primary-600 text-white' : 'bg-gray-200')}>Patients</button>
                        <button onClick={function () { return setRoleFilter(types_1.UserRole.PROVIDER); }} className={"px-3 py-1 text-sm rounded-md ".concat(roleFilter === types_1.UserRole.PROVIDER ? 'bg-primary-600 text-white' : 'bg-gray-200')}>Providers</button>
                        <button onClick={function () { return setRoleFilter(types_1.UserRole.ADMIN); }} className={"px-3 py-1 text-sm rounded-md ".concat(roleFilter === types_1.UserRole.ADMIN ? 'bg-primary-600 text-white' : 'bg-gray-200')}>Admins</button>
                    </div>
                </div>
                <Table_1.Table columns={columns} data={paginatedItems} requestSort={requestSort} getSortArrow={getSortArrow}/>
                 <PaginationControls_1.default {...paginationProps}/>
            </Card_1.default>
        </div>);
};
exports.default = UserManagement;
