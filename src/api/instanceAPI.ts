import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL_TASK,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config: any): AxiosRequestConfig => {
  const token = sessionStorage.getItem('user');
  // config.headers['Authorization'] = token ? `Bearer ${token}` : ``;
  config.headers.Authorization = token ? `Bearer ${token}` : ``;
  return config;
});

export default instance;
