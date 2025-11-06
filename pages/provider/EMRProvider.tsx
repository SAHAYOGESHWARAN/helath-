import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useEMRIntegration } from '../../hooks/useEMRIntegration';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import UniqueLoader from '../../components/shared/UniqueLoader';
import Link from 'next/link';
import { useRouter } from 'next/router';

const EMRPatient: React.FC = () => {
  const { users } = useAuth();
  const emr = useEMRIntegration();
  const router = useRouter();
  const patientId = (router?.query?.id as string) || (users && users.find((u:any)=>u.role==='PATIENT')?.id);

  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);
  const [sharedWith, setSharedWith] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(()=> {
      setRecords([
        { id: 'e1', type: 'Encounter', date: new Date().toISOString(), title: 'Annual Visit', details: 'Vitals normal. Follow up in 1 year.' },
        { id: 'l1', type: 'Lab', date: new Date(Date.now()-1000*60*60*24*7).toISOString(), title: 'CBC', details: 'All values within range.' },
        { id: 'm1', type: 'Medication', date: new Date(Date.now()-1000*60*60*24*30).toISOString(), title: 'Atorvastatin', details: '20mg daily' }
      ]);
      setSharedWith(['Dr. Alice', 'Family: +1-555-0100']);
      setLoading(false);
    }, 300);
  }, [patientId, emr]);

  const requestAmendment = async (recordId: string) => {
    await emr.requestAmendment?.(patientId, recordId).catch(()=>{});
    alert('Amendment requested for record ' + recordId);
  };

  const downloadCCD = async () => {
    alert('Downloading CCD (mock)');
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader title="My Health Record" subtitle="View your synced EMR records and manage sharing & corrections." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Record Actions</h3>
          <div className="mt-3 space-y-2">
            <button onClick={downloadCCD} className="block w-full p-2 bg-gray-100 rounded">Download CCD / Export</button>
            <button onClick={()=>alert('Requesting data access (mock)')} className="block w-full p-2 bg-gray-100 rounded">Request Data Access</button>
            <Link href="/patient/privacy" className="block p-2 bg-gray-100 rounded">Manage Sharing</Link>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold">Shared With</h3>
          <div className="mt-3 text-sm text-gray-600">
            {sharedWith.map((s, i) => <div key={i} className="flex justify-between py-1 border-b">{s}<button onClick={()=>setSharedWith(prev=>prev.filter(x=>x!==s))} className="text-xs text-red-600">Revoke</button></div>)}
            {sharedWith.length === 0 && <div className="text-sm text-gray-500">No active shares</div>}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold">Sync Status</h3>
          <div className="mt-3">
            <div className="text-sm text-gray-600">Last sync: {records[0] ? new Date(records[0].date).toLocaleString() : 'N/A'}</div>
            <div className="mt-2 text-sm">Source: Connected EMR</div>
          </div>
        </Card>
      </div>

      <Card title="Timeline">
        {loading ? <UniqueLoader /> : (
          <div className="space-y-4">
            {records.map(r => (
              <div key={r.id} className="flex justify-between items-start border p-3 rounded">
                <div>
                  <div className="text-sm font-semibold">{r.title} <span className="text-xs text-gray-500">({r.type})</span></div>
                  <div className="text-xs text-gray-500">{new Date(r.date).toLocaleString()}</div>
                  <div className="mt-2 text-sm text-gray-700">{r.details}</div>
                </div>
                <div className="text-right">
                  <button onClick={()=>requestAmendment(r.id)} className="text-sm px-2 py-1 bg-gray-100 rounded mb-2">Request Amendment</button>
                  <button onClick={()=>alert('Viewing details (mock)')} className="text-sm px-2 py-1 bg-primary-600 text-white rounded">View</button>
                </div>
              </div>
            ))}
            {records.length === 0 && <div className="text-sm text-gray-500">No records available</div>}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EMRPatient;