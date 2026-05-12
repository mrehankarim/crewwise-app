import axios from 'axios';
import { Platform } from 'react-native';

// For Android Emulator use 10.0.2.2 instead of localhost
// For iOS Simulator use localhost
const baseURL = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api/v1' : 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
