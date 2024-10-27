import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000000000,
  withCredentials: true
  // headers: {
  //   'x-auth-token':
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlRJVElSUEVUU0hPUEBQME85SThVNyIsImlhdCI6MTcyODg3OTczMX0.K14-dWjVmj-vbylSvFulQWioZr6flpTMz0sutuQ_FbM'
  // }
});
