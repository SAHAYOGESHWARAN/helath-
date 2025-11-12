import { User, Appointment, Claim, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, Referral, UserRole } from '@/types';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('novopath-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiLogin = async (email: string, password?: string): Promise<{ user: User; token: string } | null> => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      const { user } = await apiVerifyToken(data.token);
      return { user, token: data.token };
    }
    return null;
  } catch (error) {
    console.error('Login failed:', error);
    return null;
  }
};

export const apiVerifyToken = async (token: string): Promise<{ user: User }> => {
  const { data } = await api.post('/auth/verify', { token });
  return data;
};

export const apiRegister = async (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole): Promise<User> => {
  const { data } = await api.post('/genai/register', { ...userData, role });
  return data;
};

export const apiChangePassword = async (current: string, newPass: string): Promise<boolean> => {
  try {
    await api.post('/genai/change-password', { current, newPass });
    return true;
  } catch (error) {
    console.error('Password change failed:', error);
    return false;
  }
};

export const fetchAllData = async () => {
  const results = await Promise.allSettled([
    api.get('/emr/records'),
    api.get('/scheduling/appointments'),
    api.get('/emr/claims'),
    api.get('/emr/invoices'),
    api.get('/notes/notes'),
    api.get('/emr/prescriptions'),
    api.get('/emr/messages'),
    api.get('/emr/lab-orders'),
    api.get('/emr/referrals'),
    api.get('/genai/provider-plans'),
    api.get('/genai/patient-plans'),
    api.get('/genai/audit-log'),
  ]);

  const getData = (result) => (result.status === 'fulfilled' ? result.value.data : []);

  const [users, appointments, claims, invoices, progressNotes, prescriptions, messages, labOrders, referrals, providerPlans, patientPlans, auditLog] = results.map(getData);

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
    providerPlans,
    patientPlans,
    auditLog,
  };
};

export const apiUpdateUser = async (userId: string, updatedData: Partial<User> | ((currentUser: User) => Partial<User>)): Promise<User | null> => {
  try {
    const { data } = await api.put(`/emr/records/${userId}`, updatedData);
    return data;
  } catch (error) {
    console.error('User update failed:', error);
    return null;
  }
};

export const apiAddAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const { data } = await api.post('/scheduling/appointments', appointment);
  return data;
};

export const apiConfirmAppointment = async (appointmentId: string): Promise<Appointment | null> => {
  try {
    const { data } = await api.put(`/scheduling/appointments/${appointmentId}/confirm`);
    return data;
  } catch (error) {
    console.error('Appointment confirmation failed:', error);
    return null;
  }
};

export const apiCancelAppointment = async (appointmentId: string): Promise<Appointment | null> => {
  try {
    const { data } = await api.put(`/scheduling/appointments/${appointmentId}/cancel`);
    return data;
  } catch (error) {
    console.error('Appointment cancellation failed:', error);
    return null;
  }
};

export const apiAddClaim = async (claim: Omit<Claim, 'id'>): Promise<Claim> => {
    const { data } = await api.post('/emr/claims', claim);
    return data;
};

export const apiAddInvoice = async (invoice: Omit<BillingInvoice, 'id'>): Promise<BillingInvoice> => {
    const { data } = await api.post('/emr/invoices', invoice);
    return data;
};

export const apiMakePayment = async (invoiceId: string, amount: number): Promise<BillingInvoice> => {
    const { data } = await api.post(`/emr/invoices/${invoiceId}/pay`, { amount });
    return data;
};

export const apiAddVideoUpdate = async (appointmentId: string, videoUrl: string): Promise<Appointment | null> => {
    try {
        const { data } = await api.post(`/scheduling/appointments/${appointmentId}/video-update`, { videoUrl });
        return data;
    } catch (error) {
        console.error('Failed to add video update:', error);
        return null;
    }
};

export const apiAddPrescription = async (prescription: Omit<Prescription, 'id' | 'status'>): Promise<Prescription> => {
    const { data } = await api.post('/emr/prescriptions', prescription);
    return data;
};

export const apiAddProgressNote = async (note: Omit<ProgressNote, 'id'>): Promise<ProgressNote> => {
    const { data } = await api.post('/notes/notes', note);
    return data;
};

export const apiSendMessage = async (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>): Promise<Message> => {
    const { data } = await api.post('/emr/messages', message);
    return data;
};

export const apiMarkMessagesAsRead = async (userId: string, contactId: string): Promise<Message[]> => {
    const { data } = await api.put(`/emr/messages/read/${userId}/${contactId}`);
    return data;
};

export const apiAddLabOrder = async (order: Omit<LabOrder, 'id'>): Promise<LabOrder> => {
    const { data } = await api.post('/emr/lab-orders', order);
    return data;
};

export const apiAddReferral = async (referralData: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>): Promise<Referral> => {
    const { data } = await api.post('/emr/referrals', referralData);
    return data;
};

export const apiUpdateReferral = async (id: string, updates: Partial<Referral>, actionText: string): Promise<Referral | null> => {
    try {
        const { data } = await api.put(`/emr/referrals/${id}`, { updates, actionText });
        return data;
    } catch (error) {
        console.error('Referral update failed:', error);
        return null;
    }
};
