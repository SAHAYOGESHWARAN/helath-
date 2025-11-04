# Clinical Workflow & Laboratory Integration Guide

## Overview

This document describes the comprehensive clinical workflow system that integrates appointment scheduling, clinical notes, e-prescribing, payment processing, and third-party laboratory integrations into a seamless end-to-end system.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Clinical Workflow System                      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Appointments │  │ Clinical     │  │ E-Prescribing│    │
│  │              │  │ Notes        │  │              │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                 │                 │             │
│         └─────────────────┴─────────────────┘             │
│                        │                                   │
│         ┌──────────────▼──────────────┐                   │
│         │  Clinical Workflow Service  │                   │
│         │  - Visit Management         │                   │
│         │  - Workflow Orchestration   │                   │
│         └──────────────┬──────────────┘                   │
│                        │                                   │
│         ┌──────────────▼──────────────┐                   │
│         │  Patient Record Service      │                   │
│         │  - Consolidated Records     │                   │
│         │  - Timeline View             │                   │
│         └──────────────┬──────────────┘                   │
└────────────────────────┼───────────────────────────────────┘
                         │
┌────────────────────────┼───────────────────────────────────┐
│                        │                                   │
│         ┌──────────────▼──────────────┐                   │
│         │  Laboratory Integration      │                   │
│         │  - Third-party Lab APIs      │                   │
│         │  - Automated Imports         │                   │
│         │  - Data Mapping              │                   │
│         └──────────────┬──────────────┘                   │
│                        │                                   │
│         ┌──────────────▼──────────────┐                   │
│         │  EMR API                     │                   │
│         └──────────────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## Features

### 1. Clinical Workflow

The clinical workflow service manages the complete patient visit lifecycle:

1. **Appointment Scheduling** → Patient scheduled
2. **Check-In** → Patient arrives and checks in
3. **In Progress** → Provider sees patient
4. **Clinical Note** → Provider documents visit
5. **E-Prescribing** → Prescriptions sent electronically
6. **Lab Orders** → Lab tests ordered if needed
7. **Billing** → Invoice created
8. **Payment** → Patient pays (without insurance)
9. **Visit Completed** → Workflow complete

### 2. Patient Record Consolidation

Each patient has a comprehensive digital file that includes:

- **Demographics**: Name, contact info, DOB, address
- **Clinical Data**: Conditions, allergies, medications, surgeries
- **Visit History**: All appointments, notes, prescriptions
- **Lab Results**: All laboratory tests and results
- **Vitals**: Blood pressure, heart rate, weight, BMI
- **Communication**: Messages with providers
- **Summary**: Statistics and key metrics

### 3. Laboratory Integration

Third-party laboratory integration provides:

- **Automated Result Imports**: Results automatically imported from labs
- **Structured Data Mapping**: Transform lab formats to internal structure
- **Result Tracking**: Track lab orders and results
- **Provider Management**: Register multiple lab providers
- **Polling Support**: Automatic polling for new results

### 4. Payment Processing

Secure payment processing (without insurance/claims):

- Multiple payment methods (credit card, debit, cash, check, online)
- Invoice generation
- Payment tracking
- Transaction logging

## Usage

### Clinical Workflow

```typescript
import { useClinicalWorkflow } from '../hooks/useClinicalWorkflow';

function VisitManagement({ appointmentId }: { appointmentId: string }) {
  const {
    workflow,
    workflowStatus,
    isLoading,
    startVisit,
    checkIn,
    createNote,
    addPrescription,
    createInvoice,
    processPayment,
    completeVisit,
  } = useClinicalWorkflow(appointmentId);

  // Start visit
  const handleStartVisit = async () => {
    await startVisit(appointmentId);
  };

  // Check in patient
  const handleCheckIn = async () => {
    await checkIn(appointmentId);
  };

  // Create progress note
  const handleCreateNote = async () => {
    await createNote(appointmentId, {
      patientId: workflow?.appointment.patientId || '',
      patientName: workflow?.appointment.patientName || '',
      providerId: workflow?.appointment.providerId || '',
      status: 'Draft',
      content: {
        subjective: 'Patient reports...',
        objective: 'Physical exam shows...',
        assessment: 'Diagnosis...',
        plan: 'Treatment plan...',
      },
    });
  };

  // Add prescription
  const handleAddPrescription = async () => {
    await addPrescription(appointmentId, {
      patientId: workflow?.appointment.patientId || '',
      patientName: workflow?.appointment.patientName || '',
      drug: 'Amoxicillin 500mg',
      dosage: '1 tablet',
      frequency: 'Three times daily',
      quantity: 21,
      refills: 1,
      pharmacy: 'CVS Pharmacy',
      notes: 'Take with food',
    });
  };

  // Process payment
  const handlePayment = async () => {
    await processPayment(appointmentId, {
      amount: 150.00,
      method: 'credit_card',
    });
  };

  // Complete visit
  const handleComplete = async () => {
    await completeVisit(appointmentId);
  };

  return (
    <div>
      <h2>Visit Workflow</h2>
      {workflowStatus && (
        <div>
          <p>Current Step: {workflowStatus.currentStep}</p>
          <p>Completed: {workflowStatus.completedSteps.join(', ')}</p>
        </div>
      )}
      {/* Workflow controls */}
    </div>
  );
}
```

### Patient Record

