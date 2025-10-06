import React, { useState, useEffect } from 'react';
import Card from '../../components/shared/Card';
import { ClockIcon, UsersIcon } from '../../components/shared/Icons';

const initialPatients = [
  { id: 1, name: 'Alice Johnson', reason: 'Follow-up', checkInTime: new Date(Date.now() - 5 * 60000) }, // 5 minutes ago
  { id: 2, name: 'Charlie Brown', reason: 'Sick Visit', checkInTime: new Date(Date.now() - 2 * 60000) }, // 2 minutes ago
];

const WaitingRoom: React.FC = () => {
  const [patients, setPatients] = useState(initialPatients);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000); // Update every second
    return () => clearInterval(timer);
  }, []);

  const calculateWaitTime = (checkInTime: Date) => {
    const diff = currentTime.getTime() - checkInTime.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Virtual Waiting Room</h1>
      <Card>
        <div className="flex items-center text-lg font-semibold text-gray-700 mb-4">
          <UsersIcon />
          <span className="ml-2">{patients.length} Patient(s) Waiting</span>
        </div>
        <div className="space-y-4">
          {patients.map((patient) => (
            <div key={patient.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img
                  src={`https://picsum.photos/seed/${patient.id}/100`}
                  alt="Patient Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-bold text-lg text-gray-800">{patient.name}</p>
                  <p className="text-sm text-gray-600">{patient.reason}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-gray-600">
                  <ClockIcon />
                  <span className="ml-2 font-mono text-lg">{calculateWaitTime(patient.checkInTime)}</span>
                </div>
                <div className="space-x-2">
                   <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm">
                      Notify
                    </button>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg text-sm">
                      Start Session
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WaitingRoom;