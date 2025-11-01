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
var Card_1 = require("../../components/shared/Card");
var types_1 = require("../../types");
var PageHeader_1 = require("../../components/shared/PageHeader");
var useAuth_1 = require("../../hooks/useAuth");
var Modal_1 = require("../../components/shared/Modal");
var formik_1 = require("formik");
var Yup = require("yup");
var Icons_1 = require("../../components/shared/Icons");
var App_1 = require("../../App");
var useTable_1 = require("../../hooks/useTable");
var PaginationControls_1 = require("../../components/shared/PaginationControls");
var Table_1 = require("../../components/shared/Table");
var getStatusColor = function (status) {
    switch (status) {
        case types_1.ClaimStatus.PAID_IN_FULL: return 'bg-emerald-100 text-emerald-800';
        case types_1.ClaimStatus.SUBMITTED:
        case types_1.ClaimStatus.PROCESSING:
            return 'bg-blue-100 text-blue-800';
        case types_1.ClaimStatus.DENIED:
            return 'bg-red-100 text-red-800';
        case types_1.ClaimStatus.DRAFT:
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
var SuperbillSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    serviceDate: Yup.date().required('Service date is required').max(new Date(), 'Service date cannot be in the future'),
    lineItems: Yup.array().of(Yup.object().shape({
        service: Yup.string().required('Description is required'),
        charge: Yup.number().positive('Charge must be positive').required('Charge is required'),
    })).min(1, 'At least one line item is required'),
});
var NewSuperbillModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, useAuth_1.useAuth)(), users = _b.users, addClaim = _b.addClaim, addInvoice = _b.addInvoice;
    var showToast = (0, App_1.useApp)().showToast;
    var patients = (0, react_1.useMemo)(function () { return users.filter(function (u) { return u.role === types_1.UserRole.PATIENT; }); }, [users]);
    return (<Modal_1.default isOpen={isOpen} onClose={onClose} title="Create New Superbill" size="xl">
            <formik_1.Formik initialValues={{ patientId: '', serviceDate: new Date().toISOString().split('T')[0], lineItems: [{ service: '', charge: '' }] }} validationSchema={SuperbillSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
            var patient = patients.find(function (p) { return p.id === values.patientId; });
            if (!patient)
                return;
            var totalCharge = values.lineItems.reduce(function (sum, item) { return sum + parseFloat(item.charge || '0'); }, 0);
            var newClaim = {
                patientId: values.patientId,
                provider: 'Dr. John Smith', // Logged in provider
                serviceDate: values.serviceDate,
                status: types_1.ClaimStatus.DRAFT,
                claimType: types_1.ClaimType.PROFESSIONAL,
                totalClaimChargeAmount: totalCharge,
                patientOwes: totalCharge,
                insurancePaid: 0,
                lineItems: values.lineItems.map(function (li) { return ({ service: li.service, charge: parseFloat(li.charge) }); }),
                createdAt: new Date().toISOString().split('T')[0],
            };
            addClaim(newClaim);
            addInvoice({
                patientId: values.patientId,
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                totalAmount: totalCharge,
                amountDue: totalCharge,
                status: 'Due',
                description: "Services on ".concat(values.serviceDate),
            });
            setSubmitting(false);
            resetForm();
            onClose();
            showToast('Superbill created successfully as a draft.', 'success');
        }}>
                {function (_a) {
            var values = _a.values, isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
            return (<formik_1.Form>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <formik_1.Field as="select" name="patientId" className="w-full p-2 border rounded">
                                <option value="">Select Patient</option>
                                {patients.map(function (p) { return <option key={p.id} value={p.id}>{p.name}</option>; })}
                            </formik_1.Field>
                             <formik_1.Field type="date" name="serviceDate" className="w-full p-2 border rounded"/>
                        </div>
                        <formik_1.ErrorMessage name="patientId" component="div" className="text-red-500 text-xs"/>
                        <formik_1.ErrorMessage name="serviceDate" component="div" className="text-red-500 text-xs"/>

                        <h3 className="font-semibold mt-4 mb-2">Line Items</h3>
                        <formik_1.FieldArray name="lineItems">
                            {function (_a) {
                    var push = _a.push, remove = _a.remove;
                    return (<div className="space-y-2">
                                    {values.lineItems.map(function (_, index) { return (<div key={index} className="flex items-center gap-2">
                                            <formik_1.Field name={"lineItems.".concat(index, ".service")} placeholder="Service Description (e.g., Office Visit)" className="w-full p-2 border rounded"/>
                                            <formik_1.Field name={"lineItems.".concat(index, ".charge")} type="number" placeholder="Charge" className="w-32 p-2 border rounded"/>
                                            <button type="button" onClick={function () { return remove(index); }} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Icons_1.TrashIcon className="w-5 h-5"/></button>
                                        </div>); })}
                                    <button type="button" onClick={function () { return push({ service: '', charge: '' }); }} className="text-sm text-primary-600 font-semibold">+ Add Line Item</button>
                                </div>);
                }}
                        </formik_1.FieldArray>
                        <formik_1.ErrorMessage name="lineItems" component="div" className="text-red-500 text-xs"/>


                        <div className="flex justify-end space-x-2 mt-6">
                            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg">Save Superbill</button>
                        </div>
                    </formik_1.Form>);
        }}
            </formik_1.Formik>
        </Modal_1.default>);
};
var Billing = function () {
    var claims = (0, useAuth_1.useAuth)().claims;
    var _a = (0, react_1.useState)(false), isModalOpen = _a[0], setIsModalOpen = _a[1];
    var metrics = (0, react_1.useMemo)(function () { return ({
        billedThisMonth: claims.reduce(function (acc, c) { return acc + c.totalClaimChargeAmount; }, 0),
        outstanding: claims.filter(function (c) { return [types_1.ClaimStatus.SUBMITTED, types_1.ClaimStatus.PROCESSING].includes(c.status); }).reduce(function (acc, c) { return acc + c.totalClaimChargeAmount; }, 0)
    }); }, [claims]);
    // FIX: Destructure columnFilters from useTable to make it available in the component scope.
    var _b = (0, useTable_1.useTable)(claims, 10, {
        initialSort: { key: 'createdAt', direction: 'desc' },
    }), paginatedItems = _b.paginatedItems, paginationProps = _b.paginationProps, requestSort = _b.requestSort, getSortArrow = _b.getSortArrow, setColumnFilters = _b.setColumnFilters, columnFilters = _b.columnFilters;
    var columns = [
        { accessorKey: 'id', header: 'Claim ID', cellClassName: 'font-mono text-gray-600' },
        { accessorKey: 'patientId', header: 'Patient ID' },
        { accessorKey: 'createdAt', header: 'Date' },
        { accessorKey: 'totalClaimChargeAmount', header: 'Amount', cell: function (row) { return "$".concat(row.totalClaimChargeAmount.toFixed(2)); }, cellClassName: 'font-semibold' },
        { accessorKey: 'status', header: 'Status', cell: function (row) { return (<span className={"px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusColor(row.status))}>{row.status.replace(/_/g, ' ')}</span>); } },
        { accessorKey: 'actions', header: 'Actions', cell: function () { return <button className="text-primary-600 hover:underline">View</button>; } },
    ];
    return (<div>
        <PageHeader_1.default title="Billing & Coding" buttonText="Create Superbill" onButtonClick={function () { return setIsModalOpen(true); }}/>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card_1.default>
                <p className="text-gray-500">Billed This Month</p>
                <p className="text-3xl font-bold text-gray-800">${metrics.billedThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </Card_1.default>
            <Card_1.default>
                <p className="text-gray-500">Outstanding</p>
                <p className="text-3xl font-bold text-gray-800">${metrics.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </Card_1.default>
            <Card_1.default>
                <p className="text-gray-500">Success Rate</p>
                <p className="text-3xl font-bold text-gray-800">
                    {claims.length > 0 ?
            "".concat(((claims.filter(function (c) { return c.status === types_1.ClaimStatus.PAID_IN_FULL; }).length / claims.length) * 100).toFixed(1), "%")
            : 'N/A'}
                </p>
            </Card_1.default>
        </div>

        <Card_1.default>
             <div className="mb-4">
              <div className="flex space-x-2 border-b overflow-x-auto">
                {__spreadArray(['All'], Object.values(types_1.ClaimStatus), true).map(function (status) { return (<button key={status} onClick={function () { return setColumnFilters(function (prev) { return (__assign(__assign({}, prev), { status: status === 'All' ? '' : status })); }); }} className={"py-2 px-3 text-sm font-medium whitespace-nowrap ".concat((status === 'All' && !columnFilters.status) || columnFilters.status === status ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500')}>
                        {status.replace(/_/g, ' ')}
                    </button>); })}
              </div>
            </div>
            <Table_1.Table columns={columns} data={paginatedItems} requestSort={requestSort} getSortArrow={getSortArrow}/>
            <PaginationControls_1.default {...paginationProps}/>
        </Card_1.default>
        <NewSuperbillModal isOpen={isModalOpen} onClose={function () { return setIsModalOpen(false); }}/>
    </div>);
};
exports.default = Billing;
