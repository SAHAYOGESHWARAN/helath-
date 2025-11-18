# Advanced EMR System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Environment Setup

Create `.env` file in project root:

```env
VITE_EMR_API_URL=https://api.emr.example.com/api/v1
VITE_EMR_API_KEY=your-api-key-here
EMR_ENCRYPTION_KEY=your-master-key-here
EMR_AUTO_SYNC_INTERVAL=30000
EMR_ENABLE_OFFLINE_MODE=true
```

### Step 2: Wrap Your App with Provider

```typescript
import { EMRProvider } from './hooks/useAdvancedEMR';

function App() {
  return (
    <EMRProvider
      baseUrl={import.meta.env.VITE_EMR_API_URL}
      apiKey={import.meta.env.VITE_EMR_API_KEY}
      enableAutoSync={true}
      autoSyncInterval={30000}
      enableOfflineMode={true}
    >
      <YourAppComponents />
    </EMRProvider>
  );
}
```

### Step 3: Use in Components

```typescript
import {
  usePatient,
  useAppointments,
  usePrescriptions,
  useSyncState,
} from './hooks/useAdvancedEMR';

function PatientView({ patientId }) {
  // Get patient data with auto-refresh
  const { patient, loading, error, updatePatient } = usePatient(patientId);

  // Get appointments
  const { appointments, bookAppointment, rescheduleAppointment } =
    useAppointments();

  // Get prescriptions
  const { prescriptions, refillPrescription } = usePrescriptions(patientId);

  // Monitor sync state
  const syncState = useSyncState();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>
        {patient.firstName} {patient.lastName}
      </h1>
      <p>Appointments: {appointments.length}</p>
      <p>Prescriptions: {prescriptions.length}</p>
      <p>Last synced: {syncState?.lastSyncTime}</p>

      <button onClick={() => updatePatient({ verified: true })}>
        Mark Verified
      </button>
    </div>
  );
}
```

### Step 4: Access All Services

```typescript
import { useEMR } from './hooks/useAdvancedEMR';

function AnalyticsPage() {
  const { services } = useEMR();

  // Access all service groups
  const searchResults = await services.search.fullTextSearch('diabetes');
  const analytics = await services.analytics.getPatientDemographics();
  const report = await services.reporting.generatePatientReport('p-123');
  const workflows = await services.workflows.getWorkflows();
  const alerts = await services.notifications.getAlerts();
  const compliance = await services.compliance.checkHIPAACompliance(fields);

  // ... use in your UI
}
```

---

## 📚 Key Services Overview

### 1. **Patient Service**

```typescript
const { patient, loading, error, refetch, updatePatient } =
  usePatient('patient-id');
```

- Get/create/update patient records
- Access patient timeline, summary, history
- Bulk operations with batch API

### 2. **Appointment Service**

```typescript
const {
  appointments,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
} = useAppointments();
```

- Book, reschedule, cancel appointments
- Check available slots
- Appointment analytics

### 3. **Prescription Service**

```typescript
const { prescriptions, refillPrescription, checkInteractions } =
  usePrescriptions(patientId);
```

- Manage prescriptions
- Check drug interactions
- Get dosage recommendations

### 4. **Vitals Service**

```typescript
const { vitals, recordVital, getTrends } = useVitals(patientId);
```

- Record vital signs
- Track vital trends
- Analyze patterns

### 5. **Search Service**

```typescript
const { query, results, search } = useSearch();
```

- Full-text search
- Advanced filtering
- Semantic search

### 6. **Analytics Service**

```typescript
const { data, loading } = useAnalytics('metric-name');
```

- Patient demographics
- Disease trends
- Quality metrics
- Financial analysis

### 7. **Workflow Service**

```typescript
await services.workflows.executeWorkflow(workflowId, context);
```

- Create/execute workflows
- Task assignment
- Workflow automation

### 8. **Security Service**

```typescript
const encrypted = await securityService.encryptData(data);
await securityService.logAuditTrail(userId, action, resource);
```

- Data encryption
- Access control
- Audit logging
- HIPAA/GDPR compliance

### 9. **Real-Time Service**

```typescript
await client.connectWebSocket();
client.subscribeToEvents('event:PATIENT_UPDATE', (event) => {});
```

- WebSocket connections
- Real-time events
- Change notifications

### 10. **Sync Engine**

```typescript
await syncEngine.startAutoSync(30000);
syncEngine.trackLocalChange('Patient', id, data, 'UPDATE');
```

- Offline support
- Conflict resolution
- Change tracking

