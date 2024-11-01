import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://popo-backend-1.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
  withCredentials: true
});
