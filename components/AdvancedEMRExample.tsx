/**
 * Advanced EMR Example Components - Real-world Usage Patterns
 */

import React, { useState, useEffect } from 'react';
import {
  EMRProvider,
  useEMR,
  usePatient,
  useAppointments,
  usePrescriptions,
  useVitals,
  useSyncState,
  useOfflineMode,
  useSearch,
  useAlerts,
} from '../hooks/useAdvancedEMR';

// ============================================================================
// PATIENT DASHBOARD COMPONENT
// ============================================================================

export function PatientDashboard({ patientId }: { patientId: string }) {
  const { patient, loading, error, refetch } = usePatient(patientId);
  const { appointments } = useAppointments({ patientId });
  const { prescriptions } = usePrescriptions(patientId);
  const { vitals } = useVitals(patientId);
  const syncState = useSyncState();
  const { isOffline, pendingChanges } = useOfflineMode();

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {patient?.firstName} {patient?.lastName}
            </h1>
            <p className="text-gray-600">ID: {patientId}</p>
          </div>
          <div>
            {isOffline && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded">
                ⚠️ Offline Mode ({pendingChanges} pending)
              </div>
            )}
            <p className="text-sm text-gray-600">
              Last synced: {syncState?.lastSyncTime ? new Date(syncState.lastSyncTime).toLocaleString() : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Patient Info */}
      <PatientInfoCard patient={patient} />

      {/* Appointments */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
        <AppointmentsList appointments={appointments} />
      </section>

      {/* Prescriptions */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Active Prescriptions</h2>
        <PrescriptionsList prescriptions={prescriptions} />
      </section>

      {/* Vitals */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Vital Signs</h2>
        <VitalsList vitals={vitals} />
      </section>

      {/* Refresh Button */}
      <button
        onClick={refetch}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Refresh Data
      </button>
    </div>
  );
}

// ============================================================================
// APPOINTMENT BOOKING COMPONENT
// ============================================================================

interface AppointmentSlot {
  id: string;
  time: string;
}

interface AppointmentResponse {
  success: boolean;
  data?: AppointmentSlot[];
}

export function AppointmentBooking() {
  const { services } = useEMR();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProvider && selectedDate) {
      setLoading(true);
      services.scheduling
        .findAvailableSlots({
          providerId: selectedProvider,
          date: selectedDate,
          duration: 30
        })
        .then((response: AppointmentResponse) => {
          if (response.success) {
            setAvailableSlots(response.data || []);
          }
          setLoading(false);
        });
    }
  }, [selectedProvider, selectedDate, services.scheduling]);

  const handleBook = async (slot: AppointmentSlot) => {
    try {
      const response = await services.scheduling.bookAppointment({
        providerId: selectedProvider,
        date: selectedDate,
        time: slot.time,
        reason: 'General Checkup'
      });

      if (response.success) {
        alert('Appointment booked successfully!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Booking failed: ${errorMessage}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>

      <div className="space-y-4">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Provider</label>
          <input
            type="text"
            placeholder="Provider ID"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Available Slots */}
        {loading ? (
          <p>Loading available slots...</p>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">Available Times</label>
            <div className="grid grid-cols-4 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleBook(slot)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded"
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

export function PatientSearch() {
  const { query, results, search } = useSearch();
  const [input, setInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search(input);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Patient Search</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search patients..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Found {results.length} results for "{query}"
          </p>
          <ul className="space-y-2">
            {results.map((result) => (
              <li key={result.id} className="p-3 border rounded hover:bg-gray-50">
                <p className="font-medium">{result.name}</p>
                <p className="text-sm text-gray-600">{result.email}</p>
                <p className="text-sm text-gray-600">ID: {result.id}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ANALYTICS DASHBOARD COMPONENT
// ============================================================================

export function AnalyticsDashboard() {
  const { services } = useEMR();
  const [analytics, setAnalytics] = useState({
    demographics: null,
    appointments: null,
    medications: null,
    readmissions: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [demo, apts, meds, readmit] = await Promise.all([
          services.analytics.getPatientDemographics(),
          services.analytics.getAppointmentAnalytics(),
          services.analytics.getMedicationUsageAnalytics(),
          services.analytics.getReadmissionRates(),
        ]);

        setAnalytics({
          demographics: demo.success ? demo.data : null,
          appointments: apts.success ? apts.data : null,
          medications: meds.success ? meds.data : null,
          readmissions: readmit.success ? readmit.data : null,
        });
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [services.analytics]);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Demographics</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(analytics.demographics, null, 2)}
        </pre>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Appointment Analytics</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(analytics.appointments, null, 2)}
        </pre>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Medication Usage</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(analytics.medications, null, 2)}
        </pre>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Readmission Rates</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
          {JSON.stringify(analytics.readmissions, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// ALERTS COMPONENT
// ============================================================================

export function AlertsPanel() {
  const { alerts, acknowledgeAlert } = useAlerts();

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No active alerts</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Active Alerts ({alerts.length})</h2>
      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={`p-3 rounded border-l-4 ${
              alert.priority === 'CRITICAL'
                ? 'bg-red-100 border-red-500'
                : alert.priority === 'HIGH'
                ? 'bg-orange-100 border-orange-500'
                : 'bg-yellow-100 border-yellow-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{alert.message}</p>
                <p className="text-sm text-gray-600">{alert.patientId}</p>
              </div>
              <button
                onClick={() => acknowledgeAlert(alert.id)}
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Acknowledge
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

interface PatientInfoType {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
}

function PatientInfoCard({ patient }: { patient: PatientInfoType }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">Patient Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium">{patient?.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Phone</p>
          <p className="font-medium">{patient?.phone}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date of Birth</p>
          <p className="font-medium">{patient?.dateOfBirth}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Gender</p>
          <p className="font-medium">{patient?.gender}</p>
        </div>
      </div>
    </div>
  );
}

interface AppointmentType {
  id: string;
  reason: string;
  date: string;
  time: string;
  providerId: string;
}

function AppointmentsList({ appointments }: { appointments: AppointmentType[] }) {
  if (!appointments || appointments.length === 0) {
    return <p className="text-gray-600">No upcoming appointments</p>;
  }

  return (
    <ul className="space-y-2">
      {appointments.map((apt: AppointmentType) => (
        <li key={apt.id} className="p-3 border rounded">
          <p className="font-medium">{apt.reason}</p>
          <p className="text-sm text-gray-600">
            {new Date(apt.date).toLocaleDateString()} at {apt.time}
          </p>
          <p className="text-sm text-gray-600">Provider: {apt.providerId}</p>
        </li>
      ))}
    </ul>
  );
}

interface PrescriptionType {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  expiryDate: string;
}

function PrescriptionsList({ prescriptions }: { prescriptions: PrescriptionType[] }) {
  if (!prescriptions || prescriptions.length === 0) {
    return <p className="text-gray-600">No active prescriptions</p>;
  }

  return (
    <ul className="space-y-2">
      {prescriptions.map((rx: PrescriptionType) => (
        <li key={rx.id} className="p-3 border rounded">
          <p className="font-medium">{rx.medication}</p>
          <p className="text-sm text-gray-600">{rx.dosage} - {rx.frequency}</p>
          <p className="text-sm text-gray-600">Expires: {rx.expiryDate}</p>
        </li>
      ))}
    </ul>
  );
}

interface VitalType {
  id: string;
  type: string;
  value: string;
  timestamp: string;
}

function VitalsList({ vitals }: { vitals: VitalType[] }) {
  if (!vitals || vitals.length === 0) {
    return <p className="text-gray-600">No vital records</p>;
  }

  return (
    <ul className="space-y-2">
      {vitals.slice(0, 5).map((vital: VitalType) => (
        <li key={vital.id} className="p-3 border rounded">
          <p className="font-medium">{vital.type}</p>
          <p className="text-sm text-gray-600">Value: {vital.value}</p>
          <p className="text-sm text-gray-600">{new Date(vital.timestamp).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

export function AdvancedEMRApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [patientId] = useState('patient-123');

  return (
    <EMRProvider
      baseUrl="https://api.emr.local/api/v1"
      apiKey=""
      enableAutoSync={true}
      autoSyncInterval={30000}
      enableOfflineMode={true}
    >
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Advanced EMR System</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded ${activeTab === 'dashboard' ? 'bg-blue-700' : ''}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`px-4 py-2 rounded ${activeTab === 'appointments' ? 'bg-blue-700' : ''}`}
              >
                Appointments
              </button>
              <button
                onClick={() => setActiveTab('search')}
                className={`px-4 py-2 rounded ${activeTab === 'search' ? 'bg-blue-700' : ''}`}
              >
                Search
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded ${activeTab === 'analytics' ? 'bg-blue-700' : ''}`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-4 py-2 rounded ${activeTab === 'alerts' ? 'bg-blue-700' : ''}`}
              >
                Alerts
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-6xl mx-auto p-6">
          {activeTab === 'dashboard' && <PatientDashboard patientId={patientId} />}
          {activeTab === 'appointments' && <AppointmentBooking />}
          {activeTab === 'search' && <PatientSearch />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'alerts' && <AlertsPanel />}
        </main>
      </div>
    </EMRProvider>
  );
}

export default AdvancedEMRApp;
