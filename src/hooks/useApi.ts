'use client';

import { parseCookies } from 'nookies';
import axios from 'axios';

export function useApi() {
  const { 'books-register.token': token } = parseCookies();

  const api = axios.create({
    baseURL: 'https://books-register-api-production.up.railway.app/',
  });

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return api;
}