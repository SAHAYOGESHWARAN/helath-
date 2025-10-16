import { User, UserRole, Appointment, Medication, LabResult, HealthGoal, Allergy, Surgery, FamilyHistoryEntry, ImmunizationRecord, LifestyleInfo, VitalsRecord, Claim, ProgressNote, Prescription, Referral, SubscriptionPlan, BillingInvoice, ClaimStatus, ClaimType } from './types';

// ========================================================================
// MOCK USERS
// ========================================================================
export const MOCK_USERS: User[] = [
  {
    id: 'patient-1',
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    role: UserRole.PATIENT,
    avatarUrl: `https://i.pravatar.cc/150?u=jane.doe@email.com`,
    phone: '555-123-4567',
    address: '123 Health St, Wellness City, CA 90210',
    dob: '1990-05-15',
    state: 'California',
    isVerified: true,
    status: 'Active',
    subscription: {
        planId: 'patient_basic',
        planName: 'Basic Care',
        status: 'Active',
        renewalDate: '2024-09-15',
    },
    conditions: [
      { id: 'cond1', name: 'Hypertension' },
      { id: 'cond2', name: 'Type 2 Diabetes' },
    ],
    allergies: [
        { id: 'alg1', name: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis' },
        { id: 'alg2', name: 'Peanuts', severity: 'Moderate', reaction: 'Hives and swelling' },
    ],
    surgeries: [
        { id: 'surg1', name: 'Appendectomy', date: '2015-08-20' },
    ],
    medications: [
        { id: 'med1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', status: 'Active', adherence: 95 },
        { id: 'med2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', status: 'Active', adherence: 90 },
        { id: 'med3', name: 'Amoxicillin', dosage: '250mg', frequency: 'As needed', status: 'Inactive', adherence: 100 },
    ],
    familyHistory: [
        { id: 'fh1', relation: 'Mother', condition: 'Heart Disease' },
        { id: 'fh2', relation: 'Father', condition: 'Type 2 Diabetes' },
    ],
    immunizations: [
        { id: 'im1', vaccine: 'Influenza', date: '2023-10-05' },
        { id: 'im2', vaccine: 'Tetanus (Tdap)', date: '2021-03-12' },
    ],
    vitals: [
        { id: 'vt1', date: '2024-07-20', bloodPressure: '130/85', heartRate: 72, weight: 155 },
        { id: 'vt2', date: '2024-04-15', bloodPressure: '128/82', heartRate: 75, weight: 158 },
        { id: 'vt3', date: '2024-01-10', bloodPressure: '135/88', heartRate: 78, weight: 160 },
    ],
    lifestyle: {
        diet: 'Balanced, low-sodium diet',
        exercise: '3-4 times a week (cardio and light weights)',
        smokingStatus: 'Never',
        alcoholConsumption: 'Occasional',
    },
    notificationSettings: {
        emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: true, pushAll: true,
    },
    healthGoals: [
        { id: 'hg1', title: 'Lower Blood Pressure', target: 125, current: 130, unit: 'Systolic', deadline: '2024-10-31' },
        { id: 'hg2', title: 'Weekly Steps', target: 50000, current: 35000, unit: 'steps', deadline: '2024-08-30' },
    ],
    labResults: [
        {
            id: 'lab1', testName: 'Lipid Panel', date: '2024-07-20', status: 'Final',
            components: [
                { name: 'Cholesterol, Total', value: '190 mg/dL', referenceRange: '<200', isAbnormal: false },
                { name: 'Triglycerides', value: '160 mg/dL', referenceRange: '<150', isAbnormal: true },
                { name: 'HDL Cholesterol', value: '45 mg/dL', referenceRange: '>40', isAbnormal: false },
                { name: 'LDL Cholesterol', value: '115 mg/dL', referenceRange: '<100', isAbnormal: true },
            ]
        }
    ]
  },
  {
    id: 'provider-1',
    name: 'Dr. John Smith',
    email: 'dr.smith@email.com',
    role: UserRole.PROVIDER,
    avatarUrl: 'https://i.pravatar.cc/150?u=dr.smith@email.com',
    specialty: 'General Practice',
    licenseNumber: 'GMC-12345',
    state: 'California',
    isVerified: true,
    status: 'Active',
    subscription: {
        planId: 'pro_plus',
        planName: 'Pro Plus',
        status: 'Active',
        renewalDate: '2024-09-01',
    },
  },
  {
    id: 'provider-2',
    name: 'Dr. Evelyn Reed',
    email: 'e.reed@email.com',
    role: UserRole.PROVIDER,
    avatarUrl: 'https://i.pravatar.cc/150?u=e.reed@email.com',
    specialty: 'Cardiology',
    licenseNumber: 'CARD-67890',
    state: 'California',
    isVerified: false,
    status: 'Active',
  },
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@novopath.com',
    role: UserRole.ADMIN,
    avatarUrl: 'https://i.pravatar.cc/150?u=admin@novopath.com',
    isVerified: true,
    status: 'Active',
  }
];

