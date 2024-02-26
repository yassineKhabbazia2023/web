import { defineStore } from 'pinia'
import { msalInstance } from '../msal'
import type { UserInfo } from './types'
import api from '../api'
import { tokenService } from '../main'

type commonStateType = {
  user: UserInfo | null
}

export const store = defineStore('common', {
  state: (): commonStateType => ({
    user: null
  }),
  getters: {
    token: (): string => tokenService.getToken(),
    isAuthenticated: (): boolean => tokenService.hasValidAccessToken(),
    isCollab: (state: commonStateType) => !!state.user?.isCollab,
    favoriteEntities: (state: commonStateType) => state.user?.entities?.favorites ?? [],
    defaultEntity: (state: commonStateType) => state.user?.entities?.default
  },
  actions: {
    logout: async (state: any) => {
      try {
        tokenService.setToken('')
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
      } catch (e) {
        console.warn(e)
      }
    }
  }
})

export default store
