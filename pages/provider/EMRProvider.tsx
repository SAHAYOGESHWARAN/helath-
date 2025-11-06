import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePatientData } from '../../hooks/usePatientData';
import Card from '../../components/shared/Card';
import PageHeader from '../../components/shared/PageHeader';
import UniqueLoader from '../../components/shared/UniqueLoader';
import RealtimeVitals from '../../components/shared/RealtimeVitals';
import AmendmentRequestForm from '../../components/shared/AmendmentRequestForm';

const EMRProvider: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [amendingRecord, setAmendingRecord] = useState<{ id: string; type: string } | null>(null);

  if (!patientId) {
    return (
      <div>
        <PageHeader title="No Patient Selected" />
        <Card>
          <p>Please select a patient to view their EMR.</p>
        </Card>
      </div>
    );
  }

  const {
    patientData,
    appointments,
    prescriptions,
    labResults,
    vitals,
    loading,
    error,
    emrState,
    refetch,
  } = usePatientData(patientId);

  const timelineRecords = React.useMemo(() => {
    const allRecords = [
      ...(appointments || []).map(a => ({ id: a.id, type: 'Appointment', date: a.date, title: a.reason, details: a.visitSummary || 'No summary.' })),
      ...(prescriptions || []).map(p => ({ id: p.id, type: 'Medication', date: p.date, title: `${p.name} ${p.dosage}`, details: `Status: ${p.status}` })),
      ...(labResults || []).map(l => ({ id: l.id, type: 'Lab Result', date: l.date, title: l.testName, details: `Result: ${l.value} ${l.units}` })),
      ...(vitals || []).map(v => ({ id: v.id, type: 'Vitals', date: v.date, title: 'Vitals Recorded', details: `BP: ${v.bloodPressure}, HR: ${v.heartRate}` })),
    ];
    return allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments, prescriptions, labResults, vitals]);

  const requestAmendment = (recordId: string, recordType: string) => {
    setAmendingRecord({ id: recordId, type: recordType });
  };

  const downloadCCD = async () => {
    alert('Downloading CCD (mock)');
  };

  return (
    <div className="animate-fade-in-up">
      <PageHeader title={`${patientData?.name || 'Patient'}'s Health Record`} subtitle="View synced EMR records and manage sharing & corrections." />

      {error && <Card className="bg-red-100 text-red-700 p-4 mb-6">{error}</Card>}

      {patientId && <RealtimeVitals patientId={patientId} />}

      {amendingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <AmendmentRequestForm
              patientId={patientId!}
              recordId={amendingRecord.id}
              recordType={amendingRecord.type}
            />
            <button
              onClick={() => setAmendingRecord(null)}
              className="mt-4 w-full text-center p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Record Actions</h3>
          <div className="mt-3 space-y-2">
            <button onClick={downloadCCD} className="block w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200">Download CCD / Export</button>
            <button onClick={refetch} className="block w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200">Refresh Data</button>
            <Link to="/provider/settings" className="block p-2 bg-gray-100 rounded hover:bg-gray-200">Manage Sharing</Link>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold">Shared With</h3>
          <div className="mt-3 text-sm text-gray-600">
            <div className="flex justify-between py-1 border-b">Dr. Alice <button className="text-xs text-red-600">Revoke</button></div>
            <div className="text-sm text-gray-500 mt-2">No other active shares</div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold">Sync Status</h3>
          <div className="mt-3">
            <div className="text-sm text-gray-600">
              Last sync: {emrState.lastSyncTime ? new Date(emrState.lastSyncTime).toLocaleString() : 'N/A'}
            </div>
            <div className={`mt-2 text-sm font-semibold ${emrState.isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {emrState.isConnected ? 'Connected' : 'Disconnected'}
            </div>
            {emrState.isSyncing && <div className="text-sm text-blue-500 mt-1">Syncing...</div>}
          </div>
        </Card>
      </div>

      <Card title="Timeline">
        {loading && !timelineRecords.length ? <UniqueLoader /> : (
          <div className="space-y-4">
            {timelineRecords.length === 0 && !loading && <div className="text-sm text-gray-500">No records available</div>}
            {timelineRecords.map(r => (
              <div key={`${r.type}-${r.id}`} className="flex justify-between items-start border p-3 rounded-lg shadow-sm bg-white">
                <div>
                  <div className="text-sm font-semibold">{r.title} <span className="text-xs text-gray-500">({r.type})</span></div>
                  <div className="text-xs text-gray-500">{new Date(r.date).toLocaleString()}</div>
                  <div className="mt-2 text-sm text-gray-700">{r.details}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <button onClick={() => requestAmendment(r.id, r.type)} className="text-sm px-2 py-1 bg-gray-100 rounded mb-2 hover:bg-gray-200 w-full text-center">Request Amendment</button>
                  <button onClick={() => alert('Viewing details (mock)')} className="text-sm px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 w-full text-center">View</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default EMRProvider;