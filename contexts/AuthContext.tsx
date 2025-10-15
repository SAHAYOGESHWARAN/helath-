import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole, BillingInvoice, SubscriptionPlan, Appointment, Prescription, ProgressNote, EnterpriseSettingsConfig, InsuranceInfo, NotificationSettings } from '../types';

interface SystemSettingsConfig {
    maintenanceMode: boolean;
    newPatientRegistrations: boolean;
    newProviderRegistrations: boolean;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  isSubmitting: boolean;
  login: (credentials: { email: string; password?: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (updater: (currentUser: User) => User) => Promise<void>;
  register: (userData: Partial<User>, role: UserRole) => void;
  addUser: (newUser: Omit<User, 'id'>) => void;
  editUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  verifyProvider: (userId: string) => void;
  // Billing
  invoices: BillingInvoice[];
  makePayment: (invoiceId: string, paymentAmount: number) => void;
  addInvoice: (invoiceData: Omit<BillingInvoice, 'id' | 'status' | 'amountDue' | 'date'>) => void;
  markInvoiceAsPaid: (invoiceId: string) => void;
  // Subscriptions
  patientSubscriptionPlans: SubscriptionPlan[];
  providerSubscriptionPlans: SubscriptionPlan[];
  currentSubscription: SubscriptionPlan | null;
  changeSubscription: (planId: string) => void;
  updateProviderPlans: (plans: SubscriptionPlan[]) => void;
  updateUserSubscription: (userId: string, newPlanId: string) => void;
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'patientName'>) => boolean;
  cancelAppointment: (appointmentId: string) => void;
  confirmAppointment: (appointmentId: string) => void;
  submitAppointmentFeedback: (appointmentId: string, summary: string) => void;
   // Insurance
  insurance: InsuranceInfo | null;
  updateInsurance: (data: InsuranceInfo) => Promise<void>;
  // Prescriptions & Notes
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id' | 'status'>) => void;
  progressNotes: ProgressNote[];
  addNote: (note: Omit<ProgressNote, 'id' | 'status'>) => void;
  updateNote: (note: ProgressNote) => void;
  // Settings
  changePassword: (current: string, newPass: string) => Promise<boolean>;
  systemSettings: SystemSettingsConfig;
  updateSystemSettings: (settings: SystemSettingsConfig) => Promise<void>;
  enterpriseSettings: EnterpriseSettingsConfig;
  updateEnterpriseSettings: (settings: EnterpriseSettingsConfig) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- STARTING (EMPTY) DATA ---
const PATIENT_PLANS: SubscriptionPlan[] = [
    { id: 'plan_basic_patient', name: 'Basic Care', price: '$19/month', patientLimit: 0, features: ['Secure Messaging', 'Appointment Scheduling', 'Health Records Access', 'Basic AI Assistant', '50% off first video call'] },
    { id: 'plan_plus_patient', name: 'Plus Care', price: '$49/month', patientLimit: 0, isPopular: true, features: ['All Basic features', 'Unlimited Video Consults', 'Priority Support', 'Advanced AI Assistant', 'Personalized Health Goals'] },
    { id: 'plan_total_patient', name: 'Total Wellness', price: '$99/month', patientLimit: 0, features: ['All features of Plus Care', '24/7 On-Demand Nurse Chat', 'Annual In-depth Health Review'] },
];
const PROVIDER_PLANS: SubscriptionPlan[] = [
  { id: 'prod_1', name: 'Basic Tier', price: '$49/mo', patientLimit: 50, features: ['Up to 50 patients', 'Basic EHR', 'Appointment Scheduling'] },
  { id: 'prod_2', name: 'Pro Tier', price: '$99/mo', patientLimit: 200, isPopular: true, features: ['Up to 200 patients', 'Full EHR & E-Prescribing', 'Telehealth Included', 'Advanced Reporting'] },
  { id: 'prod_3', name: 'Enterprise', price: 'Custom', patientLimit: 0, features: ['Unlimited patients', 'All Pro features', 'Dedicated Support', 'SSO Integration'] },
];
const NOTIF_SETTINGS: NotificationSettings = { emailAppointments: true, emailBilling: true, emailMessages: true, smsMessages: false, pushAll: false };
const SYSTEM_SETTINGS: SystemSettingsConfig = { maintenanceMode: false, newPatientRegistrations: true, newProviderRegistrations: true };
const ENTERPRISE_SETTINGS: EnterpriseSettingsConfig = { ssoProvider: 'Okta', ssoEntityId: 'urn:example:saml:sp', primaryColor: '#3b82f6', enforceMfa: true, customLogoUrl: '' };

const DEFAULT_USERS: User[] = [
  {
    id: 'admin_default_rish',
    name: 'Rish Novo',
    email: 'rishnovo@gmail.com',
    role: UserRole.ADMIN,
    avatarUrl: `https://i.pravatar.cc/150?u=rishnovo@gmail.com`,
    status: 'Active',
    notificationSettings: NOTIF_SETTINGS,
  }
];


// Custom hook to manage state with session storage and keep it synchronized
function useSessionStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.sessionStorage.getItem(key);
            if (item) {
                const parsed = JSON.parse(item);
                // If there is existing data, use it. If not, and it's the 'users' key, check if we need to add the default user.
                if (key === 'novopath-users' && Array.isArray(parsed) && !parsed.some(u => u.id === DEFAULT_USERS[0].id)) {
                  const mergedUsers = [...parsed, ...DEFAULT_USERS.filter(du => !parsed.some(pu => pu.id === du.id))];
                  window.sessionStorage.setItem(key, JSON.stringify(mergedUsers));
                  return mergedUsers;
                }
                if (parsed !== null || initialValue === null) {
                    return parsed;
                }
            }
            window.sessionStorage.setItem(key, JSON.stringify(initialValue));
            return initialValue;
        } catch (error) {
            console.error(`Error reading sessionStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting sessionStorage key “${key}”:`, error);
        }
    };

    return [storedValue, setValue];
}


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE MANAGEMENT (Now with Persistence) ---
  const [users, setUsers] = useSessionStorage<User[]>('novopath-users', DEFAULT_USERS);
  const [user, setUser] = useSessionStorage<User | null>('novopath-user', null);
  const [appointments, setAppointments] = useSessionStorage<Appointment[]>('novopath-appointments', []);
  const [invoices, setInvoices] = useSessionStorage<BillingInvoice[]>('novopath-invoices', []);
  const [prescriptions, setPrescriptions] = useSessionStorage<Prescription[]>('novopath-prescriptions', []);
  const [progressNotes, setProgressNotes] = useSessionStorage<ProgressNote[]>('novopath-progressNotes', []);
  const [insurance, setInsurance] = useSessionStorage<InsuranceInfo | null>('novopath-insurance', null);
  const [systemSettings, setSystemSettings] = useSessionStorage<SystemSettingsConfig>('novopath-systemSettings', SYSTEM_SETTINGS);
  const [enterpriseSettings, setEnterpriseSettings] = useSessionStorage<EnterpriseSettingsConfig>('novopath-enterpriseSettings', ENTERPRISE_SETTINGS);
  const [providerSubscriptionPlans, setProviderSubscriptionPlans] = useSessionStorage<SubscriptionPlan[]>('novopath-providerPlans', PROVIDER_PLANS);
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionPlan | null>(null);

  // --- EFFECTS ---
  useEffect(() => {
    // `useSessionStorage` handles initial load, so this effect just manages loading state and subscription object.
    if (user && user.subscription) {
      const allPlans = [...PATIENT_PLANS, ...providerSubscriptionPlans];
      const sub = allPlans.find(p => p.id === user.subscription!.planId);
      setCurrentSubscription(sub || null);
    } else {
        setCurrentSubscription(null);
    }
    setLoading(false);
  }, [user, providerSubscriptionPlans]);

  // --- AUTH & USER MANAGEMENT ---
  const login = useCallback(async (credentials: { email: string; password?: string }): Promise<boolean> => {
    setIsSubmitting(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the user from the persisted list
        const userToLogin = users.find((u: User) => u.email.toLowerCase() === credentials.email.toLowerCase());
        
        if (userToLogin) {
          setUser(userToLogin); // This automatically persists the logged-in user
          resolve(true);
        } else {
          console.warn(`No user with email ${credentials.email} found. Please register first.`);
          resolve(false);
        }
        setIsSubmitting(false);
      }, 700);
    });
  }, [users, setUser]);

  const logout = useCallback(() => {
    setUser(null); // This automatically removes the user from session storage
  }, [setUser]);

  const register = useCallback((userData: Partial<User>, role: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: userData.name || 'New User',
            email: userData.email || 'new@user.com',
            ...userData,
            role,
            avatarUrl: `https://i.pravatar.cc/150?u=${userData.email}`,
            status: 'Active',
            isVerified: role === UserRole.PROVIDER ? false : undefined,
            notificationSettings: NOTIF_SETTINGS, // Assign default notification settings
        };
      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      setIsSubmitting(false);
    }, 700);
  }, [setUsers, setUser]);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    setUsers(prev => [...prev, { 
        id: `user_${Date.now()}`, 
        avatarUrl: `https://i.pravatar.cc/150?u=${userData.email}`, 
        status: 'Active', 
        notificationSettings: NOTIF_SETTINGS, // Assign default notification settings
        ...userData, 
    }]);
  }, [setUsers]);

  const editUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
    }
  }, [user, setUsers, setUser]);

  const deleteUser = useCallback((userId: string) => { 
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, [setUsers]);
  
  const verifyProvider = useCallback((userId: string) => {
    setUsers(prev => prev.map(u => (u.id === userId && u.role === UserRole.PROVIDER) ? { ...u, isVerified: true } : u));
  }, [setUsers]);

  const updateUser = useCallback((updater: (currentUser: User) => User) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(currentUser => {
          if (!currentUser) {
            resolve();
            return null;
          }
          const updatedUser = updater(currentUser);
          // Also update the master users list
          setUsers(currentUsers => currentUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
          return updatedUser;
        });
        resolve();
      }, 300);
    });
  }, [setUser, setUsers]);
  
  // --- SUBSCRIPTIONS ---
  const updateUserSubscription = useCallback((userId: string, newPlanId: string) => {
      const allPlans = [...PATIENT_PLANS, ...providerSubscriptionPlans];
      const newPlan = allPlans.find(p => p.id === newPlanId);
      if (!newPlan) return;
      
      const updater = (currentUser: User): User => ({
          ...currentUser,
          subscription: {
              planId: newPlan.id,
              planName: newPlan.name,
              status: currentUser.subscription?.status || 'Active',
              renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
          }
      });

      if (user?.id === userId) {
          updateUser(updater);
      } else {
          const targetUser = users.find(u => u.id === userId);
          if (targetUser) {
              editUser(updater(targetUser));
          }
      }
  }, [providerSubscriptionPlans, user, updateUser, users, editUser]);
  
  const changeSubscription = useCallback((planId: string) => {
    if (!user) return;
    updateUserSubscription(user.id, planId);
  }, [user, updateUserSubscription]);

  const updateProviderPlans = useCallback((plans: SubscriptionPlan[]) => { setProviderSubscriptionPlans(plans); }, [setProviderSubscriptionPlans]);
  
  // --- BILLING & PAYMENTS ---
  const makePayment = useCallback((invoiceId: string, paymentAmount: number) => {
    setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
            const newAmountDue = inv.amountDue - paymentAmount;
            return {
                ...inv,
                amountDue: Math.max(0, newAmountDue),
                status: newAmountDue <= 0 ? 'Paid' : 'Due'
            };
        }
        return inv;
    }));
  }, [setInvoices]);

  const addInvoice = useCallback((invoiceData: Omit<BillingInvoice, 'id' | 'status' | 'amountDue' | 'date'>) => {
    const newInvoice: BillingInvoice = {
      ...invoiceData,
      id: `inv_${Date.now()}`,
      status: 'Due',
      amountDue: invoiceData.totalAmount,
      date: new Date().toISOString().split('T')[0],
    };
    setInvoices(prev => [newInvoice, ...prev]);
  }, [setInvoices]);

  const markInvoiceAsPaid = useCallback((invoiceId: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: 'Paid', amountDue: 0 } : inv
    ));
  }, [setInvoices]);

  // --- APPOINTMENTS ---
  const addAppointment = useCallback((appointment: Omit<Appointment, 'id' | 'status' | 'patientName'>): boolean => {
    const isSlotTaken = appointments.some(a => a.date === appointment.date && a.time === appointment.time && a.status !== 'Cancelled');
    if (isSlotTaken) {
        console.error("Appointment slot is already booked.");
        return false;
    }
    if(!user) return false;
    setAppointments(prev => [...prev, { ...appointment, id: `appt_${Date.now()}`, status: 'Pending', patientName: user.name }]);
    return true;
  }, [user, appointments, setAppointments]);

  const cancelAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.map(a => a.id === appointmentId ? {...a, status: 'Cancelled'} : a));
  }, [setAppointments]);

   const confirmAppointment = useCallback((appointmentId: string) => {
    setAppointments(prev => prev.map(a => a.id === appointmentId ? {...a, status: 'Confirmed'} : a));
  }, [setAppointments]);

  const submitAppointmentFeedback = useCallback((appointmentId: string, summary: string) => {
    setAppointments(prev => prev.map(a => a.id === appointmentId ? {...a, visitSummary: summary} : a));
  }, [setAppointments]);
  
  // --- RECORDS ---
  const addPrescription = useCallback((prescription: Omit<Prescription, 'id' | 'status'>) => {
    setPrescriptions(prev => [...prev, { ...prescription, id: `rx_${Date.now()}`, status: 'Sent' }]);
  }, [setPrescriptions]);
  
  const addNote = useCallback((note: Omit<ProgressNote, 'id' | 'status'>) => {
    setProgressNotes(prev => [...prev, { ...note, id: `pn_${Date.now()}`, status: 'Draft' }]);
  }, [setProgressNotes]);
  
  const updateNote = useCallback((updatedNote: ProgressNote) => {
    setProgressNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
  }, [setProgressNotes]);

  // --- SETTINGS & PROFILE ---
  const updateInsurance = useCallback((data: InsuranceInfo) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => { setInsurance(data); resolve(); }, 800);
    });
  }, [setInsurance]);
  
  const changePassword = useCallback((current: string, newPass: string) => {
    return new Promise<boolean>((resolve) => {
        setTimeout(() => { resolve(true); }, 800);
    });
  }, []);

  const updateSystemSettings = useCallback((settings: SystemSettingsConfig) => {
     return new Promise<void>((resolve) => {
        setTimeout(() => { setSystemSettings(settings); resolve(); }, 800);
    });
  }, [setSystemSettings]);

  const updateEnterpriseSettings = useCallback((settings: EnterpriseSettingsConfig) => {
    return new Promise<void>((resolve) => {
       setTimeout(() => { setEnterpriseSettings(settings); resolve(); }, 800);
   });
 }, [setEnterpriseSettings]);

  return (
    <AuthContext.Provider value={{ 
        user, users, loading, isSubmitting, login, logout, 
        updateUser,
        register, addUser, editUser, deleteUser, verifyProvider,
        invoices, makePayment, addInvoice, markInvoiceAsPaid,
        patientSubscriptionPlans: PATIENT_PLANS, providerSubscriptionPlans, currentSubscription, changeSubscription, updateProviderPlans, updateUserSubscription,
        appointments, addAppointment, cancelAppointment, confirmAppointment, submitAppointmentFeedback,
        insurance, updateInsurance,
        prescriptions, addPrescription,
        progressNotes, addNote, updateNote,
        changePassword,
        systemSettings, updateSystemSettings,
        enterpriseSettings, updateEnterpriseSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};