import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUser } from '../data/mockData';
import { authApi } from '../services/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => Promise<void>;
  updateUser: (updated: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('globetrotter_user');
      return stored ? JSON.parse(stored) : mockUser;
    } catch {
      return mockUser;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session against backend on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('globetrotter_token');
      if (token) {
        try {
          const freshUser = await authApi.getMe();
          setUser(freshUser);
        } catch {
          // Token expired or invalid
          console.warn('Session expired or backend unavailable, using local session');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  }, [user]);

  const login = async (email: string, password?: string): Promise<boolean> => {
    try {
      const res = await authApi.login(email, password || 'password123');
      setUser(res.user);
      return true;
    } catch (err: any) {
      console.warn('Backend login failed, using local auth:', err.message);
      const loggedUser: User = {
        ...mockUser,
        email: email || mockUser.email,
      };
      setUser(loggedUser);
      return true;
    }
  };

  const signup = async (name: string, email: string, password?: string): Promise<boolean> => {
    try {
      const res = await authApi.register(name, email, password || 'password123');
      setUser(res.user);
      return true;
    } catch (err: any) {
      console.warn('Backend signup failed, using local auth:', err.message);
      const newUser: User = {
        ...mockUser,
        id: `user-${Date.now()}`,
        name: name || 'Explorer',
        email: email,
        tripsCount: 0,
        countriesVisited: 1,
      };
      setUser(newUser);
      return true;
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (updated: Partial<User>) => {
    if (!user) return;
    try {
      if (updated.name || updated.email) {
        await authApi.updateProfile({ name: updated.name, email: updated.email });
      }
    } catch (err) {
      console.warn('Backend profile update failed:', err);
    }
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        updateUser: updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
