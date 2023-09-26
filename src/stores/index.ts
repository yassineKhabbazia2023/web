import { defineStore } from 'pinia'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import api from '../api'
import { msalInstance } from '../msal'

type UserInfo = {
  firstName: string
  lastName: string
  occupation: string
  email: string
  token: string,
  id: string,
  isCollab: boolean,
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
    isAuthenticated: (state: any) => !!state.user?.token && !isTokenExpired(state.user.token),
    isCollab: (state: any) => !!state.user?.isCollab
  },
  actions: {
    logout: async (state: any) => {
      try {
        state.user = null
        sessionStorage.removeItem('token')
        if (state.user?.isCollab) {
          msalInstance.logout()
        } else {
          const urlLogout = '/api/logout'
          const data = {
            userId: state?.user?.id
          }
          await api().auth.post(urlLogout, data)
        }
      } catch {}
    }
  }
})
