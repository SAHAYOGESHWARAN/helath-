"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
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
var Compliance = function () {
    var auditLog = (0, useAuth_1.useAuth)().auditLog;
    var _a = (0, react_1.useState)(''), filter = _a[0], setFilter = _a[1];
    var filteredLog = (0, react_1.useMemo)(function () {
        if (!filter)
            return auditLog;
        var lowercasedFilter = filter.toLowerCase();
        return auditLog.filter(function (log) {
            return log.user.toLowerCase().includes(lowercasedFilter) ||
                log.action.toLowerCase().includes(lowercasedFilter) ||
                log.details.toLowerCase().includes(lowercasedFilter);
        });
    }, [auditLog, filter]);
    var handleExport = (0, react_1.useCallback)(function () {
        exportToCsv('compliance_audit_log.csv', filteredLog);
    }, [filteredLog]);
    return (<div>
            <PageHeader_1.default title="Compliance & Auditing" subtitle="Monitor system access and data protection."/>
            <Card_1.default>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">System Audit Log</h3>
                    <div className="flex space-x-2">
                        <input type="text" placeholder="Filter by user or action..." className="p-2 border rounded-md text-sm" value={filter} onChange={function (e) { return setFilter(e.target.value); }}/>
                        <button onClick={handleExport} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Export Log</button>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                             {filteredLog.length > 0 ? (filteredLog.map(function (log) { return (<tr key={log.id}>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{log.timestamp}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user}</td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.userRole}</td>
                                         <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{log.action}</span></td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.details}</td>
                                     </tr>); })) : (<tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        No audit log entries found.
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </Card_1.default>
        </div>);
};
exports.default = Compliance;
