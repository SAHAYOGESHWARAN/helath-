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
var useAuth_1 = require("../../hooks/useAuth");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Icons_1 = require("../../components/shared/Icons");
var Modal_1 = require("../../components/shared/Modal");
var useTable_1 = require("../../hooks/useTable");
var PaginationControls_1 = require("../../components/shared/PaginationControls");
var Table_1 = require("../../components/shared/Table");
var getStatusColor = function (status) {
    switch (status) {
        case 'Active': return 'bg-emerald-100 text-emerald-800';
        case 'Suspended': return 'bg-red-100 text-red-800';
        case 'Inactive': return 'bg-gray-100 text-gray-800';
    }
};
var PatientQuickViewModal = function (_a) {
    var patient = _a.patient, onClose = _a.onClose;
    var navigate = (0, react_router_dom_1.useNavigate)();
    if (!patient)
        return null;
    var latestVitals = patient.vitals && patient.vitals.length > 0 ? patient.vitals[0] : null;
    var viewFullChart = function () {
        onClose();
        navigate("/patients/".concat(patient.id));
    };
    return (<Modal_1.default isOpen={!!patient} onClose={onClose} title="Patient Quick View" size="lg">
            <div className="flex items-start space-x-6 p-4">
                <img src={patient.avatarUrl} alt={patient.name} className="w-24 h-24 rounded-full border-4 border-primary-100"/>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
                    <p className="text-gray-600">DOB: {patient.dob}</p>
                    <p className="text-sm text-gray-500 mt-1">Patient ID: <span className="font-mono">{patient.id}</span></p>
                </div>
            </div>
             <div className="mt-4 px-4">
                <Card_1.default title="Latest Vitals" className="p-4">
                     {latestVitals ? (<div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-500">Blood Pressure</p>
                                <p className="text-xl font-bold text-gray-800">{latestVitals.bloodPressure}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Heart Rate</p>
                                <p className="text-xl font-bold text-gray-800">{latestVitals.heartRate} <span className="text-sm font-normal">bpm</span></p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">BMI</p>
                                <p className="text-xl font-bold text-gray-800">{latestVitals.bmi || 'N/A'}</p>
                            </div>
                        </div>) : <p className="text-sm text-gray-500 text-center">No vitals recorded.</p>}
                </Card_1.default>
             </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Close</button>
                <button onClick={viewFullChart} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg">View Full Chart</button>
            </div>
        </Modal_1.default>);
};
var PatientManagement = function () {
    var users = (0, useAuth_1.useAuth)().users;
    var _a = (0, react_1.useState)(null), selectedPatient = _a[0], setSelectedPatient = _a[1];
    var _b = (0, react_1.useState)('All'), statusFilter = _b[0], setStatusFilter = _b[1];
    var patients = (0, react_1.useMemo)(function () { return users.filter(function (u) { return u.role === types_1.UserRole.PATIENT; }); }, [users]);
    var _c = (0, useTable_1.useTable)(patients, 10, { initialSort: { key: 'name', direction: 'asc' } }), paginatedItems = _c.paginatedItems, paginationProps = _c.paginationProps, requestSort = _c.requestSort, getSortArrow = _c.getSortArrow, setGlobalFilter = _c.setGlobalFilter, setColumnFilters = _c.setColumnFilters;
    (0, react_1.useEffect)(function () {
        setColumnFilters(function (prev) { return (__assign(__assign({}, prev), { status: statusFilter === 'All' ? '' : statusFilter })); });
    }, [statusFilter, setColumnFilters]);
    var columns = [
        { accessorKey: 'name', header: 'Name', cell: function (row) { return <span className="font-medium text-gray-900">{row.name}</span>; } },
        { accessorKey: 'id', header: 'Patient ID', cellClassName: 'font-mono text-gray-500' },
        { accessorKey: 'dob', header: 'Date of Birth' },
        { accessorKey: 'status', header: 'Status', cell: function (row) { return (<span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat(getStatusColor(row.status))}>
                {row.status}
            </span>); } },
        { accessorKey: 'actions', header: 'Actions', cell: function (row) { return (<button onClick={function (e) { e.stopPropagation(); setSelectedPatient(row); }} className="text-primary-600 hover:text-primary-800 font-medium">
                Quick View
            </button>); } }
    ];
    return (<div>
            <PageHeader_1.default title="Patient Management"/>
            <Card_1.default>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div className="relative w-full md:max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icons_1.SearchIcon className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input type="text" placeholder="Search by name, ID, or status..." className="w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" onChange={function (e) { return setGlobalFilter(e.target.value); }}/>
                    </div>
                    <div className="flex items-center space-x-2 self-start md:self-center">
                        {['All', 'Active', 'Inactive', 'Suspended'].map(function (status) { return (<button key={status} onClick={function () { return setStatusFilter(status); }} className={"px-4 py-2 text-sm font-medium rounded-md ".concat(statusFilter === status ? 'bg-primary-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
                                {status}
                            </button>); })}
                    </div>
                </div>

                <Table_1.Table columns={columns} data={paginatedItems} onRowClick={setSelectedPatient} requestSort={requestSort} getSortArrow={getSortArrow}/>

                <PaginationControls_1.default {...paginationProps}/>
            </Card_1.default>
            <PatientQuickViewModal patient={selectedPatient} onClose={function () { return setSelectedPatient(null); }}/>
        </div>);
};
exports.default = PatientManagement;
