# EMR API Integration Guide

## Overview

The EMR (Electronic Medical Records) API integration provides a secure, scalable, and modular way to connect the healthcare application with the EMR system. This architecture enables real-time data synchronization, supports FHIR standards, and provides enterprise-grade security through API key authentication.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Healthcare Application                      │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  React Hooks  │  │  Components  │  │   Services   │  │
│  │  (useEMR)    │  │              │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                 │          │
│         └─────────────────┴─────────────────┘          │
│                        │                               │
│         ┌──────────────▼──────────────┐               │
│         │  EMR Integration Service    │               │
│         │  - Real-time sync           │               │
│         │  - Data transformation      │               │
│         │  - Error recovery           │               │
│         └──────────────┬──────────────┘               │
└─────────────────────────┼───────────────────────────────┘
                          │
                          │ HTTPS + API Key Auth
                          │
┌─────────────────────────▼───────────────────────────────┐
│              EMR API Layer                              │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  RESTful     │  │  FHIR        │  │  Security    │ │
│  │  Endpoints   │  │  Endpoints    │  │  Middleware   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐ │
│  │  EMR Database                                     │ │
│  │  - Patient Records                                │ │
│  │  - Appointments                                    │ │
│  │  - Prescriptions                                  │ │
│  │  - Lab Results                                    │ │
│  └──────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Features

### 1. **Secure Authentication**

- API key-based authentication
- Secure key storage and rotation
- Request signing and validation

### 2. **Real-time Synchronization**

- Automatic data sync at configurable intervals
- Manual sync on demand
- Bidirectional data flow (read/write)

### 3. **RESTful API**

- Standard HTTP methods (GET, POST, PATCH, DELETE)
- Consistent response format
- Comprehensive error handling

### 4. **FHIR Compatibility**

- FHIR R4 compliant endpoints
- Resource transformation
- Future-ready for HL7 integration

### 5. **Error Handling & Recovery**

- Automatic retry with exponential backoff
- Request caching
- Offline capability support

## Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```env
# EMR API Configuration
VITE_EMR_API_URL=https://emr-api.example.com/api/v1
VITE_EMR_API_KEY=your-secure-api-key-here

# Optional: API Key from environment (for server-side)
EMR_API_KEY=your-server-side-api-key
```

Tip: A minimal `.env.example` is included at the project root. Copy it to `.env` and fill in your values.

### 2. Install Dependencies

All dependencies are already included. The EMR API client uses native browser APIs.

### 3. Initialize in Your Application

```typescript
import { getEMRAPIClient } from './services/emrApiClient';
import APIKeyManager from './services/apiKeyManager';

// Set API key
APIKeyManager.setActiveAPIKey('your-api-key', {
  name: 'Production Key',
  environment: 'production',
  permissions: ['read', 'write'],
});

// Initialize client
const emrClient = getEMRAPIClient({
  baseUrl: process.env.VITE_EMR_API_URL,
  apiKey: APIKeyManager.getAPIKey(),
});
```

## Usage

### React Hook (Recommended)

```typescript
import { useEMRIntegration } from '../hooks/useEMRIntegration';

function PatientDashboard() {
  const { user } = useAuth();
  const {
    state,
    syncPatientData,
    syncAppointments,
    syncAll,
    startAutoSync,
    stopAutoSync,
    isAutoSyncActive,
  } = useEMRIntegration();

  // Manual sync
  const handleSync = async () => {
    await syncAll(user?.id);
  };

  // Auto-sync every 60 seconds
  useEffect(() => {
    if (user?.id) {
      startAutoSync(60000);
      return () => stopAutoSync();
    }
  }, [user?.id, startAutoSync, stopAutoSync]);

  return (
    <div>
      <button onClick={handleSync} disabled={state.isSyncing}>
        {state.isSyncing ? 'Syncing...' : 'Sync Data'}
      </button>
      {state.error && <p>Error: {state.error}</p>}
      {state.lastSyncTime && (
        <p>Last synced: {state.lastSyncTime.toLocaleString()}
      )}
    </div>
  );
}
```

### Direct API Client

```typescript
import { getEMRAPIClient } from './services/emrApiClient';

const emrClient = getEMRAPIClient();

// Get patient data
const patientResponse = await emrClient.getPatient('patient-id');
if (patientResponse.success) {
  console.log('Patient:', patientResponse.data);
}

// Get appointments
const appointmentsResponse = await emrClient.getAppointments({
  patientId: 'patient-id',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
});

// Create appointment
const newAppointment = await emrClient.createAppointment({
  patientId: 'patient-id',
  providerId: 'provider-id',
  date: '2024-12-01',
  time: '10:00 AM',
  reason: 'Annual Checkup',
  location: 'Clinic',
  status: 'Pending',
  duration: 30,
});
```

### Integration Service

```typescript
import { getEMRIntegrationService } from './services/emrIntegrationService';

