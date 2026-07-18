import axios from 'axios';

// Configuración base para conectarse al backend
const api = axios.create({
  baseURL: 'http://localhost:5000', // URL de tu servidor Node.js
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;