import jwtDecode from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'

export function getTokenExp(token: string) {
  const { exp } = token ? jwtDecode<JwtPayload>(token) : {
    exp: undefined,
  }

  return { exp }
}
