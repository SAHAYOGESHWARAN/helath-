import React, { useState } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { Referral, ReferralStatus } from '../../types';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';

const getReferralStatusPill = (status: ReferralStatus) => {
    const baseClasses = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
        case 'Pending': return `${baseClasses} bg-yellow-100 text-yellow-800`;
        case 'Sent': return `${baseClasses} bg-emerald-100 text-emerald-800`;
        case 'Completed': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'Cancelled': return `${baseClasses} bg-red-100 text-red-800`;
        default: return `${baseClasses} bg-gray-100 text-gray-800`;
    }
};

const Referrals: React.FC = () => {
    const { referrals } = useAuth();
    
    const { paginatedItems, paginationProps, setColumnFilters, getSortArrow, requestSort } = useTable<Referral>(
        referrals, 
        10, 
        { 
            initialSort: { key: 'createdAt', direction: 'desc' },
            dateRangeFilterKey: 'createdAt',
        }
    );
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setColumnFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div>
            <PageHeader title="Referrals" buttonText="New Referral" onButtonClick={() => {}} />
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase align-top">
                                    <div onClick={() => requestSort('patientName')} className="flex items-center cursor-pointer mb-1"><span>Patient</span>{getSortArrow('patientName')}</div>
                                    <input name="patientName" onChange={handleFilterChange} className="w-full text-sm p-1 border rounded bg-white" placeholder="Filter..." onClick={e => e.stopPropagation()}/>
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase align-top">
                                    <div onClick={() => requestSort('referredTo')} className="flex items-center cursor-pointer mb-1"><span>Referred To</span>{getSortArrow('referredTo')}</div>
                                    <input name="referredTo" onChange={handleFilterChange} className="w-full text-sm p-1 border rounded bg-white" placeholder="Filter..." onClick={e => e.stopPropagation()}/>
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase align-top">
                                    <div onClick={() => requestSort('createdAt')} className="flex items-center cursor-pointer mb-1"><span>Date</span>{getSortArrow('createdAt')}</div>
                                     <div className="flex items-center gap-1">
                                        <input type="date" name="startDate" onChange={handleFilterChange} className="w-full text-sm p-1 border rounded bg-white" onClick={e => e.stopPropagation()} />
                                        <span className="text-gray-500">-</span>
                                        <input type="date" name="endDate" onChange={handleFilterChange} className="w-full text-sm p-1 border rounded bg-white" onClick={e => e.stopPropagation()} />
                                    </div>
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase align-top">
                                     <div onClick={() => requestSort('status')} className="flex items-center cursor-pointer mb-1"><span>Status</span>{getSortArrow('status')}</div>
                                    <select name="status" onChange={handleFilterChange} className="w-full text-sm p-1 border rounded bg-white" onClick={e => e.stopPropagation()}>
                                        <option value="">All</option>
                                        {[ReferralStatus.PENDING, ReferralStatus.SENT, ReferralStatus.COMPLETED, ReferralStatus.CANCELLED].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase align-top">
                                    <div className="mb-1">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {paginatedItems.map(referral => (
                                <tr key={referral.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{referral.patientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{referral.referredTo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(referral.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={getReferralStatusPill(referral.status)}>{referral.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="text-primary-600 hover:underline text-sm">View</button>
                                    </td>
                                </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
                 <PaginationControls {...paginationProps} />
            </Card>
        </div>
    );
};

export default Referrals;