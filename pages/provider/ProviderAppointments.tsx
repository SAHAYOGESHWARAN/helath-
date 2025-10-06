import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';

type Status = 'Confirmed' | 'Pending' | 'Cancelled';
const appointments = [
  { id: 1, patient: 'John Doe', date: '2024-08-15', time: '10:30 AM', reason: 'Annual Check-up', status: 'Confirmed' as Status },
  { id: 2, patient: 'Alice Johnson', date: '2024-08-15', time: '11:00 AM', reason: 'Follow-up', status: 'Confirmed' as Status },
  { id: 3, patient: 'Bob Williams', date: '2024-08-16', time: '09:00 AM', reason: 'Consultation', status: 'Pending' as Status },
  { id: 4, patient: 'Charlie Brown', date: '2024-08-16', time: '02:30 PM', reason: 'Check-up', status: 'Confirmed' as Status },
  { id: 5, patient: 'Diana Prince', date: '2024-08-17', time: '10:00 AM', reason: 'Sick Visit', status: 'Cancelled' as Status },
];

const getStatusColor = (status: Status) => {
  switch (status) {
    case 'Confirmed': return 'bg-green-100 text-green-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
  }
};

const ProviderAppointments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const matchesSearch = appt.patient.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointment Management</h1>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option>All</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appt.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.date} at {appt.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appt.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-primary-600 hover:text-primary-900">View Chart</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ProviderAppointments;