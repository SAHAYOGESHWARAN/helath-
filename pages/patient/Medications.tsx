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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var PageHeader_1 = require("../../components/shared/PageHeader");
var Icons_1 = require("../../components/shared/Icons");
var useAuth_1 = require("../../hooks/useAuth");
var App_1 = require("../../App");
var Modal_1 = require("../../components/shared/Modal");
var formik_1 = require("formik");
var Yup = require("yup");
// Schema for validation
var MedicationSchema = Yup.object().shape({
    name: Yup.string().required('Medication name is required'),
    dosage: Yup.string().required('Dosage is required'),
    frequency: Yup.string().required('Frequency is required'),
});
// Modal for Add/Edit
var MedicationFormModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave, initialValues = _a.initialValues;
    return (<Modal_1.default isOpen={isOpen} onClose={onClose} title={initialValues.name ? 'Edit Medication' : 'Add Medication'}>
        <formik_1.Formik initialValues={initialValues} validationSchema={MedicationSchema} onSubmit={function (values, _a) {
            var setSubmitting = _a.setSubmitting;
            onSave(values);
            setSubmitting(false);
        }}>
        {function (_a) {
            var isSubmitting = _a.isSubmitting, errors = _a.errors, touched = _a.touched;
            return (<formik_1.Form className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <formik_1.Field name="name" placeholder="e.g., Lisinopril" className={"w-full p-2 border bg-white rounded-md mt-1 ".concat(errors.name && touched.name ? 'border-red-500' : 'border-gray-300')}/>
                    <formik_1.ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1"/>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dosage</label>
                        <formik_1.Field name="dosage" placeholder="e.g., 10mg" className={"w-full p-2 border bg-white rounded-md mt-1 ".concat(errors.dosage && touched.dosage ? 'border-red-500' : 'border-gray-300')}/>
                        <formik_1.ErrorMessage name="dosage" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Frequency</label>
                        <formik_1.Field name="frequency" placeholder="e.g., Once daily" className={"w-full p-2 border bg-white rounded-md mt-1 ".concat(errors.frequency && touched.frequency ? 'border-red-500' : 'border-gray-300')}/>
                         <formik_1.ErrorMessage name="frequency" component="p" className="text-red-500 text-xs mt-1"/>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">{initialValues.name ? 'Save Changes' : 'Add Medication'}</button>
                </div>
            </formik_1.Form>);
        }}
        </formik_1.Formik>
    </Modal_1.default>);
};
// Updated Card to include actions
var MedicationCard = function (_a) {
    var med = _a.med, onRequestRefill = _a.onRequestRefill, onEdit = _a.onEdit, onDelete = _a.onDelete;
    return (<div className="p-4 border border-gray-200 rounded-lg bg-white flex flex-col sm:flex-row justify-between sm:items-center">
        <div className="flex items-center space-x-4">
            <div className={"p-3 rounded-full ".concat(med.status === 'Active' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500')}>
                <Icons_1.PillIcon />
            </div>
            <div>
                <p className="font-bold text-lg text-gray-800">{med.name}</p>
                <p className="text-sm text-gray-600">{med.dosage}, {med.frequency}</p>
                 {med.status === 'Active' && typeof med.adherence === 'number' && (<div className="flex items-center text-xs mt-1">
                        <span className="font-semibold mr-1.5">Adherence:</span>
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "".concat(med.adherence, "%") }}></div>
                        </div>
                        <span className="ml-1.5 font-medium text-emerald-700">{med.adherence}%</span>
                    </div>)}
            </div>
        </div>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0 self-end sm:self-center">
             {med.status === 'Active' && <button onClick={function () { return onRequestRefill(med.name); }} className="text-xs font-semibold text-white bg-primary-500 hover:bg-primary-600 px-3 py-1.5 rounded-full">Request Refill</button>}
             <button onClick={function () { return onEdit(med); }} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full" aria-label={"Edit ".concat(med.name)}><Icons_1.PencilAltIcon className="w-5 h-5"/></button>
             {med.status === 'Active' && <button onClick={function () { return onDelete(med); }} className="p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full" aria-label={"Delete ".concat(med.name)}><Icons_1.TrashIcon className="w-5 h-5"/></button>}
            <span className={"px-2 py-1 text-xs font-semibold rounded-full w-20 text-center ".concat(med.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800')}>{med.status}</span>
        </div>
    </div>);
};
var Medications = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, updateUser = _a.updateUser;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)(null), editingMed = _b[0], setEditingMed = _b[1];
    var _c = (0, react_1.useState)(null), deletingMed = _c[0], setDeletingMed = _c[1];
    var _d = (0, react_1.useState)(new Set()), takenMeds = _d[0], setTakenMeds = _d[1];
    var _e = (0, react_1.useState)(new Set()), justTaken = _e[0], setJustTaken = _e[1];
    var activeMeds = (0, react_1.useMemo)(function () { var _a; return ((_a = user === null || user === void 0 ? void 0 : user.medications) === null || _a === void 0 ? void 0 : _a.filter(function (m) { return m.status === 'Active'; })) || []; }, [user]);
    var inactiveMeds = (0, react_1.useMemo)(function () { var _a; return ((_a = user === null || user === void 0 ? void 0 : user.medications) === null || _a === void 0 ? void 0 : _a.filter(function (m) { return m.status === 'Inactive'; })) || []; }, [user]);
    var handleSaveMedication = function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedMeds, newMedication, updatedMeds;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(editingMed && editingMed.id)) return [3 /*break*/, 2];
                    updatedMeds = (_a = user === null || user === void 0 ? void 0 : user.medications) === null || _a === void 0 ? void 0 : _a.map(function (m) { return m.id === editingMed.id ? __assign(__assign({}, m), values) : m; });
                    return [4 /*yield*/, updateUser({ medications: updatedMeds })];
                case 1:
                    _b.sent();
                    showToast('Medication updated!', 'success');
                    return [3 /*break*/, 4];
                case 2:
                    newMedication = __assign(__assign({ id: "med_".concat(Date.now()) }, values), { status: 'Active', adherence: 100 });
                    updatedMeds = __spreadArray(__spreadArray([], ((user === null || user === void 0 ? void 0 : user.medications) || []), true), [newMedication], false);
                    return [4 /*yield*/, updateUser({ medications: updatedMeds })];
                case 3:
                    _b.sent();
                    showToast('Medication added!', 'success');
                    _b.label = 4;
                case 4:
                    setEditingMed(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDeleteMedication = function () { return __awaiter(void 0, void 0, void 0, function () {
        var updatedMeds;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!deletingMed)
                        return [2 /*return*/];
                    updatedMeds = (_a = user === null || user === void 0 ? void 0 : user.medications) === null || _a === void 0 ? void 0 : _a.map(function (m) { return m.id === deletingMed.id ? __assign(__assign({}, m), { status: 'Inactive' }) : m; });
                    return [4 /*yield*/, updateUser({ medications: updatedMeds })];
                case 1:
                    _b.sent();
                    showToast("".concat(deletingMed.name, " marked as inactive."), 'success');
                    setDeletingMed(null);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleMarkAsTaken = function (medId, medName) {
        setTakenMeds(function (prev) { return new Set(prev).add(medId); });
        setJustTaken(function (prev) { return new Set(prev).add(medId); });
        showToast("".concat(medName, " logged as taken for today."), 'success');
    };
    var handleRequestRefill = function (medName) {
        showToast("Refill requested for ".concat(medName, ". Your provider has been notified."), 'info');
    };
    var initialFormValues = (0, react_1.useMemo)(function () { return editingMed ? { name: editingMed.name, dosage: editingMed.dosage, frequency: editingMed.frequency } : { name: '', dosage: '', frequency: '' }; }, [editingMed]);
    return (<div>
            <PageHeader_1.default title="My Medications" buttonText="Add Medication" onButtonClick={function () { return setEditingMed({ id: '', name: '', dosage: '', frequency: '', status: 'Active' }); }}/>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     <Card_1.default>
                        <h2 className="text-xl font-bold mb-4">Active Medications</h2>
                        <div className="space-y-4">
                            {activeMeds.length > 0 ? activeMeds.map(function (med) { return <MedicationCard key={med.id} med={med} onEdit={setEditingMed} onDelete={setDeletingMed} onRequestRefill={handleRequestRefill}/>; }) : <p className="text-gray-500 text-center py-4">You have no active medications.</p>}
                        </div>
                    </Card_1.default>
                     <Card_1.default>
                        <h2 className="text-xl font-bold mb-4">Inactive/Past Medications</h2>
                        <div className="space-y-4">
                            {inactiveMeds.length > 0 ? inactiveMeds.map(function (med) { return <MedicationCard key={med.id} med={med} onEdit={setEditingMed} onDelete={setDeletingMed} onRequestRefill={handleRequestRefill}/>; }) : <p className="text-gray-500 text-center py-4">You have no past medications.</p>}
                        </div>
                    </Card_1.default>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card_1.default title="Log Today's Doses">
                        <div className="space-y-4">
                           {activeMeds.length > 0 ? activeMeds.map(function (med) {
            var isTaken = takenMeds.has(med.id);
            var isJustTaken = justTaken.has(med.id);
            return (<div key={med.id} className={"flex justify-between items-center p-3 rounded-lg transition-colors ".concat(isJustTaken ? 'animate-mark-complete' : (isTaken ? 'bg-gray-100' : 'bg-gray-50'))} onAnimationEnd={function () {
                    if (isJustTaken) {
                        setJustTaken(function (prev) {
                            var newSet = new Set(prev);
                            newSet.delete(med.id);
                            return newSet;
                        });
                    }
                }}>
                                        <div>
                                            <p className={"font-semibold transition-colors ".concat(isTaken ? 'text-gray-500 line-through' : 'text-gray-800')}>{med.name}</p>
                                            <p className="text-sm text-gray-500">Take {med.frequency.toLowerCase()}</p>
                                        </div>
                                        <button onClick={function () { return handleMarkAsTaken(med.id, med.name); }} disabled={isTaken} className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-full disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
                                            <Icons_1.CheckCircleIcon className="w-5 h-5 mr-1.5"/>
                                            {isTaken ? 'Taken' : 'Mark as Taken'}
                                        </button>
                                   </div>);
        }) : <p className="text-gray-500 text-center text-sm">No active medications to log.</p>}
                        </div>
                     </Card_1.default>
                </div>
            </div>

            {editingMed && (<MedicationFormModal isOpen={!!editingMed} onClose={function () { return setEditingMed(null); }} onSave={handleSaveMedication} initialValues={initialFormValues}/>)}

            <Modal_1.default isOpen={!!deletingMed} onClose={function () { return setDeletingMed(null); }} title="Confirm Action" size="sm" footer={<>
                    <button onClick={function () { return setDeletingMed(null); }} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleDeleteMedication} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Mark as Inactive</button>
                </>}>
                <p>Are you sure you want to mark <strong>{deletingMed === null || deletingMed === void 0 ? void 0 : deletingMed.name}</strong> as inactive? It will be moved to your past medications.</p>
            </Modal_1.default>
        </div>);
};
exports.default = Medications;
