import { createContext } from 'react';
import { AuthContextType } from './AuthContext.tsx';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
