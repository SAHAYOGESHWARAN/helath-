import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEMRIntegration } from '../../hooks/useEMRIntegration';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import UniqueLoader from '../../components/shared/UniqueLoader';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowPathIcon as RefreshIcon, GlobeAltIcon as CloudIcon, CogIcon as PlayIcon, StopIcon } from '../../components/shared/Icons';
import { Link } from 'react-router-dom';

const EMRAdmin: React.FC = () => {
  const { users } = useAuth();
  const emr = useEMRIntegration();

  const [loading, setLoading] = useState(false);
  const [autoSync, setAutoSync] = useState<boolean>(false);
  const [logs, setLogs] = useState<Array<{ id: string; time: string; status: string; details?: string }>>([]);
  const [qualitySeries, setQualitySeries] = useState<{ date: string; score: number }[]>([]);

  useEffect(() => {
    // initial load (replace with real API calls)
    setLoading(true);
    Promise.all([
      emr.getIntegrationStatus?.() ?? Promise.resolve({ autoSync: true }),
      emr.fetchAuditLogs?.() ?? Promise.resolve([]),
    ]).then(([status, audit]: any) => {
      setAutoSync(Boolean(status?.autoSync));
      setLogs(audit.length ? audit : [
        { id: '1', time: new Date().toISOString(), status: 'Success', details: 'Initial sync' }
      ]);
      // mock quality series for chart
      const now = new Date();
      const series = [...Array(7)].map((_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - (6 - i));
        return { date: d.toISOString().slice(0,10), score: 80 + Math.round(Math.random() * 20) };
      });
      setQualitySeries(series);
    }).finally(() => setLoading(false));
  }, [emr]);

  const overall = useMemo(() => {
    const avg = qualitySeries.length ? Math.round(qualitySeries.reduce((s, p) => s + p.score, 0) / qualitySeries.length) : 0;
    return {
      connected: emr.isConnected,
      dataQuality: avg,
      syncedPatients: Math.round((users || []).filter(u => u.role === 'PATIENT').length * 0.92),
    };
  }, [qualitySeries, emr.isConnected, users]);

  const handleSyncNow = async () => {
    setLoading(true);
    try {
      await emr.syncNow?.();
      setLogs(prev => [{ id: String(Date.now()), time: new Date().toISOString(), status: 'Started', details: `Job mock` }, ...prev].slice(0,20));
      // simulate update to chart
      setQualitySeries(s => [...s.slice(1), { date: new Date().toISOString().slice(0,10), score: 85 }]);
    } catch (e) {
      setLogs(prev => [{ id: String(Date.now()), time: new Date().toISOString(), status: 'Failed', details: String(e) }, ...prev].slice(0,20));
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoSync = async () => {
    setAutoSync(v => !v);
    // persist to integration settings (replace with API)
    await emr.setIntegrationSettings?.({ autoSync: !autoSync }).catch(()=>{});
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="EMR Integration — Admin" subtitle="Monitor and control EMR synchronization, audit logs and data quality." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Connection</h3>
              <p className="text-sm text-gray-600">Status with external EMR</p>
              <p className={`mt-3 font-bold ${overall.connected ? 'text-green-600' : 'text-red-600'}`}>{overall.connected ? 'Connected' : 'Disconnected'}</p>
            </div>
            <div className="text-right">
              <button onClick={() => emr.reconnect?.()} className="inline-flex items-center px-3 py-2 bg-gray-100 rounded">
                <RefreshIcon className="w-4 h-4 mr-2" /> Reconnect
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold">Auto Sync</h3>
          <p className="text-sm text-gray-600">Enable scheduled background synchronization</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">{autoSync ? 'Active' : 'Disabled'}</div>
            <div className="flex items-center space-x-2">
              <button onClick={toggleAutoSync} className={`px-3 py-1 rounded ${autoSync ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>{autoSync ? 'Disable' : 'Enable'}</button>
              <button onClick={handleSyncNow} disabled={loading} className="px-3 py-1 rounded bg-primary-600 text-white inline-flex items-center">
                <PlayIcon className="w-4 h-4 mr-2" /> Sync Now
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold">Data Quality</h3>
          <p className="text-sm text-gray-600">Aggregate integrity score</p>
          <div className="mt-4">
            <div className="text-3xl font-bold">{overall.dataQuality}%</div>
            <div className="h-3 bg-gray-200 rounded mt-2 overflow-hidden">
              <div style={{ width: `${overall.dataQuality}%` }} className="h-full bg-gradient-to-r from-green-400 to-blue-500" />
            </div>
            <div className="mt-3 text-sm text-gray-600">Synced patients: {overall.syncedPatients}</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card title="Sync Success (last 7 days)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={qualitySeries}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Recent Audit Logs">
          <div className="space-y-3 max-h-56 overflow-auto">
            {loading ? <UniqueLoader /> : logs.map(l => (
              <div key={l.id} className="flex justify-between items-start border-b pb-2">
                <div>
                  <div className="text-sm font-medium">{l.status}</div>
                  <div className="text-xs text-gray-500">{l.time}</div>
                  {l.details && <div className="text-xs mt-1 text-gray-600">{l.details}</div>}
                </div>
                <div className="text-xs text-gray-400">#{l.id}</div>
              </div>
            ))}
            {logs.length === 0 && <div className="text-sm text-gray-500">No logs available</div>}
          </div>
          <div className="mt-3 text-right">
            <button onClick={() => setLogs([])} className="text-sm text-red-600">Clear</button>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <Card title="Provider Mappings & Settings">
          <p className="text-sm text-gray-600 mb-4">Map local providers to EMR provider records, configure webhooks and field mappings.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <h4 className="font-semibold text-sm mb-2">Mapping Preview</h4>
              <table className="w-full text-sm">
                <thead className="text-left">
                  <tr><th className="pb-2">Local</th><th className="pb-2">EMR</th></tr>
                </thead>
                <tbody>
                  {users.filter(u=>u.role==='PROVIDER').slice(0,5).map((p:any) => (
                    <tr key={p.id}><td className="py-1">{p.name}</td><td className="py-1">EMR-{p.id.slice(0,6)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm mb-2">Actions</h4>
              <div className="flex flex-col space-y-2">
                <Link to="/admin/providers" className="text-sm p-2 bg-gray-100 rounded">Manage Provider Maps</Link>
                <button className="text-sm p-2 bg-gray-100 rounded">Export Audit CSV</button>
                <button className="text-sm p-2 bg-gray-100 rounded">Test Webhook</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EMRAdmin;