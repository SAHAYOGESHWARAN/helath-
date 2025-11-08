import React from 'react';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/shared/Card';
import { useAuth } from '../../hooks/useAuth';
import { useTable } from '../../hooks/useTable';
import { Table, ColumnDefinition } from '../../components/shared/Table';
import PaginationControls from '../../components/shared/PaginationControls';
import { SystemAuditLog } from '../../types';

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

const Compliance: React.FC = () => {
    const { auditLog } = useAuth();

    const {
        paginatedItems,
        sortedAndFilteredItems,
        paginationProps,
        requestSort,
        getSortArrow,
        setGlobalFilter,
    } = useTable(auditLog, 10, { initialSort: { key: 'timestamp', direction: 'desc' } });

    const handleExport = () => {
        exportToCsv('compliance_audit_log.csv', sortedAndFilteredItems);
    };
    
    const columns: ColumnDefinition<SystemAuditLog>[] = [
      { accessorKey: 'timestamp', header: 'Timestamp', cellClassName: 'font-mono text-gray-600'},
      { accessorKey: 'user', header: 'User' },
      { accessorKey: 'userRole', header: 'Role' },
      { accessorKey: 'action', header: 'Action', cell: (row) => <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{row.action}</span> },
      { accessorKey: 'details', header: 'Details' },
    ];
    
    return (
        <div>
            <PageHeader title="Compliance & Auditing" subtitle="Monitor system access and data protection." />
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">System Audit Log</h3>
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            placeholder="Filter by user or action..." 
                            className="p-2 border rounded-md text-sm" 
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                        <button onClick={handleExport} className="bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg text-sm">Export Log</button>
                    </div>
                </div>
                 <Table<SystemAuditLog>
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

export default Compliance;
