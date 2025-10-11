import React, { useState, useEffect } from 'react';
import Card from '../../components/shared/Card';
import { VideoCameraIcon } from '../../components/shared/Icons';

const getAppointmentTime = (minutesFromNow: number) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutesFromNow);
    return date;
};

interface Consult {
    id: number;
    doctor: string;
    specialty: string;
    appointmentTime: Date;
}

const initialConsults: Consult[] = [
  { id: 1, doctor: 'Dr. Jane Smith', specialty: 'Cardiologist', appointmentTime: getAppointmentTime(10) },
  { id: 2, doctor: 'Dr. David Chen', specialty: 'Dermatologist', appointmentTime: getAppointmentTime(120) },
  { id: 3, doctor: 'Dr. Emily White', specialty: 'General Practice', appointmentTime: getAppointmentTime(60 * 24 * 2) }, // 2 days from now
  { id: 4, doctor: 'Dr. Ben Carter', specialty: 'Pediatrics', appointmentTime: getAppointmentTime(-45) }, // In the past
  { id: 5, doctor: 'Dr. Sarah Lee', specialty: 'Neurology', appointmentTime: getAppointmentTime(60 * 24 * 5) }, // 5 days from now
];

const ConfirmationModal: React.FC<{
    consult: Consult | null;
    action: 'Reschedule' | 'Cancel' | null;
    onClose: () => void;
    onConfirm: (consult: Consult, action: 'Reschedule' | 'Cancel') => void;
}> = ({ consult, action, onClose, onConfirm }) => {
    if (!consult || !action) return null;

    const isCancel = action === 'Cancel';
    const title = isCancel ? 'Confirm Cancellation' : 'Reschedule Appointment';
    const message = isCancel
        ? `Are you sure you want to cancel your appointment with ${consult.doctor}?`
        : `To reschedule your appointment with ${consult.doctor}, please call our office at (555) 123-4567. Would you like to proceed with canceling this appointment slot?`;
    const confirmText = isCancel ? 'Yes, Cancel' : 'Yes, Proceed';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 animate-slide-in-up">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors">
                        Go Back
                    </button>
                    <button 
                        onClick={() => onConfirm(consult, action)} 
                        className={`font-bold py-2 px-4 rounded-lg transition-colors ${isCancel ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const VideoConsults: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [consults, setConsults] = useState<Consult[]>(initialConsults);
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        consult: Consult | null;
        action: 'Reschedule' | 'Cancel' | null;
    }>({ isOpen: false, consult: null, action: null });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000); 
        return () => clearInterval(timer);
    }, []);

    const getButtonState = (apptTime: Date): { text: string; disabled: boolean; className: string } => {
        const timeDiff = apptTime.getTime() - currentTime.getTime();
        const minutesUntil = timeDiff / (1000 * 60);

        const joinableClassName = "bg-primary-600 text-white enabled:hover:bg-primary-700";
        const disabledClassName = "bg-gray-300 text-gray-500 cursor-not-allowed";
        const endedClassName = "bg-red-200 text-red-700 cursor-not-allowed";

        if (minutesUntil <= 15 && minutesUntil > -30) {
            return { text: 'Join Call', disabled: false, className: joinableClassName };
        }
        
        if (minutesUntil > 15) {
             if (minutesUntil < 60) {
                return { text: `Join in ${Math.ceil(minutesUntil)} min`, disabled: true, className: disabledClassName };
             }
             return { text: 'Join Call', disabled: true, className: disabledClassName };
        }

        if (minutesUntil <= -30) {
             return { text: 'Ended', disabled: true, className: endedClassName };
        }

        return { text: 'Join Call', disabled: true, className: disabledClassName };
    };
    
    const handleModalOpen = (consult: Consult, action: 'Reschedule' | 'Cancel') => {
        setModalState({ isOpen: true, consult, action });
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, consult: null, action: null });
    };

    const handleConfirmAction = (consult: Consult, action: 'Reschedule' | 'Cancel') => {
        if (action === 'Cancel') {
            setConsults(prev => prev.filter(c => c.id !== consult.id));
            alert(`Your appointment with ${consult.doctor} has been cancelled.`);
        } else if (action === 'Reschedule') {
            // In a real app, this would open a rescheduling flow. Here, we'll just remove it and alert.
            setConsults(prev => prev.filter(c => c.id !== consult.id));
            alert(`Your appointment slot with ${consult.doctor} has been cleared. Please call to reschedule.`);
        }
        handleModalClose();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Video Consultations</h1>
            <Card>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Consults</h2>
                <div className="space-y-4">
                    {consults.sort((a,b) => a.appointmentTime.getTime() - b.appointmentTime.getTime()).map((consult) => {
                        const { text, disabled, className } = getButtonState(consult.appointmentTime);
                        const hoursUntil = (consult.appointmentTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);
                        const canManage = hoursUntil > 24;

                        return (
                            <div key={consult.id} className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col sm:flex-row justify-between sm:items-center">
                                <div className="flex items-center space-x-4 mb-4 sm:mb-0 flex-grow">
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
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    {canManage && (
                                        <>
                                            <button 
                                                onClick={() => handleModalOpen(consult, 'Reschedule')}
                                                className="text-primary-600 hover:text-primary-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                                                Reschedule
                                            </button>
                                            <button 
                                                onClick={() => handleModalOpen(consult, 'Cancel')}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                    <button 
                                        disabled={disabled}
                                        className={`font-bold py-2 px-4 rounded-lg shadow-sm transition-all w-36 text-center ${className}`}
                                    >
                                        {text}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
            <ConfirmationModal 
                consult={modalState.consult}
                action={modalState.action}
                onClose={handleModalClose}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
};

export default VideoConsults;