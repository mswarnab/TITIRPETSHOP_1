import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://popo-backend-dev.onrender.com',
  // baseURL: 'http://localhost:8000',

  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
  withCredentials: true
});
