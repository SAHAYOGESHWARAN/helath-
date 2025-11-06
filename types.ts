export enum UserRole {
  PATIENT = 'PATIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export interface Subscription {
  planId: string;
  status: 'Active' | 'Cancelled' | 'Trialing';
  renewalDate: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  status: 'Active' | 'Resolved';
  ageOfOnset?: number;
  notes?: string;
}

export interface Allergy {
  id: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  reaction: string;
  status: 'Active' | 'Resolved';
  notes?: string;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    status: 'Active' | 'Inactive';
    adherence?: number;
}

export interface Surgery {
    id: string;
    name: string;
    date: string;
}

export interface Immunization {
    id: string;
    vaccine: string;
    date: string;
}

export interface FamilyHistory {
    id: string;
    relation: 'Mother' | 'Father' | 'Sibling' | 'Grandparent' | 'Other';
    condition: string;
}

export interface Lifestyle {
    diet: string;
    exercise: string;
    smokingStatus: 'Never' | 'Former' | 'Current';
    alcoholConsumption: 'None' | 'Occasional' | 'Regular';
}

export interface VitalsRecord {
    id: string;
    patientId?: string;
    date: string;
    bloodPressure: string;
    heartRate: number;
    weight: number;
    bmi: number;
    recordedAt?: string;
}

export interface LabResultComponent {
    name: string;
    value: string;
    referenceRange: string;
    isAbnormal: boolean;
}

export interface LabResult {
    id: string;
    patientId?: string;
    testName: string;
    date: string;
    result?: string;
    components: LabResultComponent[];
}

export interface GymMembership {
    gymName: string;
    status: 'Active' | 'Inactive';
    lastCheckIn: string;
}

export interface HealthGoal {
    id: string;
    title: string;
    target: number;
    current: number;
    unit: string;
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD
  subtasks?: Subtask[];
  priority?: TaskPriority;
}

export interface NotificationSettings {
    emailAppointments: boolean;
    emailBilling: boolean;
    emailMessages: boolean;
    smsMessages: boolean;
    pushAll: boolean;
}

export interface InsuranceInfo {
    provider: string;
    planName: string;
    memberId: string;
    groupId: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  password?: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
  status?: 'Active' | 'Suspended' | 'Inactive';
  createdAt?: string;
  bio?: string;
  // Patient specific
  dob?: string;
  address?: string;
  state?: string;
  conditions?: MedicalCondition[];
  allergies?: Allergy[];
  medications?: Medication[];
  surgeries?: Surgery[];
  immunizations?: Immunization[];
  familyHistory?: FamilyHistory[];
  lifestyle?: Lifestyle;
  vitals?: VitalsRecord[];
  labResults?: LabResult[];
  gymMembership?: GymMembership;
  healthGoals?: HealthGoal[];
  tasks?: Task[];

  // Provider specific
  specialty?: string;
  licenseNumber?: string;
  isVerified?: boolean;
  subscription?: Subscription;
  
  notificationSettings?: NotificationSettings;
  insurance?: InsuranceInfo;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  reason?: string;
  location: 'Clinic' | 'Virtual' | 'Hospital';
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';
  duration: number; // in minutes
  checkInStatus?: 'Waiting' | 'Checked-In';
  visitSummary?: string;
  videoUpdates?: { id: string; date: string; videoUrl: string }[];
}

export interface PatientNote {
  id: string;
  encounterId: string;
  authorId: string;
  type: 'HPI' | 'ROS' | 'PhysicalExam' | 'AssessmentPlan';
  content: string;
  timestamp: string;
  isSigned: boolean;
}

export interface Encounter {
  id: string;
  patientId: string;
  providerId: string;
  date: string;
  type: 'Office Visit' | 'Telehealth' | 'Procedure';
  chiefComplaint: string;
  notes: PatientNote[];
  status: 'InProgress' | 'Completed' | 'Cancelled';
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
  patientId: string;
  provider: string;
  serviceDate: string;
  status: ClaimStatus;
  claimType: ClaimType;
  totalClaimChargeAmount: number;
  patientOwes: number;
  insurancePaid: number;
  lineItems: ClaimLineItem[];
  denialReason?: string;
  createdAt: string;
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


export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: string[];
  patientLimit: number;
  isPopular?: boolean;
  type: 'patient' | 'provider';
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface ProgressNote {
    id: string;
    patientId: string;
    patientName: string;
    providerId: string;
    date: string;
    status: 'Draft' | 'Pending Signature' | 'Signed';
    content: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    }
}

export interface Prescription {
    id: string;
    patientId?: string;
    patientName: string;
    drug: string;
    dosage: string;
    frequency: string;
    quantity: number;
    refills: number;
    pharmacy: string;
    datePrescribed: string;
    status: 'Draft' | 'Sent' | 'Filled' | 'Cancelled';
    notes?: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    text: string;
    timestamp: string;
    isRead: boolean;
}

export interface LabOrder {
    id: string;
    patientId: string;
    patientName: string;
    providerId: string;
    date: string;
    tests: string[];
    status: 'Ordered' | 'Results Ready' | 'Reviewed';
}

export enum ReferralStatus {
    PENDING = 'Pending',
    SENT = 'Sent',
    COMPLETED = 'Completed',
    CANCELLED = 'Cancelled',
}

export interface AuditLogEntry {
    date: string;
    action: string;
    status: ReferralStatus;
}

export interface SystemAuditLog {
    id: number;
    timestamp: string;
    user: string;
    userRole: UserRole | 'System';
    action: string;
    details: string;
}

export interface Referral {
    id: string;
    patientId: string;
    patientName: string;
    referredTo: string;
    referredFrom: string;
    createdAt: string;
    updatedAt?: string;
    sentDate?: string;
    status: ReferralStatus;
    type: 'Incoming' | 'Outgoing';
    reason: string;
    notes?: string;
    urgency: 'Routine' | 'Urgent' | 'STAT';
    attachments?: string[];
    auditLog: AuditLogEntry[];
}

export interface ReminderSettings {
  channels: {
    email: boolean;
    sms: boolean;
  };
  timeOption: '1h' | '24h' | '2d' | '3d' | 'custom';
  customDateTime: string | null;
}

// New interfaces for advanced EMR features
export interface RiskScore {
  id: string;
  patientId: string;
  score: number; // 0-100
  level: 'Low' | 'Medium' | 'High' | 'Critical';
  factors: string[];
  lastUpdated: string;
}

export interface PredictiveAnalytics {
  userGrowthPrediction: number;
  revenueProjection: number;
  churnRate: number;
  confidence: number; // 0-100
}

export interface RealTimeVitals {
  patientId: string;
  timestamp: string;
  heartRate?: number;
  bloodPressure?: string;
  oxygenSaturation?: number;
  temperature?: number;
  deviceId: string;
}

export interface CareSuggestion {
  id: string;
  patientId: string;
  type: 'Medication' | 'Lifestyle' | 'Follow-up' | 'Prevention';
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  generatedAt: string;
}

export interface SystemHealth {
  uptime: number; // in hours
  errorRate: number; // percentage
  responseTime: number; // in ms
  activeUsers: number;
  lastUpdated: string;
}

export interface PredictiveAlert {
  id: string;
  patientId: string;
  type: 'Health Risk' | 'Medication Adherence' | 'Appointment Reminder';
  message: string;
  severity: 'Low' | 'Medium' | 'High';
  triggeredAt: string;
  actionRequired: boolean;
}
