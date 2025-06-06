"use client";

import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

interface UseAuthReturn {
  user: any;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasPermission: (role: string) => boolean;
  clearError: () => void;
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Check if user is admin
  const isAdmin = context.user?.role === 'ADMIN';
  
  // Check if user has specific permission
  const hasPermission = (requiredRole: string) => {
    if (!context.user) return false;
    
    // Admin has all permissions
    if (context.user.role === 'ADMIN') return true;
    
    // Check specific role
    return context.user.role === requiredRole;
  };
  
  return {
    ...context,
    isAdmin,
    hasPermission,
  };
} 