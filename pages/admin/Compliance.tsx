
import React, { useState, useMemo } from 'react';
import Card from '../../components/shared/Card';
import { DownloadIcon, FilterIcon } from '../../components/shared/Icons';

const mockLogs = [
  { id: 1, timestamp: '2024-08-15 10:32:15', user: 'Dr. Jane Smith', userRole: 'Provider', action: 'Login Success', details: 'User logged in from IP 192.168.1.1' },
  { id: 2, timestamp: '2024-08-15 10:33:01', user: 'Dr. Jane Smith', userRole: 'Provider', action: 'View Patient Chart', details: 'Viewed chart for John Doe (pat1)' },
  { id: 3, timestamp: '2024-08-15 09:45:22', user: 'Alex Johnson', userRole: 'Admin', action: 'Update Settings', details: 'Updated system feature flags' },
  { id: 4, timestamp: '2024-08-15 09:10:48', user: 'John Doe', userRole: 'Patient', action: 'Login Success', details: 'User logged in from IP 203.0.113.25' },
  { id: 5, timestamp: '2024-08-14 15:20:11', user: 'Dr. Jane Smith', userRole: 'Provider', action: 'E-Prescription Sent', details: 'Sent prescription for Amoxicillin to patient Alice Johnson' },
  { id: 6, timestamp: '2024-08-14 14:05:56', user: 'Alex Johnson', userRole: 'Admin', action: 'Login Failed', details: 'Failed login attempt for user: admin_support' },
  { id: 7, timestamp: '2024-08-14 11:55:03', user: 'John Doe', userRole: 'Patient', action: 'Payment Submitted', details: 'Submitted payment of $50.00' },
  { id: 8, timestamp: '2024-08-13 18:00:00', user: 'System', userRole: 'System', action: 'Data Export', details: 'Weekly analytics data exported by automated job' },
];

const actionTypes = [...new Set(mockLogs.map(log => log.action))];

const Compliance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => {
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
  }, [searchTerm, actionFilter, dateRange]);

  const handleClear = () => {
    setSearchTerm('');
    setActionFilter('All');
    setDateRange({ start: '', end: '' });
  };

  const isFiltered = searchTerm !== '' || actionFilter !== 'All' || dateRange.start || dateRange.end;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Compliance & Auditing</h1>
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
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg text-sm w-full sm:w-auto flex items-center justify-center gap-2">
                <DownloadIcon className="w-4 h-4" />
                <span>Export Log</span>
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
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
      </Card>
    </div>
  );
};

export default Compliance;