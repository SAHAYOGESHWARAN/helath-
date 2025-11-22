import { User, Appointment, Claim, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, Referral, UserRole, SystemAuditLog } from '@/types';
import {
  MOCK_USERS,
  MOCK_APPOINTMENTS,
  MOCK_CLAIMS,
  MOCK_INVOICES,
  MOCK_PROGRESS_NOTES,
  MOCK_PRESCRIPTIONS,
  MOCK_MESSAGES,
  MOCK_LAB_ORDERS,
  MOCK_REFERRALS,
  MOCK_AUDIT_LOG,
  MOCK_PROVIDER_PLANS,
  MOCK_PATIENT_PLANS
} from '@/mockData';

// Mock In-Memory Database
const users = [...MOCK_USERS];
const appointments = [...MOCK_APPOINTMENTS];
const claims = [...MOCK_CLAIMS];
const invoices = [...MOCK_INVOICES];
const progressNotes = [...MOCK_PROGRESS_NOTES];
const prescriptions = [...MOCK_PRESCRIPTIONS];
const messages = { ...MOCK_MESSAGES };
const labOrders = [...MOCK_LAB_ORDERS];
const referrals = [...MOCK_REFERRALS];
const auditLog = [...MOCK_AUDIT_LOG];

// Helper for delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiLogin = async (email: string, password?: string): Promise<{ user: User; token: string } | null> => {
  await delay(500);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  // Simple password check for demo (in mock data password is plain text)
  if (user && user.password === password) {
    return { user, token: `mock-token-${user.id}` };
  }
  return null;
};

export const apiVerifyToken = async (token: string): Promise<{ user: User }> => {
  await delay(200);
  const userId = token.replace('mock-token-', '');
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error('Invalid token');
  return { user };
};

