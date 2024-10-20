import axios from 'axios';
export const client = axios.create({
  baseURL: 'https://popo-backend-1.onrender.com/',
  timeout: 100000,
  headers: {
    'x-auth-token':
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRJVElSUEVUU0hPUEBQME85SThVNyIsImlhdCI6MTcyOTM0Nzg2N30.us4TtLPyHmR5nEzwGzNlzg41omBcoJHFhghIfy8_cw0'
  }
});

// module.exports = client;
