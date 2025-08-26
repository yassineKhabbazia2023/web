import api from '../api'
import { API_PREFIXES } from '../constants/api-prefixes'
import type { CreateNewPasswordPayload, LoginPayload, LoginData } from './authentication.service.types'

export async function refreshClientToken() {
  const baseUrl = `${API_PREFIXES.AUTHENTICATION}/refreshToken`

  const { data: token } = await api().gateway.post(baseUrl)

  return token
}

export async function createNewPassword(payload: CreateNewPasswordPayload) {
  const urlUpdatePassword = `${API_PREFIXES.AUTHENTICATION}/createNewPassword`

  return await api().gateway.post(urlUpdatePassword, payload)
}

export async function login(payload: LoginPayload) {
  const loginUrl = `${API_PREFIXES.AUTHENTICATION}/login`

  const { data } = await api().gateway.post<LoginData>(loginUrl, payload)

  return data
}