---

## 🎯 Common Use Cases

### Display Patient Dashboard

```typescript
function PatientDashboard({ patientId }) {
  const { patient } = usePatient(patientId);
  const { appointments } = useAppointments({ patientId });
  const { prescriptions } = usePrescriptions(patientId);
  const { vitals } = useVitals(patientId);

  return (
    <div>
      <PatientInfo patient={patient} />
      <AppointmentsList appointments={appointments} />
      <PrescriptionsList prescriptions={prescriptions} />
      <VitalsList vitals={vitals} />
    </div>
  );
}
```

### Book an Appointment

```typescript
async function bookAppointment() {
  const { appointments, bookAppointment } = useAppointments();

  const result = await bookAppointment({
    patientId: 'p-123',
    providerId: 'prov-456',
    date: '2024-12-15',
    time: '10:00 AM',
    reason: 'Annual Checkup',
  });

  if (result.success) {
    alert('Appointment booked!');
  }
}
```

### Check Drug Interactions

```typescript
async function checkInteractions() {
  const { checkInteractions } = usePrescriptions(patientId);

  const result = await checkInteractions([
    'metformin',
    'lisinopril',
    'aspirin',
  ]);

  // Display interactions to doctor
}
```

### Generate Analytics Report

```typescript
async function generateReport() {
  const { services } = useEMR();

  const report = await services.reporting.generatePatientReport('p-123');
  const download = await services.reporting.downloadReport(report.id, 'PDF');

  // Download or email report
}
```

### Monitor Sync State

```typescript
function SyncIndicator() {
  const syncState = useSyncState();
  const { isOffline, pendingChanges } = useOfflineMode();

  return (
    <div>
      <p>Offline: {isOffline ? 'Yes' : 'No'}</p>
      <p>Pending Changes: {pendingChanges}</p>
      <p>Last Sync: {syncState?.lastSyncTime}</p>
    </div>
  );
}
```

### Access Real-Time Events

```typescript
function RealtimeUpdates() {
  const { client } = useEMR();

  useEffect(() => {
    // Connect to WebSocket
    client.connectWebSocket();

    // Subscribe to patient updates
    const unsubscribe = client.subscribeToEvents(
      'event:PATIENT_UPDATE',
      (event) => {
        console.log('Patient updated:', event);
        // Update UI
      }
    );

    return () => {
      unsubscribe();
      client.disconnectWebSocket();
    };
  }, [client]);

  return <div>Listening for updates...</div>;
}
```

---

## 🔧 Configuration Options

### EMR Provider Props

```typescript
interface EMRProviderProps {
  baseUrl?: string; // EMR API URL
  apiKey?: string; // API authentication key
  enableAutoSync?: boolean; // Auto-sync enabled (default: true)
  autoSyncInterval?: number; // Sync interval in ms (default: 30000)
  enableOfflineMode?: boolean; // Offline support (default: true)
  children: React.ReactNode;
}
```

### EMR Client Config

```typescript
const client = new AdvancedEMRClient('https://api.emr.com/api/v1', 'api-key', {
  cacheTTL: 5 * 60 * 1000, // Cache for 5 minutes
  retryAttempts: 3, // Retry 3 times
  retryDelay: 1000, // 1 second retry delay
  batchSize: 20, // Process 20 items per batch
  requestTimeout: 30000, // 30 second timeout
});
```

### Sync Engine Config

```typescript
const syncEngine = new RealTimeSyncEngine(client, {
  enableAutoSync: true,
  autoSyncInterval: 30000,
  enableWebSocket: true,
  enableOfflineMode: true,
  conflictResolutionStrategy: 'MERGE',
  maxSyncRetries: 3,
  compressionEnabled: false,
});
```

---

## 📊 API Examples

### Get Patient with Details

```typescript
const { data } = await client.getPatient('p-123');
// Returns: { id, firstName, lastName, email, phone, ... }
```

### Search Patients

```typescript
const { data } = await client.getPatients({
  search: 'diabetes',
  filter: { age: { min: 40, max: 65 } },
  sort: [{ field: 'lastName', direction: 'ASC' }],
  pagination: { page: 1, limit: 10 },
});
// Returns: Array of matching patients
```

### Get Appointment Availability

```typescript
const { data } = await client.getAvailableSlots('prov-123', '2024-12-15');
// Returns: [{ id, time, duration, available: true }, ...]
```

### Create Appointment

