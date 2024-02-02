import { defineStore } from 'pinia'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { msalInstance } from '../msal'
import type { UserInfo } from './types'
import api from '../api'

type commonStateType = {
  user: UserInfo | null
}

export const isTokenExpired = (token: string): boolean => {
  const { exp } = jwtDecode<JwtPayload>(token)
  return !!exp && exp * 1000 < Date.now()
}

export const store = defineStore('common', {
  state: (): commonStateType => ({
    user: null
  }),
  getters: {
    token: (state: commonStateType) =>
      state?.user?.token ?? (sessionStorage.getItem('token') as string),
    isAuthenticated: (getter: any) => {
      return !!getter.token && !isTokenExpired(getter.token)
    },
    isCollab: (state: commonStateType) => !!state.user?.isCollab,
    favoriteEntities: (state: commonStateType) => state.user?.entities?.favorites ?? [],
    defaultEntity: (state: commonStateType) => state.user?.entities?.default
  },
  actions: {
    logout: async (state: commonStateType) => {
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
