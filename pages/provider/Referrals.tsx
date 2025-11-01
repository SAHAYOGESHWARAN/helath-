"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PageHeader_1 = require("../../components/shared/PageHeader");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var types_1 = require("../../types");
var useTable_1 = require("../../hooks/useTable");
var PaginationControls_1 = require("../../components/shared/PaginationControls");
var Modal_1 = require("../../components/shared/Modal");
var formik_1 = require("formik");
var Yup = require("yup");
var App_1 = require("../../App");
var Icons_1 = require("../../components/shared/Icons");
var getReferralStatusPill = function (status) {
    var base = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
        case 'Pending': return "".concat(base, " bg-yellow-100 text-yellow-800");
        case 'Sent': return "".concat(base, " bg-blue-100 text-blue-800");
        case 'Completed': return "".concat(base, " bg-emerald-100 text-emerald-800");
        case 'Cancelled': return "".concat(base, " bg-red-100 text-red-800");
        default: return "".concat(base, " bg-gray-100 text-gray-800");
    }
};
var getUrgencyPill = function (urgency) {
    var base = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (urgency) {
        case 'STAT': return "".concat(base, " bg-red-100 text-red-800");
        case 'Urgent': return "".concat(base, " bg-amber-100 text-amber-800");
        case 'Routine': return "".concat(base, " bg-gray-100 text-gray-800");
        default: return '';
    }
};
var ReferralSchema = Yup.object().shape({
    patientId: Yup.string().required('Patient is required'),
    referredTo: Yup.string().required('Specialist/Practice is required'),
    faxNumber: Yup.string().matches(/^(\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/, 'Invalid fax number').required('Fax number is required'),
    reason: Yup.string().required('Reason for referral is required'),
    urgency: Yup.string().oneOf(['Routine', 'Urgent', 'STAT']).required('Urgency is required'),
});
var NewReferralModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose;
    var _b = (0, useAuth_1.useAuth)(), provider = _b.user, users = _b.users, addReferral = _b.addReferral;
    var showToast = (0, App_1.useApp)().showToast;
    var patients = (0, react_1.useMemo)(function () { return users.filter(function (u) { return u.role === types_1.UserRole.PATIENT; }); }, [users]);
    var mockAttachments = ['Lab Results - 2024-08-01.pdf', 'Progress Note - 2024-08-15.pdf'];
    return (<Modal_1.default isOpen={isOpen} onClose={onClose} title="Create New Outgoing Referral" size="lg">
            <formik_1.Formik initialValues={{
            patientId: '',
            referredTo: '',
            faxNumber: '',
            reason: '',
            notes: '',
            urgency: 'Routine',
            attachments: [],
        }} validationSchema={ReferralSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting, resetForm = _a.resetForm;
            var patient = patients.find(function (p) { return p.id === values.patientId; });
            if (!provider || !patient)
                return;
            addReferral({
                patientId: values.patientId,
                patientName: patient.name,
                referredTo: values.referredTo,
                referredFrom: provider.name,
                reason: values.reason,
                notes: values.notes,
                urgency: values.urgency,
                attachments: values.attachments,
            });
            setSubmitting(false);
            resetForm();
            onClose();
            showToast('Referral sent successfully via Phaxio.', 'success');
        }}>
                {function (_a) {
            var values = _a.values, isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
            return (<formik_1.Form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium">Patient</label>
                                <formik_1.Field as="select" name="patientId" className={"w-full p-2 border rounded ".concat(errors.patientId && touched.patientId ? 'border-red-500' : 'border-gray-300')}>
                                    <option value="">Select a patient</option>
                                    {patients.map(function (p) { return <option key={p.id} value={p.id}>{p.name}</option>; })}
                                </formik_1.Field>
                                <formik_1.ErrorMessage name="patientId" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Urgency</label>
                                <formik_1.Field as="select" name="urgency" className="w-full p-2 border rounded">
                                    <option value="Routine">Routine</option>
                                    <option value="Urgent">Urgent</option>
                                    <option value="STAT">STAT</option>
                                </formik_1.Field>
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium">Referred To (Specialist/Practice)</label>
                                <formik_1.Field name="referredTo" className={"w-full p-2 border rounded ".concat(errors.referredTo && touched.referredTo ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="referredTo" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                             <div>
                                <label className="block text-sm font-medium">Fax Number</label>
                                <formik_1.Field name="faxNumber" placeholder="e.g., 555-555-5555" className={"w-full p-2 border rounded ".concat(errors.faxNumber && touched.faxNumber ? 'border-red-500' : 'border-gray-300')}/>
                                <formik_1.ErrorMessage name="faxNumber" component="p" className="text-red-500 text-xs mt-1"/>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Reason for Referral</label>
                            <formik_1.Field name="reason" as="textarea" rows="3" className={"w-full p-2 border rounded ".concat(errors.reason && touched.reason ? 'border-red-500' : 'border-gray-300')}/>
                             <formik_1.ErrorMessage name="reason" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>

                         <div>
                            <label className="block text-sm font-medium">Clinical Notes (optional)</label>
                            <formik_1.Field name="notes" as="textarea" rows="4" className="w-full p-2 border rounded"/>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Attach Documents (optional)</label>
                            <div className="mt-1 space-y-2">
                                <formik_1.FieldArray name="attachments">
                                    {function () { return (mockAttachments.map(function (file) { return (<label key={file} className="flex items-center p-2 border rounded-md bg-gray-50">
                                                <formik_1.Field type="checkbox" name="attachments" value={file} className="h-4 w-4 text-primary-600 border-gray-300 rounded"/>
                                                <Icons_1.PaperClipIcon className="w-4 h-4 ml-3 mr-2 text-gray-500"/>
                                                <span className="text-sm text-gray-700">{file}</span>
                                            </label>); })); }}
                                </formik_1.FieldArray>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center w-40">
                                {isSubmitting ? <Icons_1.SpinnerIcon /> : <><Icons_1.FaxIcon className="w-5 h-5 mr-2"/> Send via Fax</>}
                            </button>
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-2">Securely sent via Phaxio API</p>
                    </formik_1.Form>);
        }}
            </formik_1.Formik>
        </Modal_1.default>);
};
var ReferralDetailsModal = function (_a) {
    var referral = _a.referral, onClose = _a.onClose;
    var updateReferral = (0, useAuth_1.useAuth)().updateReferral;
    var showToast = (0, App_1.useApp)().showToast;
    if (!referral)
        return null;
    var handleUpdateStatus = function (status, actionText) {
        updateReferral(referral.id, { status: status }, actionText);
        showToast("Referral status updated to ".concat(status), 'success');
        onClose();
    };
    var isOutgoingPending = referral.type === 'Outgoing' && referral.status === types_1.ReferralStatus.PENDING;
    var isIncomingPending = referral.type === 'Incoming' && referral.status === types_1.ReferralStatus.PENDING;
    return (<Modal_1.default isOpen={!!referral} onClose={onClose} title={"Referral Details - ".concat(referral.patientName)} size="lg">
            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm p-4 bg-gray-50 rounded-lg border">
                    <div><p className="font-medium text-gray-500">Patient</p><p className="font-semibold">{referral.patientName}</p></div>
                    <div><p className="font-medium text-gray-500">Referred To</p><p className="font-semibold">{referral.referredTo}</p></div>
                    <div><p className="font-medium text-gray-500">Referred From</p><p className="font-semibold">{referral.referredFrom}</p></div>
                    <div><p className="font-medium text-gray-500">Date</p><p className="font-semibold">{new Date(referral.createdAt).toLocaleDateString()}</p></div>
                </div>

                 <div><p className="font-medium text-gray-500">Reason</p><p>{referral.reason}</p></div>
                 {referral.notes && <div><p className="font-medium text-gray-500">Notes</p><p className="p-2 bg-gray-100 rounded-md whitespace-pre-wrap">{referral.notes}</p></div>}
                 {referral.attachments && referral.attachments.length > 0 && <div>
                    <p className="font-medium text-gray-500">Attachments</p>
                    <ul className="list-disc list-inside">
                        {referral.attachments.map(function (file) { return <li key={file} className="text-blue-600 underline cursor-pointer">{file}</li>; })}
                    </ul>
                </div>}

                <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Audit Log</h4>
                    <ul className="space-y-3 border-l-2 pl-6 relative">
                        {referral.auditLog.map(function (log) { return (<li key={log.date} className="relative">
                                <div className="absolute -left-[31px] top-1 w-4 h-4 bg-gray-300 rounded-full border-4 border-white"></div>
                                <p className="font-medium text-gray-800">{log.action}</p>
                                <p className="text-xs text-gray-500">{new Date(log.date).toLocaleString()}</p>
                            </li>); })}
                    </ul>
                </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                 {isOutgoingPending && <>
                    <button onClick={function () { return handleUpdateStatus(types_1.ReferralStatus.CANCELLED, 'Referral Cancelled by Provider'); }} className="bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg">Cancel Referral</button>
                    <button onClick={function () { return handleUpdateStatus(types_1.ReferralStatus.SENT, 'Referral Sent via Fax'); }} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Mark as Sent</button>
                 </>}
                  {isIncomingPending && <>
                    <button onClick={function () { return handleUpdateStatus(types_1.ReferralStatus.CANCELLED, 'Referral Declined'); }} className="bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg">Decline</button>
                    <button onClick={function () { return handleUpdateStatus(types_1.ReferralStatus.COMPLETED, 'Referral Accepted'); }} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg">Accept & Schedule</button>
                 </>}
            </div>
        </Modal_1.default>);
};
var Referrals = function () {
    var referrals = (0, useAuth_1.useAuth)().referrals;
    var _a = (0, react_1.useState)(false), isNewModalOpen = _a[0], setIsNewModalOpen = _a[1];
    var _b = (0, react_1.useState)(null), selectedReferral = _b[0], setSelectedReferral = _b[1];
    var _c = (0, react_1.useState)('All'), typeFilter = _c[0], setTypeFilter = _c[1];
    var filteredReferrals = (0, react_1.useMemo)(function () {
        if (typeFilter === 'All')
            return referrals;
        return referrals.filter(function (r) { return r.type === typeFilter; });
    }, [referrals, typeFilter]);
    var _d = (0, useTable_1.useTable)(filteredReferrals, 10, {
        initialSort: { key: 'createdAt', direction: 'desc' }
    }), paginatedItems = _d.paginatedItems, paginationProps = _d.paginationProps, requestSort = _d.requestSort, getSortArrow = _d.getSortArrow;
    return (<div>
            <PageHeader_1.default title="Referral Management" buttonText="New Outgoing Referral" onButtonClick={function () { return setIsNewModalOpen(true); }}/>
            <Card_1.default>
                <div className="flex space-x-2 border-b mb-4">
                    <button onClick={function () { return setTypeFilter('All'); }} className={"py-2 px-4 font-medium ".concat(typeFilter === 'All' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500')}>All</button>
                    <button onClick={function () { return setTypeFilter('Incoming'); }} className={"py-2 px-4 font-medium ".concat(typeFilter === 'Incoming' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500')}>Incoming</button>
                    <button onClick={function () { return setTypeFilter('Outgoing'); }} className={"py-2 px-4 font-medium ".concat(typeFilter === 'Outgoing' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500')}>Outgoing</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th onClick={function () { return requestSort('patientName'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Patient {getSortArrow('patientName')}</th>
                                <th onClick={function () { return requestSort('type'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Type {getSortArrow('type')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referred To/From</th>
                                <th onClick={function () { return requestSort('createdAt'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Date {getSortArrow('createdAt')}</th>
                                <th onClick={function () { return requestSort('urgency'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Urgency {getSortArrow('urgency')}</th>
                                <th onClick={function () { return requestSort('status'); }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer">Status {getSortArrow('status')}</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedItems.map(function (referral) { return (<tr key={referral.id} className="hover:bg-gray-50 cursor-pointer" onClick={function () { return setSelectedReferral(referral); }}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{referral.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{referral.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{referral.type === 'Incoming' ? referral.referredFrom : referral.referredTo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(referral.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={getUrgencyPill(referral.urgency)}>{referral.urgency}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={getReferralStatusPill(referral.status)}>{referral.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={function (e) { e.stopPropagation(); setSelectedReferral(referral); }} className="text-primary-600 hover:text-primary-900">Details</button>
                                    </td>
                                </tr>); })}
                        </tbody>
                    </table>
                </div>
                <PaginationControls_1.default {...paginationProps}/>
            </Card_1.default>
            <NewReferralModal isOpen={isNewModalOpen} onClose={function () { return setIsNewModalOpen(false); }}/>
            <ReferralDetailsModal referral={selectedReferral} onClose={function () { return setSelectedReferral(null); }}/>
        </div>);
};
exports.default = Referrals;
