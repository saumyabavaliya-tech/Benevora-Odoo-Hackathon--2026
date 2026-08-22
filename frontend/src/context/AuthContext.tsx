import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUser } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updated: Partial<User>) => void;
  updateUser: (updated: Partial<User>) => void;
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

  useEffect(() => {
    if (user) {
      localStorage.setItem('globetrotter_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    // Mock login
    const loggedUser: User = {
      ...mockUser,
      email: email || mockUser.email,
    };
    setUser(loggedUser);
    return true;
  };

  const signup = async (name: string, email: string): Promise<boolean> => {
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
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!user) return;
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