// ========================================================================
// MOCK APPOINTMENTS
// ========================================================================
export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'appt1', patientName: 'Jane Doe', providerName: 'Dr. John Smith', providerId: 'provider-1', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '10:00', duration: 30, reason: 'Annual Check-up', type: 'In-Person', status: 'Confirmed', checkInStatus: 'Pending' },
    { id: 'appt2', patientName: 'Jane Doe', providerName: 'Dr. John Smith', providerId: 'provider-1', date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '14:30', duration: 15, reason: 'Medication Follow-up', type: 'Virtual', status: 'Confirmed', checkInStatus: 'Pending' },
    { id: 'appt3', patientName: 'Jane Doe', providerName: 'Dr. John Smith', providerId: 'provider-1', date: '2024-07-20', time: '09:00', duration: 30, reason: 'Lab Results Review', type: 'In-Person', status: 'Completed', visitSummary: 'Reviewed recent lab results. Triglycerides and LDL are slightly elevated. Advised on dietary changes and follow-up in 3 months. Patient is agreeable to the plan.' },
    { id: 'appt4', patientName: 'Jane Doe', providerName: 'Dr. John Smith', providerId: 'provider-1', date: '2024-06-10', time: '11:00', duration: 15, reason: 'Prescription Refill', type: 'Virtual', status: 'Completed', visitSummary: 'Patient requested refill for Lisinopril. Approved for 90-day supply.' },
    { id: 'appt5', patientName: 'Someone Else', providerName: 'Dr. John Smith', providerId: 'provider-1', date: new Date().toISOString().split('T')[0], time: '13:00', duration: 30, reason: 'New Patient Visit', type: 'In-Person', status: 'Confirmed', checkInStatus: 'Checked-In' },
    { id: 'appt6', patientName: 'Another Patient', providerName: 'Dr. John Smith', providerId: 'provider-1', date: new Date().toISOString().split('T')[0], time: '13:30', duration: 15, reason: 'Sick Visit', type: 'In-Person', status: 'Confirmed', checkInStatus: 'Pending' },
    { id: 'appt7', patientName: 'A New Requester', providerName: 'Dr. John Smith', providerId: 'provider-1', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '16:00', duration: 15, reason: 'Consultation Request', type: 'Virtual', status: 'Pending' },
];

// ========================================================================
// MOCK BILLING & CLAIMS
// ========================================================================
export const MOCK_CLAIMS: Claim[] = [
    { id: 'claim_123', patientId: 'patient-1', status: ClaimStatus.PAID_IN_FULL, totalClaimChargeAmount: 250.00, serviceDate: '2024-07-20', provider: 'Dr. John Smith', patientOwes: 20.00, insurancePaid: 230.00, lineItems: [{ service: 'Office Visit, Established', charge: 150.00 }, { service: 'Lipid Panel', charge: 100.00 }] },
    { id: 'claim_456', patientId: 'patient-1', status: ClaimStatus.PAID_PARTIALLY, totalClaimChargeAmount: 75.00, serviceDate: '2024-06-10', provider: 'Dr. John Smith', patientOwes: 15.00, insurancePaid: 60.00, lineItems: [{ service: 'Telehealth Visit, 15 min', charge: 75.00 }] },
    { id: 'claim_789', patientId: 'patient-1', status: ClaimStatus.DENIED, totalClaimChargeAmount: 300.00, serviceDate: '2024-05-01', provider: 'Dr. Evelyn Reed', patientOwes: 300.00, insurancePaid: 0.00, lineItems: [{ service: 'Cardiac Stress Test', charge: 300.00 }], denialReason: 'Service not covered under current plan. Pre-authorization required.' },
];

