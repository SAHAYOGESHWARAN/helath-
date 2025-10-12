
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole, BillingInvoice, SubscriptionPlan } from '../types';

interface AuthContextType {
  user: User | null;
  users: User[];
  loading: boolean;
  isSubmitting: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  register: (userData: Partial<User>, role: UserRole) => void;
  addUser: (newUser: Omit<User, 'id'>) => void;
  editUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  // Billing
  invoices: BillingInvoice[];
  makePayment: (invoiceId: string, paymentAmount: number) => void;
  // Subscriptions
  patientSubscriptionPlans: SubscriptionPlan[];
  providerSubscriptionPlans: SubscriptionPlan[];
  currentSubscription: SubscriptionPlan | null;
  changeSubscription: (planId: string) => void;
  updateProviderPlans: (plans: SubscriptionPlan[]) => void;
  updateUserSubscription: (userId: string, newPlanId: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_PATIENT_PLANS: SubscriptionPlan[] = [
    { id: 'plan_basic_patient', name: 'Basic Care', price: '$19/month', patientLimit: 0, features: ['Secure Messaging', 'Appointment Scheduling', 'Health Records Access', 'Basic AI Assistant'] },
    { id: 'plan_plus_patient', name: 'Plus Care', price: '$49/month', patientLimit: 0, isPopular: true, features: ['All Basic features', 'Priority Support', 'Advanced AI Assistant', 'Personalized Health Goals'] },
    { id: 'plan_total_patient', name: 'Total Wellness', price: '$99/month', patientLimit: 0, features: ['All features of Plus Care', '24/7 On-Demand Nurse Chat', 'Annual In-depth Health Review'] },
];

const MOCK_PROVIDER_PLANS: SubscriptionPlan[] = [
  { id: 'prod_1', name: 'Basic Tier', price: '$49/mo', patientLimit: 50, features: ['Up to 50 patients', 'Basic EHR', 'Appointment Scheduling'] },
  { id: 'prod_2', name: 'Pro Tier', price: '$99/mo', patientLimit: 200, isPopular: true, features: ['Up to 200 patients', 'Full EHR & E-Prescribing', 'Telehealth Included', 'Advanced Reporting'] },
  { id: 'prod_3', name: 'Enterprise', price: 'Custom', patientLimit: 0, features: ['Unlimited patients', 'All Pro features', 'Dedicated Support', 'SSO Integration'] },
];

const MOCK_INITIAL_USERS: Record<UserRole, User[]> = {
  [UserRole.PATIENT]: [
    { id: 'pat1', name: 'John Doe', email: 'john.doe@email.com', role: UserRole.PATIENT, avatarUrl: 'https://picsum.photos/seed/patient1/100', dob: '1985-05-20', phone: '555-123-4567', address: '123 Health St, Wellness City, USA', status: 'Active' },
    { id: 'pat2', name: 'Alice Johnson', email: 'alice.j@email.com', role: UserRole.PATIENT, avatarUrl: 'https://picsum.photos/seed/patient2/100', dob: '1992-11-12', phone: '555-234-5678', address: '456 Oak Ave, Healing Town, USA', status: 'Active' },
    { id: 'pat3', name: 'Charlie Brown', email: 'charlie.b@email.com', role: UserRole.PATIENT, avatarUrl: 'https://picsum.photos/seed/patient3/100', dob: '1998-09-30', phone: '555-345-6789', address: '789 Pine Ln, Remedy Village, USA', status: 'Suspended' },
  ],
  [UserRole.PROVIDER]: [
    { id: 'pro1', name: 'Dr. Jane Smith', email: 'jane.smith@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider1/100', phone: '555-987-6543', specialty: 'Cardiology', status: 'Active', subscription: { planId: 'prod_2', planName: 'Pro Tier', status: 'Active', renewalDate: '2025-08-15' } },
    { id: 'pro2', name: 'Dr. David Chen', email: 'david.chen@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider2/100', phone: '555-876-5432', specialty: 'Dermatology', status: 'Active', subscription: { planId: 'prod_1', planName: 'Basic Tier', status: 'Active', renewalDate: '2025-07-20' } },
    { id: 'pro3', name: 'Dr. Emily White', email: 'emily.white@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider3/100', phone: '555-765-4321', specialty: 'Pediatrics', status: 'Active', subscription: { planId: 'prod_2', planName: 'Pro Tier', status: 'Cancelled', renewalDate: '2024-06-30' } },
  ],
  [UserRole.ADMIN]: [
    { id: 'adm1', name: 'Alex Johnson', email: 'alex.j@email.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/admin1/100', phone: '555-555-1212', status: 'Active' },
    { id: 'adm2', name: 'Maria Garcia', email: 'maria.g@email.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/admin2/100', phone: '555-555-2121', status: 'Active' },
  ],
};

const MOCK_INVOICES: BillingInvoice[] = [
    { id: 'inv1', patientId: 'pat1', date: '2024-08-01', dueDate: '2024-08-31', amount: 50.00, status: 'Due', description: 'Co-pay: Dr. Smith (July 15)' },
    { id: 'inv2', patientId: 'pat1', date: '2024-08-05', dueDate: '2024-09-04', amount: 200.00, status: 'Due', description: 'ER Visit Co-insurance' },
    { id: 'inv3', patientId: 'pat1', date: '2024-07-10', dueDate: '2024-08-10', amount: 20.00, status: 'Paid', description: 'Lab Work (Quest)' },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(Object.values(MOCK_INITIAL_USERS).flat());
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [invoices, setInvoices] = useState<BillingInvoice[]>(MOCK_INVOICES);
  const [providerSubscriptionPlans, setProviderSubscriptionPlans] = useState<SubscriptionPlan[]>(MOCK_PROVIDER_PLANS);
  const [currentSubscription, setCurrentSubscription] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('novopath-user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (parsedUser.role === UserRole.PATIENT) {
            setCurrentSubscription(MOCK_PATIENT_PLANS[0]);
        } else if (parsedUser.role === UserRole.PROVIDER && parsedUser.subscription) {
            const sub = providerSubscriptionPlans.find(p => p.id === parsedUser.subscription.planId);
            setCurrentSubscription(sub || null);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
    } finally {
      setLoading(false);
    }
  }, [providerSubscriptionPlans]);

