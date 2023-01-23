import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': ['http://localhost:3000', 'https://react-web-chat.vercel.app'],
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers':
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    'Content-Type': 'application/json'
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
  return config
}, async error => {
  return await Promise.reject(error)
})

export default api
