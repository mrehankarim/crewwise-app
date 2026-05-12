import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.OS === 'android'
  ? 'http://[IP_ADDRESS]/api/v1'
  : 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