  const updateUserSubscription = useCallback((userId: string, newPlanId: string) => {
      const newPlan = providerSubscriptionPlans.find(p => p.id === newPlanId);
      if (!newPlan) return;

      const updatedUsers = users.map(u => 
          u.id === userId ? {
              ...u,
              subscription: {
                  planId: newPlan.id,
                  planName: newPlan.name,
                  status: u.subscription?.status || 'Active',
                  renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
              }
          } : u
      );
      setUsers(updatedUsers);

      if(user?.id === userId) {
          const updatedCurrentUser = updatedUsers.find(u => u.id === userId);
          if (updatedCurrentUser) {
            setUser(updatedCurrentUser);
            sessionStorage.setItem('novopath-user', JSON.stringify(updatedCurrentUser));
            setCurrentSubscription(newPlan);
          }
      }
  }, [providerSubscriptionPlans, users, user]);


  const login = useCallback((role: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const userToLogin = users.find(u => u.role === role);
      if (userToLogin) {
        setUser(userToLogin);
        sessionStorage.setItem('novopath-user', JSON.stringify(userToLogin));
        if (userToLogin.role === UserRole.PATIENT) {
            setCurrentSubscription(MOCK_PATIENT_PLANS[0]);
        } else if (userToLogin.role === UserRole.PROVIDER && userToLogin.subscription) {
            const sub = providerSubscriptionPlans.find(p => p.id === userToLogin.subscription!.planId);
            setCurrentSubscription(sub || null);
        }
      }
      setIsSubmitting(false);
    }, 700);
  }, [users, providerSubscriptionPlans]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('novopath-user');
  }, []);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    setUsers(prev => {
        const newUser: User = {
            id: `user_${Date.now()}`,
            avatarUrl: `https://picsum.photos/seed/${userData.name}/100`,
            status: 'Active',
            ...userData,
        };
        return [...prev, newUser];
    });
  }, []);

  const editUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    if (user?.id === updatedUser.id) {
        setUser(updatedUser);
        sessionStorage.setItem('novopath-user', JSON.stringify(updatedUser));
    }
  }, [user]);

  const deleteUser = useCallback((userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
  }, []);

  const register = useCallback((userData: Partial<User>, role: UserRole) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name || 'New User',
        email: userData.email || 'new@user.com',
        ...userData,
        role,
        avatarUrl: `https://picsum.photos/seed/${userData.name}/100`,
        status: 'Active',
      };
      setUsers(prev => [...prev, newUser]);
      setUser(newUser);
      sessionStorage.setItem('novopath-user', JSON.stringify(newUser));
      setIsSubmitting(false);
    }, 700);
  }, []);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      editUser(newUser); // Also update in the main users list
      return newUser;
    });
  }, [editUser]);

  const makePayment = useCallback((invoiceId: string, paymentAmount: number) => {
    setInvoices(prev => prev.map(inv => {
        if (inv.id === invoiceId) {
            const remaining = inv.amount - paymentAmount;
            return {
                ...inv,
                amount: remaining > 0 ? remaining : 0,
                status: remaining <= 0 ? 'Paid' : 'Due',
            };
        }
        return inv;
    }));
  }, []);
  
  const changeSubscription = useCallback((planId: string) => {
    if (!user) return;
    const allPlans = user.role === UserRole.PATIENT ? MOCK_PATIENT_PLANS : providerSubscriptionPlans;
    const newPlan = allPlans.find(p => p.id === planId);
    
    if(newPlan) {
        setCurrentSubscription(newPlan);
        if (user.role === UserRole.PROVIDER || user.role === UserRole.PATIENT) {
            updateUserSubscription(user.id, planId);
        }
    }
  }, [user, providerSubscriptionPlans, updateUserSubscription]);

  const updateProviderPlans = useCallback((plans: SubscriptionPlan[]) => {
    setProviderSubscriptionPlans(plans);
  }, []);

  return (
    <AuthContext.Provider value={{ 
        user, 
        users,
        loading, 
        isSubmitting,
        login, 
        logout, 
        updateUser, 
        register,
        addUser,
        editUser,
        deleteUser,
        invoices,
        makePayment,
        patientSubscriptionPlans: MOCK_PATIENT_PLANS,
        providerSubscriptionPlans,
        currentSubscription,
        changeSubscription,
        updateProviderPlans,
        updateUserSubscription,
    }}>
      {children}
    </AuthContext.Provider>
  );
};