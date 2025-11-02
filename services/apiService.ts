import {
  MOCK_USERS, MOCK_APPOINTMENTS, MOCK_CLAIMS, MOCK_PROVIDER_PLANS, MOCK_PATIENT_PLANS,
  MOCK_PROGRESS_NOTES, MOCK_PRESCRIPTIONS, MOCK_MESSAGES, MOCK_INVOICES, MOCK_LAB_ORDERS,
  MOCK_REFERRALS, MOCK_AUDIT_LOG
} from '../mockData';
import { User, Appointment, Claim, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, Referral, SystemAuditLog, UserRole, InsuranceInfo, MedicalCondition, Allergy, HealthGoal, Task, Subtask, Subscription, ReminderSettings, ReferralStatus, AuditLogEntry } from '../types';

const SIMULATED_LATENCY = 150;

// In a real application, this would be a proper data store or would be refetched.
// For this simulation, we'll just modify the imported mock data arrays directly for mutations.
let users: User[] = JSON.parse(JSON.stringify(MOCK_USERS));
let appointments: Appointment[] = JSON.parse(JSON.stringify(MOCK_APPOINTMENTS));
let claims: Claim[] = JSON.parse(JSON.stringify(MOCK_CLAIMS));
let invoices: BillingInvoice[] = JSON.parse(JSON.stringify(MOCK_INVOICES));
let progressNotes: ProgressNote[] = JSON.parse(JSON.stringify(MOCK_PROGRESS_NOTES));
let prescriptions: Prescription[] = JSON.parse(JSON.stringify(MOCK_PRESCRIPTIONS));
let messages: Record<string, Message[]> = JSON.parse(JSON.stringify(MOCK_MESSAGES));
let labOrders: LabOrder[] = JSON.parse(JSON.stringify(MOCK_LAB_ORDERS));
let referrals: Referral[] = JSON.parse(JSON.stringify(MOCK_REFERRALS));

// --- API Request Simulation ---
const apiRequest = <T>(data: T): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), SIMULATED_LATENCY));

// --- Auth Endpoints ---
export const apiLogin = (email: string, password?: string): Promise<User | null> => {
  const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (foundUser && (!password || foundUser.password === password)) {
    return apiRequest(foundUser);
  }
  return apiRequest(null);
};

export const apiRegister = (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole): Promise<User> => {
    const newUser: User = {
        id: `user_${Date.now()}`,
        ...userData,
        role: role,
        avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
        status: 'Active',
        isVerified: role !== UserRole.PROVIDER,
        notificationSettings: { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: false, pushAll: false },
    };
    users.push(newUser);
    return apiRequest(newUser);
};

export const apiChangePassword = (current: string, newPass: string): Promise<boolean> => {
    // Mock implementation - always succeeds
    return apiRequest(true);
};

// --- Data Fetching Endpoints ---
export const fetchAllData = () => {
    return Promise.all([
        apiRequest(users),
        apiRequest(appointments),
        apiRequest(claims),
        apiRequest(invoices),
        apiRequest(progressNotes),
        apiRequest(prescriptions),
        apiRequest(messages),
        apiRequest(labOrders),
        apiRequest(referrals),
        apiRequest(MOCK_PROVIDER_PLANS),
        apiRequest(MOCK_PATIENT_PLANS),
        apiRequest(MOCK_AUDIT_LOG),
    ]).then(([users, appointments, claims, invoices, progressNotes, prescriptions, messages, labOrders, referrals, providerPlans, patientPlans, auditLog]) => ({
        users, appointments, claims, invoices, progressNotes, prescriptions, messages, labOrders, referrals, providerPlans, patientPlans, auditLog
    }));
}

// --- Data Mutation Endpoints ---
export const apiUpdateUser = (userId: string, updatedData: Partial<User> | ((currentUser: User) => Partial<User>)): Promise<User | null> => {
    let updatedUser: User | null = null;
    users = users.map(u => {
        if (u.id === userId) {
            const updates = typeof updatedData === 'function' ? updatedData(u) : updatedData;
            updatedUser = { ...u, ...updates };
            return updatedUser;
        }
        return u;
    });
    return apiRequest(updatedUser);
};

export const apiAddAppointment = (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
    const newAppointment: Appointment = {
        ...appointment,
        id: `appt_${Date.now()}`,
    };
    appointments.push(newAppointment);
    return apiRequest(newAppointment);
};

export const apiConfirmAppointment = (appointmentId: string): Promise<Appointment | null> => {
    let updatedAppt: Appointment | null = null;
    appointments = appointments.map(a => {
        if (a.id === appointmentId) {
            updatedAppt = { ...a, status: 'Confirmed' };
            return updatedAppt;
        }
        return a;
    });
    return apiRequest(updatedAppt);
};

