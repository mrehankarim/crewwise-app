import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  workerDetails?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: async (email, password, role) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, accessToken } = data.data;

      if (user.role !== role) {
        throw new Error(`Please login as ${user.role}`);
      }

      await AsyncStorage.setItem('token', accessToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      set({ user, token: accessToken, isLoading: false });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message);
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) { }
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    set({ user: null, token: null, isLoading: false });
  },
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        set({ isLoading: false });
        return;
      }

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const { data } = await api.get('/auth/me');
      set({ user: data.data.user, token, isLoading: false });
    } catch (error) {
      await AsyncStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      set({ user: null, token: null, isLoading: false });
    }
  }
}));
