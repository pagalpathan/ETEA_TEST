import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { mockUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    setIsGuest(false);
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      joinedAt: new Date().toISOString(),
      totalTests: 0,
      averageScore: 0,
      streak: 0
    };
    setUser(newUser);
    setIsGuest(false);
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Guest User',
      email: '',
      joinedAt: new Date().toISOString(),
      totalTests: 0,
      averageScore: 0,
      streak: 0
    };
    setUser(guestUser);
    setIsGuest(true);
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
  };

  const resetPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      login,
      signup,
      loginAsGuest,
      logout,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};