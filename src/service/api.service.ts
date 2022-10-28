import axios from 'axios'

const JWTToken = localStorage.getItem('token')

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export function apiSetHeader (name: string, value: string): void {
  if (value.length > 0) {
    api.defaults.headers[name] = value
  }
};

if (JWTToken != null) {
  apiSetHeader('Authorization', `Bearer ${JWTToken}`)
}

api.interceptors.request.use(config => {
//   if (config.defaults.headers.Authorization != null) {
//     // Тут пишем редирект если не авторизован
//   }

  return config
}, async error => {
  return await Promise.reject(error)
})

export default api