```typescript
import { getPatientRecordService } from '../services/patientRecordService';

const patientRecordService = getPatientRecordService();

// Get comprehensive patient record
const recordResponse = await patientRecordService.getConsolidatedRecord('patient-id');

if (recordResponse.success && recordResponse.data) {
  const record = recordResponse.data;
  console.log('Patient:', record.patient.name);
  console.log('Total Visits:', record.summary.totalVisits);
  console.log('Active Medications:', record.summary.activeMedicationsCount);
  console.log('Next Appointment:', record.summary.nextAppointment);
}

// Get timeline view
const timelineResponse = await patientRecordService.getTimeline('patient-id');
if (timelineResponse.success && timelineResponse.data) {
  timelineResponse.data.forEach(event => {
    console.log(`${event.date}: ${event.title} - ${event.description}`);
  });
}
```

### Laboratory Integration

```typescript
import { getLaboratoryIntegrationService } from '../services/laboratoryIntegration';

const labService = getLaboratoryIntegrationService();

// Register a lab provider
labService.registerProvider({
  id: 'labcorp',
  name: 'LabCorp',
  apiUrl: 'https://api.labcorp.com/v1',
  apiKey: 'your-api-key',
  autoImport: true,
  pollingInterval: 60000, // Poll every 60 seconds
  mappingRules: {
    patientIdField: 'patientId',
    testNameField: 'testName',
    resultDateField: 'resultDate',
    componentMapping: {
      name: 'componentName',
      value: 'value',
      unit: 'unit',
      referenceRange: 'referenceRange',
      flag: 'flag',
    },
  },
});

// Manually import results
const thirdPartyResults = [
  {
    patientId: 'patient-123',
    accessionNumber: 'ACC-001',
    collectionDate: '2024-11-01',
    resultDate: '2024-11-02',
    testName: 'Complete Blood Count',
    results: [
      {
        componentName: 'White Blood Count',
        value: 7.2,
        unit: '10^3/μL',
        referenceRange: '4.0-11.0',
        flag: 'N',
      },
      {
        componentName: 'Hemoglobin',
        value: 14.5,
        unit: 'g/dL',
        referenceRange: '12.0-16.0',
        flag: 'N',
      },
    ],
    status: 'Final',
    labName: 'LabCorp',
  },
];

const importResult = await labService.importLabResults('labcorp', thirdPartyResults);
console.log(`Imported: ${importResult.imported}, Failed: ${importResult.failed}`);
```

## Data Structures

### Consolidated Patient Record

```typescript
interface ConsolidatedPatientRecord {
  patient: User;
  demographics: {
    name: string;
    email: string;
    phone?: string;
    dob?: string;
    address?: string;
    state?: string;
  };
  clinicalData: {
    conditions: MedicalCondition[];
    allergies: Allergy[];
    medications: Medication[];
    surgeries: Surgery[];
    immunizations: Immunization[];
    familyHistory: FamilyHistory[];
    lifestyle: Lifestyle | null;
    healthGoals: HealthGoal[];
  };
  visitHistory: {
    appointments: Appointment[];
    progressNotes: ProgressNote[];
    prescriptions: Prescription[];
    labResults: LabResult[];
    labOrders: LabOrder[];
    vitals: VitalsRecord[];
  };
  summary: {
    totalVisits: number;
    totalPrescriptions: number;
    totalLabResults: number;
    lastVisitDate: string | null;
    nextAppointment: Appointment | null;
    activeMedicationsCount: number;
    pendingLabResults: number;
  };
}
```

### Visit Workflow

```typescript
interface VisitWorkflow {
  appointment: Appointment;
  progressNote?: ProgressNote;
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  invoice?: BillingInvoice;
  paymentStatus: 'pending' | 'partial' | 'paid';
}
```

## Workflow Steps

1. **SCHEDULED** - Appointment is scheduled
2. **CHECKED_IN** - Patient has checked in
3. **IN_PROGRESS** - Provider is seeing patient
4. **NOTE_COMPLETED** - Clinical note has been created
5. **PRESCRIPTIONS_SENT** - Prescriptions have been sent
6. **LAB_ORDERS_PLACED** - Lab orders have been placed
7. **BILLING_COMPLETED** - Invoice has been created
8. **VISIT_COMPLETED** - Visit workflow is complete

## Payment Processing

The system supports payment processing without insurance/claims:

- **Payment Methods**: Credit card, debit card, cash, check, online
- **Invoice Generation**: Automatic invoice creation
- **Payment Tracking**: Track partial and full payments
- **Transaction Logging**: Secure transaction recording

## Laboratory Integration Providers

### Supported Features

- Multiple lab provider support
- Customizable data mapping rules
- Automatic result polling
- Result validation and normalization
- Lab order status tracking

### Adding a New Lab Provider

1. Register provider with mapping rules
2. Configure API credentials
3. Set up polling interval (if auto-import)
4. Test import functionality

## Best Practices

1. **Workflow Management**
   - Always start visit workflow before seeing patient
   - Complete all steps in order
   - Verify data before completing visit

2. **Patient Records**
   - Use consolidated records for comprehensive view
   - Clear cache when data is updated
   - Use timeline view for chronological overview

3. **Laboratory Integration**
   - Validate mapping rules before production
   - Monitor import failures
   - Set appropriate polling intervals

4. **Payment Processing**
   - Always create invoice before payment
   - Verify payment amount matches invoice
   - Log all transactions securely

## Future Enhancements

- [ ] Insurance integration (when ready)
- [ ] Claims processing
- [ ] Advanced analytics
- [ ] Mobile app support
- [ ] Telemedicine integration
- [ ] Patient portal features

## Support

For questions or issues:
- Check service logs
- Review error messages
- Consult API documentation
- Contact development team

