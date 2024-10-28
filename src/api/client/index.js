import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://popo-backend-1.onrender.com/',
  timeout: 10000000000,
  withCredentials: true
});
