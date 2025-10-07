import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'
import { logger } from '@pulse/core'

function decodeToken(token: string) {
  return jwtDecode<JwtPayload>(token)
}

export function getTokenExp(token: string) {
  try {
    const { exp } = decodeToken(token)
    return exp
  } catch (error) {
    logger.error('Failed to decode token', error)
    return 0
  }
}

export function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

export function tokenIsValid(token: unknown): token is string {
  if (token === undefined || token === null || typeof token !== 'string' || token === '') {
    return false
  }

  const exp = getTokenExp(token)
  return exp !== undefined && exp > nowInSeconds()
}

