import api from '../api'
import { API_PREFIXES } from '../constants/api-prefixes'
import { CurrentUserManager } from '@pulse/common/managers'
import type { CreateNewPasswordPayload, LoginPayload, LoginData } from './authentication.service.types'

export async function refreshClientToken(sub: string) {
  const baseUrl = `${API_PREFIXES.AUTHENTICATION}/refreshToken?userId=${sub}`

  const { data: token } = await api().gateway.post(baseUrl)

  // TODO : Bouger cette action en dehors du service qui n'a pas à réaliser ce type d'opérations // https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47385
  CurrentUserManager.persistToken(token)
}

export async function createNewPassword(payload: CreateNewPasswordPayload) {
  const urlUpdatePassword = `${API_PREFIXES.AUTHENTICATION}/createNewPassword`

  return await api().gateway.post(urlUpdatePassword, payload)
}

export async function isInvitationTokenValid(invitationToken: string) {
  const urlValidToken = `${API_PREFIXES.AUTHENTICATION}/IsInvitationTokenValid`

  const { data: isValid } = await api().gateway.get<boolean>(urlValidToken, {
    params: {
      invitationToken,
    },
  })

  return isValid
}

export async function login(payload: LoginPayload) {
  const loginUrl = `${API_PREFIXES.AUTHENTICATION}/login`

  const { data } = await api().gateway.post<LoginData>(loginUrl, payload)

  return data
}
