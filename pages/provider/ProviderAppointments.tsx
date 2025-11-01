"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Card_1 = require("../../components/shared/Card");
var useAuth_1 = require("../../hooks/useAuth");
var Modal_1 = require("../../components/shared/Modal");
var App_1 = require("../../App");
var Icons_1 = require("../../components/shared/Icons");
var PageHeader_1 = require("../../components/shared/PageHeader");
var getStatusColor = function (status) {
    switch (status) {
        case 'Confirmed': return 'bg-blue-100 text-blue-800';
        case 'Completed': return 'bg-emerald-100 text-emerald-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
var ProviderAppointments = function () {
    var _a = (0, useAuth_1.useAuth)(), user = _a.user, appointments = _a.appointments, confirmAppointment = _a.confirmAppointment, cancelAppointment = _a.cancelAppointment;
    var showToast = (0, App_1.useApp)().showToast;
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('All'), statusFilter = _c[0], setStatusFilter = _c[1];
    var _d = (0, react_1.useState)(null), modal = _d[0], setModal = _d[1];
    var _e = (0, react_1.useState)(null), selectedAppointment = _e[0], setSelectedAppointment = _e[1];
    var _f = (0, react_1.useState)(false), isSubmitting = _f[0], setIsSubmitting = _f[1];
    var filteredAppointments = (0, react_1.useMemo)(function () {
        return appointments.filter(function (appt) {
            var matchesProvider = appt.providerId === (user === null || user === void 0 ? void 0 : user.id);
            var matchesSearch = appt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
            var matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
            return matchesProvider && matchesSearch && matchesStatus;
        }).sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
    }, [searchTerm, statusFilter, appointments, user]);
    var openModal = function (type, appointment) {
        setSelectedAppointment(appointment);
        setModal(type);
    };
    var handleConfirm = function () {
        if (!selectedAppointment)
            return;
        setIsSubmitting(true);
        confirmAppointment(selectedAppointment.id);
        showToast('Appointment confirmed!', 'success');
        setIsSubmitting(false);
        setModal(null);
    };
    var handleCancel = function () {
        if (!selectedAppointment)
            return;
        setIsSubmitting(true);
        cancelAppointment(selectedAppointment.id);
        showToast('Appointment cancelled.', 'success');
        setIsSubmitting(false);
        setModal(null);
    };
    return (<div>
      <PageHeader_1.default title="Appointment Management"/>
      <Card_1.default>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons_1.SearchIcon className="h-5 w-5 text-gray-400"/>
            </div>
            <input type="text" placeholder="Search by patient name..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="w-full pl-10 pr-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"/>
          </div>
          <select value={statusFilter} onChange={function (e) { return setStatusFilter(e.target.value); }} className="px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (filteredAppointments.map(function (appt) { return (<tr key={appt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.patientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC' })} at {appt.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat(getStatusColor(appt.status))}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={function () { return openModal('details', appt); }} className="text-primary-600 hover:text-primary-900">View</button>
                    </td>
                  </tr>); })) : (<tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                        No appointments found for the selected filters.
                    </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </Card_1.default>

      {/* Modals */}
      <Modal_1.default isOpen={modal === 'details'} onClose={function () { return setModal(null); }} title="Appointment Details">
        {selectedAppointment && <div className="space-y-4">
          <p><strong>Patient:</strong> {selectedAppointment.patientName}</p>
          <p><strong>Date & Time:</strong> {new Date(selectedAppointment.date).toLocaleDateString('en-US', { timeZone: 'UTC' })} at {selectedAppointment.time}</p>
          <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            {selectedAppointment.status === 'Pending' && <button onClick={function () { return openModal('confirm', selectedAppointment); }} className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg">Confirm</button>}
            {(selectedAppointment.status === 'Pending' || selectedAppointment.status === 'Confirmed') && <button onClick={function () { return openModal('cancel', selectedAppointment); }} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>}
          </div>
        </div>}
      </Modal_1.default>

      <Modal_1.default isOpen={modal === 'confirm'} onClose={function () { return setModal(null); }} title="Confirm Appointment" footer={<>
        <button onClick={function () { return setModal(null); }} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Back</button>
        <button onClick={handleConfirm} disabled={isSubmitting} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center">{isSubmitting ? <Icons_1.SpinnerIcon /> : 'Yes, Confirm'}</button>
      </>}>
        <p>Are you sure you want to confirm this appointment for <strong>{selectedAppointment === null || selectedAppointment === void 0 ? void 0 : selectedAppointment.patientName}</strong>?</p>
      </Modal_1.default>

      <Modal_1.default isOpen={modal === 'cancel'} onClose={function () { return setModal(null); }} title="Cancel Appointment" footer={<>
        <button onClick={function () { return setModal(null); }} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Back</button>
        <button onClick={handleCancel} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center">{isSubmitting ? <Icons_1.SpinnerIcon /> : 'Yes, Cancel'}</button>
      </>}>
        <p>Are you sure you want to cancel this appointment for <strong>{selectedAppointment === null || selectedAppointment === void 0 ? void 0 : selectedAppointment.patientName}</strong>?</p>
      </Modal_1.default>

    </div>);
};
exports.default = ProviderAppointments;
