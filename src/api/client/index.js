import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://popo-backend-1.onrender.com',
  // baseURL: 'https://popo-backend.vercel.app/',
  // baseURL: 'http://localhost:8000',

  // baseURL: 'https://popo-backend-dev.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
  withCredentials: true
});
