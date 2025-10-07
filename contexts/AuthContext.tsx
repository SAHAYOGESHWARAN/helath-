
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

const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.PATIENT]: { id: 'pat1', name: 'John Doe', email: 'john.doe@email.com', role: UserRole.PATIENT, avatarUrl: 'https://picsum.photos/seed/patient/100', dob: '1985-05-20', phone: '555-123-4567', address: '123 Health St, Wellness City, USA' },
  [UserRole.PROVIDER]: { id: 'pro1', name: 'Dr. Jane Smith', email: 'jane.smith@email.com', role: UserRole.PROVIDER, avatarUrl: 'https://picsum.photos/seed/provider/100', phone: '555-987-6543' },
  [UserRole.ADMIN]: { id: 'adm1', name: 'Alex Johnson', email: 'alex.j@email.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/seed/admin/100', phone: '555-555-1212' },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in session storage
    try {
      const storedUser = sessionStorage.getItem('tangerine-user');
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
      const userToLogin = MOCK_USERS[role];
      setUser(userToLogin);
      sessionStorage.setItem('tangerine-user', JSON.stringify(userToLogin));
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
      sessionStorage.setItem('tangerine-user', JSON.stringify(newUser));
      setLoading(false);
    }, 500);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('tangerine-user');
  }, []);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) {
        return null;
      }
      const newUser = { ...prevUser, ...updatedData };
      sessionStorage.setItem('tangerine-user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, register }}>
      {children}
    </AuthContext.Provider>
  );
};
