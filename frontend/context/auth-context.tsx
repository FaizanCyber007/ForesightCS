'use client';

import * as React from 'react';

export interface UserSession {
  fullName: string;
  companyName: string;
  role: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (
    fullName: string,
    companyName: string,
    role: string,
    email: string,
    username: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Local registration mock removed; rely on actual backend calls for auth.

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Read session on mount
    const savedUser = localStorage.getItem('foresight_user');
    if (savedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('foresight_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/v1/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('foresight_user', JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const register = async (
    fullName: string,
    companyName: string,
    role: string,
    email: string,
    username: string,
    password: string
  ) => {
    // For now, mock registration succeeds but user must log in
    await new Promise((resolve) => setTimeout(resolve, 800));
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
