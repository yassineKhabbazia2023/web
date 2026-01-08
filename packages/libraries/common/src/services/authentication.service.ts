import api from '../api'
import { API_PREFIXES } from '../constants/api-prefixes'
import type { CreateNewPasswordPayload, UpdatePasswordPayload, LoginPayload, LoginData } from './authentication.service.types'
import type { CustomAxiosRequestConfig } from '../api/api.types'
import type { UserInfo } from '../types/user.type'


export async function refreshClientToken() {
  const baseUrl = `${API_PREFIXES.AUTHENTICATION}/refreshToken`

  const { data: token } = await api().gateway.post(
    baseUrl,
    undefined, // no payload
    { skipTokenRefresh: true } as CustomAxiosRequestConfig,
  )

  return token
}

export async function createNewPassword(payload: CreateNewPasswordPayload) {
  const urlUpdatePassword = `${API_PREFIXES.AUTHENTICATION}/createNewPassword`

  return await api().gateway.post(urlUpdatePassword, payload)
}

export async function updatePassword(payload: UpdatePasswordPayload, contactId: UserInfo['id']) {
  const urlUpdatePassword = `${API_PREFIXES.AUTHENTICATION}/update-password`
  return await api().gateway.post(urlUpdatePassword, payload, {
    params: { contactId },
  })
}

export async function login(payload: LoginPayload) {
  const loginUrl = `${API_PREFIXES.AUTHENTICATION}/login`

  const { data } = await api().gateway.post<LoginData>(loginUrl, payload)

  return data
}
