import { axiosClient, setAuthToken, clearAuthToken, setRefreshToken, setUserId, clearAllTokens } from './axios-client';
import { ENDPOINTS } from './endpoints';
import { logApiError } from './error-handler';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
  phone?: string;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  profileImage?: string | null;
  password_change_required?: boolean;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Auth API service
export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      console.log('Login response:', response.data);
      // Backend structure: { statusCode, message, data: { accessToken, refreshToken, user } }
      const authData = response.data.data;
      
      // Store tokens and user ID in memory
      setAuthToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);
      setUserId(authData.user.id);
      
      return authData;
    } catch (error) {
      logApiError(error);
      throw error;
    }
  },
  
  // Admin login
  adminLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axiosClient.post(ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
      console.log('Admin login response:', response.data);
      // Backend structure: { statusCode, message, data: { accessToken, refreshToken, user } }
      const authData = response.data.data;
      
      // Store tokens and user ID in memory
      setAuthToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);
      setUserId(authData.user.id);
      
      return authData;
    } catch (error) {
      logApiError(error);
      throw error;
    }
  },
  
  // Logout user
  logout: async (): Promise<{ success: boolean }> => {
    try {
      const response = await axiosClient.post(ENDPOINTS.AUTH.LOGOUT);
      clearAllTokens();
      return response.data;
    } catch (error) {
      // Clear token even if API call fails
      clearAllTokens();
      logApiError(error);
      throw error;
    }
  },
  
  // Get current user profile
  getProfile: async (): Promise<UserDto> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.AUTH.PROFILE);
      // Backend structure: { statusCode, message, data: UserDto }
      return response.data.data || response.data;
    } catch (error) {
      logApiError(error);
      throw error;
    }
  },
  
  // Get current admin profile
  getAdminProfile: async (): Promise<UserDto> => {
    try {
      console.log('Fetching admin profile from:', ENDPOINTS.AUTH.ADMIN_PROFILE);
      const response = await axiosClient.get(ENDPOINTS.AUTH.ADMIN_PROFILE);
      // Backend structure: { statusCode, message, data: UserDto }
      console.log('Admin profile response:', response.data);
      const profileData = response.data.data;
      
      // If we got a successful admin profile, we should update userId too
      // This ensures token refresh has the correct user ID
      if (profileData && profileData.id) {
        setUserId(profileData.id);
      }
      
      return profileData;
    } catch (error) {
      logApiError(error);
      throw error;
    }
  },
  
  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ success: boolean }> => {
    try {
      const response = await axiosClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return response.data;
    } catch (error) {
      logApiError(error);
      throw error;
    }
  },
  
  // Refresh token (usually called automatically by axios interceptor)
  refreshToken: async (userId: string, refreshToken: string): Promise<{ accessToken: string }> => {
    try {
      const response = await axiosClient.post(ENDPOINTS.AUTH.REFRESH, {
        userId,
        refreshToken
      });
      
      // Backend structure: { statusCode, message, data: { accessToken } }
      const tokenData = response.data.data;
      setAuthToken(tokenData.accessToken);
      return tokenData;
    } catch (error) {
      clearAllTokens();
      logApiError(error);
      throw error;
    }
  },
}; 