export const MOCK_INVOICES: BillingInvoice[] = [
    { id: 'inv_1', patientId: 'patient-1', date: '2024-07-25', dueDate: '2024-08-25', totalAmount: 20.00, amountDue: 20.00, status: 'Due', description: 'Co-pay for visit on 2024-07-20' },
    { id: 'inv_2', patientId: 'patient-1', date: '2024-06-15', dueDate: '2024-07-15', totalAmount: 15.00, amountDue: 0.00, status: 'Paid', description: 'Co-pay for visit on 2024-06-10' },
];

// ========================================================================
// MOCK CLINICAL DATA
// ========================================================================
export const MOCK_PRESCRIPTIONS: Prescription[] = [
    { id: 'rx1', patientId: 'patient-1', patientName: 'Jane Doe', drug: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', quantity: 90, refills: 2, pharmacy: 'CVS Pharmacy, Wellness City', datePrescribed: '2024-07-20', status: 'Filled' },
    { id: 'rx2', patientId: 'patient-1', patientName: 'Jane Doe', drug: 'Metformin 500mg', dosage: '1 tablet', frequency: 'Twice daily', quantity: 180, refills: 2, pharmacy: 'Walgreens, Wellness City', datePrescribed: '2024-07-20', status: 'Sent' },
];

export const MOCK_PROGRESS_NOTES: ProgressNote[] = [
    { id: 'note1', patientId: 'patient-1', patientName: 'Jane Doe', date: '2024-07-20', status: 'Signed', content: { subjective: 'Patient here for lab review.', objective: 'Vitals stable. BP 130/85.', assessment: 'Hypertension, Hyperlipidemia', plan: 'Discussed diet. Continue Lisinopril. Re-check labs in 3 months.' } },
    { id: 'note2', patientId: 'patient-1', patientName: 'Jane Doe', date: '2024-06-10', status: 'Pending Signature', content: { subjective: 'Needs refill for Lisinopril.', objective: 'No new complaints.', assessment: 'Stable hypertension.', plan: 'Refilled Lisinopril 10mg for 90 days.' } },
];

export const MOCK_REFERRALS: Referral[] = [
    { id: 1, patient: 'Jane Doe', referredTo: 'Dr. Evelyn Reed (Cardiology)', date: '2024-05-01', status: 'Approved', type: 'Outgoing', reason: 'Abnormal EKG findings' },
];

// ========================================================================
// MOCK SUBSCRIPTION PLANS
// ========================================================================
export const MOCK_PATIENT_PLANS: SubscriptionPlan[] = [
  { id: 'patient_basic', name: 'Basic Care', price: '$19/mo', patientLimit: 0, features: ['Secure Messaging', 'EMR Access', 'Appointment Scheduling', '1 Video Consult Credit/yr'] },
  { id: 'patient_plus', name: 'Care Plus', price: '$49/mo', patientLimit: 0, features: ['All Basic features', '5 Video Consult Credits/yr', 'AI Health Summary', 'Priority Support'], isPopular: true },
];

export const MOCK_PROVIDER_PLANS: SubscriptionPlan[] = [
    { id: 'pro_essential', name: 'Pro Essentials', price: '$99/mo', patientLimit: 100, features: ['Up to 100 Patients', 'E-Prescribing', 'Patient Management', 'Basic Reporting'] },
    { id: 'pro_plus', name: 'Pro Plus', price: '$199/mo', patientLimit: 500, features: ['Up to 500 Patients', 'All Essentials features', 'Advanced Reporting', 'Telehealth Module', 'AI Scribe'], isPopular: true },
    { id: 'pro_enterprise', name: 'Enterprise', price: 'Contact Us', patientLimit: 0, features: ['Unlimited Patients', 'All Plus features', 'Custom Integrations', 'Dedicated Support Manager'] },
];
