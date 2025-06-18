'use client';

import { parseCookies } from 'nookies';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useCallback, useMemo } from 'react';

// Create a singleton axios instance
const createApiInstance = (): AxiosInstance => {
  const api = axios.create({
    baseURL: 'https://books-register-api-production.up.railway.app/',
    timeout: 10000, // 10 second timeout
  });

  // Request interceptor to add token dynamically
  api.interceptors.request.use(
    (config) => {
      const { 'books-register.token': token } = parseCookies();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Token expired or invalid - you might want to redirect to login
        // or dispatch a logout action here
        console.warn('Authentication failed - token may be expired');
        // Optional: Clear the invalid token
        // destroyCookie(null, 'books-register.token');
      }
      return Promise.reject(error);
    }
  );

  return api;
};

// Singleton instance
let apiInstance: AxiosInstance | null = null;

export function useApi() {
  // Create the instance only once using useMemo
  const api = useMemo(() => {
    if (!apiInstance) {
      apiInstance = createApiInstance();
    }
    return apiInstance;
  }, []);

  return api;
}

// Utility function to get current token
export function getToken(): string | undefined {
  const { 'books-register.token': token } = parseCookies();
  return token;
}

// Utility function to check if user is authenticated
export function useIsAuthenticated(): boolean {
  return useMemo(() => {
    const token = getToken();
    return !!token;
  }, []);
}

// Optional: Hook for making authenticated requests with better error handling
export function useAuthenticatedRequest() {
  const api = useApi();
  
  const makeRequest = useCallback(async <T>(
    requestFn: (api: AxiosInstance) => Promise<T>
  ): Promise<T> => {
    try {
      return await requestFn(api);
    } catch (error) {
      if (error instanceof AxiosError) {
        // Handle specific API errors
        throw new Error(error.response?.data?.message || error.message);
      }
      throw error;
    }
  }, [api]);

  return makeRequest;
}