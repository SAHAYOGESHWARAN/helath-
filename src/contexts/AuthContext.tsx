
/* eslint-disable react-refresh/only-export-components */
import React, { ReactNode, useCallback, useEffect, useMemo, createContext } from 'react';
import * as api from '@/services/apiService';
import { socketService } from '@/services/socketService';
import { eventBus, EVENTS } from '@/services/eventBus';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { User, UserRole, Claim, Appointment, SubscriptionPlan, ProgressNote, Prescription, Message, BillingInvoice, LabOrder, Referral, InsuranceInfo, ReminderSettings, MedicalCondition, Allergy, HealthGoal, Task, Subtask, Subscription, SystemAuditLog } from '@/types';

export interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole) => Promise<void>;
  updateUser: (updatedData: Partial<User> | ((currentUser: User) => Partial<User>)) => Promise<void>;
  appointments: Appointment[];
  claims: Claim[];
  invoices: BillingInvoice[];
  currentSubscription?: SubscriptionPlan;
  changeSubscription: (planId: string) => void;
  patientSubscriptionPlans: SubscriptionPlan[];
  providerSubscriptionPlans: SubscriptionPlan[];
  updateSubscriptionPlan: (plan: SubscriptionPlan) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, 'id'>, reminder?: ReminderSettings) => Promise<void>;
  addVideoUpdateToAppointment: (appointmentId: string, videoUrl: string) => Promise<void>;
  makePayment: (invoiceId: string, amount: number) => Promise<void>;
  insurance: InsuranceInfo | null;
  updateInsurance: (data: InsuranceInfo) => Promise<void>;
  progressNotes: ProgressNote[];
  addProgressNote: (note: Omit<ProgressNote, 'id'>) => Promise<void>;
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id' | 'status'>) => Promise<void>;
  messages: Record<string, Message[]>;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
  markMessagesAsRead: (contactId: string) => Promise<void>;
  confirmAppointment: (appointmentId: string) => Promise<void>;
  cancelAppointment: (appointmentId: string) => Promise<void>;
  labOrders: LabOrder[];
  addLabOrder: (newOrder: Omit<LabOrder, 'id'>) => Promise<void>;
  referrals: Referral[];
  addReferral: (newReferralData: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>) => Promise<void>;
  updateReferral: (id: string, updates: Partial<Referral>, actionText: string) => Promise<void>;
  changePassword: (current: string, newPass: string) => Promise<any>;
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
  addClaim: (claim: Omit<Claim, 'id'>) => Promise<void>;
  addInvoice: (invoice: Omit<BillingInvoice, 'id'>) => Promise<void>;
  auditLog: SystemAuditLog[];
  socketStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, setUser, setToken, setLoading } = useAuthStore();
    const { 
        setUsers, 
        setAppointments, 
        addAppointment,
        setClaims, 
        setInvoices, 
        setProgressNotes, 
        setPrescriptions, 
        setMessages, 
        setLabOrders, 
        setReferrals, 
        setPatientPlans, 
        setProviderPlans, 
        setAuditLog,
        setSocketStatus
    } = useAppStore();

    useEffect(() => {
        const token = sessionStorage.getItem('novopath-token');
        if (!token) {
            setLoading(false);
            return;
        }

        const checkUser = async () => {
            try {
                const { user } = await api.apiVerifyToken(token);
                setUser(user);
                setToken(token);
            } catch (e) {
                console.error("Failed to verify token.", e);
                sessionStorage.removeItem('novopath-token');
                sessionStorage.removeItem('novopath-user');
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [setUser, setToken, setLoading]);

    useEffect(() => {
        if (user) {
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

                    const fullUser = data.users.find(u => u.id === user.id) || user;
                    setUser(fullUser);
                    sessionStorage.setItem('novopath-user', JSON.stringify(fullUser));
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        } else {
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
    }, [user?.id, setUser, setUsers, setAppointments, setClaims, setInvoices, setProgressNotes, setPrescriptions, setMessages, setLabOrders, setReferrals, setProviderPlans, setPatientPlans, setAuditLog]);

    useEffect(() => {
        if (user) {
            const token = sessionStorage.getItem('novopath-token') || undefined;
            socketService.connect(user.id, { token });

            const unsubStatus = socketService.onStatusChange((s) => {
                setSocketStatus(s);
            });

            const unsubMessage = socketService.onMessage((data: any) => {
                try {
                    if (!data) return;
                    if (data.type === 'message.created' && data.payload) {
                        const msg = data.payload as Message;
                        const key = [msg.senderId, msg.receiverId].sort().join('-');
                        useAppStore.setState(prev => {
                            const existing = prev.messages[key] || [];
                            if (existing.some(m => m.id === msg.id)) return prev;
                            return { ...prev, messages: { ...prev.messages, [key]: [...existing, msg] } };
                        });
                    }
                } catch (err) {
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
    }, [user?.id, setSocketStatus]);

    useEffect(() => {
        const unsubAppointment = eventBus.subscribe(EVENTS.APPOINTMENT_CREATED, (payload: any) => {
            addAppointment(payload);
        });

        const unsubNote = eventBus.subscribe(EVENTS.NOTE_CREATED, (payload: any) => {
            useAppStore.setState(prev => ({ progressNotes: [...prev.progressNotes, payload] }));
        });

        const unsubMessage = eventBus.subscribe(EVENTS.MESSAGE_CREATED, (payload: any) => {
            const msg = payload as Message;
            const key = [msg.senderId, msg.receiverId].sort().join('-');
            useAppStore.setState(prev => ({ messages: { ...prev.messages, [key]: [...(prev.messages[key] || []), msg] } }));
        });

        const unsubLab = eventBus.subscribe(EVENTS.LAB_ORDER_CREATED, (payload: any) => {
            useAppStore.setState(prev => ({ labOrders: [...prev.labOrders, payload] }));
        });

        return () => {
            unsubAppointment();
            unsubNote();
            unsubMessage();
            unsubLab();
        };
    }, [addAppointment]);

    const authValue = useAuth();
    return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const { user, setUser, token, isLoading } = useAuthStore();
    const {
        users,
        appointments,
        claims,
        invoices,
        patientPlans,
        providerPlans,
        progressNotes,
        prescriptions,
        messages,
        labOrders,
        referrals,
        reminders,
        auditLog,
        socketStatus
    } = useAppStore();

    const login = useCallback(async (email: string, password?: string): Promise<boolean> => {
        try {
            const resp = await api.apiLogin(email, password);
            if (resp && resp.user) {
                sessionStorage.setItem('novopath-token', resp.token);
                sessionStorage.setItem('novopath-user', JSON.stringify(resp.user));
                setUser(resp.user);
                useAuthStore.getState().setToken(resp.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }, [setUser]);

    const logout = useCallback(() => {
        setUser(null);
        sessionStorage.removeItem('novopath-user');
        sessionStorage.removeItem('novopath-token');
    }, [setUser]);

    const register = useCallback(async (userData: Omit<User, 'id' | 'role' | 'avatarUrl'>, role: UserRole) => {
        const newUser = await api.apiRegister(userData, role);
        setUser(newUser);
    }, [setUser]);

    const updateUser = useCallback(async (updatedData: Partial<User> | ((currentUser: User) => Partial<User>)) => {
        if (!user) return;
        const updatedUser = await api.apiUpdateUser(user.id, updatedData);
        if (updatedUser) {
            setUser(updatedUser);
            sessionStorage.setItem('novopath-user', JSON.stringify(updatedUser));
            useAppStore.setState(prev => ({
                users: prev.users.map(u => u.id === user.id ? updatedUser : u)
            }));
        }
    }, [user, setUser]);

    const addAppointment = useCallback(async (appointment: Omit<Appointment, 'id'>, reminder?: ReminderSettings) => {
        const newAppointment = await api.apiAddAppointment(appointment);
        useAppStore.getState().addAppointment(newAppointment);
        if (reminder) {
            useAppStore.setState(prev => ({...prev, reminders: {...prev.reminders, [newAppointment.id]: reminder}}));
        }
    }, []);

    const addVideoUpdateToAppointment = useCallback(async (appointmentId: string, videoUrl: string) => {
        const updatedAppointment = await api.apiAddVideoUpdate(appointmentId, videoUrl);
        if(updatedAppointment) {
            useAppStore.setState(prev => ({
                appointments: prev.appointments.map(appt => appt.id === appointmentId ? updatedAppointment : appt)
            }));
        }
    }, []);

    const makePayment = useCallback(async (invoiceId: string, amount: number) => {
        const updatedInvoice = await api.apiMakePayment(invoiceId, amount);
        if(updatedInvoice) {
            useAppStore.setState(prev => ({
                invoices: prev.invoices.map(inv => inv.id === invoiceId ? updatedInvoice : inv)
            }));
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
        const isProviderPlan = providerPlans.some(p => p.id === plan.id);
        
        if (isProviderPlan) {
            useAppStore.setState(prev => ({
                providerPlans: prev.providerPlans.map(p => (p.id === plan.id ? plan : p))
            }));
        } else {
            useAppStore.setState(prev => ({
                patientPlans: prev.patientPlans.map(p => (p.id === plan.id ? plan : p))
            }));
        }
        return Promise.resolve();
    }, [providerPlans, patientPlans]);

    const addProgressNote = useCallback(async (note: Omit<ProgressNote, 'id'>) => {
        const newNote = await api.apiAddProgressNote(note);
        useAppStore.setState(prev => ({ progressNotes: [...prev.progressNotes, newNote] }));
    }, []);

    const addPrescription = useCallback(async (prescription: Omit<Prescription, 'id' | 'status'>) => {
        const newPrescription = await api.apiAddPrescription(prescription);
        useAppStore.setState(prev => ({ prescriptions: [...prev.prescriptions, newPrescription] }));
    }, []);

    const addClaim = useCallback(async (claim: Omit<Claim, 'id'>) => {
        const newClaim = await api.apiAddClaim(claim);
        useAppStore.setState(prev => ({ claims: [...prev.claims, newClaim] }));
    }, []);

    const addInvoice = useCallback(async (invoice: Omit<BillingInvoice, 'id'>) => {
        const newInvoice = await api.apiAddInvoice(invoice);
        useAppStore.setState(prev => ({ invoices: [...prev.invoices, newInvoice] }));
    }, []);

    const sendMessage = useCallback(async (message: Omit<Message, 'id' | 'timestamp' | 'isRead'>) => {
        const newMessage = await api.apiSendMessage(message);
        const key = [message.senderId, message.receiverId].sort().join('-');
        useAppStore.setState(prev => ({ messages: { ...prev.messages, [key]: [...(prev.messages[key] || []), newMessage] } }));
    }, []);

    const markMessagesAsRead = useCallback(async (contactId: string) => {
        if (!user) return;
        const updatedMessages = await api.apiMarkMessagesAsRead(user.id, contactId);
        const key = [user.id, contactId].sort().join('-');
        useAppStore.setState(prev => ({ messages: { ...prev.messages, [key]: updatedMessages } }));
    }, [user]);

    const confirmAppointment = useCallback(async (appointmentId: string) => {
        const updatedAppointment = await api.apiConfirmAppointment(appointmentId);
        if (updatedAppointment) {
            useAppStore.setState(prev => ({
                appointments: prev.appointments.map(a => a.id === appointmentId ? updatedAppointment : a)
            }));
        }
    }, []);

    const cancelAppointment = useCallback(async (appointmentId: string) => {
        const updatedAppointment = await api.apiCancelAppointment(appointmentId);
        if (updatedAppointment) {
            useAppStore.setState(prev => ({
                appointments: prev.appointments.map(a => a.id === appointmentId ? updatedAppointment : a)
            }));
        }
    }, []);

    const addLabOrder = useCallback(async (newOrder: Omit<LabOrder, 'id'>) => {
        const createdOrder = await api.apiAddLabOrder(newOrder);
        useAppStore.setState(prev => ({ labOrders: [...prev.labOrders, createdOrder] }));
    }, []);

    const addReferral = useCallback(async (newReferralData: Omit<Referral, 'id' | 'createdAt' | 'status' | 'type' | 'auditLog'>) => {
        const newReferral = await api.apiAddReferral(newReferralData);
        useAppStore.setState(prev => ({ referrals: [...prev.referrals, newReferral] }));
    }, []);

    const updateReferral = useCallback(async (id: string, updates: Partial<Referral>, actionText: string) => {
        const updatedReferral = await api.apiUpdateReferral(id, updates, actionText);
        if (updatedReferral) {
            useAppStore.setState(prev => ({
                referrals: prev.referrals.map(r => r.id === id ? updatedReferral : r)
            }));
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
                return { ...t, subtasks: t.subtasks?.map(st => st.id === subtaskId ? ({ ...st, completed: !st.completed }) : st) };
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

    return {
        user,
        users,
        loading: isLoading, // Use the explicit isLoading state from store
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
};
