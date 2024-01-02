import { defineStore } from 'pinia'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import api from '../api'
import { msalInstance } from '../msal'
import { type UserInfo } from './types'

export const isTokenExpired = (token: string) => {
  const { exp } = jwtDecode<JwtPayload>(token)
  return !!exp && exp * 1000 < Date.now()
}

export const store = defineStore('common', {
  state: () => ({
    user: null as UserInfo | null
  }),
  getters: {
    token : (state: any) => state?.user?.token ?? sessionStorage.getItem('token') as string,
    isAuthenticated :(getter : any ) => {
      return !!getter.token && !isTokenExpired(getter.token)
    },
    isCollab: (state: any) => !!state.user?.isCollab,
  },
  actions: {
    logout: async (state: any) => {
      try {
        if (state.user?.isCollab) {
          msalInstance.logout()
        } else {
          const urlLogout = '/logout'
          const data = {
            userId: state?.user?.id
          }
          await api().auth.post(urlLogout, data)
        }
        state.user = null
        sessionStorage.removeItem('token')
      } catch {}
    }
  }
})
export default store
