
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole, Appointment, Medication, LabResult, HealthGoal, Allergy, Surgery, FamilyHistoryEntry, ImmunizationRecord, LifestyleInfo, VitalsRecord, InsuranceInfo, Claim, ProgressNote, Prescription, Referral, SubscriptionPlan, BillingInvoice, ClaimStatus, ClaimType } from '../types';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_CLAIMS, MOCK_INVOICES, MOCK_PRESCRIPTIONS, MOCK_PROGRESS_NOTES, MOCK_REFERRALS, MOCK_PATIENT_PLANS, MOCK_PROVIDER_PLANS } from '../mockData'; // Using a separate mock data file for cleanliness

// --- Context Type Definition ---
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
  register: (userData: Partial<User>, role: UserRole) => void;
  updateUser: (updateFn: (currentUser: User) => User) => Promise<void>;
  
  // Data for the whole app
  users: User[];
  appointments: Appointment[];
  claims: Claim[];
  invoices: BillingInvoice[];
  prescriptions: Prescription[];
  progressNotes: ProgressNote[];
  referrals: Referral[];
  insurance: InsuranceInfo | null;
  currentSubscription: SubscriptionPlan | null;
  patientSubscriptionPlans: SubscriptionPlan[];
  providerSubscriptionPlans: SubscriptionPlan[];

  // Functions to modify data
  addAppointment: (appt: Omit<Appointment, 'id' | 'status' | 'patientName'>) => boolean;
  cancelAppointment: (id: string) => void;
  confirmAppointment: (id: string) => void;
  submitAppointmentFeedback: (id: string, summary: string) => void;
  addClaim: (claim: Omit<Claim, 'id'>) => void;
  makePayment: (invoiceId: string, amount: number) => void;
  addPrescription: (rx: Omit<Prescription, 'id' | 'status'>) => void;
  addNote: (note: Omit<ProgressNote, 'id' | 'status'>) => void;
  updateNote: (note: ProgressNote) => void;
  addReferral: (ref: Omit<Referral, 'id' | 'status'>) => void;
  updateInsurance: (info: InsuranceInfo) => Promise<void>;
  changeSubscription: (planId: string) => void;
  changePassword: (current: string, newPass: string) => Promise<boolean>;
  markMessagesAsRead: (contactId: string) => void;
  sendMessage: (message: any) => void;
  messages: any;

  // Admin functions
  verifyUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: 'Active' | 'Suspended') => void;
}