const integrationService = getEMRIntegrationService();

// Sync all patient data
const syncResult = await integrationService.syncAllPatientData('patient-id');

// Start auto-sync
integrationService.startAutoSync('patient-id', 60000); // Every 60 seconds

// Push local changes
await integrationService.pushAppointment({
  patientId: 'patient-id',
  providerId: 'provider-id',
  date: '2024-12-01',
  // ... other fields
});
```

## API Endpoints

### Patient Records

- `GET /api/v1/patients/{id}` - Get patient by ID
- `GET /api/v1/patients?name={name}&email={email}` - Search patients
- `PATCH /api/v1/patients/{id}` - Update patient

### Appointments

- `GET /api/v1/appointments?patientId={id}` - Get appointments
- `GET /api/v1/appointments/{id}` - Get appointment by ID
- `POST /api/v1/appointments` - Create appointment
- `PATCH /api/v1/appointments/{id}` - Update appointment

### Prescriptions

- `GET /api/v1/prescriptions?patientId={id}` - Get prescriptions
- `GET /api/v1/prescriptions/{id}` - Get prescription by ID
- `POST /api/v1/prescriptions` - Create prescription
- `PATCH /api/v1/prescriptions/{id}` - Update prescription

### Lab Results

- `GET /api/v1/lab-results?patientId={id}` - Get lab results
- `GET /api/v1/lab-results/{id}` - Get lab result by ID
- `POST /api/v1/lab-results` - Create lab result

### Vitals

- `GET /api/v1/vitals?patientId={id}` - Get vitals
- `POST /api/v1/patients/{id}/vitals` - Create vital record

### FHIR Endpoints

- `GET /api/v1/fhir/Patient/{id}` - FHIR Patient resource
- `GET /api/v1/fhir/Appointment?patient={id}` - FHIR Appointments
- `GET /api/v1/fhir/MedicationStatement?patient={id}` - FHIR Medications
- `GET /api/v1/fhir/Observation?patient={id}&category=laboratory` - FHIR Lab Results

## Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId?: string;
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "id": "patient-123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "timestamp": "2024-11-02T12:00:00Z",
  "requestId": "req_1234567890_abc123"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "PATIENT_NOT_FOUND",
    "message": "Patient with ID 'patient-123' not found",
    "details": {
      "patientId": "patient-123"
    }
  },
  "timestamp": "2024-11-02T12:00:00Z",
  "requestId": "req_1234567890_abc123"
}
```

## Security Best Practices

1. **API Key Management**

   - Never commit API keys to version control
   - Use environment variables for keys
   - Rotate keys regularly
   - Use different keys for different environments

2. **Request Security**

   - Always use HTTPS
   - Validate all input data
   - Implement rate limiting
   - Log all API requests

3. **Data Protection**
   - Encrypt sensitive data in transit
   - Follow HIPAA compliance guidelines
   - Implement proper access controls
   - Audit all data access

## Error Handling

The API client includes automatic retry logic with exponential backoff:

```typescript
// Automatic retries (default: 3 attempts)
const response = await emrClient.getPatient('patient-id');

if (!response.success) {
  console.error('Error:', response.error?.code, response.error?.message);
  // Handle error appropriately
}
```

## Caching

The API client includes built-in caching (5-minute TTL by default):

```typescript
// First call - fetches from API
const response1 = await emrClient.getPatient('patient-id');

// Second call within 5 minutes - returns cached data
const response2 = await emrClient.getPatient('patient-id');

// Clear cache
emrClient.clearCache();
```

## Testing

```typescript
// Health check
const isHealthy = await emrClient.healthCheck();
console.log('EMR API is healthy:', isHealthy);

// Test connection
const integrationService = getEMRIntegrationService();
const isConnected = await integrationService.checkEMRHealth();
```

## Troubleshooting

### Common Issues

1. **API Key Not Working**

   - Verify key is correct in environment variables
   - Check key hasn't expired
   - Ensure key has proper permissions

2. **Connection Timeout**

   - Check network connectivity
   - Verify EMR API URL is correct
   - Increase timeout in configuration

3. **Data Not Syncing**
   - Check if auto-sync is enabled
   - Verify patient ID is correct
   - Check error messages in console

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Batch operations support
- [ ] Advanced filtering and search
- [ ] GraphQL endpoint
- [ ] Webhook support for event notifications
- [ ] Multi-tenant support
- [ ] Advanced analytics and reporting

## Support

For issues or questions:

- Check the API documentation
- Review error logs
- Contact the EMR API team
