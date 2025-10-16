// FIX: Removed self-import of `UserRole` which was causing a declaration conflict.

// FIX: Added 'ADMIN' to UserRole to support admin-specific functionality.
export enum UserRole {
  PATIENT = 'PATIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export interface FamilyHistoryEntry {
  id: string;
  relation: 'Mother' | 'Father' | 'Sibling' | 'Grandparent' | 'Other';
  condition: string;
}

export interface ImmunizationRecord {
  id: string;
  vaccine: string;
  date: string;
}

export interface VitalsRecord {
  id: string;
  date: string;
  bloodPressure: string; // e.g., "120/80"
  heartRate: number;
  weight: number; // in lbs
  bloodGlucose?: number; // in mg/dL
}

export interface LifestyleInfo {
  diet: string;
  exercise: string;
  smokingStatus: 'Never' | 'Former' | 'Current';
  alcoholConsumption: 'None' | 'Occasional' | 'Regular';
}

export interface NotificationSettings {
  emailAppointments: boolean;
  emailBilling: boolean;
  emailMessages: boolean;
  smsMessages: boolean; // For SMS alerts on new messages
  pushAll: boolean;
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
  state?: string; 
  specialty?: string; 
  licenseNumber?: string;
  isVerified?: boolean; 
  status?: 'Active' | 'Suspended';
  subscription?: {
    planId: string;
    planName: string;
    status: 'Active' | 'Cancelled' | 'Trialing';
    renewalDate: string;
  };
  conditions?: { id: string, name: string }[];
  allergies?: Allergy[];
  surgeries?: Surgery[];
  medications?: Medication[];
  familyHistory?: FamilyHistoryEntry[];
  immunizations?: ImmunizationRecord[];
  vitals?: VitalsRecord[];
  lifestyle?: LifestyleInfo;
  notificationSettings?: NotificationSettings; // User-specific notification settings
  healthGoals?: HealthGoal[];
  labResults?: LabResult[];
}

export interface Appointment {
  id: string;
  patientName: string;
  providerName: string;
  providerId?: string;
  date: string;
  time: string;
  duration: 15 | 30 | 60;
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
  prescribedBy?: string;
  startDate?: string;
  status: 'Active' | 'Inactive';
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

export interface InsuranceInfo {
  provider: string;
  planName: string;
  memberId: string;
  groupId: string;
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
    id: string;
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
    patientId: string;
    date: string;
    dueDate: string;
    totalAmount: number;
    amountDue: number;
    status: 'Paid' | 'Due' | 'Overdue';
    description: string;
}

export interface Referral {
  id: number;
  patient: string;
  referredTo?: string;
  referredFrom?: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Declined';
  type: 'Outgoing' | 'Incoming';
  reason: string;
}