import { defineStore } from 'pinia'
import jwtDecode, { JwtPayload } from 'jwt-decode'

type UserInfo = {
  firstName: string
  lastName: string
  occupation: string
  email: string
  token: string,
  id: string,
  activeEntity: {
    idAccount: string,
    name: string,
    icon: string,
    color: string
  }[]
}

const isTokenExpired = (token: string) => {
  const { exp } = jwtDecode<JwtPayload>(token)
  return !!exp && exp < Date.now()
}

export default defineStore('common', {
  state: () => ({
    user: null as UserInfo | null
  }),
  getters: {
    isAuthenticated: (state: any) => !!state.user?.token && !isTokenExpired(state.user.token)
  }
})
