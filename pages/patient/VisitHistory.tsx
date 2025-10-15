
import React, { useMemo, useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { Appointment } from '../../types';
import Modal from '../../components/shared/Modal';

const VisitHistory: React.FC = () => {
    const { appointments } = useAuth();
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const pastAppointments = useMemo(() => {
        return [...appointments]
            .filter(a => a.status === 'Completed' || a.status === 'Cancelled')
            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [appointments]);

    const getStatusPill = (status: Appointment['status']) => {
        switch (status) {
          case 'Completed': return 'bg-emerald-100 text-emerald-800';
          case 'Cancelled': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <PageHeader 
                title="Visit History"
                subtitle="A record of your past appointments and consultations."
            />

            <Card>
                <div className="space-y-4">
                    {pastAppointments.length > 0 ? (
                        pastAppointments.map(appt => (
                            <div 
                                key={appt.id} 
                                className="p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedAppointment(appt)}
                            >
                                <div className="flex flex-col sm:flex-row justify-between">
                                    <div>
                                        <p className="font-bold text-lg text-gray-800">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p className="text-sm text-gray-600">with {appt.providerName}</p>
                                        <p className="text-sm text-gray-500 mt-1">Reason: {appt.reason}</p>
                                    </div>
                                    <div className="flex items-center justify-end mt-3 sm:mt-0">
                                         <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                                     </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">You have no past appointments.</p>
                    )}
                </div>
            </Card>

            <Modal
                isOpen={!!selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                title="Visit Summary"
            >
                {selectedAppointment && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Date</p>
                            <p className="font-semibold">{new Date(selectedAppointment.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                         <div>
                            <p className="text-sm font-medium text-gray-500">Provider</p>
                            <p className="font-semibold">{selectedAppointment.providerName}</p>
                        </div>
                        {selectedAppointment.visitSummary ? (
                             <div>
                                <p className="text-sm font-medium text-gray-500">Summary & Notes</p>
                                <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md border">{selectedAppointment.visitSummary}</p>
                            </div>
                        ) : (
                            <p className="text-gray-600">No summary was provided for this visit.</p>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VisitHistory;
