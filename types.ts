
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
}

export interface Appointment {
  id: string;
  patientName: string;
  providerName: string;
  date: string;
  time: string;
  reason: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface Patient {
    id: string;
    name: string;
    dob: string;
    lastSeen: string;
    status: 'Active' | 'Inactive';
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
