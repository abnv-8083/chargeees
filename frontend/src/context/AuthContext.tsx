'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminGetMe, adminLogin, adminLogout } from '@/lib/api';
import AuthModal from '@/components/ui/AuthModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'editor' | 'client';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Global Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
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
    } else {
      setUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();
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

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    const res = await adminLogin(email, password);
    const userData = res.user || res.data;
    if (res.token && userData) {
      localStorage.setItem('token', res.token);
      setToken(res.token);
      setUser(userData);
      if (userData.role !== 'client') {
        router.push('/admin');
      }
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
      if (pathname.startsWith('/admin')) {
        router.push('/admin/login');
      }
    }
  };

  const handleModalSuccess = (userData: User, tokenStr: string) => {
    setUser(userData);
    setToken(tokenStr);
    if (userData.role !== 'client' && pathname.startsWith('/admin/login')) {
      router.push('/admin');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        refreshUser,
      }}
    >
      {children}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        onSuccess={handleModalSuccess}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
