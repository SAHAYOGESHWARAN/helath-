import React, { useMemo, useCallback } from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { CurrencyDollarIcon, ExclamationTriangleIcon } from '../../components/shared/Icons';
import { useAuth } from '../../hooks/useAuth';
import { useTable } from '../../hooks/useTable';
import PaginationControls from '../../components/shared/PaginationControls';
import { Table, ColumnDefinition } from '../../components/shared/Table';
import { BillingInvoice } from '../../types';

const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || rows.length === 0) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
        keys.join(separator) +
        '\n' +
        rows.map(row => {
            return keys.map(k => {
                let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
                cell = String(cell).replace(/"/g, '""');
                if (String(cell).includes(separator) || String(cell).includes('\n')) {
                    cell = `"${cell}"`;
                }
                return cell;
            }).join(separator);
        }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


const Billing: React.FC = () => {
    const { invoices, users } = useAuth();

    const { revenueThisMonth, totalRevenue, failedTransactions } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        let monthRevenue = 0;
        let ytdRevenue = 0;

        invoices.forEach(inv => {
            if (inv.status === 'Paid') {
                const invDate = new Date(inv.date);
                if (invDate.getFullYear() === currentYear) {
                    ytdRevenue += inv.totalAmount;
                    if (invDate.getMonth() === currentMonth) {
                        monthRevenue += inv.totalAmount;
                    }
                }
            }
        });

        return {
            revenueThisMonth: monthRevenue,
            totalRevenue: ytdRevenue,
            failedTransactions: invoices.filter(i => i.status === 'Overdue').length,
        };
    }, [invoices]);

    const transactions = useMemo(() => {
        return [...invoices].map(inv => {
            const user = users.find(u => u.id === inv.patientId);
            return {
                id: inv.id,
                date: inv.date,
                user: user?.name || 'Unknown User',
                type: 'Subscription / Co-pay', // Mocked type
                amount: inv.totalAmount,
                status: inv.status,
            };
        });
    }, [invoices, users]);

    const { paginatedItems, paginationProps, requestSort, getSortArrow } = useTable(transactions, 10, {
        initialSort: { key: 'date', direction: 'desc' },
    });
    
    const handleExport = useCallback(() => {
        exportToCsv('billing_transactions.csv', transactions);
    }, [transactions]);
    
    const columns: ColumnDefinition<typeof transactions[0]>[] = [
        { accessorKey: 'id', header: 'Transaction ID', cellClassName: 'font-mono' },
        { accessorKey: 'date', header: 'Date' },
        { accessorKey: 'user', header: 'User' },
        { accessorKey: 'type', header: 'Type' },
        { accessorKey: 'amount', header: 'Amount', cell: (row) => `$${row.amount.toFixed(2)}` },
        { accessorKey: 'status', header: 'Status', cell: (row) => (
            <span className={`px-2 py-1 text-xs rounded-full ${row.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {row.status}
            </span>
        )},
    ];


    return (
        <div>
            <PageHeader title="Platform Billing" subtitle="Manage and track all financial transactions." />
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="flex items-center p-4">
                    <div className="p-3 bg-emerald-100 rounded-full mr-4"><CurrencyDollarIcon className="w-6 h-6 text-emerald-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">${revenueThisMonth.toLocaleString()}</p><p className="text-gray-500">Revenue (This Month)</p></div>
                </Card>
                <Card className="flex items-center p-4">
                     <div className="p-3 bg-blue-100 rounded-full mr-4"><CurrencyDollarIcon className="w-6 h-6 text-blue-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</p><p className="text-gray-500">Total Revenue (YTD)</p></div>
                </Card>
                <Card className="flex items-center p-4">
                     <div className="p-3 bg-red-100 rounded-full mr-4"><ExclamationTriangleIcon className="w-6 h-6 text-red-600" /></div>
                    <div><p className="text-3xl font-bold text-gray-800">{failedTransactions}</p><p className="text-gray-500">Failed/Overdue</p></div>
                </Card>
            </div>

            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    <button onClick={handleExport} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Export CSV</button>
                </div>
                 <Table<typeof transactions[0]>
                    columns={columns}
                    data={paginatedItems}
                    requestSort={requestSort}
                    getSortArrow={getSortArrow}
                />
                <PaginationControls {...paginationProps} />
            </Card>
        </div>
    );
};

export default Billing;