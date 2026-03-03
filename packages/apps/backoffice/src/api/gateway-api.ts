import axios from 'axios'
import { VITE_API_GATEWAY } from 'env-vars'
import { requestTokenInterceptor } from './interceptors/request-token.interceptor'

const gatewayApi = axios.create({
  baseURL: VITE_API_GATEWAY,
  headers: {
    'Content-Type': 'application/json',
  },
})

gatewayApi.interceptors.request.use(requestTokenInterceptor)

export default gatewayApi
