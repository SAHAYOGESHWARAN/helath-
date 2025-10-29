import React, { createContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { User, UserRole, Claim, ClaimStatus, ClaimType, Appointment, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, VitalsRecord, LabResult, MedicalCondition, Allergy, Surgery, Immunization, FamilyHistory, Lifestyle, HealthGoal, GymMembership, Referral, ReferralStatus, AuditLogEntry, InsuranceInfo } from '../types';
import { MOCK_USERS, MOCK_CLAIMS, MOCK_APPOINTMENTS, MOCK_PROVIDER_PLANS, MOCK_PATIENT_PLANS, MOCK_PROGRESS_NOTES, MOCK_PRESCRIPTIONS, MOCK_MESSAGES, MOCK_INVOICES, MOCK_LAB_ORDERS, MOCK_REFERRALS } from '../mockData';

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password?: string) => void;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole) => void;
  updateUser: (updater: (currentUser: User) => User) => Promise<void>;
  claims: Claim[];
  addClaim: (newClaim: Omit<Claim, 'id'>) => void;
  appointments: Appointment[];
  confirmAppointment: (id: string) => void;
  cancelAppointment: (id: string) => void;
  providerSubscriptionPlans: SubscriptionPlan[];
  patientSubscriptionPlans: SubscriptionPlan[];
  currentSubscription: SubscriptionPlan | undefined;
  changeSubscription: (planId: string) => void;
  progressNotes: ProgressNote[];
  prescriptions: Prescription[];
  addPrescription: (newPrescription: Omit<Prescription, 'id' | 'status'>) => void;
  messages: Record<string, Message[]>; // Thread ID (patientId or providerId) to messages
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessagesAsRead: (threadId: string) => void;
  invoices: BillingInvoice[];
  addInvoice: (newInvoice: Omit<BillingInvoice, 'id'>) => void;
  makePayment: (invoiceId: string, amount: number) => void;
  labOrders: LabOrder[];
  addLabOrder: (newOrder: Omit<LabOrder, 'id'>) => void;
  insurance: InsuranceInfo | undefined;
  updateInsurance: (info: InsuranceInfo) => Promise<void>;
  changePassword: (current: string, newPass: string) => Promise<boolean>;
  verifyUser: (userId: string) => void;
  updateUserStatus: (userId: string, status: 'Active' | 'Suspended' | 'Inactive') => void;
  referrals: Referral[];
  addReferral: (newReferral: Omit<Referral, 'id' | 'status' | 'createdAt' | 'type' | 'auditLog'>) => void;
  updateReferral: (referralId: string, updates: Partial<Referral>, auditLogAction?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'novopath-user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [claims, setClaims] = useState<Claim[]>(MOCK_CLAIMS);
    const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
    const [progressNotes, setProgressNotes] = useState<ProgressNote[]>(MOCK_PROGRESS_NOTES);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(MOCK_PRESCRIPTIONS);
    const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
    const [invoices, setInvoices] = useState<BillingInvoice[]>(MOCK_INVOICES);
    const [labOrders, setLabOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
    const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem(USER_STORAGE_KEY);
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const fullUser = MOCK_USERS.find(u => u.id === parsedUser.id) || parsedUser;
                setUser(fullUser);
            }
        } catch (error) {
            console.error("Failed to parse user from session storage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback((email: string, password?: string) => {
        setLoading(true);
        setTimeout(() => {
            const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (foundUser) {
                const fullUser = MOCK_USERS.find(u => u.id === foundUser.id) || foundUser;
                setUser(fullUser);
                sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fullUser));
            } else {
                // Fallback for demo purposes
                const userRole = email as UserRole;
                 const defaultUser = MOCK_USERS.find(u => u.role === userRole) || MOCK_USERS.find(u => u.role === UserRole.PATIENT)!;
                setUser(defaultUser);
                sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
            }
            setLoading(false);
        }, 500);
    }, []);

    const register = useCallback((userData: Partial<Omit<User, 'id' | 'role' | 'avatarUrl'>>, role: UserRole) => {
        setLoading(true);
        setTimeout(() => {
            const newUser: User = {
                id: `user_${Date.now()}`,
                name: userData.name || '',
                email: userData.email || '',
                ...userData,
                role,
                avatarUrl: `https://picsum.photos/seed/${userData.name}/100`,
                status: 'Active',
                isVerified: role !== UserRole.PROVIDER,
            };
            setUsers(prev => [...prev, newUser]);
            setUser(newUser);
            sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
            setLoading(false);
        }, 500);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem(USER_STORAGE_KEY);
    }, []);

    const updateUser = useCallback(async (updater: (currentUser: User) => User) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const updated = updater(prevUser);
            sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);
    
    const addClaim = useCallback((newClaim: Omit<Claim, 'id'>) => {
        const fullClaim: Claim = { ...newClaim, id: `CLM_${Date.now()}` };
        setClaims(prev => [...prev, fullClaim]);
    }, []);
    
    const addInvoice = useCallback((newInvoice: Omit<BillingInvoice, 'id'>) => {
        const fullInvoice: BillingInvoice = { ...newInvoice, id: `inv_${Date.now()}` };
        setInvoices(prev => [...prev, fullInvoice]);
    }, []);

    const makePayment = useCallback((invoiceId: string, amount: number) => {
        setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
                const newAmountDue = inv.amountDue - amount;
                return { ...inv, amountDue: newAmountDue, status: newAmountDue <= 0 ? 'Paid' : 'Due' };
            }
            return inv;
        }));
    }, []);

    const confirmAppointment = useCallback((id: string) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Confirmed' } : a));
    }, []);
    
    const cancelAppointment = useCallback((id: string) => {
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    }, []);
    
    const changeSubscription = useCallback((planId: string) => {
        updateUser(u => ({...u, subscription: { planId, status: 'Active', renewalDate: '2025-09-01' }}));
    }, [updateUser]);

    const addPrescription = useCallback((newPrescription: Omit<Prescription, 'id' | 'status'>) => {
        const fullRx: Prescription = { ...newPrescription, id: `rx_${Date.now()}`, status: 'Sent' };
        setPrescriptions(prev => [fullRx, ...prev]);
    }, []);

    const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
        const fullMessage: Message = { ...message, id: `msg_${Date.now()}`, timestamp: new Date().toISOString(), isRead: false };
        const threadId = message.senderId === user?.id ? message.receiverId : message.senderId;
        setMessages(prev => ({
            ...prev,
            [threadId]: [...(prev[threadId] || []), fullMessage]
        }));
        // Simulate reply
        setTimeout(() => {
            const reply: Message = {
                id: `msg_reply_${Date.now()}`,
                senderId: message.receiverId,
                receiverId: message.senderId,
                text: "Thank you for your message. I will get back to you shortly.",
                timestamp: new Date().toISOString(),
                isRead: false,
            };
            setMessages(prev => ({
                ...prev,
                [threadId]: [...(prev[threadId] || []), reply]
            }));
        }, 1500);
    }, [user]);

    const markMessagesAsRead = useCallback((threadId: string) => {
        setMessages(prev => {
            const thread = prev[threadId];
            if (!thread) return prev;
            return {
                ...prev,
                [threadId]: thread.map(msg => msg.senderId !== user?.id ? { ...msg, isRead: true } : msg)
            };
        });
    }, [user]);

    const addLabOrder = useCallback((newOrder: Omit<LabOrder, 'id'>) => {
        const fullOrder: LabOrder = { ...newOrder, id: `lo_${Date.now()}` };
        setLabOrders(prev => [fullOrder, ...prev]);
    }, []);
    
    const updateInsurance = useCallback(async (info: InsuranceInfo) => {
        await updateUser(u => ({...u, insurance: info}));
    }, [updateUser]);

    const changePassword = useCallback(async (current: string, newPass: string) => {
        console.log({current, newPass}); // Mock
        return true;
    }, []);
    
    const verifyUser = useCallback((userId: string) => {
        setUsers(prev => prev.map(u => u.id === userId ? {...u, isVerified: true} : u));
    }, []);

    const updateUserStatus = useCallback((userId: string, status: 'Active' | 'Suspended' | 'Inactive') => {
        setUsers(prev => prev.map(u => u.id === userId ? {...u, status} : u));
    }, []);

    const addReferral = useCallback((newReferral: Omit<Referral, 'id' | 'status' | 'createdAt' | 'type' | 'auditLog'>) => {
        const now = new Date().toISOString();
        const patient = users.find(u => u.id === newReferral.patientId);
        const newLog: AuditLogEntry = { date: now, action: 'Referral Created', status: ReferralStatus.PENDING };
        const fullReferral: Referral = {
            ...newReferral,
            id: `ref_${Date.now()}`,
            status: ReferralStatus.PENDING,
            createdAt: now,
            type: 'Outgoing',
            patientName: patient?.name || 'Unknown',
            auditLog: [newLog],
        };
        setReferrals(prev => [fullReferral, ...prev]);
    }, [users]);
    
    const updateReferral = useCallback(async (referralId: string, updates: Partial<Referral>, auditLogAction?: string) => {
        setReferrals(prev => prev.map(r => {
            if (r.id === referralId) {
                const updatedReferral = { ...r, ...updates, updatedAt: new Date().toISOString() };
                if (updates.status && updates.status !== r.status) {
                    const newLogEntry: AuditLogEntry = {
                        date: new Date().toISOString(),
                        action: auditLogAction || `Status changed to ${updates.status}`,
                        status: updates.status,
                    };
                    updatedReferral.auditLog = [newLogEntry, ...(updatedReferral.auditLog || [])];
                }
                return updatedReferral;
            }
            return r;
        }));
    }, []);

    const currentSubscription = useMemo(() => {
        if (!user || !user.subscription) return undefined;
        return [...MOCK_PROVIDER_PLANS, ...MOCK_PATIENT_PLANS].find(p => p.id === user.subscription?.planId);
    }, [user]);

    const insurance = useMemo(() => user?.insurance, [user]);

    const value = {
        user, users, loading, login, logout, register, updateUser, claims, addClaim, appointments, 
        confirmAppointment, cancelAppointment, providerSubscriptionPlans: MOCK_PROVIDER_PLANS, 
        patientSubscriptionPlans: MOCK_PATIENT_PLANS, currentSubscription, changeSubscription, progressNotes,
        prescriptions, addPrescription, messages, sendMessage, markMessagesAsRead, invoices, addInvoice, makePayment,
        labOrders, addLabOrder, insurance, updateInsurance, changePassword, verifyUser, updateUserStatus,
        referrals, addReferral, updateReferral,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};