
import { User, UserRole, Claim, ClaimStatus, ClaimType, Appointment, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, Referral, ReferralStatus, AuditLogEntry, SystemAuditLog } from './types';

export const MOCK_USERS: User[] = [];
export const MOCK_APPOINTMENTS: Appointment[] = [];
export const MOCK_CLAIMS: Claim[] = [];
export const MOCK_PROVIDER_PLANS: SubscriptionPlan[] = [];
export const MOCK_PATIENT_PLANS: SubscriptionPlan[] = [];
export const MOCK_PROGRESS_NOTES: ProgressNote[] = [];
export const MOCK_PRESCRIPTIONS: Prescription[] = [];
export const MOCK_MESSAGES: Record<string, Message[]> = {};
export const MOCK_INVOICES: BillingInvoice[] = [];
export const MOCK_LAB_ORDERS: LabOrder[] = [];
export const MOCK_REFERRALS: Referral[] = [];
export const MOCK_AUDIT_LOG: SystemAuditLog[] = [];
