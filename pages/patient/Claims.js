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
var Card_1 = require("../../components/shared/Card");
var types_1 = require("../../types");
var Modal_1 = require("../../components/shared/Modal");
var PageHeader_1 = require("../../components/shared/PageHeader");
var useAuth_1 = require("../../hooks/useAuth");
var useTable_1 = require("../../hooks/useTable");
var Table_1 = require("../../components/shared/Table");
var PaginationControls_1 = require("../../components/shared/PaginationControls");
var getStatusColor = function (status) {
    switch (status) {
        case types_1.ClaimStatus.PAID_IN_FULL: return 'bg-green-100 text-green-800';
        case types_1.ClaimStatus.PROCESSING:
        case types_1.ClaimStatus.SUBMITTED:
            return 'bg-blue-100 text-blue-800';
        case types_1.ClaimStatus.DENIED:
        case types_1.ClaimStatus.REJECTED:
            return 'bg-red-100 text-red-800';
        case types_1.ClaimStatus.PAID_PARTIALLY:
            return 'bg-yellow-100 text-yellow-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
var ClaimDetailModal = function (_a) {
    var claim = _a.claim, onClose = _a.onClose;
    var navigate = (0, react_router_dom_1.useNavigate)();
    if (!claim)
        return null;
    var handlePayNow = function () {
        onClose();
        navigate('/payments');
    };
    return (<Modal_1.default isOpen={!!claim} onClose={onClose} title={"Explanation of Benefits"} size="lg">
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm p-4 bg-gray-50 rounded-lg border">
                    <div>
                        <p className="font-medium text-gray-500">Claim ID</p>
                        <p className="font-semibold text-gray-800 font-mono">{claim.id}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Provider</p>
                        <p className="font-semibold text-gray-800">{claim.provider}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Service Date</p>
                        <p className="font-semibold text-gray-800">{claim.serviceDate}</p>
                    </div>
                </div>

                {claim.status === types_1.ClaimStatus.DENIED && (<div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
                        <h4 className="font-bold">Reason for Denial</h4>
                        <p className="text-sm">{claim.denialReason || 'No specific reason provided.'}</p>
                    </div>)}

                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Services Provided</h4>
                     <div className="overflow-x-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Charge</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {claim.lineItems.map(function (item, index) { return (<tr key={index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.service}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 text-right">${item.charge.toFixed(2)}</td>
                                    </tr>); })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Financial Summary</h4>
                    <div className="space-y-2 text-sm border-t border-b divide-y">
                        <div className="flex justify-between py-2"><span className="text-gray-600">Total Billed Amount:</span><span className="font-medium text-gray-800">${claim.totalClaimChargeAmount.toFixed(2)}</span></div>
                        <div className="flex justify-between py-2"><span className="text-gray-600">Paid by Insurance:</span><span className="font-medium text-green-700">${claim.insurancePaid.toFixed(2)}</span></div>
                        <div className="flex justify-between py-2 text-base"><span className="font-semibold text-gray-800">Your Responsibility:</span><span className="font-bold text-red-600">${claim.patientOwes.toFixed(2)}</span></div>
                    </div>
                </div>

                {claim.patientOwes > 0 && (<div className="pt-4 text-right">
                         <button onClick={handlePayNow} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg">
                             Pay ${claim.patientOwes.toFixed(2)} Now
                         </button>
                     </div>)}

            </div>
        </Modal_1.default>);
};
var Claims = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, claims = _a.claims;
    var _b = (0, react_1.useState)(null), selectedClaim = _b[0], setSelectedClaim = _b[1];
    var myClaims = (0, react_1.useMemo)(function () { return claims.filter(function (c) { return c.patientId === (user === null || user === void 0 ? void 0 : user.id); }); }, [claims, user]);
    var _c = (0, useTable_1.useTable)(myClaims, 10, { initialSort: { key: 'serviceDate', direction: 'desc' } }), paginatedItems = _c.paginatedItems, paginationProps = _c.paginationProps, requestSort = _c.requestSort, getSortArrow = _c.getSortArrow, setGlobalFilter = _c.setGlobalFilter, setColumnFilters = _c.setColumnFilters;
    var columns = [
        { accessorKey: 'id', header: 'Claim ID' },
        { accessorKey: 'serviceDate', header: 'Service Date' },
        { accessorKey: 'provider', header: 'Provider' },
        { accessorKey: 'totalClaimChargeAmount', header: 'Total Charge', cell: function (row) { return "$".concat(row.totalClaimChargeAmount.toFixed(2)); } },
        { accessorKey: 'patientOwes', header: 'You Owe', cell: function (row) { return "$".concat(row.patientOwes.toFixed(2)); }, cellClassName: 'font-semibold text-red-600' },
        { accessorKey: 'status', header: 'Status', cell: function (row) { return (<span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat(getStatusColor(row.status))}>
            {row.status.replace(/_/g, ' ')}
        </span>); } },
        { accessorKey: 'actions', header: '', cell: function (row) { return (<button onClick={function () { return setSelectedClaim(row); }} className="text-primary-600 hover:text-primary-900 font-medium">Details</button>); }, cellClassName: 'text-right' },
    ];
    return (<div>
      <PageHeader_1.default title="My Claims"/>
      <Card_1.default>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <input type="text" placeholder="Search by Claim ID or Provider..." onChange={function (e) { return setGlobalFilter(e.target.value); }} className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
          <select onChange={function (e) { return setColumnFilters(function (prev) { return (__assign(__assign({}, prev), { status: e.target.value === 'All' ? '' : e.target.value })); }); }} className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <option value="All">All Statuses</option>
            {Object.values(types_1.ClaimStatus).map(function (status) { return (<option key={status} value={status}>
                {status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.replace(/_/g, ' ').slice(1).toLowerCase()}
              </option>); })}
          </select>
        </div>

        <Table_1.Table columns={columns} data={paginatedItems} requestSort={requestSort} getSortArrow={getSortArrow} onRowClick={setSelectedClaim} emptyState={<div className="text-center py-10 text-gray-500">You have no claims on file.</div>}/>
        <PaginationControls_1.default {...paginationProps}/>

      </Card_1.default>
      <ClaimDetailModal claim={selectedClaim} onClose={function () { return setSelectedClaim(null); }}/>
    </div>);
};
exports.default = Claims;
