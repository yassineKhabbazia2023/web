import { logger } from '@pulse/core'
import { defineStore } from 'pinia'
import { msalInstance } from '../msal'
import type { UserInfo } from './types'
import api from '../api'
import { tokenService } from '../main.mts'

const AUTH_API = 'authorization/api'

type commonStateType = {
  user: UserInfo | null
  permissions: string[]
}

export const store = defineStore('common', {
  state: (): commonStateType => ({
    user: null,
    permissions: [],
  }),
  getters: {
    token: (): string => tokenService.getToken(),
    isAuthenticated: (): boolean => tokenService.hasValidAccessToken(),
    isCollab: (state: commonStateType) => !!state.user?.isCollab,
    favoriteEntities: (state: commonStateType) =>
      state.user?.entities?.favorites ?? [],
    defaultEntity: (state: commonStateType) => state.user?.entities?.default,
    userPermissions: (state: commonStateType) => state.permissions,
    userAccountPermissions: (state: commonStateType) => state.user?.entities?.default?.permissions,
  },
  actions: {
    logout: async (state: any) => {
      try {
        tokenService.setToken('')
        if (state.user?.isCollab) {
          msalInstance.logout()
        } else {
          const urlLogout = 'authentication/api/logout'
          const data = {
            gigyaUserId: state?.user?.gigyaUserId,
          }
          await api().gateway.post(urlLogout, data)
        }
        state.user = null
      } catch (e) {
        logger.warn(e)
      }
    },
    async fetchUserPermissions() {
      try {
        const { data } = await api().gateway.get(
          `${AUTH_API}/authorization/currentuser`,
        )
        this.permissions = data
      } catch (error) {
        logger.error('Unable to retrieve user permissions: ', error)
      }
    },
    async fetchUserAccountPermissions() {
      try {
        if (this.user?.entities?.default) {
          const { data } = await api().gateway.get(
            `${AUTH_API}/authorization/currentuser?accountId=${this.user.entities.default?.accountId}`,
          )
          this.user.entities.default.permissions = data
        }
      } catch (error) {
        logger.error(
          'Unable to retrieve permissions for this account: ',
          error,
        )
      }
    },
  },
})

export default store
