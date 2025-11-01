"use strict";
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
var Icons_1 = require("../../components/shared/Icons");
var useAuth_1 = require("../../hooks/useAuth");
var exportToCsv = function (filename, rows) {
    if (!rows || rows.length === 0)
        return;
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
var Billing = function () {
    var _a = (0, useAuth_1.useAuth)(), invoices = _a.invoices, users = _a.users;
    var _b = (0, react_1.useMemo)(function () {
        var now = new Date();
        var currentMonth = now.getMonth();
        var currentYear = now.getFullYear();
        var monthRevenue = 0;
        var ytdRevenue = 0;
        invoices.forEach(function (inv) {
            if (inv.status === 'Paid') {
                var invDate = new Date(inv.date);
                if (invDate.getFullYear() === currentYear) {
                    ytdRevenue += inv.totalAmount;
                    if (invDate.getMonth() === currentMonth) {
                        monthRevenue += inv.totalAmount;
                    }
                }
            }
        });
        return {
            revenueThisMonth: monthRevenue,
            totalRevenue: ytdRevenue,
            failedTransactions: 230, // Mocked for now
        };
    }, [invoices]), revenueThisMonth = _b.revenueThisMonth, totalRevenue = _b.totalRevenue, failedTransactions = _b.failedTransactions;
    var transactions = (0, react_1.useMemo)(function () {
        return __spreadArray([], invoices, true).sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); }).map(function (inv) {
            var user = users.find(function (u) { return u.id === inv.patientId; });
            return {
                id: inv.id,
                date: inv.date,
                provider: (user === null || user === void 0 ? void 0 : user.name) || 'Unknown User',
                type: 'Subscription / Co-pay', // Mocked type
                amount: inv.totalAmount,
                status: inv.status,
            };
        });
    }, [invoices, users]);
    var handleExport = (0, react_1.useCallback)(function () {
        exportToCsv('billing_transactions.csv', transactions);
    }, [transactions]);
    return (<div>
            <PageHeader_1.default title="Platform Billing" subtitle="Manage and track all financial transactions."/>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card_1.default className="flex items-center p-4">
                    <div className="p-3 bg-emerald-100 rounded-full mr-4"><Icons_1.CurrencyDollarIcon className="w-6 h-6 text-emerald-600"/></div>
                    <div><p className="text-3xl font-bold text-gray-800">${revenueThisMonth.toLocaleString()}</p><p className="text-gray-500">Revenue (This Month)</p></div>
                </Card_1.default>
                <Card_1.default className="flex items-center p-4">
                     <div className="p-3 bg-blue-100 rounded-full mr-4"><Icons_1.CurrencyDollarIcon className="w-6 h-6 text-blue-600"/></div>
                    <div><p className="text-3xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</p><p className="text-gray-500">Total Revenue (YTD)</p></div>
                </Card_1.default>
                <Card_1.default className="flex items-center p-4">
                     <div className="p-3 bg-red-100 rounded-full mr-4"><Icons_1.CurrencyDollarIcon className="w-6 h-6 text-red-600"/></div>
                    <div><p className="text-3xl font-bold text-gray-800">${failedTransactions.toLocaleString()}</p><p className="text-gray-500">Failed Transactions</p></div>
                </Card_1.default>
            </div>

            <Card_1.default>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    <div className="flex space-x-2">
                        <input type="date" className="p-2 border rounded-md text-sm"/>
                        <button onClick={handleExport} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Export CSV</button>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                             {transactions.length > 0 ? (transactions.map(function (tx) { return (<tr key={tx.id}>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{tx.id}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.date}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tx.provider}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.type}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">${tx.amount.toFixed(2)}</td>
                                         <td className="px-6 py-4 whitespace-nowrap"><span className={"px-2 py-1 text-xs rounded-full ".concat(tx.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>{tx.status}</span></td>
                                     </tr>); })) : (<tr>
                                    <td colSpan={6} className="text-center py-10 text-gray-500">
                                        No transactions to display.
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </Card_1.default>
        </div>);
};
exports.default = Billing;
