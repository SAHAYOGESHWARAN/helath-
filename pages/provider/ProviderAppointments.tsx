import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { Appointment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import { SpinnerIcon } from '../../components/shared/Icons';
import PageHeader from '../../components/shared/PageHeader';

const getStatusColor = (status: Appointment['status']) => {
  switch (status) {
    case 'Confirmed': return 'bg-blue-100 text-blue-800';
    case 'Completed': return 'bg-emerald-100 text-emerald-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ProviderAppointments: React.FC = () => {
  const { user, appointments, confirmAppointment, cancelAppointment } = useAuth();
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modal, setModal] = useState<'details' | 'cancel' | 'confirm' | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const matchesProvider = appt.providerId === user?.id;
      const matchesSearch = appt.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
      return matchesProvider && matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [searchTerm, statusFilter, appointments, user]);

  const openModal = (type: 'details' | 'cancel' | 'confirm', appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModal(type);
  };

  const handleConfirm = () => {
    if (!selectedAppointment) return;
    setIsSubmitting(true);
    setTimeout(() => {
      confirmAppointment(selectedAppointment.id);
      showToast('Appointment confirmed!', 'success');
      setIsSubmitting(false);
      setModal(null);
    }, 800);
  };
  
  const handleCancel = () => {
    if (!selectedAppointment) return;
    setIsSubmitting(true);
    setTimeout(() => {
      cancelAppointment(selectedAppointment.id);
      showToast('Appointment cancelled.', 'success');
      setIsSubmitting(false);
      setModal(null);
    }, 800);
  };

  return (
    <div>
      <PageHeader title="Appointment Management" />
      <Card>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border bg-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
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
              {filteredAppointments.map((appt) => (
                <tr key={appt.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC' })} at {appt.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal('details', appt)} className="text-primary-600 hover:text-primary-900">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <Modal isOpen={modal === 'details'} onClose={() => setModal(null)} title="Appointment Details">
        {selectedAppointment && <div className="space-y-4">
          <p><strong>Patient:</strong> {selectedAppointment.patientName}</p>
          <p><strong>Date & Time:</strong> {new Date(selectedAppointment.date).toLocaleDateString('en-US', { timeZone: 'UTC' })} at {selectedAppointment.time}</p>
          <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
          <div className="flex justify-end space-x-2 pt-4 border-t">
            {selectedAppointment.status === 'Pending' && <button onClick={() => openModal('confirm', selectedAppointment)} className="bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg">Confirm</button>}
            {(selectedAppointment.status === 'Pending' || selectedAppointment.status === 'Confirmed') && <button onClick={() => openModal('cancel', selectedAppointment)} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg">Cancel</button>}
          </div>
        </div>}
      </Modal>

      <Modal isOpen={modal === 'confirm'} onClose={() => setModal(null)} title="Confirm Appointment" footer={<>
        <button onClick={() => setModal(null)} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Back</button>
        <button onClick={handleConfirm} disabled={isSubmitting} className="bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Yes, Confirm'}</button>
      </>}>
        <p>Are you sure you want to confirm this appointment for <strong>{selectedAppointment?.patientName}</strong>?</p>
      </Modal>
      
      <Modal isOpen={modal === 'cancel'} onClose={() => setModal(null)} title="Cancel Appointment" footer={<>
        <button onClick={() => setModal(null)} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Back</button>
        <button onClick={handleCancel} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-36 flex justify-center">{isSubmitting ? <SpinnerIcon /> : 'Yes, Cancel'}</button>
      </>}>
        <p>Are you sure you want to cancel this appointment for <strong>{selectedAppointment?.patientName}</strong>?</p>
      </Modal>

    </div>
  );
};

export default ProviderAppointments;