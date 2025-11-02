import React, { useMemo } from 'react';
import { jsPDF } from 'jspdf';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { Appointment } from '../../types';
import { ChevronDownIcon, DownloadIcon } from '../../components/shared/Icons';

const VisitHistory: React.FC = () => {
    const { user, appointments } = useAuth();

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
    
    const handleDownloadPdf = (appt: Appointment) => {
        const doc = new jsPDF();
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Visit Summary', 20, 20);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Patient: ${user?.name}`, 20, 35);
        doc.text(`Provider: ${appt.providerName}`, 20, 42);
        doc.text(`Date of Visit: ${new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 49);

        doc.setLineWidth(0.5);
        doc.line(20, 55, 190, 55);

        doc.setFont('helvetica', 'bold');
        doc.text('Reason for Visit:', 20, 65);
        doc.setFont('helvetica', 'normal');
        const reasonLines = doc.splitTextToSize(appt.reason, 170);
        doc.text(reasonLines, 20, 72);
        
        const reasonHeight = doc.getTextDimensions(reasonLines).h;
        let currentY = 72 + reasonHeight + 10;

        doc.setFont('helvetica', 'bold');
        doc.text('Summary & Notes:', 20, currentY);
        currentY += 7;
        doc.setFont('helvetica', 'normal');
        const summaryLines = doc.splitTextToSize(appt.visitSummary || 'No summary available.', 170);
        doc.text(summaryLines, 20, currentY);

        doc.save(`Visit_Summary_${appt.date}.pdf`);
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
                            <details key={appt.id} className="group border border-gray-200 rounded-lg bg-white transition-shadow hover:shadow-md">
                                <summary className="p-4 flex justify-between items-center cursor-pointer list-none">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                                        <p className="font-bold text-lg text-gray-800">{new Date(appt.date).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <div className="text-sm text-gray-600">
                                            <p>with {appt.providerName}</p>
                                            <p className="sm:hidden mt-1">Reason: {appt.reason}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusPill(appt.status)}`}>{appt.status}</span>
                                        <ChevronDownIcon className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
                                    </div>
                                </summary>
                                <div className="px-4 pb-4 border-t border-gray-200">
                                    <div className="mt-4 space-y-4 text-sm">
                                         <div>
                                            <p className="font-medium text-gray-500">Reason for Visit</p>
                                            <p className="font-semibold">{appt.reason}</p>
                                        </div>
                                        {appt.visitSummary ? (
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="font-medium text-gray-500">Visit Summary & Notes</p>
                                                    <button 
                                                        onClick={() => handleDownloadPdf(appt)} 
                                                        className="flex items-center text-xs font-medium text-primary-600 hover:text-primary-800"
                                                    >
                                                        <DownloadIcon className="w-4 h-4 mr-1" />
                                                        Download PDF
                                                    </button>
                                                </div>
                                                <p className="text-gray-700 bg-gray-50 p-3 rounded-md border">{appt.visitSummary}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">No summary was provided for this visit.</p>
                                        )}
                                    </div>
                                </div>
                            </details>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">You have no past appointments.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default VisitHistory;