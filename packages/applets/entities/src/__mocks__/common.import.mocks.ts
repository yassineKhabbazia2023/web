
import { createPinia, defineStore, setActivePinia } from 'pinia'
import { commonPinia as pinia } from '@pulse/common'
import { mockHasPermission } from './permissions.mock'
import { mockedEntity } from './entities.mocks'

setActivePinia(pinia)

vi.mock('@pulse/common', () => ({
  commonPinia: () => createPinia(),
  commonStore: defineStore('common', {
    getters: {
      isAuthenticated: () => true,
      isCollab: () => true,
      defaultEntity: () => (mockedEntity),
    },
  }),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
  amplitudeService: {
    track: vi.fn(),
  },
}))
