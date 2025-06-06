import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, ENDPOINTS } from './endpoints';

// Token storage keys
const AUTH_TOKEN_KEY = 'admin_auth_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
const USER_ID_KEY = 'admin_user_id';

// Load tokens from sessionStorage on initialization (client-side only)
let accessToken: string | null = null;
let refreshToken: string | null = null;
let userId: string | null = null;

// Initialize tokens from sessionStorage if available
if (typeof window !== 'undefined') {
  try {
    accessToken = sessionStorage.getItem(AUTH_TOKEN_KEY);
    refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
    userId = sessionStorage.getItem(USER_ID_KEY);
    
    console.log('Loaded auth state from session storage:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUserId: !!userId
    });
  } catch (e) {
    console.error('Error loading auth state from session storage:', e);
  }
}

// Create the axios instance
export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies (refresh token)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token to requests
axiosClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      
      // Enhanced debugging for admin-specific endpoints
      if (config.url?.includes('/admin/')) {
        console.log('Making admin API request:', {
          url: config.url,
          method: config.method,
          hasToken: true
        });
      }
    } else {
      console.log('Making request without auth token:', {
        url: config.url,
        method: config.method
      });
    }
    
    // Log request for debugging
    console.log(`${config.method?.toUpperCase()} ${config.url}`, { 
      headers: config.headers,
      hasToken: !!accessToken
    });
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Log error for debugging
    console.log('Response error:', { 
      status: error.response?.status,
      url: originalRequest.url,
      hasToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUserId: !!userId
    });
    
    // Handle 401 errors (token expired)
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      originalRequest.url !== ENDPOINTS.AUTH.REFRESH &&
      userId && refreshToken // Only attempt refresh if we have required data
    ) {
      originalRequest._retry = true;
      
      try {
        console.log('Attempting token refresh with:', {
          userId,
          refreshTokenLength: refreshToken?.length
        });
        
        // Call refresh token endpoint with required parameters
        const response = await axios.post(
          `${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
          {
            userId: userId,
            refreshToken: refreshToken
          },
          { withCredentials: true }
        );
        
        console.log('Token refresh response:', response.data);
        
        // Update in-memory token
        const responseData = response.data.data || response.data;
        const newToken = responseData.accessToken;
        
        // Store the new access token
        setAuthToken(newToken);
        
        // Update header and retry
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        
        return axios(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Force logout on refresh failure
        clearAllTokens();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth token management functions
export const setAuthToken = (token: string) => {
  console.log('Setting auth token:', token?.substring(0, 15) + '...');
  accessToken = token;
  
  // Store in sessionStorage (client-side only)
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (e) {
      console.error('Error storing auth token in session storage:', e);
    }
  }
};

export const setRefreshToken = (token: string) => {
  console.log('Setting refresh token:', token?.substring(0, 15) + '...');
  refreshToken = token;
  
  // Store in sessionStorage (client-side only)
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (e) {
      console.error('Error storing refresh token in session storage:', e);
    }
  }
};

export const setUserId = (id: string) => {
  console.log('Setting user ID:', id);
  userId = id;
  
  // Store in sessionStorage (client-side only)
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(USER_ID_KEY, id);
    } catch (e) {
      console.error('Error storing user ID in session storage:', e);
    }
  }
};

export const clearAuthToken = () => {
  console.log('Clearing auth token');
  accessToken = null;
  
  // Remove from sessionStorage (client-side only)
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.error('Error removing auth token from session storage:', e);
    }
  }
};

export const clearAllTokens = () => {
  console.log('Clearing all tokens');
  accessToken = null;
  refreshToken = null;
  userId = null;
  
  // Remove from sessionStorage (client-side only)
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(AUTH_TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(USER_ID_KEY);
    } catch (e) {
      console.error('Error removing tokens from session storage:', e);
    }
  }
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  return !!accessToken;
}; 