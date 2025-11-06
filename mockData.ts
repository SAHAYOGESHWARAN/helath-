import { User, UserRole, Claim, ClaimStatus, ClaimType, Appointment, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, VitalsRecord, LabResult, MedicalCondition, Allergy, Surgery, Immunization, FamilyHistory, Lifestyle, HealthGoal, GymMembership, Referral, ReferralStatus, AuditLogEntry, InsuranceInfo, ReminderSettings, Task, Subtask, Subscription, SystemAuditLog } from './types';

export const MOCK_USERS: User[] = [
  { 
    id: 'pat1', name: 'John Doe', email: 'john.doe@email.com', password: 'Password123!', role: UserRole.PATIENT, avatarUrl: 'https://i.pravatar.cc/150?u=pat1', dob: '1985-05-20', phone: '555-123-4567', address: '123 Health St, Wellness City, USA', state: 'California', status: 'Active', createdAt: '2023-10-01T10:00:00Z',
    conditions: [{id: 'c1', name: 'Hypertension', status: 'Active', ageOfOnset: 45}],
    allergies: [{id: 'a1', name: 'Penicillin', severity: 'Severe', reaction: 'Anaphylaxis', status: 'Active'}],
    medications: [
      { id: 'med1', name: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', status: 'Active', adherence: 95 },
      { id: 'med2', name: 'Atorvastatin 20mg', dosage: '1 tablet', frequency: 'Once daily at bedtime', status: 'Active', adherence: 98 },
      { id: 'med3', name: 'Aspirin 81mg', dosage: '1 tablet', frequency: 'Once daily', status: 'Inactive' },
    ],
    vitals: [
        { id: 'v1', date: '2024-08-01', bloodPressure: '118/78', heartRate: 72, weight: 185, bmi: 24.5 },
        { id: 'v2', date: '2024-05-15', bloodPressure: '122/80', heartRate: 75, weight: 188, bmi: 25.1 },
        { id: 'v3', date: '2024-02-10', bloodPressure: '125/82', heartRate: 70, weight: 190, bmi: 25.4 },
    ],
    labResults: [
        {id: 'lab1', testName: 'Lipid Panel', date: '2024-07-25', components: [
            { name: 'Total Cholesterol', value: '180 mg/dL', referenceRange: '<200 mg/dL', isAbnormal: false },
            { name: 'LDL', value: '100 mg/dL', referenceRange: '<130 mg/dL', isAbnormal: false },
            { name: 'HDL', value: '60 mg/dL', referenceRange: '>40 mg/dL', isAbnormal: false },
        ]}
    ],
    healthGoals: [
      { id: 'g1', title: 'Daily Steps', current: 7500, target: 10000, unit: 'steps' },
      { id: 'g2', title: 'Weight Loss', current: 185, target: 180, unit: 'lbs' },
    ],
    tasks: [
      { id: 't1', text: 'Schedule follow-up with Dr. Smith', completed: false, dueDate: '2024-09-10', priority: 'High' },
      { id: 't2', text: 'Pick up Lisinopril prescription', completed: true, priority: 'Medium' },
    ],
    subscription: { planId: 'plan_p2', status: 'Active', renewalDate: '2025-08-15' },
    insurance: { provider: 'Blue Cross Blue Shield', planName: 'PPO Plan A', memberId: 'X123456789', groupId: 'G98765' },
    notificationSettings: { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: true, pushAll: false },
  },
  { id: 'pro1', name: 'Jane Smith', email: 'jane.smith@email.com', password: 'Password123!', role: UserRole.PROVIDER, avatarUrl: 'https://i.pravatar.cc/150?u=pro1', specialty: 'Cardiology', licenseNumber: 'G-12345', state: 'California', isVerified: true, phone: '555-987-6543', subscription: { planId: 'plan_d2', status: 'Active', renewalDate: '2025-01-01' }, status: 'Active', createdAt: '2023-09-15T10:00:00Z' },
  { id: 'adm1', name: 'Admin User', email: 'admin@novopath.com', password: 'password123', role: UserRole.ADMIN, avatarUrl: 'https://i.pravatar.cc/150?u=adm1', phone: '555-555-1212', status: 'Active', createdAt: '2023-09-01T10:00:00Z' },
  { id: 'pat2', name: 'Alice Williams', email: 'alice.w@email.com', password: 'Password123!', role: UserRole.PATIENT, avatarUrl: 'https://i.pravatar.cc/150?u=pat2', dob: '1992-11-12', phone: '555-234-5678', address: '456 Oak Ave, Wellness City, USA', state: 'California', status: 'Active', createdAt: '2024-01-20T10:00:00Z' },
  { id: 'pro2', name: 'David Chen', email: 'david.chen@email.com', password: 'Password123!', role: UserRole.PROVIDER, avatarUrl: 'https://i.pravatar.cc/150?u=pro2', specialty: 'Dermatology', licenseNumber: 'G-67890', state: 'California', isVerified: false, phone: '555-876-5432', subscription: { planId: 'plan_d1', status: 'Active', renewalDate: '2025-02-01' }, status: 'Active', createdAt: '2024-02-10T10:00:00Z' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'appt1', patientId: 'pat1', patientName: 'John Doe', providerId: 'pro1', providerName: 'Dr. Jane Smith', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '10:30 AM', reason: 'Annual Check-up', location: 'Clinic', status: 'Confirmed', duration: 30, visitSummary: 'Patient is doing well, continue current treatment plan.'},
    { id: 'appt2', patientId: 'pat2', patientName: 'Alice Williams', providerId: 'pro1', providerName: 'Dr. Jane Smith', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '11:00 AM', reason: 'Follow-up', location: 'Virtual', status: 'Pending', duration: 15 },
    { id: 'appt3', patientId: 'pat1', patientName: 'John Doe', providerId: 'pro2', providerName: 'Dr. David Chen', date: '2024-07-20', time: '02:00 PM', reason: 'Dermatology Follow-up', location: 'Virtual', status: 'Completed', duration: 15, visitSummary: 'Condition has improved. Follow up in 6 months.' },
];

export const MOCK_CLAIMS: Claim[] = [
    { id: 'CLM78901', patientId: 'pat1', provider: 'Dr. Jane Smith', serviceDate: '2024-07-15', totalClaimChargeAmount: 450, patientOwes: 50, insurancePaid: 400, status: ClaimStatus.PAID_IN_FULL, claimType: ClaimType.PROFESSIONAL, createdAt: '2024-07-18', lineItems: [{service: 'Office Visit 99213', charge: 250}, {service: 'EKG', charge: 200}] },
];

export const MOCK_INVOICES: BillingInvoice[] = [
    { id: 'inv_1', patientId: 'pat1', date: '2024-07-18', dueDate: '2024-08-18', totalAmount: 50, amountDue: 0, status: 'Paid', description: 'Co-pay for visit on 2024-07-15' },
    { id: 'inv_2', patientId: 'pat1', date: '2024-08-01', dueDate: '2024-09-01', totalAmount: 25, amountDue: 25, status: 'Due', description: 'Co-pay for lab work' },
];

export const MOCK_PROVIDER_PLANS: SubscriptionPlan[] = [
  { id: 'plan_d1', name: 'Basic Tier', price: '$49/mo', features: ['Up to 50 patients', 'Basic EHR', 'Appointment Scheduling'], patientLimit: 50, type: 'provider' },
  { id: 'plan_d2', name: 'Pro Tier', price: '$99/mo', features: ['Up to 200 patients', 'Full EHR & E-Prescribing', 'Telehealth Included', 'Advanced Reporting'], patientLimit: 200, isPopular: true, type: 'provider' },
  { id: 'plan_d3', name: 'Enterprise', price: 'Custom', features: ['Unlimited patients', 'All Pro features', 'Dedicated Support & Onboarding'], patientLimit: -1, type: 'provider' },
];

export const MOCK_PATIENT_PLANS: SubscriptionPlan[] = [
    { id: 'plan_p1', name: 'Video Consults', price: '$29.99/mo', features: ['5 video consults per month', 'Unlimited messaging', 'AI health summary'], patientLimit: 0, type: 'patient' },
    { id: 'plan_p2', name: 'Wellness Coach', price: '$49.99/mo', features: ['Unlimited video consults', 'AI Weight Loss Coach access', 'Personalized health goals'], patientLimit: 0, isPopular: true, type: 'patient' },
];

export const MOCK_PROGRESS_NOTES: ProgressNote[] = [
    { id: 'note1', patientId: 'pat1', patientName: 'John Doe', providerId: 'pro1', date: '2024-08-15', status: 'Signed', content: { subjective: 'Patient reports feeling well.', objective: 'BP 120/80, HR 72.', assessment: 'Stable.', plan: 'Continue current medications.' } }
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
    { id: 'rx1', patientId: 'pat1', patientName: 'John Doe', drug: 'Lisinopril 10mg', dosage: '1 tablet', frequency: 'Once daily', quantity: 30, refills: 2, pharmacy: 'CVS Pharmacy, Anytown', datePrescribed: '2024-08-14', status: 'Sent' },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
    'pro1': [
        { id: 'msg1', senderId: 'pro1', receiverId: 'pat1', text: 'Hello John, just a reminder about your upcoming appointment.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: 'msg2', senderId: 'pat1', receiverId: 'pro1', text: 'Thanks Dr. Smith! I\'ll be there.', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), isRead: true },
    ]
};

