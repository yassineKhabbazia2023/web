import { api } from '../api'
import { API_PREFIXES } from '../constants/api-prefixes'
import { logger } from '@pulse/toolbox'
import type { CreateNewPasswordPayload, UpdatePasswordPayload, LoginPayload, LoginData } from './authentication.service.types'
import type { CustomAxiosRequestConfig } from '../api/api.types'
import type { UserInfo } from '../types/user.type'


export async function refreshClientToken() {
  const baseUrl = `${API_PREFIXES.AUTHENTICATION}/refreshToken`

  const { data: token } = await api.gateway.post(
    baseUrl,
    undefined, // no payload
    { skipTokenRefresh: true } as CustomAxiosRequestConfig,
  )

  return token
}

export async function createNewPassword(payload: CreateNewPasswordPayload) {
  const urlUpdatePassword = `${API_PREFIXES.AUTHENTICATION}/createNewPassword`

  return await api.gateway.post(urlUpdatePassword, payload)
}

export async function updatePassword(payload: UpdatePasswordPayload, contactId: UserInfo['id']) {
  const urlUpdatePassword = `${API_PREFIXES.AUTHENTICATION}/update-password`
  return await api.gateway.post(urlUpdatePassword, payload, {
    params: { contactId },
  })
}

export async function login(payload: LoginPayload) {
  const loginUrl = `${API_PREFIXES.AUTHENTICATION}/login`

  const { data } = await api.gateway.post<LoginData>(loginUrl, payload)

  return data
}

export async function logoutUser() {
  try {
    const urlLogout = `${API_PREFIXES.AUTHENTICATION}/logout`
    // skipUnauthorizedCallback: a 401 from /logout (e.g. session already
    // invalidated on the backend) must not re-trigger the unauthorized
    // callback, otherwise the logout flow would recurse indefinitely.
    // The middle `undefined` is the request body — axios signature is
    // post(url, data, config) and /logout takes no payload.
    await api.gateway.post(
      urlLogout,
      undefined, // no payload
      { skipUnauthorizedCallback: true } as CustomAxiosRequestConfig,
    )
  } catch (error) {
    logger.error('Error during client logout: ', error)
  }
}
