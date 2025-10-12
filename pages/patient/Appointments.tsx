import React, { useState, useMemo, useRef, useEffect } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment } from '../../types';
import { CalendarIcon, ClockIcon, VideoCameraIcon, UsersIcon, DocumentTextIcon, StarIcon, SearchIcon } from '../../components/shared/Icons';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';

// Mock data for appointments
const mockAppointmentsData: Appointment[] = [
  {
    id: 'appt1',
    patientName: 'John Doe',
    providerName: 'Dr. Jane Smith',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:30 AM',
    reason: 'Annual Check-up',
    type: 'In-Person',
    status: 'Confirmed',
  },
  {
    id: 'appt2',
    patientName: 'John Doe',
    providerName: 'Dr. David Chen',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '02:00 PM',
    reason: 'Dermatology Follow-up',
    type: 'Virtual',
    status: 'Confirmed',
  },
  {
    id: 'appt3',
    patientName: 'John Doe',
    providerName: 'Dr. Jane Smith',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:00 AM',
    reason: 'Follow-up Visit',
    type: 'In-Person',
    status: 'Completed',
    visitSummary: 'Patient is responding well to treatment. Continue current medication plan. Follow up in 6 months.'
  },
  {
    id: 'appt4',
    patientName: 'John Doe',
    providerName: 'Dr. Emily White',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00 AM',
    reason: 'Initial Consultation',
    type: 'In-Person',
    status: 'Completed',
    visitSummary: 'Discussed patient history and symptoms. Ordered initial lab work.'
  },
];

const mockProviders = [
  { id: 'pro1', name: 'Dr. Jane Smith', specialty: 'Cardiology', avatarUrl: 'https://picsum.photos/seed/provider1/100' },
  { id: 'pro2', name: 'Dr. David Chen', specialty: 'Dermatology', avatarUrl: 'https://picsum.photos/seed/provider2/100' },
  { id: 'pro3', name: 'Dr. Emily White', specialty: 'Pediatrics', avatarUrl: 'https://picsum.photos/seed/provider3/100' },
];


// Helper to reliably parse 'YYYY-MM-DD' strings in the user's local timezone.
// This prevents bugs where new Date('YYYY-MM-DD') is treated as UTC midnight.
const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Month is 0-indexed in JavaScript Date constructor.
    return new Date(year, month - 1, day);
};

// Extend the base Appointment type to include feedback locally
interface AppointmentWithFeedback extends Appointment {
  feedback?: {
    rating: number;
    comment: string;
  };
}

