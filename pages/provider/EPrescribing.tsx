"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Card_1 = require("../../components/shared/Card");
var PageHeader_1 = require("../../components/shared/PageHeader");
var types_1 = require("../../types");
var useAuth_1 = require("../../hooks/useAuth");
var Modal_1 = require("../../components/shared/Modal");
var formik_1 = require("formik");
var Yup = require("yup");
var App_1 = require("../../App");
var useTable_1 = require("../../hooks/useTable");
var PaginationControls_1 = require("../../components/shared/PaginationControls");
var Table_1 = require("../../components/shared/Table");
var getStatusPill = function (status) {
    var baseClasses = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
        case 'Sent': return "".concat(baseClasses, " bg-blue-100 text-blue-800");
        case 'Filled': return "".concat(baseClasses, " bg-emerald-100 text-emerald-800");
        case 'Draft': return "".concat(baseClasses, " bg-yellow-100 text-yellow-800");
        case 'Cancelled': return "".concat(baseClasses, " bg-red-100 text-red-800");
        default: return "".concat(baseClasses, " bg-gray-100 text-gray-800");
    }
};
var PrescriptionSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    drug: Yup.string().required('Drug name is required'),
    dosage: Yup.string().required('Dosage is required'),
    frequency: Yup.string().required('Frequency is required'),
    quantity: Yup.number().positive('Must be positive').required('Quantity is required'),
    refills: Yup.number().min(0, 'Cannot be negative').required('Number of refills is required'),
    notes: Yup.string().max(200, 'Notes cannot exceed 200 characters'),
});
var POPULAR_DRUGS = ['Lisinopril 10mg', 'Atorvastatin 20mg', 'Metformin 500mg', 'Amoxicillin 500mg', 'Albuterol Inhaler'];
var NewPrescriptionModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, useAuth_1.useAuth)(), user = _b.user, users = _b.users, addPrescription = _b.addPrescription;
    var showToast = (0, App_1.useApp)().showToast;
    var patients = (0, react_1.useMemo)(function () { return users.filter(function (u) { return u.role === types_1.UserRole.PATIENT; }); }, [users]);
    return (<Modal_1.default isOpen={isOpen} onClose={onClose} title="Create New e-Prescription" size="lg">
            <formik_1.Formik initialValues={{ patientId: '', drug: '', dosage: '', frequency: '', quantity: 30, refills: 1, notes: '' }} validationSchema={PrescriptionSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
            if (!user)
                return;
            var patient = users.find(function (u) { return u.id === values.patientId; });
            if (!patient)
                return;
            addPrescription({
                patientId: values.patientId,
                patientName: patient.name,
                drug: values.drug,
                dosage: values.dosage,
                frequency: values.frequency,
                quantity: values.quantity,
                refills: values.refills,
                pharmacy: 'CVS Pharmacy, Anytown', // Mock
                datePrescribed: new Date().toISOString().split('T')[0],
                notes: values.notes,
            });
            setSubmitting(false);
            resetForm();
            onClose();
            showToast('e-Prescription has been sent successfully!', 'success');
        }}>
                {function (_a) {
            var isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched, setFieldValue = _a.setFieldValue;
            return (<formik_1.Form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Patient</label>
                            <formik_1.Field as="select" name="patientId" className={"w-full p-2 border rounded ".concat(errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300')}>
                                <option value="">Select a patient</option>
                                {patients.map(function (p) { return <option key={p.id} value={p.id}>{p.name}</option>; })}
                            </formik_1.Field>
                            <formik_1.ErrorMessage name="patientId" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Drug</label>
                             <formik_1.Field name="drug" placeholder="e.g., Atorvastatin 20mg" className={"w-full p-2 border rounded ".concat(errors.drug && touched.drug ? 'border-red-500' : 'border-gray-300')}/>
                             <div className="flex flex-wrap gap-2 pt-2">
                                {POPULAR_DRUGS.map(function (drug) { return (<button key={drug} type="button" onClick={function () { return setFieldValue('drug', drug); }} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200">
                                        + {drug}
                                    </button>); })}
                            </div>
                             <formik_1.ErrorMessage name="drug" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Dosage</label>
                                <formik_1.Field name="dosage" placeholder="e.g., 1 tablet" className={"w-full p-2 border rounded ".concat(errors.dosage && touched.dosage ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="dosage" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Frequency</label>
                                <formik_1.Field name="frequency" placeholder="e.g., Once daily" className={"w-full p-2 border rounded ".concat(errors.frequency && touched.frequency ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="frequency" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Quantity</label>
                                <formik_1.Field name="quantity" type="number" className={"w-full p-2 border rounded ".concat(errors.quantity && touched.quantity ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="quantity" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Refills</label>
                                <formik_1.Field name="refills" type="number" className={"w-full p-2 border rounded ".concat(errors.refills && touched.refills ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="refills" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                        </div>

                         <div>
                            <label className="block text-sm font-medium">Notes for Pharmacist (optional)</label>
                            <formik_1.Field name="notes" as="textarea" rows="2" className="w-full p-2 border rounded"/>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg">Send Prescription</button>
                        </div>
                    </formik_1.Form>);
        }}
            </formik_1.Formik>
        </Modal_1.default>);
};
var EPrescribing = function () {
    var prescriptions = (0, useAuth_1.useAuth)().prescriptions;
    var _a = (0, react_1.useState)(false), isModalOpen = _a[0], setIsModalOpen = _a[1];
    var _b = (0, useTable_1.useTable)(prescriptions, 10, { initialSort: { key: 'datePrescribed', direction: 'desc' } }), paginatedItems = _b.paginatedItems, paginationProps = _b.paginationProps, requestSort = _b.requestSort, getSortArrow = _b.getSortArrow;
    var columns = [
        { accessorKey: 'datePrescribed', header: 'Date', cellClassName: 'font-mono text-gray-600' },
        { accessorKey: 'patientName', header: 'Patient', cellClassName: 'font-medium text-gray-900' },
        { accessorKey: 'drug', header: 'Drug' },
        { accessorKey: 'status', header: 'Status', cell: function (row) { return <span className={getStatusPill(row.status)}>{row.status}</span>; } },
        { accessorKey: 'actions', header: 'Actions', cell: function () { return <button className="text-primary-600 hover:underline">View Details</button>; } },
    ];
    return (<div>
            <PageHeader_1.default title="E-Prescribing" buttonText="Create Prescription" onButtonClick={function () { return setIsModalOpen(true); }}/>

            <Card_1.default>
                <Table_1.Table columns={columns} data={paginatedItems} requestSort={requestSort} getSortArrow={getSortArrow}/>
                <PaginationControls_1.default {...paginationProps}/>
            </Card_1.default>
            <NewPrescriptionModal isOpen={isModalOpen} onClose={function () { return setIsModalOpen(false); }}/>
        </div>);
};
exports.default = EPrescribing;
