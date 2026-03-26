import { getSecureItem } from './secure-storage';
import { getApiBaseUrl } from '../config/runtime-config';
import { Platform } from 'react-native';
import { parseApiResponse, type ApiError } from './http';

const IS_WEB = Platform.OS === 'web';
const AUTH_TOKEN_KEY = 'patrol_auth_token';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
};

/**
 * Thrown when an API request returns a non-2xx response. The `userMessage`
 * field contains a message safe to show to end users; `technicalDetail`
 * is for developer logging only.
 */
export class ApiRequestError extends Error {
  readonly userMessage: string;
  readonly technicalDetail?: string;

  constructor(result: ApiError) {
    super(result.error);
    this.name = 'ApiRequestError';
    this.userMessage = result.error;
    this.technicalDetail = result.technicalDetail;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let token: string | null = null;
  if (IS_WEB) {
    token = typeof window !== 'undefined' ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
  } else {
    token = await getSecureItem(AUTH_TOKEN_KEY);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getApiBaseUrl() ?? '';
  const response = await fetch(`${baseUrl}/api${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const result = await parseApiResponse<T>(response);

  if (!result.ok) {
    throw new ApiRequestError(result);
  }

  return result.data;
}

const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

export default api;
