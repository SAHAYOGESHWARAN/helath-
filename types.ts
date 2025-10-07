
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
}

export interface Appointment {
  id: string;
  patientName: string;
  providerName: string;
  date: string;
  time: string;
  reason: string;
  type: 'In-Person' | 'Virtual';
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  checkInStatus?: 'Pending' | 'Checked-In' | 'Late';
  visitSummary?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
}

export interface Allergy {
  id: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
}

export interface HealthGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
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

export interface Claim {
  id: string;
  patientId: string;
  status: ClaimStatus;
  claimType: ClaimType;
  totalClaimChargeAmount: number;
  createdAt: string;
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
}
