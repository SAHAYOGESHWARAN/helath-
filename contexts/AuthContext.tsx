
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  register: (userData: Pick<User, 'name' | 'email' | 'dob'>, role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<UserRole, User[]> = {
  [UserRole.PATIENT]: [
    { id: 'pat1', name: 'John Doe', email: 'john.doe@email.com', role: UserRole.PATIENT, avatarUrl: 'https://picsum.photos/seed/patient1/100', dob: '1985-05-20', phone: '555-123-4567', address: '123 Health St, Wellness City, USA' },
    { id: 'pat2', name: 'Alice Johnson', email: 'alice.j@email.com', role: UserRole.PATIENT, avatarUrl: 'https://picsum.photos/seed/patient2/100', dob: '1992-11-12', phone: '555-234-5678', address: '456 Oak Ave, Healing Town, USA' },
    { id: 'pat3', name: 'Charlie Brown', email: 'charlie.b@email.com', role: UserRole.PATIENT, avatarUrl: 'https://picsum.photos/seed/patient3/100', dob: '1998-09-30', phone: '555-345-6789', address: '789 Pine Ln, Remedy Village, USA' },
  ],
  [UserRole.PROVIDER]: [
    { id: 'pro1', name: 'Dr. Jane Smith', email: 'jane.smith@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider1/100', phone: '555-987-6543', specialty: 'Cardiology' },
    { id: 'pro2', name: 'Dr. David Chen', email: 'david.chen@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider2/100', phone: '555-876-5432', specialty: 'Dermatology' },
    { id: 'pro3', name: 'Dr. Emily White', email: 'emily.white@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider3/100', phone: '555-765-4321', specialty: 'Pediatrics' },
  ],
  [UserRole.ADMIN]: [
    { id: 'adm1', name: 'Alex Johnson', email: 'alex.j@email.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/admin1/100', phone: '555-555-1212' },
    { id: 'adm2', name: 'Maria Garcia', email: 'maria.g@email.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/admin2/100', phone: '555-555-2121' },
  ],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in session storage
    try {
      const storedUser = sessionStorage.getItem('novopath-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      const userToLogin = MOCK_USERS[role][0];
      setUser(userToLogin);
      sessionStorage.setItem('novopath-user', JSON.stringify(userToLogin));
      setLoading(false);
    }, 500);
  }, []);

  const register = useCallback((userData: Pick<User, 'name' | 'email' | 'dob'>, role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: `user_${Date.now()}`,
        ...userData,
        role,
        avatarUrl: `https://picsum.photos/seed/${userData.name}/100`,
      };
      setUser(newUser);
      sessionStorage.setItem('novopath-user', JSON.stringify(newUser));
      setLoading(false);
    }, 500);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('novopath-user');
  }, []);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) {
        return null;
      }
      const newUser = { ...prevUser, ...updatedData };
      sessionStorage.setItem('novopath-user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, register }}>
      {children}
    </AuthContext.Provider>
  );
};
