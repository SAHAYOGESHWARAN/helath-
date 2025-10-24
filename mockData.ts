
import { User, UserRole, Appointment, Claim, BillingInvoice, Prescription, ProgressNote, Referral, SubscriptionPlan, ClaimStatus, ClaimType } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Dr. Admin',
    email: 'admin@novopath.com',
    role: UserRole.ADMIN,
    avatarUrl: 'https://i.pravatar.cc/150?u=admin@novopath.com',
    isVerified: true,
    status: 'Active',
  },
  {
    id: 'provider-1',
    name: 'Dr. John Smith',
    email: 'john.smith@novopath.com',
    role: UserRole.PROVIDER,
    avatarUrl: 'https://i.pravatar.cc/150?u=john.smith@novopath.com',
    isVerified: true,
    status: 'Active',
    specialty: 'Cardiology',
  },
  {
    id: 'patient-1',
    name: 'Jane Doe',
    email: 'jane.doe@email.com',
    role: UserRole.PATIENT,
    avatarUrl: 'https://i.pravatar.cc/150?u=jane.doe@email.com',
    isVerified: true,
    status: 'Active',
  },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'appt_1', patientId: 'patient-1', patientName: 'Jane Doe', providerId: 'provider-1', providerName: 'Dr. John Smith', date: '2024-10-28', time: '10:00', duration: 30, reason: 'Annual Checkup', type: 'In-Person', status: 'Confirmed' },
    { id: 'appt_2', patientId: 'patient-1', patientName: 'Jane Doe', providerId: 'provider-1', providerName: 'Dr. John Smith', date: '2024-11-15', time: '14:30', duration: 30, reason: 'Follow-up Consultation', type: 'Virtual', status: 'Pending' },
];
export const MOCK_CLAIMS: Claim[] = [
    { id: 'claim_1', patientId: 'patient-1', serviceDate: '2024-10-28', claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 250.00, status: ClaimStatus.SUBMITTED, provider: 'Dr. John Smith', patientOwes: 50, insurancePaid: 200, lineItems: [{ service: 'Annual physical examination.', charge: 250 }] },
    { id: 'claim_2', patientId: 'patient-1', serviceDate: '2024-09-12', claimType: ClaimType.PROFESSIONAL, totalClaimChargeAmount: 120.00, status: ClaimStatus.PAID_IN_FULL, provider: 'Dr. John Smith', patientOwes: 0, insurancePaid: 120, lineItems: [{ service: 'Dental cleaning and checkup.', charge: 120 }] },
];
export const MOCK_INVOICES: BillingInvoice[] = [
    { id: 'inv_1', patientId: 'patient-1', totalAmount: 250.00, amountDue: 50.00, date: '2024-10-29', dueDate: '2024-11-29', status: 'Due', description: 'Invoice for annual checkup co-pay.' },
    { id: 'inv_2', patientId: 'patient-1', totalAmount: 120.00, amountDue: 0.00, date: '2024-09-15', dueDate: '2024-10-15', status: 'Paid', description: 'Invoice for dental cleaning.' },
];
export const MOCK_PRESCRIPTIONS: Prescription[] = [
    { id: 'rx_1', patientId: 'patient-1', patientName: 'Jane Doe', drug: 'Lisinopril 10mg', dosage: '1 tablet daily', frequency: 'Once a day', quantity: 30, refills: 3, pharmacy: 'CVS Pharmacy', datePrescribed: '2024-10-28', status: 'Filled' },
];
export const MOCK_PROGRESS_NOTES: ProgressNote[] = [
    { id: 'note_1', patientId: 'patient-1', patientName: 'Jane Doe', date: '2024-10-28T10:30:00Z', content: { subjective: 'Patient reports feeling well.', objective: 'Vitals stable.', assessment: 'No new issues.', plan: 'Continue current medications.' }, status: 'Signed' },
];
export const MOCK_REFERRALS: Referral[] = [
    { id: 1, patient: 'Jane Doe', referredFrom: 'Dr. John Smith', referredTo: 'Dermatology', reason: 'Suspicious mole on back.', date: '2024-10-28', status: 'Pending', type: 'Outgoing' },
];
export const MOCK_PATIENT_PLANS: SubscriptionPlan[] = [
    { id: 'plan_p1', name: 'Basic Care', price: '$29/month', features: ['Secure Messaging', 'Appointment Booking', 'Health Records Access'], patientLimit: 1 },
    { id: 'plan_p2', name: 'Premium Care', price: '$59/month', features: ['All Basic Features', 'Telehealth Visits', 'Wellness Tracking'], patientLimit: 1 },
];
export const MOCK_PROVIDER_PLANS: SubscriptionPlan[] = [
    { id: 'plan_d1', name: 'Solo Practitioner', price: '$199/month', features: ['EMR Access', 'Patient Scheduling', 'Basic Billing'], patientLimit: 200 },
    { id: 'plan_d2', name: 'Clinic Suite', price: '$499/month', features: ['All Solo Features', 'Advanced Analytics', 'Multi-user Support'], patientLimit: 1000 },
];
