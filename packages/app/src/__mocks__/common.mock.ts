import { defineStore } from 'pinia'
import { vi } from 'vitest'
import { getMockedFavoriteEntities } from '@app/__mocks__/entities.mocks'
import { customerUserMock } from '@app/__mocks__/users.mocks'

export const debounceMock = vi.fn((callback: Function) => callback)

export const commonMock = {
  debounce: (callback: Function) => debounceMock(callback),
  getInitials: vi.fn(),
  commoni18n: vi.fn(),
  commonStore: defineStore('common', {
    state: () => ({
      user: null,
    }),
    getters: {
      isAuthenticated: () => true,
      isCollab: () => true,
      defaultEntity: () => getMockedFavoriteEntities()[0],
    },
  }),
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: {} }),
    },
  }),
  routes: {
    value: [],
  },
  dataProvider: () => ({
    fetchUserData: vi.fn(() => Promise.resolve(customerUserMock)),
  }),
  amplitudeService: {
    init: vi.fn(),
    track: vi.fn(),
    setUserId: vi.fn(),
  },
}
