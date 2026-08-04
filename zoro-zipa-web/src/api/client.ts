import axios from 'axios'

/**
 * Axios instance for the Zoro-Zipa Spring Boot API.
 * In dev, Vite proxies /api to http://localhost:8080.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})
