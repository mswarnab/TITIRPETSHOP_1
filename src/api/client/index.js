import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://popo-backend-v.vercel.app/',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 60000,
  withCredentials: true
});