// --- Create Context ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider Component ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // App-wide data state
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(MOCK_INVOICES);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);
  const [progressNotes, setProgressNotes] = useState<ProgressNote[]>(MOCK_PROGRESS_NOTES);
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [insurance, setInsurance] = useState<InsuranceInfo | null>({ provider: 'Blue Cross', planName: 'PPO Gold', memberId: 'XG123456789', groupId: 'GRP9876' });
  
  // Mock messages
   const [messages, setMessages] = useState<Record<string, any>>({
    'provider-1': [
      { id: 'msg1', senderId: 'provider-1', receiverId: 'patient-1', text: 'Hello Jane, just following up on your recent lab results.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isRead: false },
      { id: 'msg2', senderId: 'patient-1', receiverId: 'provider-1', text: 'Hi Dr. Smith! Thanks for reaching out. Is everything okay?', timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), isRead: true },
    ]
  });

  // Load user from localStorage on initial render
  useEffect(() => {
    setTimeout(() => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
      setLoading(false);
    }, 1000); // Simulate network delay
  }, []);
  
  const login = useCallback((email: string) => {
    setLoading(true);
    setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('user', JSON.stringify(foundUser));
        } else {
            alert('User not found!');
        }
        setLoading(false);
    }, 800);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);

  const register = useCallback((userData: Partial<User>, role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
        const newUser: User = {
            id: role === UserRole.PATIENT ? `patient-${Date.now()}` : `provider-${Date.now()}`,
            name: userData.name || '',
            email: userData.email || '',
            role: role,
            avatarUrl: `https://i.pravatar.cc/150?u=${userData.email}`,
            isVerified: role === UserRole.PATIENT, // Patients are auto-verified
            status: 'Active',
            ...userData
        };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setLoading(false);
    }, 1200);
  }, []);

  const updateUser = useCallback(async (updateFn: (currentUser: User) => User) => {
    setUser(prevUser => {
        if (!prevUser) return null;
        const updatedUser = updateFn(prevUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        
        return updatedUser;
    });
  }, []);

  const addAppointment = useCallback((appt: Omit<Appointment, 'id' | 'status' | 'patientName'>) => {
    if (!user) return false;
    const newAppt: Appointment = {
        ...appt,
        id: `appt_${Date.now()}`,
        patientName: user.name,
        status: 'Pending',
    };
    setAppointments(prev => [newAppt, ...prev]);
    return true;
  }, [user]);
  
  const cancelAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
  }, []);
  
  const confirmAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmed' } : a));
  }, []);
  
  const submitAppointmentFeedback = useCallback((id: string, summary: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, visitSummary: summary } : a));
  }, []);

  const changeSubscription = useCallback((planId: string) => {
      const allPlans = [...MOCK_PATIENT_PLANS, ...MOCK_PROVIDER_PLANS];
      const newPlan = allPlans.find(p => p.id === planId);
      if (newPlan && user) {
          const subscriptionData = {
              planId: newPlan.id,
              planName: newPlan.name,
              status: 'Active' as const,
              renewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString(),
          };
          updateUser(currentUser => ({...currentUser, subscription: subscriptionData }));
      }
  }, [user, updateUser]);

  const verifyUser = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: true } : u));
  }, []);

  const updateUserStatus = useCallback((userId: string, status: 'Active' | 'Suspended') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  }, []);
  
  // Combine all other state modification functions...
  const addClaim = (claim: Omit<Claim, 'id'>) => setClaims(prev => [{ ...claim, id: `claim_${Date.now()}` }, ...prev]);
  const makePayment = (invoiceId: string, amount: number) => {
    setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
            const newAmountDue = inv.amountDue - amount;
            return {
                ...inv,
                amountDue: newAmountDue,
                status: newAmountDue <= 0 ? 'Paid' : 'Due',
                date: new Date().toLocaleDateString(),
            };
        }
        return inv;
    }));
  };
  const addPrescription = (rx: Omit<Prescription, 'id' | 'status'>) => setPrescriptions(prev => [{ ...rx, id: `rx_${Date.now()}`, status: 'Sent' }, ...prev]);
  const addNote = (note: Omit<ProgressNote, 'id' | 'status'>) => setProgressNotes(prev => [{ ...note, id: `note_${Date.now()}`, status: 'Draft' }, ...prev]);
  const updateNote = (note: ProgressNote) => setProgressNotes(prev => prev.map(n => n.id === note.id ? note : n));
  const addReferral = (ref: Omit<Referral, 'id' | 'status'>) => setReferrals(prev => [{ ...ref, id: Date.now(), status: 'Pending' }, ...prev]);
  const updateInsurance = async (info: InsuranceInfo) => { setInsurance(info); };
  const changePassword = async (current: string, newPass: string) => { return true; };
  const markMessagesAsRead = (contactId: string) => {
      setMessages(prev => ({
          ...prev,
          [contactId]: (prev[contactId] || []).map((msg: any) => ({ ...msg, isRead: true }))
      }));
  };
   const sendMessage = (message: any) => {
    const receiverId = message.receiverId === user?.id ? message.senderId : message.receiverId;
    const newMessage = { ...message, id: `msg_${Date.now()}`, timestamp: new Date().toISOString(), isRead: false };

    setMessages(prev => ({
      ...prev,
      [receiverId]: [...(prev[receiverId] || []), newMessage]
    }));
  };
  
  const currentSubscription = user?.role === UserRole.PATIENT 
    ? MOCK_PATIENT_PLANS.find(p => p.name === user?.subscription?.planName) || null
    : MOCK_PROVIDER_PLANS.find(p => p.name === user?.subscription?.planName) || null;

  // --- Value provided to consumers ---
  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
    updateUser,
    users,
    appointments,
    claims,
    invoices,
    prescriptions,
    progressNotes,
    referrals,
    insurance,
    currentSubscription,
    patientSubscriptionPlans: MOCK_PATIENT_PLANS,
    providerSubscriptionPlans: MOCK_PROVIDER_PLANS,
    addAppointment,
    cancelAppointment,
    confirmAppointment,
    submitAppointmentFeedback,
    addClaim,
    makePayment,
    addPrescription,
    addNote,
    updateNote,
    addReferral,
    updateInsurance,
    changeSubscription,
    changePassword,
    markMessagesAsRead,
    sendMessage,
    messages,
    verifyUser,
    updateUserStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};