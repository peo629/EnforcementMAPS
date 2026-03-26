import api from '../../shared/infra/api';
import { getSecureItem, setSecureItem, deleteSecureItem } from '../../shared/infra/secure-storage';

const TOKEN_KEY = 'patrol_auth_token';

interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  officerNumber: number;
  isActive: boolean;
}

export const authService = {
  async login(email: string, password: string) {
    const data = await api.post<{ token: string; session?: { token: string }; user: AuthUser }>('/auth/login', { email, password });
    const token = data.session?.token ?? data.token;
    await setSecureItem(TOKEN_KEY, token);
    return { token, user: data.user };
  },

  async getMe() {
    const token = await getSecureItem(TOKEN_KEY);
    if (!token) return null;
    const data = await api.get<{ user: AuthUser }>('/auth/me');
    return { token, user: data.user };
  },

  async logout() {
    await deleteSecureItem(TOKEN_KEY);
  },

  async getToken() {
    return getSecureItem(TOKEN_KEY);
  },
};
