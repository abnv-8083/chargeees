'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminGetMe, adminLogin, adminLogout } from '@/lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const userData = await adminGetMe();
          setUser(userData);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // Protect admin routes
  useEffect(() => {
    if (!loading && pathname.startsWith('/admin')) {
      const isPublicAdminRoute = ['/admin/login', '/admin/forgot-password', '/admin/reset-password'].some(p => pathname.startsWith(p));
      if (!token && !isPublicAdminRoute) {
        router.replace('/admin/login');
      } else if (token && isPublicAdminRoute) {
        router.replace('/admin');
      }
    }
  }, [loading, token, pathname, router]);

  const login = async (email: string, password: string) => {
    const res = await adminLogin(email, password);
    if (res.token && res.data) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(res.data);
      router.push('/admin');
    }
  };

  const logout = async () => {
    try {
      await adminLogout();
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      router.push('/admin/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
