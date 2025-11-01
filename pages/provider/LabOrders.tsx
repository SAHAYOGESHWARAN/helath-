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
var Modal_1 = require("../../components/shared/Modal");
var useAuth_1 = require("../../hooks/useAuth");
var types_1 = require("../../types");
var formik_1 = require("formik");
var Yup = require("yup");
var App_1 = require("../../App");
var Icons_1 = require("../../components/shared/Icons");
var LabOrderSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    tests: Yup.array().of(Yup.string().required('Test name is required')).min(1, 'At least one test is required'),
});
var POPULAR_LABS = ['Complete Blood Count (CBC)', 'Lipid Panel', 'TSH', 'Comprehensive Metabolic Panel (CMP)', 'Hemoglobin A1c'];
var NewLabOrderModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, useAuth_1.useAuth)(), user = _b.user, users = _b.users, appointments = _b.appointments, addLabOrder = _b.addLabOrder;
    var showToast = (0, App_1.useApp)().showToast;
    var _c = (0, react_1.useState)(null), itemToDelete = _c[0], setItemToDelete = _c[1];
    var patients = (0, react_1.useMemo)(function () {
        if (!user || user.role !== types_1.UserRole.PROVIDER)
            return [];
        // Get unique patient IDs from appointments with the current provider
        var providerPatientIds = new Set(appointments
            .filter(function (appt) { return appt.providerId === user.id; })
            .map(function (appt) { return appt.patientId; }));
        // Filter the main user list to get the patient objects
        return users.filter(function (u) { return u.role === types_1.UserRole.PATIENT && providerPatientIds.has(u.id); });
    }, [user, users, appointments]);
    return (<Modal_1.default isOpen={isOpen} onClose={onClose} title="Create New Lab Order" size="lg">
            <formik_1.Formik initialValues={{ patientId: '', tests: [''] }} validationSchema={LabOrderSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
            var patient = patients.find(function (p) { return p.id === values.patientId; });
            if (!patient || !user)
                return;
            var newOrder = {
                patientId: values.patientId,
                patientName: patient.name,
                providerId: user.id,
                date: new Date().toISOString().split('T')[0],
                tests: values.tests.filter(function (t) { return t.trim() !== ''; }),
                status: 'Ordered'
            };
            addLabOrder(newOrder);
            setSubmitting(false);
            resetForm();
            onClose();
            showToast("Lab order for ".concat(patient.name, " created successfully."), 'success');
        }}>
                {function (_a) {
            var values = _a.values, setFieldValue = _a.setFieldValue, touched = _a.touched, errors = _a.errors, isSubmitting = _a.isSubmitting;
            return (<formik_1.Form>
                         <div className="mb-4">
                            <label className="block text-sm font-medium">Patient</label>
                            <formik_1.Field as="select" name="patientId" className={"w-full p-2 border rounded ".concat(errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300')}>
                                <option value="">Select a patient</option>
                                {patients.map(function (p) { return <option key={p.id} value={p.id}>{p.name}</option>; })}
                            </formik_1.Field>
                            <formik_1.ErrorMessage name="patientId" component="div" className="text-red-500 text-xs mt-1"/>
                        </div>

                        <h3 className="font-semibold mt-4 mb-2">Tests to Order</h3>
                        <formik_1.FieldArray name="tests">
                            {function (_a) {
                    var push = _a.push, remove = _a.remove;
                    return (<>
                                    <div className="space-y-2">
                                        {values.tests.map(function (_, index) { return (<div key={index} className="flex items-center gap-2">
                                                <formik_1.Field name={"tests.".concat(index)} placeholder="e.g., Lipid Panel" className="w-full p-2 border rounded"/>
                                                {values.tests.length > 1 && (<button type="button" onClick={function () { return setItemToDelete(index); }} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Icons_1.TrashIcon className="w-5 h-5"/></button>)}
                                            </div>); })}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {POPULAR_LABS.map(function (lab) { return (<button key={lab} type="button" onClick={function () {
                                var currentTests = values.tests.filter(function (t) { return t.trim() !== ''; });
                                setFieldValue('tests', __spreadArray(__spreadArray([], currentTests, true), [lab], false));
                            }} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200">
                                                    + {lab}
                                                </button>); })}
                                        </div>
                                        <button type="button" onClick={function () { return push(''); }} className="text-sm text-primary-600 font-semibold">+ Add Custom Test</button>
                                        <formik_1.ErrorMessage name="tests">{function (msg) { return <div className="text-red-500 text-xs mt-1">{msg}</div>; }}</formik_1.ErrorMessage>
                                    </div>
                                    <Modal_1.default isOpen={itemToDelete !== null} onClose={function () { return setItemToDelete(null); }} title="Confirm Test Deletion" size="sm" footer={<>
                                            <button type="button" onClick={function () { return setItemToDelete(null); }} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">
                                            Cancel
                                            </button>
                                            <button type="button" onClick={function () {
                                if (itemToDelete !== null) {
                                    remove(itemToDelete);
                                    setItemToDelete(null);
                                }
                            }} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg">
                                            Delete
                                            </button>
                                        </>}>
                                        <p>Are you sure you want to remove this test from the lab order?</p>
                                    </Modal_1.default>
                                </>);
                }}
                        </formik_1.FieldArray>

                        <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 py-2 px-4 rounded-lg font-bold">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white py-2 px-4 rounded-lg font-bold">Place Order</button>
                        </div>
                    </formik_1.Form>);
        }}
            </formik_1.Formik>
        </Modal_1.default>);
};
var getStatusPill = function (status) {
    switch (status) {
        case 'Ordered': return 'bg-blue-100 text-blue-800';
        case 'Results Ready': return 'bg-emerald-100 text-emerald-800';
        case 'Reviewed': return 'bg-gray-100 text-gray-800';
    }
};
var LabOrders = function () {
    var labOrders = (0, useAuth_1.useAuth)().labOrders;
    var _a = (0, react_1.useState)(false), isModalOpen = _a[0], setIsModalOpen = _a[1];
    return (<div>
            <PageHeader_1.default title="Lab Orders" buttonText="New Lab Order" onButtonClick={function () { return setIsModalOpen(true); }}/>
            <Card_1.default>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests Ordered</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {labOrders.length > 0 ? (labOrders.map(function (order) { return (<tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.patientName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{order.tests.join(', ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={"px-2 py-1 text-xs font-semibold rounded-full ".concat(getStatusPill(order.status))}>{order.status}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-primary-600 hover:underline">View Results</button>
                                        </td>
                                    </tr>); })) : (<tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-500">
                                        <Icons_1.DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 mb-2"/>
                                        <p className="font-semibold">No Lab Orders</p>
                                        <p>
                                            <button onClick={function () { return setIsModalOpen(true); }} className="text-primary-600 font-semibold hover:underline">
                                                Create a new lab order
                                            </button> to get started.
                                        </p>
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
            </Card_1.default>
            <NewLabOrderModal isOpen={isModalOpen} onClose={function () { return setIsModalOpen(false); }}/>
        </div>);
};
exports.default = LabOrders;