export const apiCancelAppointment = (appointmentId: string): Promise<Appointment | null> => {
    let updatedAppt: Appointment | null = null;
    appointments = appointments.map(a => {
        if (a.id === appointmentId) {
            updatedAppt = { ...a, status: 'Cancelled' };
            return updatedAppt;
        }
        return a;
    });
    return apiRequest(updatedAppt);
};

export const apiAddVideoUpdate = (appointmentId: string, videoUrl: string): Promise<Appointment | null> => {
    let updatedAppt: Appointment | null = null;
    appointments = appointments.map(appt => {
        if (appt.id === appointmentId) {
            const newUpdate = { id: `vid_${Date.now()}`, date: new Date().toISOString(), videoUrl };
            updatedAppt = { ...appt, videoUpdates: [...(appt.videoUpdates || []), newUpdate] };
            return updatedAppt;
        }
        return appt;
    });
    return apiRequest(updatedAppt);
};

export const apiAddClaim = (claim: Omit<Claim, 'id'>): Promise<Claim> => {
    const newClaim: Claim = { ...claim, id: `CLM${Date.now()}` };
    claims.push(newClaim);
    return apiRequest(newClaim);
};

export const apiAddInvoice = (invoice: Omit<BillingInvoice, 'id'>): Promise<BillingInvoice> => {
    const newInvoice: BillingInvoice = { ...invoice, id: `inv_${Date.now()}` };
    invoices.push(newInvoice);
    return apiRequest(newInvoice);
};

export const apiMakePayment = (invoiceId: string, amount: number): Promise<BillingInvoice | null> => {
    let updatedInvoice: BillingInvoice | null = null;
    invoices = invoices.map(inv => {
        if (inv.id === invoiceId) {
            const newAmountDue = inv.amountDue - amount;
            updatedInvoice = {
                ...inv,
                amountDue: newAmountDue,
                status: newAmountDue <= 0 ? 'Paid' : 'Due',
            };
            return updatedInvoice;
        }
        return inv;
    });
    return apiRequest(updatedInvoice);
};

export const apiAddProgressNote = (note: Omit<ProgressNote, 'id'>): Promise<ProgressNote> => {
    const newNote: ProgressNote = { ...note, id: `note_${Date.now()}` };
    progressNotes.push(newNote);
    return apiRequest(newNote);
};

export const apiAddPrescription = (prescription: Omit<Prescription, 'id' | 'status'>): Promise<Prescription> => {
    const newPrescription: Prescription = { ...prescription, id: `rx_${Date.now()}`, status: 'Sent' };
    prescriptions.push(newPrescription);
    return apiRequest(newPrescription);
};

export const apiSendMessage = (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<Message> => {
    const newMessage: Message = { ...message, id: `msg_${Date.now()}`, timestamp: new Date().toISOString(), isRead: false };
    const key = [message.senderId, message.receiverId].sort().join('-');
    messages[key] = [...(messages[key] || []), newMessage];
    return apiRequest(newMessage);
};

export const apiMarkMessagesAsRead = (userId: string, contactId: string): Promise<Message[]> => {
    const key = [userId, contactId].sort().join('-');
    messages[key] = (messages[key] || []).map(m => m.receiverId === userId && !m.isRead ? { ...m, isRead: true } : m);
    return apiRequest(messages[key]);
};

export const apiAddLabOrder = (order: Omit<LabOrder, 'id'>): Promise<LabOrder> => {
    const newOrder: LabOrder = { ...order, id: `lo_${Date.now()}` };
    labOrders.push(newOrder);
    return apiRequest(newOrder);
};

export const apiAddReferral = (referralData: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>): Promise<Referral> => {
    const now = new Date().toISOString();
    const newReferral: Referral = {
        ...referralData,
        id: `ref_${Date.now()}`,
        createdAt: now,
        status: ReferralStatus.PENDING,
        type: 'Outgoing',
        auditLog: [{ date: now, action: 'Referral Created', status: ReferralStatus.PENDING }]
    };
    referrals.push(newReferral);
    return apiRequest(newReferral);
};

export const apiUpdateReferral = (id: string, updates: Partial<Referral>, actionText: string): Promise<Referral | null> => {
    let updatedReferral: Referral | null = null;
    referrals = referrals.map(r => {
        if (r.id === id) {
            const newLog: AuditLogEntry = { date: new Date().toISOString(), action: actionText, status: updates.status || r.status };
            updatedReferral = { ...r, ...updates, auditLog: [...r.auditLog, newLog] };
            return updatedReferral;
        }
        return r;
    });
    return apiRequest(updatedReferral);
};
