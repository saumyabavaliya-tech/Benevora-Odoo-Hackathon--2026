/**
 * GlobeTrotter API HTTP Client
 * Handles base URL configuration, Bearer token injection, and JSON response parsing.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface ApiError {
  status: number;
  message: string;
  detail?: any;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('globetrotter_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null as unknown as T;
    }

    if (!response.ok) {
      let errorDetail = 'API request failed';
      try {
        const errorJson = await response.json();
        errorDetail = errorJson.detail || errorJson.message || JSON.stringify(errorJson);
      } catch {
        errorDetail = response.statusText;
      }

      const error: ApiError = {
        status: response.status,
        message: errorDetail,
      };
      throw error;
    }

    return (await response.json()) as T;
  } catch (err: any) {
    if (err.status) {
      throw err;
    }
    // Network or connection error (e.g. backend offline)
    throw {
      status: 0,
      message: err.message || 'Unable to connect to the backend server.',
    };
  }
}
