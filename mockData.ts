import { User, UserRole, Claim, ClaimStatus, ClaimType, Appointment, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, VitalsRecord, LabResult, MedicalCondition, Allergy, Surgery, Immunization, FamilyHistory, Lifestyle, HealthGoal, GymMembership, Referral, ReferralStatus, AuditLogEntry, InsuranceInfo } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'pat1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: UserRole.PATIENT,
    avatarUrl: 'https://picsum.photos/seed/patient/100',
    dob: '1985-05-20',
    phone: '555-123-4567',
    address: '123 Health St, Wellness City, USA',
    state: 'California',
    status: 'Active',
    conditions: [{id: 'c1', name: 'Hypertension'}, {id: 'c2', name: 'Asthma'}],
    allergies: [{id: 'a1', name: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis'}, {id: 'a2', name: 'Peanuts', severity: 'Moderate', reaction: 'Hives'}],
    medications: [
        {id: 'med1', name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', status: 'Active', adherence: 95},
        {id: 'med2', name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', status: 'Active', adherence: 98},
        {id: 'med3', name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Every 8 hours for 7 days', status: 'Inactive'}
    ],
    surgeries: [{id: 's1', name: 'Appendectomy', date: '2010-06-15'}],
    immunizations: [{id: 'i1', vaccine: 'COVID-19 (Pfizer)', date: '2023-09-01'}, {id: 'i2', vaccine: 'Flu Shot', date: '2023-10-15'}],
    familyHistory: [{id: 'fh1', relation: 'Father', condition: 'Heart Disease'}, {id: 'fh2', relation: 'Mother', condition: 'Diabetes Type 2'}],
    lifestyle: { diet: 'Low-sodium', exercise: '3 times a week', smokingStatus: 'Never', alcoholConsumption: 'Occasional' },
    vitals: [
        {date: '2024-08-01', bloodPressure: '118/78', heartRate: 72, weight: 185},
        {date: '2024-04-20', bloodPressure: '120/79', heartRate: 75, weight: 188},
        {date: '2024-01-15', bloodPressure: '125/83', heartRate: 78, weight: 190},
        {date: '2023-10-01', bloodPressure: '122/81', heartRate: 76, weight: 192},
    ],
    labResults: [
        {id: 'lab1', testName: 'Lipid Panel', date: '2024-07-25', components: [
            { name: 'Total Cholesterol', value: '180 mg/dL', referenceRange: '<200', isAbnormal: false },
            { name: 'LDL', value: '100 mg/dL', referenceRange: '<130', isAbnormal: false },
            { name: 'HDL', value: '60 mg/dL', referenceRange: '>40', isAbnormal: false },
        ]}
    ],
    gymMembership: { gymName: 'Planet Fitness', status: 'Active', lastCheckIn: '2024-08-01' },
    healthGoals: [
        { id: 'goal1', title: 'Daily Steps', target: 10000, current: 7500, unit: 'steps' },
        { id: 'goal2', title: 'Weight Loss', target: 180, current: 185, unit: 'lbs' },
    ],
    notificationSettings: { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: false, pushAll: false },
    insurance: { provider: 'Blue Cross Blue Shield', planName: 'PPO Plan A', memberId: 'M123456789', groupId: 'G98765' },
    subscription: { planId: 'plan_p1', status: 'Active', renewalDate: '2025-08-15' },
    isVerified: true,
  },
  { id: 'pat2', name: 'Alice Johnson', email: 'alice.j@email.com', role: UserRole.PATIENT, avatarUrl: 'https://i.pravatar.cc/150?u=alice.j', dob: '1992-11-12', status: 'Active', state: 'New York', isVerified: true, },
  { id: 'pat3', name: 'Bob Williams', email: 'bob.w@email.com', role: UserRole.PATIENT, avatarUrl: 'https://i.pravatar.cc/150?u=bob.w', dob: '1970-02-01', status: 'Inactive', state: 'New York', isVerified: true, },
  { id: 'pat4', name: 'Charlie Brown', email: 'charlie.b@email.com', role: UserRole.PATIENT, avatarUrl: 'https://i.pravatar.cc/150?u=charlie.b', dob: '1998-09-30', status: 'Active', state: 'New York', isVerified: true, },
  { id: 'pat5', name: 'Diana Prince', email: 'diana.p@email.com', role: UserRole.PATIENT, avatarUrl: 'https://i.pravatar.cc/150?u=diana.p', dob: '1980-03-22', status: 'Active', state: 'New York', isVerified: true, },

  {
    id: 'pro1',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@email.com',
    role: UserRole.PROVIDER,
    avatarUrl: 'https://picsum.photos/seed/provider/100',
    specialty: 'Cardiology',
    isVerified: true,
    status: 'Active',
    state: 'New York',
    subscription: { planId: 'plan_d2', status: 'Active', renewalDate: '2024-09-01' },
    notificationSettings: { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: true, pushAll: true },
  },
  { id: 'pro2', name: 'Dr. David Chen', email: 'david.c@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://i.pravatar.cc/150?u=david.c', specialty: 'Dermatology', isVerified: false, status: 'Active', state: 'New York' },
  { id: 'pro3', name: 'Dr. Emily White', email: 'emily.w@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://i.pravatar.cc/150?u=emily.w', specialty: 'General Practice', isVerified: true, status: 'Suspended', state: 'New York' },
  
  { id: 'adm1', name: 'Alex Johnson', email: 'alex.j@email.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/admin/100', status: 'Active', isVerified: true },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'appt1', patientId: 'pat1', patientName: 'John Doe', providerId: 'pro1', providerName: 'Dr. Jane Smith', date: '2024-09-15', time: '10:30 AM', duration: 30, reason: 'Annual Check-up', type: 'In-Person', status: 'Confirmed', visitSummary: "Patient is in good health. Discussed lifestyle modifications. Continue current medications. Follow up in 1 year." },
    { id: 'appt2', patientId: 'pat2', patientName: 'Alice Johnson', providerId: 'pro1', providerName: 'Dr. Jane Smith', date: '2024-09-15', time: '11:00 AM', duration: 15, reason: 'Follow-up', type: 'Virtual', status: 'Confirmed', checkInStatus: 'Waiting' },
    { id: 'appt3', patientId: 'pat1', patientName: 'John Doe', providerId: 'pro2', providerName: 'Dr. David Chen', date: '2024-08-20', time: '02:00 PM', duration: 20, reason: 'Dermatology Follow-up', type: 'In-Person', status: 'Completed', visitSummary: "Checked healing of previous biopsy. No signs of infection. Recommended sunscreen." },
    { id: 'appt4', patientId: 'pat4', patientName: 'Charlie Brown', providerId: 'pro1', providerName: 'Dr. Jane Smith', date: new Date().toISOString().split('T')[0], time: '10:30 AM', duration: 15, reason: 'Sick Visit', type: 'Virtual', status: 'Confirmed', checkInStatus: 'Checked-In' },
    { id: 'appt5', patientId: 'pat5', patientName: 'Diana Prince', providerId: 'pro1', providerName: 'Dr. Jane Smith', date: new Date().toISOString().split('T')[0], time: '11:00 AM', duration: 30, reason: 'New Patient Intake', type: 'In-Person', status: 'Confirmed' },
];

export const MOCK_CLAIMS: Claim[] = [
  { id: 'CLM78901', patientId: 'pat1', provider: 'Dr. Jane Smith', serviceDate: '2024-07-15', totalClaimChargeAmount: 450, patientOwes: 50, insurancePaid: 400, status: ClaimStatus.PAID_IN_FULL, claimType: ClaimType.PROFESSIONAL, lineItems: [{ service: 'Office Visit', charge: 250 }, { service: 'EKG', charge: 200 }], createdAt: '2024-07-20' },
  { id: 'CLM78902', patientId: 'pat1', provider: 'Anytown General Hospital', serviceDate: '2024-07-22', totalClaimChargeAmount: 1250, patientOwes: 250, insurancePaid: 1000, status: ClaimStatus.PROCESSING, claimType: ClaimType.INSTITUTIONAL, lineItems: [{ service: 'Emergency Room Visit', charge: 1250 }], createdAt: '2024-07-25' },
  { id: 'CLM78903', patientId: 'pat1', provider: 'Dr. David Chen', serviceDate: '2024-06-10', totalClaimChargeAmount: 180, patientOwes: 0, insurancePaid: 180, status: ClaimStatus.PAID_IN_FULL, claimType: ClaimType.PROFESSIONAL, lineItems: [{ service: 'Dermatology Follow-up', charge: 180 }], createdAt: '2024-06-15' },
  { id: 'CLM78904', patientId: 'pat1', provider: 'Quest Diagnostics', serviceDate: '2024-05-05', totalClaimChargeAmount: 85.50, patientOwes: 20, insurancePaid: 65.50, status: ClaimStatus.DENIED, denialReason: 'Service not covered under plan benefits.', claimType: ClaimType.PROFESSIONAL, lineItems: [{ service: 'Lipid Panel', charge: 85.50 }], createdAt: '2024-05-10' },
  { id: 'CLM78905', patientId: 'pat1', provider: 'Dr. Jane Smith', serviceDate: '2024-08-01', totalClaimChargeAmount: 300, patientOwes: 50, insurancePaid: 250, status: ClaimStatus.SUBMITTED, claimType: ClaimType.PROFESSIONAL, lineItems: [{ service: 'Office Visit', charge: 300 }], createdAt: '2024-08-05' },
];

export const MOCK_INVOICES: BillingInvoice[] = [
    { id: 'inv_123', patientId: 'pat1', date: '2024-07-20', dueDate: '2024-08-20', totalAmount: 50, amountDue: 0, status: 'Paid', description: 'Co-pay for visit on 2024-07-15'},
    { id: 'inv_124', patientId: 'pat1', date: '2024-07-25', dueDate: '2024-08-25', totalAmount: 250, amountDue: 250, status: 'Due', description: 'ER visit co-insurance'},
];


export const MOCK_PROVIDER_PLANS: SubscriptionPlan[] = [
    { id: 'plan_d1', name: 'Basic Tier', price: '$49/mo', patientLimit: 50, features: ['Up to 50 active patients', 'Basic EHR', 'Appointment Scheduling'] },
    { id: 'plan_d2', name: 'Pro Tier', price: '$99/mo', patientLimit: 200, features: ['Up to 200 active patients', 'Full EHR & E-Prescribing', 'Integrated Telehealth', 'Advanced Reporting & Analytics', 'Priority Email Support'], isPopular: true },
    { id: 'plan_d3', name: 'Enterprise', price: 'Custom', patientLimit: 0, features: ['Unlimited patients', 'All Pro features', 'Dedicated Support', 'HIPAA Compliance+', 'SSO Integration'] },
];

export const MOCK_PATIENT_PLANS: SubscriptionPlan[] = [
    { id: 'plan_p1', name: 'Care Basic', price: '$19/mo', patientLimit: 0, features: ['Unlimited Secure Messaging', '1 Video Consultation/month', 'Basic Health Tracking'] },
    { id: 'plan_p2', name: 'Care Plus', price: '$49/mo', patientLimit: 0, features: ['All Basic features', '5 Video Consultations/month', 'AI Weight Loss Coach', 'Priority Scheduling'], isPopular: true },
];

export const MOCK_PROGRESS_NOTES: ProgressNote[] = [
    { id: 'note1', patientId: 'pat1', patientName: 'John Doe', providerId: 'pro1', date: '2024-08-15', status: 'Signed', content: { subjective: 'Patient reports feeling well, no new complaints.', objective: 'BP 120/80, HR 72. Lungs clear.', assessment: 'Stable hypertension.', plan: 'Continue current medications. Follow up in 3 months.' } },
    { id: 'note2', patientId: 'pat2', patientName: 'Alice Johnson', providerId: 'pro1', date: '2024-08-15', status: 'Pending Signature', content: { subjective: 'Follow-up for seasonal allergies.', objective: 'Mild congestion noted.', assessment: 'Allergic rhinitis.', plan: 'Prescribed Loratadine 10mg daily.' } },
    { id: 'note3', patientId: 'pat4', patientName: 'Charlie Brown', providerId: 'pro1', date: '2024-08-14', status: 'Draft', content: { subjective: 'Patient complains of sore throat for 2 days.', objective: '', assessment: '', plan: '' } },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
    { id: 'rx0', patientId: 'pat1', patientName: 'John Doe', drug: 'Ibuprofen 200mg', dosage: '2 tablets', frequency: 'As needed for pain', quantity: 60, refills: 1, pharmacy: 'CVS Pharmacy, Anytown', datePrescribed: '2024-08-16', status: 'Draft', notes: 'Take with a full glass of water.' },
    { id: 'rx1', patientId: 'pat1', patientName: 'John Doe', drug: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', quantity: 30, refills: 2, pharmacy: 'CVS Pharmacy, Anytown', datePrescribed: '2024-08-14', status: 'Sent' },
    { id: 'rx2', patientId: 'pat2', patientName: 'Alice Johnson', drug: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: 'Every 8 hours', quantity: 21, refills: 0, pharmacy: 'Walgreens, Anytown', datePrescribed: '2024-08-15', status: 'Filled', notes: 'Finish entire course of antibiotics.' },
    { id: 'rx3', patientId: 'pat4', patientName: 'Charlie Brown', drug: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'As needed', quantity: 1, refills: 5, pharmacy: 'Rite Aid, Anytown', datePrescribed: '2024-08-10', status: 'Sent' },
    { id: 'rx4', patientId: 'pat1', patientName: 'John Doe', drug: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', quantity: 30, refills: 2, pharmacy: 'CVS Pharmacy, Anytown', datePrescribed: '2024-08-14', status: 'Cancelled' },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
    'pro1': [
        { id: 'msg1', senderId: 'pat1', receiverId: 'pro1', text: 'Hi Dr. Smith, I have a question about my medication.', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: false },
        { id: 'msg2', senderId: 'pro1', receiverId: 'pat1', text: 'Hello John, of course. What can I help you with?', timestamp: new Date(Date.now() - 3500000).toISOString(), isRead: true },
    ],
    'pat1': [
        { id: 'msg1', senderId: 'pat1', receiverId: 'pro1', text: 'Hi Dr. Smith, I have a question about my medication.', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: false },
        { id: 'msg2', senderId: 'pro1', receiverId: 'pat1', text: 'Hello John, of course. What can I help you with?', timestamp: new Date(Date.now() - 3500000).toISOString(), isRead: true },
    ],
};

export const MOCK_LAB_ORDERS: LabOrder[] = [
    { id: 'lo1', patientId: 'pat1', patientName: 'John Doe', providerId: 'pro1', date: '2024-08-01', tests: ['Lipid Panel', 'CBC with Differential'], status: 'Results Ready' },
    { id: 'lo2', patientId: 'pat2', patientName: 'Alice Johnson', providerId: 'pro1', date: '2024-08-05', tests: ['TSH'], status: 'Ordered' },
];

export const MOCK_REFERRALS: Referral[] = [
    {
      id: 'ref1',
      patientId: 'pat1',
      patientName: 'John Doe',
      referredTo: 'Dr. Evelyn Reed (Cardiology)',
      referredFrom: 'Dr. Jane Smith',
      createdAt: '2024-08-10T10:00:00Z',
      status: ReferralStatus.COMPLETED,
      type: 'Outgoing',
      reason: 'Chest pain evaluation',
      urgency: 'Urgent',
      auditLog: [
        { date: '2024-08-12T14:30:00Z', action: 'Status changed to Completed', status: ReferralStatus.COMPLETED },
        { date: '2024-08-10T10:05:00Z', action: 'Fax Sent (simulated)', status: ReferralStatus.SENT },
        { date: '2024-08-10T10:00:00Z', action: 'Referral Created', status: ReferralStatus.PENDING },
      ]
    },
    {
      id: 'ref2',
      patientId: 'pat2',
      patientName: 'Alice Johnson',
      referredFrom: 'Dr. Ben Carter (PCP)',
      referredTo: 'Dr. Jane Smith',
      createdAt: '2024-08-12T11:00:00Z',
      status: ReferralStatus.PENDING,
      type: 'Incoming',
      reason: 'Cardiology consult',
      urgency: 'Routine',
      auditLog: [
        { date: '2024-08-12T11:00:00Z', action: 'Referral Received', status: ReferralStatus.PENDING },
      ]
    },
    {
      id: 'ref3',
      patientId: 'pat5',
      patientName: 'Diana Prince',
      referredTo: 'Dr. Frank Miller (Ortho)',
      referredFrom: 'Dr. Jane Smith',
      createdAt: '2024-07-25T09:30:00Z',
      status: ReferralStatus.SENT,
      sentDate: '2024-07-25T09:35:00Z',
      type: 'Outgoing',
      reason: 'Knee pain',
      urgency: 'Routine',
      auditLog: [
        { date: '2024-07-25T09:35:00Z', action: 'Fax Sent (simulated)', status: ReferralStatus.SENT },
        { date: '2024-07-25T09:30:00Z', action: 'Referral Created', status: ReferralStatus.PENDING },
      ]
    },
     {
      id: 'ref4',
      patientId: 'pat4',
      patientName: 'Charlie Brown',
      referredTo: 'Dr. Grace Lee (Neurology)',
      referredFrom: 'Dr. Jane Smith',
      createdAt: '2024-08-14T16:00:00Z',
      status: ReferralStatus.CANCELLED,
      type: 'Outgoing',
      reason: 'Headaches',
      notes: 'Patient cancelled appointment.',
      // FIX: Add missing 'urgency' property.
      urgency: 'Routine',
      auditLog: [
          { date: '2024-08-15T11:00:00Z', action: 'Referral Cancelled by Staff', status: ReferralStatus.CANCELLED },
          { date: '2024-08-14T16:00:00Z', action: 'Referral Created', status: ReferralStatus.PENDING },
      ]
    },
  ];