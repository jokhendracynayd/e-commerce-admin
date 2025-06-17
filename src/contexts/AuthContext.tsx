'use client';

import { createContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, UserDto } from '@/lib/api/auth-api';
import { clearAllTokens, isAuthenticated } from '@/lib/api/axios-client';

// Auth context type definition
interface AuthContextType {
  user: UserDto | null;
  isLoading: boolean;
  error: string | null;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  clearError: () => void;
  updateProfile: (data: { name: string }) => Promise<boolean>;
}

// Create auth context with undefined default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in on mount - admin only
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have tokens first
        const hasTokens = isAuthenticated();
        console.log('Checking for admin authentication, has tokens:', hasTokens);
        
        if (!hasTokens) {
          console.log('No authentication tokens found, skipping profile fetch');
          setIsLoading(false);
          return;
        }
        
        // Check for admin user only - this is an admin panel
        console.log('Checking for admin authentication...');
        try {
          const adminData = await authApi.getAdminProfile();
          console.log('Admin authentication successful:', adminData);
          setUser(adminData);
        } catch (adminErr) {
          console.error('Admin authentication failed:', adminErr);
          // Not authenticated as admin - don't try regular user endpoint
          // as this is an admin-only application
          
          // Clear tokens on admin auth failure
          clearAllTokens();
        }
      } catch (err) {
        // Silent fail - just don't set the user
        console.error('Auth check error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle forced logout events (e.g., from token refresh failure)
  useEffect(() => {
    const handleForceLogout = () => {
      setUser(null);
      clearAllTokens();
      router.push('/auth/login');
    };

    window.addEventListener('auth:logout', handleForceLogout);
    return () => {
      window.removeEventListener('auth:logout', handleForceLogout);
    };
  }, [router]);

  // Register function for creating new accounts
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await authApi.register({ name, email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function for regular users
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login({ email, password });
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function for admin users
  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting admin login process for:', email);
      const response = await authApi.adminLogin({ email, password });
      console.log('Admin login successful, user:', response.user);
      setUser(response.user);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Admin login error:', err);
      if (err.response) {
        console.error('Error details:', {
          status: err.response.status,
          data: err.response.data,
        });
      }
      setError(err.response?.data?.message || 'Admin login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore errors during logout
      console.error('Logout error (ignoring):', err);
    } finally {
      setUser(null);
      clearAllTokens();
      setIsLoading(false);
      router.push('/auth/login');
    }
  };

  // Clear error function
  const clearError = () => setError(null);
  
  // Update profile function
  const updateProfile = async (data: { name: string }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await authApi.updateProfile(data);
      setUser(updatedUser);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Return the context provider
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        register,
        login,
        adminLogin,
        logout,
        isAuthenticated: !!user,
        clearError,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
} 