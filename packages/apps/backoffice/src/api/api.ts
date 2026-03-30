import axios from 'axios'
import { VITE_API_BASE_URL } from 'env-vars'
import { requestTokenInterceptor } from './interceptors/request-token.interceptor'

const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(requestTokenInterceptor)

export default api