```typescript
const { data } = await client.createAppointment({
  patientId: 'p-123',
  providerId: 'prov-456',
  date: '2024-12-15',
  time: '10:00 AM',
  reason: 'Checkup',
});
// Returns: { id, patientId, providerId, date, time, ... }
```

### Check Drug Interactions

```typescript
const { data } = await client.checkDrugInteractions([
  'metformin',
  'lisinopril',
]);
// Returns: [{ drugs: [...], severity: 'HIGH', description: '...' }, ...]
```

### Get Lab Results with Trends

```typescript
const { data: labs } = await client.getLabResults('p-123');
const { data: trends } = await client.getVitalTrends('p-123', 'blood_pressure');
```

### Execute Workflow

```typescript
const { data } = await services.workflows.executeWorkflow(
  'workflow-id',
  { patientId: 'p-123', context: {...} }
);
// Returns: { workflowId, executionId, status, steps: [...] }
```

---

## ⚙️ Advanced Features

### Batch Operations

```typescript
const batchId = await client.createBatchOperation([
  { method: 'GET', endpoint: '/patients/p1' },
  { method: 'GET', endpoint: '/patients/p2' },
  { method: 'POST', endpoint: '/appointments', data: {...} },
]);

const status = await client.getBatchStatus(batchId);
// Process multiple operations efficiently
```

### Real-Time Sync

```typescript
const syncEngine = new RealTimeSyncEngine(client);

// Auto-sync every 30 seconds
await syncEngine.startAutoSync(30000);

// Track local changes
syncEngine.trackLocalChange('Patient', 'p-123', { name: 'John' }, 'UPDATE');

// Listen to sync state
syncEngine.onStateChange((state) => {
  console.log('Sync state:', state);
});

// Offline mode - changes sync when back online
```

### Data Encryption

```typescript
const securityService = new AdvancedSecurityService(masterKey);

const encrypted = await securityService.encryptData(sensitiveData);
const decrypted = await securityService.decryptData(encrypted);

// Add audit trail
await securityService.logAuditTrail(userId, 'VIEW_PATIENT', 'Patient', 'p-123');
```

---

## 🐛 Troubleshooting

### Data Not Syncing

```typescript
// Check sync state
const state = syncEngine.getState();
console.log('Offline:', state.offlineMode);
console.log('Pending:', state.pendingChanges);

// Force sync
await syncEngine.syncNow();

// Check errors
console.log('Errors:', state.syncErrors);
```

### WebSocket Connection Failed

```typescript
// Check if WebSocket is connected
try {
  await client.connectWebSocket();
} catch (error) {
  console.error('WebSocket error:', error);
}

// Monitor connection events
client.subscribeToEvents('ws-connected', () => {
  console.log('Connected!');
});

client.subscribeToEvents('ws-error', (error) => {
  console.error('WebSocket error:', error);
});
```

### Cache Issues

```typescript
// Clear all cache
client.clearCache();

// Clear specific pattern
client.clearCache('Patient:.*');

// Bypass cache for single request
await client.getPatient('p-123', undefined, { bypassCache: true });
```

---

## 📚 Documentation Files

- **ADVANCED_EMR_SETUP.md** - Comprehensive setup guide
- **EMR_1000_FEATURES_LIST.md** - Complete feature list (1000+)
- **EMR_API_INTEGRATION.md** - API integration guide
- **README_EMR_API.md** - EMR API documentation

---

## 🎓 Next Steps

1. ✅ Review [ADVANCED_EMR_SETUP.md](./ADVANCED_EMR_SETUP.md) for detailed setup
2. ✅ Check [EMR_1000_FEATURES_LIST.md](./EMR_1000_FEATURES_LIST.md) for all features
3. ✅ Explore example components in `components/AdvancedEMRExample.tsx`
4. ✅ Review hooks in `hooks/useAdvancedEMR.ts`
5. ✅ Configure your `.env` file
6. ✅ Start building!

---

## 💡 Pro Tips

1. **Use TypeScript** for better IDE support and type safety
2. **Enable auto-sync** for real-time data updates
3. **Use batch operations** for better performance
4. **Monitor sync state** for offline-aware UX
5. **Implement error boundaries** for better error handling
6. **Use React.memo** to prevent unnecessary re-renders
7. **Cache sensitive queries** to improve performance
8. **Enable encryption** for sensitive patient data

---

## 📞 Support

For issues or questions:

1. Check the documentation files
2. Review example components
3. Check API responses for error details
4. Enable logging for debugging
5. Contact support team

---

**Status**: Production Ready ✅
**Version**: 1.0.0 Advanced
**Last Updated**: November 18, 2024
