import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export type Role = 'guest' | 'host' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: Role;
  avatar?: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: Role, username?: string) => Promise<void>;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    role: string;
    avatar?: string;
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    api.get<User>('/auth/me')
      .then((data) => {
        setUser({
          ...data,
          role: (data.role as string).toLowerCase() as Role,
        });
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      localStorage.setItem('token', res.token);
      setUser({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        username: res.user.username,
        role: res.user.role.toLowerCase() as Role,
        avatar: res.user.avatar,
      });
      toast.success(`Welcome back, ${res.user.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: Role,
    username?: string
  ): Promise<void> => {
    try {
      const res = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
        role: role.toUpperCase(),
        username: username || email.split('@')[0],
      });
      localStorage.setItem('token', res.token);
      setUser({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        username: res.user.username,
        role: res.user.role.toLowerCase() as Role,
        avatar: res.user.avatar,
      });
      toast.success(`Welcome, ${res.user.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}