export const apiRegister = async (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole): Promise<User> => {
  await delay(500);
  const newUser: User = {
    id: `user_${Date.now()}`,
    ...userData,
    role,
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=random`,
    status: 'Active',
    createdAt: new Date().toISOString(),
    // Initialize empty arrays for patient specific fields
    conditions: [],
    allergies: [],
    medications: [],
    vitals: [],
    labResults: [],
    healthGoals: [],
    tasks: [],
  };
  users.push(newUser);
  return newUser;
};

export const apiChangePassword = async (current: string, newPass: string): Promise<boolean> => {
  await delay(500);
  // In a real app, we would check the current user from context/session
  return true;
};

export const fetchAllData = async () => {
  await delay(800);
  return {
    users,
    appointments,
    claims,
    invoices,
    progressNotes,
    prescriptions,
    messages,
    labOrders,
    referrals,
    providerPlans: MOCK_PROVIDER_PLANS,
    patientPlans: MOCK_PATIENT_PLANS,
    auditLog,
  };
};

export const apiGetUser = async (userId: string): Promise<User | null> => {
  await delay(200);
  return users.find(u => u.id === userId) || null;
};

export const apiUpdateUser = async (userId: string, updatedData: Partial<User> | ((currentUser: User) => Partial<User>)): Promise<User | null> => {
  await delay(300);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) return null;

  let updates: Partial<User>;
  if (typeof updatedData === 'function') {
    updates = updatedData(users[userIndex]);
  } else {
    updates = updatedData;
  }

  users[userIndex] = { ...users[userIndex], ...updates };
  return users[userIndex];
};

export const apiAddAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
  await delay(300);
  const newAppt: Appointment = {
    ...appointment,
    id: `appt_${Date.now()}`,
    status: appointment.status || 'Pending'
  } as Appointment;
  appointments.push(newAppt);
  return newAppt;
};

export const apiConfirmAppointment = async (appointmentId: string): Promise<Appointment | null> => {
  await delay(300);
  const index = appointments.findIndex(a => a.id === appointmentId);
  if (index === -1) return null;
  appointments[index] = { ...appointments[index], status: 'Confirmed' };
  return appointments[index];
};

export const apiCancelAppointment = async (appointmentId: string): Promise<Appointment | null> => {
  await delay(300);
  const index = appointments.findIndex(a => a.id === appointmentId);
  if (index === -1) return null;
  appointments[index] = { ...appointments[index], status: 'Cancelled' };
  return appointments[index];
};

export const apiAddClaim = async (claim: Omit<Claim, 'id'>): Promise<Claim> => {
  await delay(300);
  const newClaim = { ...claim, id: `clm_${Date.now()}` } as Claim;
  claims.push(newClaim);
  return newClaim;
};

export const apiAddInvoice = async (invoice: Omit<BillingInvoice, 'id'>): Promise<BillingInvoice> => {
  await delay(300);
  const newInvoice = { ...invoice, id: `inv_${Date.now()}` };
  invoices.push(newInvoice);
  return newInvoice;
};

export const apiMakePayment = async (invoiceId: string, amount: number): Promise<BillingInvoice | null> => {
  await delay(500);
  const index = invoices.findIndex(i => i.id === invoiceId);
  if (index === -1) return null;
  
  const invoice = invoices[index];
  const newAmountDue = Math.max(0, invoice.amountDue - amount);
  const newStatus = newAmountDue === 0 ? 'Paid' : invoice.status;
  
  invoices[index] = { ...invoice, amountDue: newAmountDue, status: newStatus as any };
  return invoices[index];
};

export const apiAddVideoUpdate = async (appointmentId: string, videoUrl: string): Promise<Appointment | null> => {
  await delay(300);
  const index = appointments.findIndex(a => a.id === appointmentId);
  if (index === -1) return null;
  
  const update = { id: `vid_${Date.now()}`, date: new Date().toISOString(), videoUrl };
  const updates = appointments[index].videoUpdates ? [...appointments[index].videoUpdates!, update] : [update];
  
  appointments[index] = { ...appointments[index], videoUpdates: updates };
  return appointments[index];
};

export const apiAddPrescription = async (prescription: Omit<Prescription, 'id' | 'status'>): Promise<Prescription> => {
    await delay(300);
    const newPrescription: Prescription = { ...prescription, id: `rx_${Date.now()}`, status: 'Sent' };
    prescriptions.push(newPrescription);
    return newPrescription;
};

export const apiAddProgressNote = async (note: Omit<ProgressNote, 'id'>): Promise<ProgressNote> => {
    await delay(300);
    const newNote: ProgressNote = { ...note, id: `note_${Date.now()}` };
    progressNotes.push(newNote);
    return newNote;
};

export const apiSendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<Message> => {
    await delay(100);
    const newMessage: Message = { 
        ...message, 
        id: `msg_${Date.now()}`, 
        timestamp: new Date().toISOString(), 
        isRead: false 
    };
    
    // In a real app, we would persist this to the message history.
    // For the mock, we'll just return it and let the UI state update.
    // Optionally, we could push it to the `messages` object if we wanted better persistence in the session.
    
    return newMessage;
};

export const apiMarkMessagesAsRead = async (userId: string, contactId: string): Promise<Message[]> => {
  await delay(200);
  // Mock implementation
  return [];
};

export const apiAddLabOrder = async (order: Omit<LabOrder, 'id'>): Promise<LabOrder> => {
    await delay(300);
    const newOrder: LabOrder = { ...order, id: `lab_${Date.now()}` };
    labOrders.push(newOrder);
    return newOrder;
};

export const apiAddReferral = async (referralData: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>): Promise<Referral> => {
    await delay(300);
    const newReferral: Referral = { 
        ...referralData, 
        id: `ref_${Date.now()}`, 
        createdAt: new Date().toISOString(),
        status: 'Pending' as any,
        type: 'Outgoing',
        auditLog: [{ date: new Date().toISOString(), action: 'Created', status: 'Pending' as any }]
    };
    referrals.push(newReferral);
    return newReferral;
};

export const apiUpdateReferral = async (id: string, updates: Partial<Referral>, actionText: string): Promise<Referral | null> => {
    await delay(300);
    const index = referrals.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    const updatedReferral = { 
        ...referrals[index], 
        ...updates,
        auditLog: [...referrals[index].auditLog, { date: new Date().toISOString(), action: actionText, status: updates.status || referrals[index].status }]
    };
    referrals[index] = updatedReferral;
    return updatedReferral;
};