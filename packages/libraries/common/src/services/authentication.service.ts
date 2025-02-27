import api from '../api'
import { TokenService } from '../token'

export async function refreshClientToken(sub: string) {
  const tokenService = TokenService.getInstance()
  const baseUrl = `authentication/api/refreshToken?userId=${sub}`

  const { data: token } = await api().gateway.post(baseUrl)

  tokenService.setToken(token)
}
