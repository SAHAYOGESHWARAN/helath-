import React, { useState, useEffect } from 'react';
import Card from '../../components/shared/Card';
import { VideoCameraIcon } from '../../components/shared/Icons';

const getAppointmentTime = (minutesFromNow: number) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutesFromNow);
    return date;
};

const mockConsults = [
  { id: 1, doctor: 'Dr. Jane Smith', specialty: 'Cardiologist', appointmentTime: getAppointmentTime(10) },
  { id: 2, doctor: 'Dr. David Chen', specialty: 'Dermatologist', appointmentTime: getAppointmentTime(120) },
  { id: 3, doctor: 'Dr. Emily White', specialty: 'General Practice', appointmentTime: getAppointmentTime(60 * 24 * 2) },
];


const VideoConsults: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const isJoinable = (apptTime: Date) => {
        const timeDiff = apptTime.getTime() - currentTime.getTime();
        const minutesUntil = timeDiff / (1000 * 60);
        return minutesUntil <= 15 && minutesUntil > -30; // Joinable 15 mins before to 30 mins after
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Video Consultations</h1>
            <Card>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Consults</h2>
                <div className="space-y-4">
                    {mockConsults.map((consult) => (
                        <div key={consult.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="bg-primary-100 p-3 rounded-full text-primary-600">
                                    <VideoCameraIcon />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-800">{consult.doctor}</p>
                                    <p className="text-sm text-gray-600">{consult.specialty}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {consult.appointmentTime.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                                    </p>
                                </div>
                            </div>
                            <button 
                                disabled={!isJoinable(consult.appointmentTime)}
                                className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all enabled:hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Join Call
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default VideoConsults;