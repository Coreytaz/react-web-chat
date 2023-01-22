import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, append,delete,entries,foreach,get,has,keys,set,values'
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