export const MOCK_LAB_ORDERS: LabOrder[] = [
    { id: 'lo1', patientId: 'pat1', patientName: 'John Doe', providerId: 'pro1', date: '2024-07-15', tests: ['Lipid Panel', 'CBC'], status: 'Results Ready' },
];

export const MOCK_REFERRALS: Referral[] = [
    { id: 'ref1', patientId: 'pat1', patientName: 'John Doe', referredTo: 'Dr. Evelyn Reed (Cardiology)', referredFrom: 'Dr. Jane Smith', createdAt: '2024-08-10', status: ReferralStatus.SENT, type: 'Outgoing', reason: 'Follow-up on EKG results', urgency: 'Routine', auditLog: [{ date: '2024-08-10', action: 'Referral Created', status: ReferralStatus.PENDING }, { date: '2024-08-11', action: 'Sent via Fax', status: ReferralStatus.SENT }] },
];

export const MOCK_AUDIT_LOG: SystemAuditLog[] = [
    { id: 1, timestamp: '2024-08-15 10:32:15', user: 'Dr. Jane Smith', userRole: UserRole.PROVIDER, action: 'Login Success', details: 'User logged in from IP 192.168.1.1' },
    { id: 2, timestamp: '2024-08-15 10:33:01', user: 'Dr. Jane Smith', userRole: UserRole.PROVIDER, action: 'View Patient Chart', details: 'Viewed chart for John Doe (pat1)' },
    { id: 3, timestamp: '2024-08-15 09:45:22', user: 'Alex Johnson', userRole: UserRole.ADMIN, action: 'Update Settings', details: 'Updated system feature flags' },
    { id: 4, timestamp: '2024-08-15 09:10:48', user: 'John Doe', userRole: UserRole.PATIENT, action: 'Login Success', details: 'User logged in from IP 203.0.113.25' },
    { id: 5, timestamp: '2024-08-14 15:20:11', user: 'Dr. Jane Smith', userRole: UserRole.PROVIDER, action: 'E-Prescription Sent', details: 'Sent prescription for Amoxicillin to patient Alice Johnson' },
    { id: 6, timestamp: '2024-08-14 14:05:56', user: 'Alex Johnson', userRole: UserRole.ADMIN, action: 'Login Failed', details: 'Failed login attempt for user: admin_support' },
    { id: 7, timestamp: '2024-08-14 11:55:03', user: 'John Doe', userRole: UserRole.PATIENT, action: 'Payment Submitted', details: 'Submitted payment of $50.00' },
    { id: 8, timestamp: '2024-08-13 18:00:00', user: 'System', userRole: 'System', action: 'Data Export', details: 'Weekly analytics data exported by automated job' },
];