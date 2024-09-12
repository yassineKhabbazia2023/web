import { defineStore } from 'pinia'
import { vi } from 'vitest'
import { accountsCollection } from '@app/schedule/tests/mocks/Account'
import { getMockedDeadlines } from '@app/schedule/tests/mocks/Deadline'
import helpers from '@app/tests/utils/helpers'
import { getMockedFavoriteEntities } from '@app/layouts/Home/Sidebar/components/SidebarEntity/MockedFavoriteEntities'

export const TEST_DATE = '2024-08-14'
const { fetchUserData } = helpers()

export const ScheduleServicesMock = {
  getScheduleModels: (longLabels: boolean) => [{
    key: 'TVA',
    label: longLabels ? 'TVA au 21' : 'TVA',
  }],
  getScheduleModelsByKey: () => ({
    TVA: 'TVA au 21 (Taxe sur la valeur ajoutée)',
  }),
  getSchedulesCollection: () => Promise.resolve([{
    date: TEST_DATE,
    deadlines: getMockedDeadlines(),
  }]),

  getAccountsCollection: () => Promise.resolve(accountsCollection),
}
export const debounceMock = vi.fn((callback: Function) => callback)

export const KpmgCommontMock = {
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
  dataProvider: () => {
    return { fetchUserData }
  },
}

export const TvaLabel = 'TVA (Taxe sur la valeur ajoutée)'

export const mockedGetScheduleModelsByKey = vi.fn((_: string): Record<string, string> => ({
  TVA: TvaLabel,
}))

