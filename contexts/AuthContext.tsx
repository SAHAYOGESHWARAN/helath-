import React, { createContext, useState, ReactNode, useCallback, useEffect, useMemo } from 'react';
// FIX: Add missing Subscription type import.
import { User, UserRole, Claim, ClaimStatus, ClaimType, Appointment, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, VitalsRecord, LabResult, MedicalCondition, Allergy, Surgery, Immunization, FamilyHistory, Lifestyle, HealthGoal, GymMembership, Referral, ReferralStatus, AuditLogEntry, InsuranceInfo, ReminderSettings, Task, Subtask, Subscription, SystemAuditLog } from '../types';
import { MOCK_USERS, MOCK_APPOINTMENTS, MOCK_CLAIMS, MOCK_PROVIDER_PLANS, MOCK_PATIENT_PLANS, MOCK_PROGRESS_NOTES, MOCK_PRESCRIPTIONS, MOCK_MESSAGES, MOCK_INVOICES, MOCK_LAB_ORDERS, MOCK_REFERRALS, MOCK_AUDIT_LOG } from '../mockData';

export interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole) => void;
  updateUser: (updatedData: Partial<User> | ((currentUser: User) => Partial<User>)) => Promise<void>;
  
  // Patient-specific
  appointments: Appointment[];
  claims: Claim[];
  invoices: BillingInvoice[];
  currentSubscription: SubscriptionPlan | undefined;
  changeSubscription: (planId: string) => void;
  patientSubscriptionPlans: SubscriptionPlan[];
  addAppointment: (appointment: Omit<Appointment, 'id'>, reminder?: ReminderSettings) => void;
  addVideoUpdateToAppointment: (appointmentId: string, videoUrl: string) => void;
  makePayment: (invoiceId: string, amount: number) => void;
  insurance: InsuranceInfo | null;
  updateInsurance: (data: InsuranceInfo) => Promise<void>;

  // Provider-specific data
  progressNotes: ProgressNote[];
  addProgressNote: (note: Omit<ProgressNote, 'id'>) => void;
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id' | 'status'>) => void;
  messages: Record<string, Message[]>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessagesAsRead: (contactId: string) => void;
  providerSubscriptionPlans: SubscriptionPlan[];
  confirmAppointment: (appointmentId: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  labOrders: LabOrder[];
  addLabOrder: (newOrder: Omit<LabOrder, 'id'>) => void;
  
  // Referrals
  referrals: Referral[];
  addReferral: (newReferral: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>) => void;
  updateReferral: (id: string, updates: Partial<Referral>, actionText: string) => void;

  // Generic data actions for patient
  changePassword: (current: string, newPass: string) => Promise<boolean>;
  reminders: Record<string, ReminderSettings>;
  addCondition: (condition: Omit<MedicalCondition, 'id'>) => void;
  addAllergy: (allergy: Omit<Allergy, 'id'>) => void;

  // Health Goals
  addHealthGoal: (goal: Omit<HealthGoal, 'id'>) => void;
  updateHealthGoal: (goal: HealthGoal) => void;
  deleteHealthGoal: (goalId: string) => void;

  // Tasks
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addSubtask: (taskId: string, text: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  
  // FIX: Add missing properties
  addClaim: (claim: Omit<Claim, 'id'>) => void;
  addInvoice: (invoice: Omit<BillingInvoice, 'id'>) => void;
  auditLog: SystemAuditLog[];
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
    const [claims, setClaims] = useState(MOCK_CLAIMS);
    const [invoices, setInvoices] = useState(MOCK_INVOICES);
    const [progressNotes, setProgressNotes] = useState(MOCK_PROGRESS_NOTES);
    const [prescriptions, setPrescriptions] = useState(MOCK_PRESCRIPTIONS);
    const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);
    const [labOrders, setLabOrders] = useState(MOCK_LAB_ORDERS);
    const [referrals, setReferrals] = useState(MOCK_REFERRALS);
    const [reminders, setReminders] = useState<Record<string, ReminderSettings>>({});

    useEffect(() => {
        try {
            const storedUser = sessionStorage.getItem('novopath-user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const fullUser = users.find(u => u.id === parsedUser.id) || parsedUser;
                setUser(fullUser);
            }
        } catch (error) {
            console.error('Failed to parse user from session storage', error);
        } finally {
            setLoading(false);
        }
    }, [users]);

    const login = useCallback(async (email: string, password?: string): Promise<boolean> => {
        setLoading(true);
        return new Promise(resolve => {
            setTimeout(() => {
                const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
                if (foundUser && foundUser.password === password) {
                    setUser(foundUser);
                    sessionStorage.setItem('novopath-user', JSON.stringify(foundUser));
                    resolve(true);
                } else {
                    resolve(false);
                }
                setLoading(false);
            }, 500);
        });
    }, [users]);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem('novopath-user');
    }, []);

    const register = useCallback((userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole) => {
        setLoading(true);
        setTimeout(() => {
            const newUser: User = {
                id: `user_${Date.now()}`,
                ...userData,
                role: role,
                avatarUrl: `https://picsum.photos/seed/${userData.name}/100`,
                status: 'Active',
                isVerified: role !== UserRole.PROVIDER,
                 notificationSettings: { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: false, pushAll: false },
            };
            setUsers(prev => [...prev, newUser]);
            setUser(newUser);
            sessionStorage.setItem('novopath-user', JSON.stringify(newUser));
            setLoading(false);
        }, 500);
    }, []);

    const updateUser = useCallback(async (updatedData: Partial<User> | ((currentUser: User) => Partial<User>)) => {
        setUser(currentUser => {
            if (!currentUser) return null;
            const updates = typeof updatedData === 'function' ? updatedData(currentUser) : updatedData;
            const updatedUser = { ...currentUser, ...updates };
            sessionStorage.setItem('novopath-user', JSON.stringify(updatedUser));
            return updatedUser;
        });
        setUsers(currentUsers => currentUsers.map(u => u.id === user?.id ? { ...u, ...(typeof updatedData === 'function' ? updatedData(u) : updatedData) } : u));
    }, [user?.id]);
    
    // ... other actions
    const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>, reminder?: ReminderSettings) => {
        const newAppointment: Appointment = {
            ...appointment,
            id: `appt_${Date.now()}`
        };
        setAppointments(prev => [...prev, newAppointment]);
        if (reminder) {
            setReminders(prev => ({...prev, [newAppointment.id]: reminder}));
        }
    }, []);

    const addVideoUpdateToAppointment = useCallback((appointmentId: string, videoUrl: string) => {
        setAppointments(prev => prev.map(appt => {
            if (appt.id === appointmentId) {
                const newUpdate = { id: `vid_${Date.now()}`, date: new Date().toISOString(), videoUrl };
                return { ...appt, videoUpdates: [...(appt.videoUpdates || []), newUpdate] };
            }
            return appt;
        }));
    }, []);

    const makePayment = useCallback((invoiceId: string, amount: number) => {
        setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
                const newAmountDue = inv.amountDue - amount;
                return {
                    ...inv,
                    amountDue: newAmountDue,
                    status: newAmountDue <= 0 ? 'Paid' : 'Due', // Simplified
                };
            }
            return inv;
        }));
    }, []);
    
     const updateInsurance = useCallback(async (data: InsuranceInfo) => {
        await updateUser({ insurance: data });
    }, [updateUser]);

    const changeSubscription = useCallback((planId: string) => {
        if (user) {
            const newSub: Subscription = {
                planId,
                status: 'Active',
                renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            };
            updateUser({ subscription: newSub });
        }
    }, [user, updateUser]);

    const addProgressNote = useCallback((note: Omit<ProgressNote, 'id'>) => {
        setProgressNotes(prev => [...prev, { ...note, id: `note_${Date.now()}` }]);
    }, []);

    const addPrescription = useCallback((prescription: Omit<Prescription, 'id' | 'status'>) => {
        setPrescriptions(prev => [...prev, { ...prescription, id: `rx_${Date.now()}`, status: 'Sent' }]);
    }, []);

    const addClaim = useCallback((claim: Omit<Claim, 'id'>) => {
        setClaims(prev => [...prev, { ...claim, id: `CLM${Date.now()}` }]);
    }, []);

    const addInvoice = useCallback((invoice: Omit<BillingInvoice, 'id'>) => {
        setInvoices(prev => [...prev, { ...invoice, id: `inv_${Date.now()}` }]);
    }, []);

    const sendMessage = useCallback((message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
        const key = user?.role === UserRole.PROVIDER ? message.receiverId : user?.id === message.senderId ? message.receiverId : message.senderId;
        if (!key) return;
        const newMessage: Message = { ...message, id: `msg_${Date.now()}`, timestamp: new Date().toISOString(), isRead: false };
        setMessages(prev => ({ ...prev, [key]: [...(prev[key] || []), newMessage] }));
    }, [user]);

    const markMessagesAsRead = useCallback((contactId: string) => {
        if (!user) return;
        setMessages(prev => {
            const chatHistory = prev[contactId] || [];
            return {
                ...prev,
                [contactId]: chatHistory.map(m => m.senderId !== user.id && !m.isRead ? { ...m, isRead: true } : m)
            };
        });
    }, [user]);

    const confirmAppointment = useCallback((appointmentId: string) => {
        setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Confirmed' } : a));
    }, []);

    const cancelAppointment = useCallback((appointmentId: string) => {
        setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Cancelled' } : a));
    }, []);

     const addLabOrder = useCallback((newOrder: Omit<LabOrder, 'id'>) => {
        setLabOrders(prev => [...prev, { ...newOrder, id: `lo_${Date.now()}` }]);
    }, []);
    
    const addReferral = useCallback((newReferral: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>) => {
        const now = new Date().toISOString();
        const referral: Referral = {
            ...newReferral,
            id: `ref_${Date.now()}`,
            createdAt: now,
            status: ReferralStatus.PENDING,
            type: 'Outgoing',
            auditLog: [{ date: now, action: 'Referral Created', status: ReferralStatus.PENDING }]
        };
        setReferrals(prev => [...prev, referral]);
    }, []);
    
    const updateReferral = useCallback((id: string, updates: Partial<Referral>, actionText: string) => {
        setReferrals(prev => prev.map(r => {
            if (r.id === id) {
                const newLog: AuditLogEntry = { date: new Date().toISOString(), action: actionText, status: updates.status || r.status };
                return { ...r, ...updates, auditLog: [...r.auditLog, newLog] };
            }
            return r;
        }));
    }, []);

     const changePassword = useCallback(async (current: string, newPass: string) => {
        // Mock implementation
        return true;
    }, []);

    const addHealthGoal = useCallback((goal: Omit<HealthGoal, 'id'>) => {
        updateUser(currentUser => ({ healthGoals: [...(currentUser.healthGoals || []), { ...goal, id: `goal_${Date.now()}` }] }));
    }, [updateUser]);

    const updateHealthGoal = useCallback((goal: HealthGoal) => {
        updateUser(currentUser => ({ healthGoals: currentUser.healthGoals?.map(g => g.id === goal.id ? goal : g) }));
    }, [updateUser]);

    const deleteHealthGoal = useCallback((goalId: string) => {
        updateUser(currentUser => ({ healthGoals: currentUser.healthGoals?.filter(g => g.id !== goalId) }));
    }, [updateUser]);

    const addTask = useCallback((task: Omit<Task, 'id' | 'completed'>) => {
        updateUser(currentUser => ({ tasks: [...(currentUser.tasks || []), { ...task, id: `task_${Date.now()}`, completed: false }] }));
    }, [updateUser]);

    const toggleTaskCompletion = useCallback((taskId: string) => {
        updateUser(currentUser => ({ tasks: currentUser.tasks?.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) }));
    }, [updateUser]);
    
    const addSubtask = useCallback((taskId: string, text: string) => {
        updateUser(currentUser => ({ tasks: currentUser.tasks?.map(t => {
            if (t.id === taskId) {
                const newSubtask: Subtask = { id: `sub_${Date.now()}`, text, completed: false };
                return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
            }
            return t;
        }) }));
    }, [updateUser]);

    const toggleSubtaskCompletion = useCallback((taskId: string, subtaskId: string) => {
        updateUser(currentUser => ({ tasks: currentUser.tasks?.map(t => {
            if (t.id === taskId) {
                return { ...t, subtasks: t.subtasks?.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st) };
            }
            return t;
        }) }));
    }, [updateUser]);
    
    const deleteSubtask = useCallback((taskId: string, subtaskId: string) => {
        updateUser(currentUser => ({ tasks: currentUser.tasks?.map(t => {
            if (t.id === taskId) {
                return { ...t, subtasks: t.subtasks?.filter(st => st.id !== subtaskId) };
            }
            return t;
        }) }));
    }, [updateUser]);

    const addCondition = useCallback((condition: Omit<MedicalCondition, 'id'>) => {
        updateUser(currentUser => ({
            conditions: [...(currentUser.conditions || []), { ...condition, id: `cond_${Date.now()}` }],
        }));
    }, [updateUser]);

    const addAllergy = useCallback((allergy: Omit<Allergy, 'id'>) => {
        updateUser(currentUser => ({
            allergies: [...(currentUser.allergies || []), { ...allergy, id: `alg_${Date.now()}` }],
        }));
    }, [updateUser]);

    const currentSubscription = useMemo(() => {
        if (!user || !user.subscription) return undefined;
        const allPlans = [...MOCK_PROVIDER_PLANS, ...MOCK_PATIENT_PLANS];
        return allPlans.find(p => p.id === user.subscription?.planId);
    }, [user]);

    const value: AuthContextType = {
        user,
        users,
        loading,
        login,
        logout,
        register,
        updateUser,
        appointments,
        claims,
        invoices,
        currentSubscription,
        changeSubscription,
        patientSubscriptionPlans: MOCK_PATIENT_PLANS,
        providerSubscriptionPlans: MOCK_PROVIDER_PLANS,
        addAppointment,
        addVideoUpdateToAppointment,
        makePayment,
        insurance: user?.insurance || null,
        updateInsurance,
        progressNotes,
        addProgressNote,
        prescriptions,
        addPrescription,
        messages,
        sendMessage,
        markMessagesAsRead,
        confirmAppointment,
        cancelAppointment,
        labOrders,
        addLabOrder,
        referrals,
        addReferral,
        updateReferral,
        changePassword,
        reminders,
        addCondition,
        addAllergy,
        addHealthGoal,
        updateHealthGoal,
        deleteHealthGoal,
        addTask,
        toggleTaskCompletion,
        addSubtask,
        toggleSubtaskCompletion,
        deleteSubtask,
        addClaim,
        addInvoice,
        auditLog: MOCK_AUDIT_LOG,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};