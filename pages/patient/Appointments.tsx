import React from 'react';
import Card from '../../components/shared/Card';

const appointments = [
    { id: 1, doctor: 'Dr. Jane Smith', date: '2024-08-15', time: '10:30 AM', reason: 'Annual Check-up', status: 'Confirmed' },
    { id: 2, doctor: 'Dr. David Chen', date: '2024-09-02', time: '02:00 PM', reason: 'Follow-up', status: 'Confirmed' },
];

const PatientAppointments: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">
          Schedule New
        </button>
      </div>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        <div className="space-y-4">
            {appointments.map(appt => (
                 <div key={appt.id} className="p-4 border rounded-lg flex justify-between items-center">
                    <div>
                        <p className="font-bold">{appt.reason} with {appt.doctor}</p>
                        <p className="text-sm text-gray-600">{appt.date} at {appt.time}</p>
                    </div>
                    <span className="px-3 py-1 text-sm font-semibold text-green-800 bg-green-100 rounded-full">{appt.status}</span>
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default PatientAppointments;
