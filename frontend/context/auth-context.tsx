'use client';

import * as React from 'react';

export interface UserSession {
  fullName: string;
  companyName: string;
  role: string;
  email: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<boolean>;
  register: (fullName: string, companyName: string, role: string, email: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Read session on mount
    const savedUser = localStorage.getItem('foresight_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('foresight_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser: UserSession = {
      fullName: 'Jordan Rivera',
      companyName: 'Foresight Labs',
      role: 'Customer Success Manager',
      email: email,
    };
    
    setUser(mockUser);
    localStorage.setItem('foresight_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  const register = async (fullName: string, companyName: string, role: string, email: string) => {
    setIsLoading(true);
    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const mockUser: UserSession = {
      fullName,
      companyName,
      role,
      email,
    };
    
    setUser(mockUser);
    localStorage.setItem('foresight_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foresight_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