const AppointmentCard: React.FC<{ 
    appointment: AppointmentWithFeedback; 
    onCancel: (appointment: Appointment) => void; 
    onFeedbackClick: (appointment: AppointmentWithFeedback) => void;
}> = ({ appointment, onCancel, onFeedbackClick }) => {
    const getStatusBadge = (status: Appointment['status']) => {
        const colors = {
            Confirmed: 'bg-emerald-500 text-white',
            Completed: 'bg-slate-500 text-white',
            Pending: 'bg-amber-500 text-white',
            Cancelled: 'bg-red-500 text-white',
        };
        return (
            <span className={`px-3 py-1 text-sm font-semibold leading-none rounded-full ${colors[status] || 'bg-gray-500 text-white'}`}>
                {status}
            </span>
        );
    };

    const isUpcoming = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight in local timezone
        const apptDate = parseLocalDate(appointment.date);
        return apptDate >= today;
    }, [appointment.date]);

    const isCancellable = appointment.status === 'Confirmed' && isUpcoming;

    return (
        <Card className="mb-4 transition-shadow hover:shadow-lg">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                    <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-2">
                        <p className="text-xl font-bold text-gray-800">{appointment.providerName}</p>
                        {getStatusBadge(appointment.status)}
                    </div>
                    <p className="text-gray-600">{appointment.reason}</p>
                </div>
                <div className="flex-shrink-0 sm:self-center flex items-center space-x-2">
                    {isCancellable && (
                        <button 
                            onClick={() => onCancel(appointment)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                            Cancel
                        </button>
                    )}
                    {appointment.status === 'Confirmed' && isUpcoming && appointment.type === 'Virtual' && (
                        <button className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-transform transform hover:scale-105 inline-block">
                            Join Virtual Consult
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4 border-t pt-4 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                    <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{parseLocalDate(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{appointment.time}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    {appointment.type === 'Virtual' ? <VideoCameraIcon className="w-5 h-5 mr-2 text-gray-500" /> : <UsersIcon className="w-5 h-5 mr-2 text-gray-500" />}
                    <span>{appointment.type}</span>
                </div>
            </div>

            {appointment.status === 'Completed' && appointment.visitSummary && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-base font-semibold text-gray-800 flex items-center mb-2">
                        <DocumentTextIcon className="w-5 h-5 mr-2 text-gray-400" />
                        Visit Summary
                    </h4>
                     <div className="text-sm text-gray-700 bg-slate-50 p-4 rounded-lg border border-slate-300 shadow-inner">
                        <p className="whitespace-pre-wrap">{appointment.visitSummary}</p>
                    </div>
                </div>
            )}
             {appointment.status === 'Completed' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                     <h4 className="text-base font-semibold text-gray-800 flex items-center mb-2">
                        <StarIcon className="w-5 h-5 mr-2 text-gray-400 fill-transparent" />
                        Your Feedback
                    </h4>
                    {appointment.feedback ? (
                         <div className="space-y-2">
                            <div className="flex items-center space-x-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon key={i} className={`w-6 h-6 ${i < appointment.feedback!.rating ? 'text-amber-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            {appointment.feedback.comment && <p className="text-sm text-gray-700 bg-slate-50 p-3 rounded-md italic">"{appointment.feedback.comment}"</p>}
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                            <p className="text-sm text-gray-500">Share your experience to help us improve.</p>
                            <button 
                                onClick={() => onFeedbackClick(appointment)} 
                                className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex-shrink-0"
                            >
                                Leave Feedback
                            </button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};


const FeedbackModal: React.FC<{
    appointment: AppointmentWithFeedback | null;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}> = ({ appointment, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit(rating, comment);
    };

    return (
        <Modal
            isOpen={!!appointment}
            onClose={onClose}
            title={`Leave Feedback for your visit with ${appointment?.providerName}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} disabled={rating === 0} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed">Submit Feedback</button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                            >
                                <StarIcon className={`w-8 h-8 transition-colors ${(hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-300'}`} />
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comments (optional)</label>
                    <textarea
                        id="comment"
                        rows={4}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Tell us more about your experience..."
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                </div>
            </div>
        </Modal>
    );
};

const PatientAppointments: React.FC = () => {
    const { showToast } = useApp();
    const [appointments, setAppointments] = useState<AppointmentWithFeedback[]>(mockAppointmentsData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State for scheduling modal
    const [selectedProvider, setSelectedProvider] = useState<(typeof mockProviders)[0] | null>(null);
    const [providerSearchTerm, setProviderSearchTerm] = useState('');
    const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
    const providerDropdownRef = useRef<HTMLDivElement>(null);
    
    const [cancelModal, setCancelModal] = useState<{ isOpen: boolean; appointment: Appointment | null }>({ isOpen: false, appointment: null });
    const [feedbackModal, setFeedbackModal] = useState<{ isOpen: boolean; appointment: AppointmentWithFeedback | null }>({ isOpen: false, appointment: null });
    const [pastAppointmentsSortOrder, setPastAppointmentsSortOrder] = useState<'newest' | 'oldest'>('newest');

    const { upcoming, past } = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const upcomingAppointments: AppointmentWithFeedback[] = [];
        const pastAppointments: AppointmentWithFeedback[] = [];

        appointments.forEach(appt => {
            const apptDate = parseLocalDate(appt.date);
            if (apptDate >= today) {
                upcomingAppointments.push(appt);
            } else {
                pastAppointments.push(appt);
            }
        });

        pastAppointments.sort((a, b) => {
            const dateA = parseLocalDate(a.date).getTime();
            const dateB = parseLocalDate(b.date).getTime();
            return pastAppointmentsSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return { 
            upcoming: upcomingAppointments.sort((a,b) => parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()), 
            past: pastAppointments 
        };
    }, [appointments, pastAppointmentsSortOrder]);

    const filteredProviders = useMemo(() =>
        mockProviders.filter(
            provider =>
                provider.name.toLowerCase().includes(providerSearchTerm.toLowerCase()) ||
                provider.specialty.toLowerCase().includes(providerSearchTerm.toLowerCase())
        ), [providerSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (providerDropdownRef.current && !providerDropdownRef.current.contains(event.target as Node)) {
                setIsProviderDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleOpenScheduleModal = () => {
        setSelectedProvider(null);
        setProviderSearchTerm('');
        setIsProviderDropdownOpen(false);
        setIsModalOpen(true);
    };

    const handleSchedule = () => {
        if (!selectedProvider) {
            showToast('Please select a provider.', 'error');
            return;
        }
        showToast(`Appointment requested with ${selectedProvider.name}!`, 'success');
        setIsModalOpen(false);
    }

    const handleOpenCancelModal = (appointment: Appointment) => {
        setCancelModal({ isOpen: true, appointment });
    };

    const handleConfirmCancel = () => {
        if (!cancelModal.appointment) return;

        setAppointments(prev => 
            prev.map(appt => 
                appt.id === cancelModal.appointment?.id ? { ...appt, status: 'Cancelled' } : appt
            )
        );

        showToast('Appointment cancelled successfully.', 'success');
        setCancelModal({ isOpen: false, appointment: null });
    };
    
    const handleOpenFeedbackModal = (appointment: AppointmentWithFeedback) => {
        setFeedbackModal({ isOpen: true, appointment });
    };

    const handleFeedbackSubmit = (rating: number, comment: string) => {
        if (!feedbackModal.appointment) return;

        setAppointments(prev =>
            prev.map(appt =>
                appt.id === feedbackModal.appointment?.id
                    ? { ...appt, feedback: { rating, comment } }
                    : appt
            )
        );

        showToast('Thank you for your feedback!', 'success');
        setFeedbackModal({ isOpen: false, appointment: null });
    };


    return (
        <div>
            <PageHeader
                title="My Appointments"
                buttonText="Schedule New Appointment"
                onButtonClick={handleOpenScheduleModal}
            />
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Appointments</h2>
                    {upcoming.length > 0 ? (
                        upcoming.map(appt => <AppointmentCard key={appt.id} appointment={appt} onCancel={handleOpenCancelModal} onFeedbackClick={handleOpenFeedbackModal} />)
                    ) : (
                        <Card><p className="text-gray-500">You have no upcoming appointments.</p></Card>
                    )}
                </div>
                <div>
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Past Appointments</h2>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">Sort by:</span>
                            <button
                                onClick={() => setPastAppointmentsSortOrder('newest')}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                                    pastAppointmentsSortOrder === 'newest'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Newest First
                            </button>
                            <button
                                onClick={() => setPastAppointmentsSortOrder('oldest')}
                                className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                                    pastAppointmentsSortOrder === 'oldest'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                Oldest First
                            </button>
                        </div>
                    </div>
                    {past.length > 0 ? (
                        past.map(appt => <AppointmentCard key={appt.id} appointment={appt} onCancel={handleOpenCancelModal} onFeedbackClick={handleOpenFeedbackModal} />)
                    ) : (
                        <Card><p className="text-gray-500">You have no past appointments.</p></Card>
                    )}
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Schedule a New Appointment"
                footer={
                    <>
                        <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancel</button>
                        <button onClick={handleSchedule} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg">Request Appointment</button>
                    </>
                }
            >
                <form className="space-y-4">
                     <div ref={providerDropdownRef}>
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700">Provider</label>
                         <div className="mt-1 relative">
                            <button type="button" onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)} className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm">
                                {selectedProvider ? (
                                    <span className="flex items-center">
                                        <img src={selectedProvider.avatarUrl} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                                        <span className="ml-3 block truncate">{selectedProvider.name} <span className="text-gray-500">({selectedProvider.specialty})</span></span>
                                    </span>
                                ) : (
                                    <span className="block truncate text-gray-400">Select a provider</span>
                                )}
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            </button>
                            {isProviderDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                    <div className="p-2 sticky top-0 bg-white z-10">
                                        <div className="relative">
                                            <input type="search" placeholder="Search name or specialty..." value={providerSearchTerm} onChange={(e) => setProviderSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md"/>
                                            <SearchIcon className="w-5 h-5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                    <ul role="listbox">
                                        {filteredProviders.map(provider => (
                                            <li key={provider.id} onClick={() => { setSelectedProvider(provider); setIsProviderDropdownOpen(false); setProviderSearchTerm(''); }} className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-primary-100 text-gray-900">
                                                <div className="flex items-center">
                                                    <img src={provider.avatarUrl} alt="" className="flex-shrink-0 h-6 w-6 rounded-full" />
                                                    <span className="ml-3 block truncate font-normal">{provider.name} <span className="text-gray-500">({provider.specialty})</span></span>
                                                </div>
                                            </li>
                                        ))}
                                        {filteredProviders.length === 0 && <li className="text-center py-2 text-gray-500">No providers found.</li>}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
                        <input type="date" id="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                    </div>
                     <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                        <textarea id="reason" rows={3} placeholder="e.g. Annual Check-up, sick visit, etc." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={cancelModal.isOpen}
                onClose={() => setCancelModal({ isOpen: false, appointment: null })}
                title="Confirm Cancellation"
                footer={
                    <>
                        <button onClick={() => setCancelModal({ isOpen: false, appointment: null })} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Go Back</button>
                        <button onClick={handleConfirmCancel} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Yes, Cancel</button>
                    </>
                }
            >
                <p>Are you sure you want to cancel your appointment with <strong className="text-gray-800">{cancelModal.appointment?.providerName}</strong> on <strong className="text-gray-800">{cancelModal.appointment && parseLocalDate(cancelModal.appointment.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</strong>?</p>
                <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
            </Modal>
            
            <FeedbackModal
                appointment={feedbackModal.appointment}
                onClose={() => setFeedbackModal({ isOpen: false, appointment: null })}
                onSubmit={handleFeedbackSubmit}
            />
        </div>
    );
};

export default PatientAppointments;