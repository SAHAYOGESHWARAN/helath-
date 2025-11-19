import { create } from 'zustand';
import { User, Appointment, Claim, BillingInvoice, SubscriptionPlan, ProgressNote, Prescription, Message, LabOrder, Referral, InsuranceInfo, ReminderSettings, MedicalCondition, Allergy, HealthGoal, Task, Subtask, SystemAuditLog, Subscription } from '@/types';

export interface AppState {
  users: User[];
  appointments: Appointment[];
  claims: Claim[];
  invoices: BillingInvoice[];
  progressNotes: ProgressNote[];
  prescriptions: Prescription[];
  messages: Record<string, Message[]>;
  labOrders: LabOrder[];
  referrals: Referral[];
  patientPlans: SubscriptionPlan[];
  providerPlans: SubscriptionPlan[];
  auditLog: SystemAuditLog[];
  reminders: Record<string, ReminderSettings>;
  socketStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  
  setUsers: (users: User[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  setClaims: (claims: Claim[]) => void;
  setInvoices: (invoices: BillingInvoice[]) => void;
  setProgressNotes: (progressNotes: ProgressNote[]) => void;
  setPrescriptions: (prescriptions: Prescription[]) => void;
  setMessages: (messages: Record<string, Message[]>) => void;
  setLabOrders: (labOrders: LabOrder[]) => void;
  setReferrals: (referrals: Referral[]) => void;
  setPatientPlans: (plans: SubscriptionPlan[]) => void;
  setProviderPlans: (plans: SubscriptionPlan[]) => void;
  setAuditLog: (log: SystemAuditLog[]) => void;
  setSocketStatus: (status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting') => void;
}

export const useAppStore = create<AppState>((set) => ({
  users: [],
  appointments: [],
  claims: [],
  invoices: [],
  progressNotes: [],
  prescriptions: [],
  messages: {},
  labOrders: [],
  referrals: [],
  patientPlans: [],
  providerPlans: [],
  auditLog: [],
  reminders: {},
  socketStatus: 'disconnected',

  setUsers: (users) => set({ users }),
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) => set((state) => ({ appointments: [...state.appointments, appointment] })),
  setClaims: (claims) => set({ claims }),
  setInvoices: (invoices) => set({ invoices }),
  setProgressNotes: (progressNotes) => set({ progressNotes }),
  setPrescriptions: (prescriptions) => set({ prescriptions }),
  setMessages: (messages) => set({ messages }),
  setLabOrders: (labOrders) => set({ labOrders }),
  setReferrals: (referrals) => set({ referrals }),
  setPatientPlans: (patientPlans) => set({ patientPlans }),
  setProviderPlans: (providerPlans) => set({ providerPlans }),
  setAuditLog: (auditLog) => set({ auditLog }),
  setSocketStatus: (socketStatus) => set({ socketStatus }),
}));
