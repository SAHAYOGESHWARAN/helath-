import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { DownloadIcon } from '../../components/shared/Icons';
import PageHeader from '../../components/shared/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { ComplianceLog } from '../../types';

const actionTypes = [
    'Login Success', 'Login Failed', 'Logout',
    'View Patient Chart', 'Update Settings', 
    'E-Prescription Sent', 'Payment Submitted', 
    'Data Export', 'Registration', 'User Created'
];

type SortableKeys = keyof ComplianceLog;

const ITEMS_PER_PAGE = 10;

const Compliance: React.FC = () => {
  const { complianceLogs } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: SortableKeys; direction: 'asc' | 'desc' } | null>({ key: 'timestamp', direction: 'desc' });

  const filteredLogs = useMemo(() => {
    return complianceLogs.filter(log => {
      const logDate = new Date(log.timestamp);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      if(startDate) startDate.setHours(0,0,0,0);
      if(endDate) endDate.setHours(23,59,59,999);

      const matchesAction = actionFilter === 'All' || log.action === actionFilter;
      const matchesSearch = searchTerm === '' ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = (!startDate || logDate >= startDate) && (!endDate || logDate <= endDate);

      return matchesAction && matchesSearch && matchesDate;
    });
  }, [searchTerm, actionFilter, dateRange, complianceLogs]);

  const sortedLogs = useMemo(() => {
    let sortableItems = [...filteredLogs];
    if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }
    return sortableItems;
  }, [filteredLogs, sortConfig]);

  const totalPages = Math.ceil(sortedLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = sortedLogs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const requestSort = (key: SortableKeys) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key: SortableKeys) => {
    if (!sortConfig || sortConfig.key !== key) return ' ';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const handleClear = () => {
    setSearchTerm('');
    setActionFilter('All');
    setDateRange({ start: '', end: '' });
    setCurrentPage(1);
  };
  
  const handleExport = () => {
        const headers = ["Timestamp", "User", "Role", "Action", "Details"];
        const csvContent = [
            headers.join(','),
            ...sortedLogs.map(log => [log.timestamp, log.user, log.userRole, log.action, `"${log.details.replace(/"/g, '""')}"`].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'audit_log_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  };

  const isFiltered = searchTerm !== '' || actionFilter !== 'All' || dateRange.start || dateRange.end;

  return (
    <div>
      <PageHeader title="Compliance & Auditing" />
      <Card title="Audit Log">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full">
                <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md"
                >
                    <option value="All">All Actions</option>
                    {actionTypes.map(action => (<option key={action} value={action}>{action}</option>))}
                </select>
                <input type="date" value={dateRange.start} onChange={e => setDateRange(d => ({...d, start: e.target.value}))} className="px-3 py-2 border border-gray-300 rounded-md" />
                <input type="date" value={dateRange.end} onChange={e => setDateRange(d => ({...d, end: e.target.value}))} className="px-3 py-2 border border-gray-300 rounded-md" />
                
                {isFiltered && (
                    <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Clear
                    </button>
                )}
            </div>
            <button onClick={handleExport} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg text-sm w-full sm:w-auto flex items-center justify-center gap-2">
                <DownloadIcon className="w-4 h-4" />
                <span>Export Log</span>
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th onClick={() => requestSort('timestamp')} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Timestamp<span className="text-gray-400">{getSortArrow('timestamp')}</span></th>
                <th onClick={() => requestSort('user')} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">User<span className="text-gray-400">{getSortArrow('user')}</span></th>
                <th onClick={() => requestSort('action')} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">Action<span className="text-gray-400">{getSortArrow('action')}</span></th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.user} <span className="text-xs text-gray-500">({log.userRole})</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {log.action}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        No logs found matching your criteria.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
                Showing {paginatedLogs.length} of {sortedLogs.length} results
            </span>
            <div className="flex space-x-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium border rounded-md disabled:opacity-50">Previous</button>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 text-sm font-medium border rounded-md disabled:opacity-50">Next</button>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default Compliance;