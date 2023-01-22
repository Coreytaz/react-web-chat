import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  }
})

export function apiSetHeader (name: string, value: string): void {
  if (value.length > 0) {
    api.defaults.headers[name] = value
  }
};

api.interceptors.request.use(config => {
  // if (config.defaults.headers.Authorization != null) {
  // }
  config.withCredentials = false
  return config
}, async error => {
  return await Promise.reject(error)
})

export default api
