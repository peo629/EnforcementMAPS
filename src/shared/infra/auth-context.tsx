import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { AppState, Platform } from "react-native";
import { getSecureItem, setSecureItem, deleteSecureItem } from "./secure-storage";
import { getApiBaseUrl } from "../config/runtime-config";
import { parseApiResponse } from "./http";

const IS_WEB = Platform.OS === "web";

// \u2500\u2500\u2500 IMPORTANT \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
// API_BASE_URL is intentionally NOT evaluated at module scope.
// EXPO_PUBLIC_DOMAIN is baked in by Metro at build time, but module-level
// evaluation can freeze a null value if the module loads before env
// substitution is complete. Calling getApiBaseUrl() lazily inside each
// function ensures the resolved value is always used.
// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

const AUTH_TOKEN_KEY = "patrol_auth_token";
const HEARTBEAT_INTERVAL_MS = 30_000;
const NO_API_URL_ERROR = "Unable to connect to the system. The server address has not been configured. Contact your supervisor or IT support.";

export interface AuthUser {
  id: string;
  officerNumber: number;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
}

interface AuthResponse {
  user: AuthUser;
  session?: { token: string };
  token?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (officerNumber: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, officerNumber: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

function presenceRequest(endpoint: string, authToken: string): void {
  const apiBaseUrl = getApiBaseUrl();
  if (!apiBaseUrl) return;
  fetch(`${apiBaseUrl}/api/presence/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ clientType: Platform.OS === "ios" ? "ios" : "android" }),
  }).catch(() => {});
}

function extractToken(data: AuthResponse): string | null {
  return data?.session?.token ?? data?.token ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tokenRef = useRef<string | null>(null);

  tokenRef.current = token;

  const startHeartbeat = useCallback((authToken: string) => {
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    presenceRequest("connect", authToken);
    heartbeatRef.current = setInterval(() => {
      presenceRequest("heartbeat", authToken);
    }, HEARTBEAT_INTERVAL_MS);
  }, []);

  const stopHeartbeat = useCallback((authToken: string | null) => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (authToken) {
      presenceRequest("disconnect", authToken);
    }
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = IS_WEB
          ? (typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null)
          : await getSecureItem(AUTH_TOKEN_KEY);

        if (!storedToken) {
          setLoading(false);
          return;
        }

        const apiBaseUrl = getApiBaseUrl();
        if (!apiBaseUrl && !IS_WEB) {
          await deleteSecureItem(AUTH_TOKEN_KEY);
          setLoading(false);
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        try {
          const res = await fetch(`${apiBaseUrl}/api/auth/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          if (res.ok) {
            const data = await res.json() as { user: AuthUser };
            setUser(data.user);
            setToken(storedToken);
          } else {
            if (IS_WEB) {
              window.localStorage.removeItem(AUTH_TOKEN_KEY);
            } else {
              await deleteSecureItem(AUTH_TOKEN_KEY);
            }
          }
        } catch {
          clearTimeout(timeoutId);
        }
      } catch {
        // SecureStore or other init error
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  useEffect(() => {
    if (!token || IS_WEB) return;
    startHeartbeat(token);
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [token, startHeartbeat]);

  useEffect(() => {
    if (IS_WEB) return;
    const subscription = AppState.addEventListener("change", (nextState) => {
      const currentToken = tokenRef.current;
      if (!currentToken) return;
      if (nextState === "active") {
        startHeartbeat(currentToken);
      } else if (nextState === "background" || nextState === "inactive") {
        stopHeartbeat(currentToken);
      }
    });
    return () => subscription.remove();
  }, [startHeartbeat, stopHeartbeat]);

  const login = useCallback(async (officerNumber: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      if (!apiBaseUrl) {
        return { success: false, error: NO_API_URL_ERROR };
      }

      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officerNumber, password }),
      });

      const result = await parseApiResponse<AuthResponse>(res);
      if (!result.ok) {
        return { success: false, error: result.error };
      }

      const tokenValue = extractToken(result.data);
      if (!tokenValue || !result.data?.user) {
        return { success: false, error: "Sign in succeeded but the response was incomplete. Please try again." };
      }

      if (IS_WEB) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, tokenValue);
      } else {
        await setSecureItem(AUTH_TOKEN_KEY, tokenValue);
      }
      setToken(tokenValue);
      setUser(result.data.user);
      return { success: true };
    } catch (err) {
      console.error("[AUTH] Login network error:", err);
      return { success: false, error: "Unable to reach the server. Please check your internet connection and try again." };
    }
  }, []);

  const register = useCallback(async (
    email: string,
    officerNumber: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiBaseUrl = getApiBaseUrl();
      if (!apiBaseUrl) {
        return { success: false, error: NO_API_URL_ERROR };
      }

      const res = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, officerNumber, password, confirmPassword }),
      });

      const result = await parseApiResponse<AuthResponse>(res);
      if (!result.ok) {
        return { success: false, error: result.error };
      }

      const tokenValue = extractToken(result.data);
      if (!tokenValue || !result.data?.user) {
        return { success: false, error: "Registration succeeded but the response was incomplete. Please try again." };
      }

      if (IS_WEB) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, tokenValue);
      } else {
        await setSecureItem(AUTH_TOKEN_KEY, tokenValue);
      }
      setToken(tokenValue);
      setUser(result.data.user);
      return { success: true };
    } catch (err) {
      console.error("[AUTH] Registration network error:", err);
      return { success: false, error: "Unable to reach the server. Please check your internet connection and try again." };
    }
  }, []);

  const logout = useCallback(async () => {
    const currentToken = token;
    if (currentToken) {
      stopHeartbeat(currentToken);
      try {
        const apiBaseUrl = getApiBaseUrl();
        if (apiBaseUrl) {
          await fetch(`${apiBaseUrl}/api/auth/logout`, {
            method: "POST",
            headers: { Authorization: `Bearer ${currentToken}` },
          });
        }
      } catch { /* ignore */ }
    }
    if (IS_WEB) {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    } else {
      await deleteSecureItem(AUTH_TOKEN_KEY);
    }
    setToken(null);
    setUser(null);
  }, [token, stopHeartbeat]);

  const value = useMemo(() => ({
    user, token, loading, login, register, logout,
  }), [user, token, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
