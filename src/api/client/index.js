import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://popo-backend-1.onrender.com',
  // baseURL: 'http://192.168.0.7:8000',
  // baseURL: 'http://localhost:8000',

  // baseURL: 'https://popo-backend-dev.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
  withCredentials: true
});
