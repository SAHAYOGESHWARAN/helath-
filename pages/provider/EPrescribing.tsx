
import React, { useState } from 'react';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import { Prescription } from '../../types';
import { PillIcon } from '../../components/shared/Icons';

// FIX: Added 'frequency' property and split from 'dosage' to match Prescription type.
const mockPrescriptions: Prescription[] = [
  { id: 'rx1', patientId: 'p1', patientName: 'John Doe', drug: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', quantity: 30, refills: 2, pharmacy: 'CVS Pharmacy', datePrescribed: '2024-08-01', status: 'Sent' },
  { id: 'rx2', patientId: 'p2', patientName: 'Alice Johnson', drug: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'every 4-6 hours as needed', quantity: 1, refills: 5, pharmacy: 'Walgreens', datePrescribed: '2024-07-15', status: 'Filled' },
  { id: 'rx3', patientId: 'p4', patientName: 'Charlie Brown', drug: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'every 8 hours', quantity: 21, refills: 0, pharmacy: 'Rite Aid', datePrescribed: '2024-08-10', status: 'Pending' },
];

const getStatusPill = (status: Prescription['status']) => {
    switch (status) {
        case 'Sent':
        case 'Filled':
             return 'bg-emerald-100 text-emerald-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Error':
        case 'Cancelled':
            return 'bg-red-100 text-red-800';
    }
};

const EPrescribing: React.FC = () => {
    const [prescriptions, setPrescriptions] = useState(mockPrescriptions);

    return (
        <div>
            <PageHeader title="E-Prescribing" buttonText="New Prescription" onButtonClick={() => {}} />
            <Card>
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {prescriptions.map(rx => (
                                <tr key={rx.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{rx.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{rx.drug}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rx.datePrescribed}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusPill(rx.status)}`}>{rx.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        {rx.status === 'Pending' && <a href="#" className="text-primary-600 hover:underline">Approve</a>}
                                        <a href="#" className="text-primary-600 hover:underline">Details</a>
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

export default EPrescribing;
