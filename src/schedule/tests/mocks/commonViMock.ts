import { defineStore } from 'pinia'
import { vi } from 'vitest'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import { getMockedDeadlines } from '@/schedule/tests/mocks/Deadline'

export const TEST_DATE = '2024-08-14'

export const ScheduleServicesMock = {
  getScheduleModelsByKey: () => ({
    TVA: 'TVA au 21 (Taxe sur la valeur ajoutée)',
  }),
  getSchedulesCollection: () => Promise.resolve([{
    date: TEST_DATE,
    deadlines: getMockedDeadlines(),
  }]),

  getAccountsCollection: () => Promise.resolve({
    status: 'fulfilled',
    value: accountsCollection,
  }),
}

export const KpmgCommontMock = {
  commonStore: defineStore('common', {
    state: () => ({
      user: null,
    }),
    getters: {
      isAuthenticated: () => true,
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
    fetchUserData: vi.fn(),
  }),
}

export const TvaLabel = 'TVA (Taxe sur la valeur ajoutée)'

export const mockedGetScheduleModelsByKey = vi.fn((_: string) => ({
  TVA: TvaLabel,
}))

