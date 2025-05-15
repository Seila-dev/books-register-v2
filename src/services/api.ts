import axios from 'axios';

const api = axios.create({
  baseURL: 'https://books-register-api-production.up.railway.app/',
});

export default api;
