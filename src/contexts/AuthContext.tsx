/* eslint-disable react-refresh/only-export-components */
import React, { useState, ReactNode, useCallback, useEffect, useMemo, createContext, useContext } from 'react';
import * as api from '@/services/apiService';
import { socketService } from '@/services/socketService';
import { eventBus, EVENTS } from '@/services/eventBus';
import { User, UserRole, Claim, ClaimStatus, ClaimType, Appointment, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, VitalsRecord, LabResult, MedicalCondition, Allergy, Surgery, Immunization, FamilyHistory, Lifestyle, HealthGoal, GymMembership, Referral, ReferralStatus, AuditLogEntry, InsuranceInfo, ReminderSettings, Task, Subtask, Subscription, SystemAuditLog, TaskPriority } from '@/types';

export interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole) => void;
  updateUser: (updatedData: Partial<User> | ((currentUser: User) => Partial<User>)) => Promise<void>;
  
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

  progressNotes: ProgressNote[];
  addProgressNote: (note: Omit<ProgressNote, 'id'>) => void;
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id' | 'status'>) => void;
  messages: Record<string, Message[]>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => void;
  markMessagesAsRead: (contactId: string) => void;
  providerSubscriptionPlans: SubscriptionPlan[];
  updateSubscriptionPlan: (plan: SubscriptionPlan) => Promise<void>;
  confirmAppointment: (appointmentId: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  labOrders: LabOrder[];
  addLabOrder: (newOrder: Omit<LabOrder, 'id'>) => void;
  
  referrals: Referral[];
  addReferral: (newReferral: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>) => void;
  updateReferral: (id: string, updates: Partial<Referral>, actionText: string) => void;

  changePassword: (current: string, newPass: string) => Promise<boolean>;
  reminders: Record<string, ReminderSettings>;
  addCondition: (condition: Omit<MedicalCondition, 'id'>) => void;
  addAllergy: (allergy: Omit<Allergy, 'id'>) => void;

  addHealthGoal: (goal: Omit<HealthGoal, 'id'>) => void;
  updateHealthGoal: (goal: HealthGoal) => void;
  deleteHealthGoal: (goalId: string) => void;

  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addSubtask: (taskId: string, text: string) => void;
  toggleSubtaskCompletion: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  
  addClaim: (claim: Omit<Claim, 'id'>) => void;
  addInvoice: (invoice: Omit<BillingInvoice, 'id'>) => void;
  auditLog: SystemAuditLog[];
    socketStatus?: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);
    const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
    const [progressNotes, setProgressNotes] = useState<ProgressNote[]>([]);
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [messages, setMessages] = useState<Record<string, Message[]>>({});
    const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [patientPlans, setPatientPlans] = useState<SubscriptionPlan[]>([]);
    const [providerPlans, setProviderPlans] = useState<SubscriptionPlan[]>([]);
    const [auditLog, setAuditLog] = useState<SystemAuditLog[]>([]);
    const [reminders, setReminders] = useState<Record<string, ReminderSettings>>({});
    const [socketStatus, setSocketStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('disconnected');

    useEffect(() => {
        const checkUser = async () => {
            const token = sessionStorage.getItem('novopath-token');
            if (token) {
                try {
                    const { user } = await api.apiVerifyToken(token);
                    setUser(user);
                } catch (e) {
                    console.error("Failed to verify token.", e);
                    sessionStorage.removeItem('novopath-token');
                    sessionStorage.removeItem('novopath-user');
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    useEffect(() => {
        // This effect will run when a user logs in to fetch all associated data.
        if (user) {
            setLoading(true);
            api.fetchAllData()
                .then(data => {
                    setUsers(data.users);
                    setAppointments(data.appointments);
                    setClaims(data.claims);
                    setInvoices(data.invoices);
                    setProgressNotes(data.progressNotes);
                    setPrescriptions(data.prescriptions);
                    setMessages(data.messages);
                    setLabOrders(data.labOrders);
                    setReferrals(data.referrals);
                    setProviderPlans(data.providerPlans);
                    setPatientPlans(data.patientPlans);
                    setAuditLog(data.auditLog);

                    // Refresh the user object with the full data from our "API"
                    const fullUser = data.users.find(u => u.id === user.id) || user;
                    setUser(fullUser);
                    sessionStorage.setItem('novopath-user', JSON.stringify(fullUser));
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Clear data on logout
            setUsers([]);
            setAppointments([]);
            setClaims([]);
            setInvoices([]);
            setProgressNotes([]);
            setPrescriptions([]);
            setMessages({});
            setLabOrders([]);
            setReferrals([]);
            setPatientPlans([]);
            setProviderPlans([]);
            setAuditLog([]);
        }
    }, [user?.id]); // Re-run only when the user ID changes (login/logout)

    // Realtime updates via WebSocket: subscribe to incoming messages and update local state.
    useEffect(() => {
        if (user) {
            // Use the user id as a connection query param; server should scope events to this user/tenant.
            const token = sessionStorage.getItem('novopath-token') || undefined;
            socketService.connect(user.id, { token });

            const unsubStatus = socketService.onStatusChange((s) => {
                setSocketStatus(s);
            });

            const unsubMessage = socketService.onMessage((data: any) => {
                try {
                    if (!data) return;

                    // Expecting a simple event envelope: { type: string, payload: any }
                    if (data.type === 'message.created' && data.payload) {
                        const msg = data.payload as Message;
                        const key = [msg.senderId, msg.receiverId].sort().join('-');
                        setMessages(prev => {
                            const existing = prev[key] || [];
                            if (existing.some(m => m.id === msg.id)) return prev; // dedupe incoming event
                            return { ...prev, [key]: [...existing, msg] };
                        });
                    }
                } catch (err) {
                    // ignore malformed realtime messages
                    console.error('Error handling realtime message', err);
                }
            });

            return () => {
                unsubMessage();
                unsubStatus();
                socketService.disconnect();
            };
        } else {
            socketService.disconnect();
            setSocketStatus('disconnected');
        }
    }, [user?.id]);

    // Subscribe to in-app event bus for domain events (appointments, notes, labs, messages)
    useEffect(() => {
        const unsubAppointment = eventBus.subscribe(EVENTS.APPOINTMENT_CREATED, (payload: any) => {
            setAppointments(prev => [...prev, payload]);
        });

        const unsubNote = eventBus.subscribe(EVENTS.NOTE_CREATED, (payload: any) => {
            setProgressNotes(prev => [...prev, payload]);
        });

        const unsubMessage = eventBus.subscribe(EVENTS.MESSAGE_CREATED, (payload: any) => {
            const msg = payload as Message;
            const key = [msg.senderId, msg.receiverId].sort().join('-');
            setMessages(prev => ({ ...prev, [key]: [...(prev[key] || []), msg] }));
        });

        const unsubLab = eventBus.subscribe(EVENTS.LAB_ORDER_CREATED, (payload: any) => {
            setLabOrders(prev => [...prev, payload]);
        });

        return () => {
            unsubAppointment();
            unsubNote();
            unsubMessage();
            unsubLab();
        };
    }, []);

    const login = useCallback(async (email: string, password?: string): Promise<boolean> => {
        setLoading(true);
        try {
            const resp = await api.apiLogin(email, password);
            if (resp && resp.user) {
                sessionStorage.setItem('novopath-token', resp.token);
                sessionStorage.setItem('novopath-user', JSON.stringify(resp.user));
                setUser(resp.user);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem('novopath-user');
        sessionStorage.removeItem('novopath-token');
    }, []);

    const register = useCallback(async (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole) => {
        setLoading(true);
        const newUser = await api.apiRegister(userData, role);
        setUser(newUser); // This triggers the data fetch effect
        setLoading(false);
    }, []);

    const updateUser = useCallback(async (updatedData: Partial<User> | ((currentUser: User) => Partial<User>)) => {
        if (!user) return;
        const updatedUser = await api.apiUpdateUser(user.id, updatedData);
        if (updatedUser) {
            setUser(updatedUser);
            sessionStorage.setItem('novopath-user', JSON.stringify(updatedUser));
            setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? updatedUser : u));
        }
    }, [user]);

    const addAppointment = useCallback(async (appointment: Omit<Appointment, 'id'>, reminder?: ReminderSettings) => {
        const newAppointment = await api.apiAddAppointment(appointment);
        setAppointments(prev => [...prev, newAppointment]);
        if (reminder) {
            setReminders(prev => ({...prev, [newAppointment.id]: reminder}));
        }
    }, []);

    const addVideoUpdateToAppointment = useCallback(async (appointmentId: string, videoUrl: string) => {
        const updatedAppointment = await api.apiAddVideoUpdate(appointmentId, videoUrl);
        if(updatedAppointment) {
            setAppointments(prev => prev.map(appt => appt.id === appointmentId ? updatedAppointment : appt));
        }
    }, []);

    const makePayment = useCallback(async (invoiceId: string, amount: number) => {
        const updatedInvoice = await api.apiMakePayment(invoiceId, amount);
        if(updatedInvoice) {
            setInvoices(prev => prev.map(inv => inv.id === invoiceId ? updatedInvoice : inv));
        }
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
    
    const updateSubscriptionPlan = useCallback(async (plan: SubscriptionPlan) => {
        // This is a mock update. In a real app, you'd call an API.
        const isProviderPlan = providerPlans.some(p => p.id === plan.id);
        
        if (isProviderPlan) {
            setProviderPlans(prev => prev.map(p => (p.id === plan.id ? plan : p)));
        } else {
            setPatientPlans(prev => prev.map(p => (p.id === plan.id ? plan : p)));
        }
        return Promise.resolve();
    }, [providerPlans, patientPlans]);

    const addProgressNote = useCallback(async (note: Omit<ProgressNote, 'id'>) => {
        const newNote = await api.apiAddProgressNote(note);
        setProgressNotes(prev => [...prev, newNote]);
    }, []);

    const addPrescription = useCallback(async (prescription: Omit<Prescription, 'id' | 'status'>) => {
        const newPrescription = await api.apiAddPrescription(prescription);
        setPrescriptions(prev => [...prev, newPrescription]);
    }, []);

    const addClaim = useCallback(async (claim: Omit<Claim, 'id'>) => {
        const newClaim = await api.apiAddClaim(claim);
        setClaims(prev => [...prev, newClaim]);
    }, []);

    const addInvoice = useCallback(async (invoice: Omit<BillingInvoice, 'id'>) => {
        const newInvoice = await api.apiAddInvoice(invoice);
        setInvoices(prev => [...prev, newInvoice]);
    }, []);

    const sendMessage = useCallback(async (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
        const newMessage = await api.apiSendMessage(message);
        const key = [message.senderId, message.receiverId].sort().join('-');
        setMessages(prev => ({ ...prev, [key]: [...(prev[key] || []), newMessage] }));
    }, []);

    const markMessagesAsRead = useCallback(async (contactId: string) => {
        if (!user) return;
        const updatedMessages = await api.apiMarkMessagesAsRead(user.id, contactId);
        const key = [user.id, contactId].sort().join('-');
        setMessages(prev => ({ ...prev, [key]: updatedMessages }));
    }, [user]);

    const confirmAppointment = useCallback(async (appointmentId: string) => {
        const updatedAppointment = await api.apiConfirmAppointment(appointmentId);
        if (updatedAppointment) {
            setAppointments(prev => prev.map(a => a.id === appointmentId ? updatedAppointment : a));
        }
    }, []);

    const cancelAppointment = useCallback(async (appointmentId: string) => {
        const updatedAppointment = await api.apiCancelAppointment(appointmentId);
        if (updatedAppointment) {
            setAppointments(prev => prev.map(a => a.id === appointmentId ? updatedAppointment : a));
        }
    }, []);

    const addLabOrder = useCallback(async (newOrder: Omit<LabOrder, 'id'>) => {
        const createdOrder = await api.apiAddLabOrder(newOrder);
        setLabOrders(prev => [...prev, createdOrder]);
    }, []);
    
    const addReferral = useCallback(async (newReferralData: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>) => {
        const newReferral = await api.apiAddReferral(newReferralData);
        setReferrals(prev => [...prev, newReferral]);
    }, []);
    
    const updateReferral = useCallback(async (id: string, updates: Partial<Referral>, actionText: string) => {
        const updatedReferral = await api.apiUpdateReferral(id, updates, actionText);
        if (updatedReferral) {
            setReferrals(prev => prev.map(r => r.id === id ? updatedReferral : r));
        }
    }, []);

    const changePassword = useCallback(async (current: string, newPass: string) => {
        return await api.apiChangePassword(current, newPass);
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
    
    const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
        updateUser(currentUser => ({
            tasks: currentUser.tasks?.map(t => t.id === taskId ? { ...t, ...updates } : t)
        }));
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
        const allPlans = [...providerPlans, ...patientPlans];
        return allPlans.find(p => p.id === user.subscription?.planId);
    }, [user, providerPlans, patientPlans]);

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
        patientSubscriptionPlans: patientPlans,
        providerSubscriptionPlans: providerPlans,
        updateSubscriptionPlan,
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
        updateTask,
        toggleTaskCompletion,
        addSubtask,
        toggleSubtaskCompletion,
        deleteSubtask,
        addClaim,
        addInvoice,
        auditLog,
        socketStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};