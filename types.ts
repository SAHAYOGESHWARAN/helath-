export enum UserRole {
  PATIENT = 'PATIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  dob?: string;
  specialty?: string; // For providers
}

export interface Appointment {
  id: string;
  patientName: string;
  providerName: string;
  providerId?: string;
  date: string;
  time: string;
  reason: string;
  type: 'In-Person' | 'Virtual';
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  checkInStatus?: 'Pending' | 'Checked-In' | 'Late';
  visitSummary?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
  status: 'Active' | 'Inactive';
  // FIX: Changed adherence from an array of objects to an optional number to match its usage as a percentage in the dashboard.
  adherence?: number;
}

export interface LabResult {
    id: string;
    testName: string;
    date: string;
    status: 'Pending' | 'Final';
    components: { name: string; value: string; referenceRange: string; isAbnormal: boolean }[];
}


export interface Allergy {
  id: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  reaction: string;
}

export interface HealthGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
}

export interface Surgery {
  id: string;
  name: string;
  date: string;
}

export interface Hospitalization {
  id: string;
  reason: string;
  admissionDate: string;
  dischargeDate: string;
}

export interface Patient {
    id:string;
    name: string;
    dob: string;
    lastSeen: string;
    status: 'Active' | 'Inactive';
    medications?: Medication[];
    allergies?: Allergy[];
    healthGoals?: HealthGoal[];
    labResults?: LabResult[];
}

export enum ClaimStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PROCESSING = 'PROCESSING',
  PAID_IN_FULL = 'PAID_IN_FULL',
  PAID_PARTIALLY = 'PAID_PARTIALLY',
  DENIED = 'DENIED',
  REJECTED = 'REJECTED',
  PENDING_INFORMATION = 'PENDING_INFORMATION',
  ADJUDICATED = 'ADJUDICATED',
  VOIDED = 'VOIDED',
}

export enum ClaimType {
  PROFESSIONAL = 'PROFESSIONAL',
  INSTITUTIONAL = 'INSTITUTIONAL',
}

export interface ClaimLineItem {
  service: string;
  charge: number;
}

export interface Claim {
  id: string;
  patientId?: string;
  status: ClaimStatus;
  claimType?: ClaimType;
  totalClaimChargeAmount: number;
  createdAt?: string; // Or serviceDate
  serviceDate: string;
  provider: string;
  patientOwes: number;
  insurancePaid: number;
  lineItems: ClaimLineItem[];
  denialReason?: string;
}


export interface ProgressNote {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  status: 'Draft' | 'Pending Signature' | 'Signed';
  content: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  drug: string;
  dosage: string;
  frequency: string;
  quantity: number;
  refills: number;
  pharmacy: string;
  datePrescribed: string;
  status: 'Pending' | 'Sent' | 'Filled' | 'Error' | 'Cancelled';
}

export interface SubscriptionPlan {
    name: string;
    price: string;
    patientLimit: number;
    features: string[];
    isPopular?: boolean;
}

export interface Notification {
  id: string;
  type: 'Message' | 'Appointment' | 'Lab Result' | 'Billing' | 'System';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface BillingInvoice {
    id: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Due' | 'Overdue';
    description: string;
}