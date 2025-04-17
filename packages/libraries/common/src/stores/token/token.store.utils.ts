import jwtDecode from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'

export function getTokenExpSub(token: string) {
  const { exp, sub } = token ? jwtDecode<JwtPayload>(token) : {
    exp: undefined,
    sub: undefined,
  }

  return { exp, sub }
}
