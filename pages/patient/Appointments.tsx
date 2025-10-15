import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Appointment, UserRole } from '../../types';
import Modal from '../../components/shared/Modal';
import { useApp } from '../../App';
import { CalendarIcon, ClockIcon, VideoCameraIcon, SpinnerIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const getStatusPill = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-emerald-100 text-emerald-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};

const AppointmentRequestSchema = Yup.object().shape({
  providerName: Yup.string().required('Provider is required'),
  date: Yup.date().min(new Date(new Date().setDate(new Date().getDate() - 1)), 'Cannot schedule in the past').required('Date is required'),
  time: Yup.string().required('Time is required'),
  duration: Yup.number().oneOf([15, 30, 60]).required('Duration is required'),
  reason: Yup.string().min(5, 'Too short').required('Reason is required'),
  type: Yup.string().required('Type is required'),
});


const PatientAppointments: React.FC = () => {
    const { user: patientUser, users, appointments, addAppointment, cancelAppointment, submitAppointmentFeedback } = useAuth();
    const { showToast } = useApp();

    const [modal, setModal] = useState<'request' | 'details' | 'cancel' | 'feedback' | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const availableProviders = useMemo(() => {
        if (!patientUser?.state) return [];
        return users.filter(u => 
            u.role === UserRole.PROVIDER && 
            u.isVerified && 
            u.state === patientUser.state
        );
    }, [users, patientUser]);

    const sortedAppointments = useMemo(() => {
        const now = new Date();
        now.setHours(0,0,0,0);
        const upcoming = [...appointments].filter(a => new Date(a.date) >= now && (a.status === 'Confirmed' || a.status === 'Pending')).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const past = [...appointments].filter(a => new Date(a.date) < now || a.status === 'Completed' || a.status === 'Cancelled').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return { upcoming, past };
    }, [appointments]);

    const handleOpenDetails = (appt: Appointment) => {
        setSelectedAppointment(appt);
        setModal('details');
    };

    const handleConfirmCancel = () => {
        if (!selectedAppointment) return;
        setIsSubmitting(true);
        setTimeout(() => {
            cancelAppointment(selectedAppointment.id);
            showToast('Appointment cancelled successfully.', 'success');
            setIsSubmitting(false);
            setModal(null);
        }, 800);
    };

    const handleFeedbackSubmit = (values: { summary: string }) => {
        if (!selectedAppointment) return;
        setIsSubmitting(true);
        setTimeout(() => {
            submitAppointmentFeedback(selectedAppointment.id, values.summary);
            showToast('Feedback submitted. Thank you!', 'success');
            setIsSubmitting(false);
            setModal(null);
        }, 800);
    };

    return (
        <div>
            <PageHeader title="Appointments" buttonText="Request Appointment" onButtonClick={() => setModal('request')} />
            
            <div className="space-y-8">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Upcoming</h2>
                    <div className="space-y-4">
                        {sortedAppointments.upcoming.length > 0 ? sortedAppointments.upcoming.map(appt => (
                             <div key={appt.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleOpenDetails(appt)}>
                                 <div className="flex flex-col sm:flex-row justify-between">
                                     <div className="flex items-center space-x-4">
                                         <div className="flex flex-col items-center justify-center bg-primary-50 text-primary-700 rounded-lg p-3 w-20 text-center">
                                             <span className="text-sm font-bold uppercase">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short' })}</span>
                                             <span className="text-2xl font-extrabold">{new Date(appt.date).getUTCDate()}</span>
                                         </div>
                                         <div>
                                             <p className="font-bold text-lg text-gray-800">{appt.reason}</p>
                                             <p className="text-sm text-gray-600">with {appt.providerName}</p>
                                             <div className="flex items-center text-sm text-gray-500 mt-1">
                                                 <ClockIcon className="w-4 h-4 mr-1.5"/> {appt.time} ({appt.duration} min) <span className="mx-2">|</span> {appt.type === 'Virtual' ? <VideoCameraIcon className="w-4 h-4 mr-1.5"/> : <CalendarIcon className="w-4 h-4 mr-1.5"/>} {appt.type}
                                             </div>
                                         </div>
                                     </div>
                                     <div className="flex items-center justify-end mt-3 sm:mt-0">
                                         <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                                     </div>
                                 </div>
                             </div>
                        )) : <p className="text-gray-500">You have no upcoming appointments.</p>}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-bold mb-4">Past</h2>
                     <div className="space-y-4">
                        {sortedAppointments.past.length > 0 ? sortedAppointments.past.map(appt => (
                             <div key={appt.id} className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleOpenDetails(appt)}>
                                 <p className="font-bold text-lg">{appt.providerName} - {new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                                 <p className="text-sm">{appt.reason}</p>
                                 <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                             </div>
                        )) : <p className="text-gray-500">You have no past appointments.</p>}
                    </div>
                </Card>
            </div>

            {/* --- MODALS --- */}
            <Modal isOpen={modal === 'details'} onClose={() => setModal(null)} title="Appointment Details">
                 {selectedAppointment && <div className="space-y-4">
                    <p><strong>Provider:</strong> {selectedAppointment.providerName}</p>
                    <p><strong>Date & Time:</strong> {new Date(selectedAppointment.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedAppointment.time}</p>
                    <p><strong>Duration:</strong> {selectedAppointment.duration} minutes</p>
                    <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                    {selectedAppointment.status === 'Completed' && !selectedAppointment.visitSummary && <button onClick={() => setModal('feedback')} className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg mt-4">Submit Feedback</button>}
                    {selectedAppointment.status === 'Confirmed' && <button onClick={() => setModal('cancel')} className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-lg mt-4">Cancel Appointment</button>}
                </div>}
            </Modal>
            
            <Modal isOpen={modal === 'cancel'} onClose={() => setModal('details')} title="Confirm Cancellation" footer={<>
                    <button onClick={() => setModal('details')} className="bg-gray-200 font-bold py-2 px-4 rounded-lg">Go Back</button>
                    <button onClick={handleConfirmCancel} disabled={isSubmitting} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-36">
                        {isSubmitting ? <SpinnerIcon/> : 'Yes, Cancel'}
                    </button>
                </>}>
                <p>Are you sure you want to cancel your appointment with <strong>{selectedAppointment?.providerName}</strong> on {new Date(selectedAppointment?.date || '').toLocaleDateString('en-US', { timeZone: 'UTC' })}?</p>
            </Modal>

            <Modal isOpen={modal === 'feedback'} onClose={() => setModal(null)} title="Submit Feedback">
                <Formik initialValues={{ summary: ''}} onSubmit={handleFeedbackSubmit}>
                   {({ isSubmitting }) => ( <Form>
                        <Field as="textarea" name="summary" rows={4} className="w-full p-2 border rounded" placeholder="How was your visit?"/>
                        <div className="flex justify-end mt-4"><button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-36">{isSubmitting ? <SpinnerIcon/> : 'Submit Feedback'}</button></div>
                    </Form>)}
                </Formik>
            </Modal>

            <Modal isOpen={modal === 'request'} onClose={() => setModal(null)} title="Request New Appointment">
                 <Formik
                    initialValues={{ providerName: '', date: '', time: '', reason: '', type: 'Virtual', duration: 15 }}
                    validationSchema={AppointmentRequestSchema}
                    onSubmit={(values, { setSubmitting, setFieldError }) => {
                        const success = addAppointment(values as Omit<Appointment, 'id' | 'status' | 'patientName'>);
                        if (success) {
                            showToast('Appointment requested successfully!', 'success');
                            setSubmitting(false);
                            setModal(null);
                        } else {
                            setFieldError('time', 'This time slot is already booked. Please choose another time.');
                            setSubmitting(false);
                        }
                    }}
                >
                   {({ isSubmitting, errors, touched, values }) => (<Form className="space-y-4">
                       <Field as="select" name="providerName" className={`w-full p-2 border rounded bg-white ${errors.providerName && touched.providerName ? 'border-red-500' : 'border-gray-300'}`}>
                           <option value="">Select a Provider</option>
                           {availableProviders.map(provider => (
                               <option key={provider.id} value={provider.name}>
                                   {provider.name} ({provider.specialty})
                               </option>
                           ))}
                       </Field> <ErrorMessage name="providerName" component="p" className="text-red-500 text-xs"/>
                       <div className="grid grid-cols-2 gap-4">
                        <div>
                           <Field type="date" name="date" className={`w-full p-2 border rounded ${errors.date && touched.date ? 'border-red-500' : 'border-gray-300'}`} />
                           <ErrorMessage name="date" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>
                        <div>
                           <Field type="time" name="time" className={`w-full p-2 border rounded ${errors.time && touched.time ? 'border-red-500' : 'border-gray-300'}`} />
                           <ErrorMessage name="time" component="p" className="text-red-500 text-xs mt-1"/>
                        </div>
                       </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <div role="group" aria-labelledby="duration-group" className="flex space-x-2">
                                <label className={`flex-1 text-center p-2 border rounded-md cursor-pointer ${values.duration === 15 ? 'bg-primary-100 border-primary-500' : 'bg-white'}`}><Field type="radio" name="duration" value={15} className="sr-only"/> 15 min</label>
                                <label className={`flex-1 text-center p-2 border rounded-md cursor-pointer ${values.duration === 30 ? 'bg-primary-100 border-primary-500' : 'bg-white'}`}><Field type="radio" name="duration" value={30} className="sr-only"/> 30 min</label>
                                <label className={`flex-1 text-center p-2 border rounded-md cursor-pointer ${values.duration === 60 ? 'bg-primary-100 border-primary-500' : 'bg-white'}`}><Field type="radio" name="duration" value={60} className="sr-only"/> 60 min</label>
                            </div>
                            {values.duration === 30 && <p className="text-xs text-amber-600 mt-1 text-center">+ Additional Fee Applies</p>}
                        </div>
                       <Field as="textarea" name="reason" placeholder="Reason for visit" className={`w-full p-2 border rounded ${errors.reason && touched.reason ? 'border-red-500' : 'border-gray-300'}`} />
                       <ErrorMessage name="reason" component="p" className="text-red-500 text-xs"/>
                       <div className="flex justify-end pt-4 border-t"><button type="submit" disabled={isSubmitting} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-lg w-40 flex items-center justify-center">{isSubmitting ? <SpinnerIcon/> : 'Request Appointment'}</button></div>
                   </Form>)}
                </Formik>
            </Modal>
        </div>
    );
};

export default PatientAppointments;