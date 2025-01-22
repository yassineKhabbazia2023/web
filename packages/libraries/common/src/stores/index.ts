import { logger } from '@pulse/core'
import { defineStore } from 'pinia'
import type { UserInfo } from './types'
import api from '../api'
import { VITE_GIGYA_SSO_ACTIVATED } from 'env-vars'
import { logoutCollaborator, logoutGigyaSSO, logoutClient, tokenService } from '../main.mts'

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
    logout: async (state: commonStateType) => {
      const isCollab = state.user?.isCollab
      const gigyaUserId = state.user?.gigyaUserId
      if (isCollab) {
        logoutCollaborator()
      } else if (gigyaUserId) {
        if(VITE_GIGYA_SSO_ACTIVATED === 'true'){
          logoutGigyaSSO()
        }
        logoutClient(gigyaUserId)
      }
      tokenService.setToken('')
      state.user = null
      state.permissions = []
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
