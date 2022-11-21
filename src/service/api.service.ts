import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export function apiSetHeader (name: string, value: string): void {
  if (value.length > 0) {
    api.defaults.headers[name] = value
  }
};

api.interceptors.request.use(config => {
  // if (config.defaults.headers.Authorization != null) {
  // }
  config.withCredentials = true
  return config
}, async error => {
  return await Promise.reject(error)
})

export default api
