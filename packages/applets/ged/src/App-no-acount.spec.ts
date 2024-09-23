/* eslint-disable max-len */
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import Ged from './'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchUserEntityServices } from '@ged/services/Services'
import { fetchServicesFolders } from '@ged/services/Folder'
import { nextTick } from 'vue'

const piniaStore = createPinia()

vi.mock('@pulse/Common', () => ({
  commonApi: () => ({
    ds: vi.fn(),
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
  }),
}))

vi.mock('@ged/models/AccountingHubConnection', () => ({
  initializedAccountingDataStreamInstance: Promise.resolve({
    getConnection: vi.fn(() => ({
      on: vi.fn(),
    })),
  }),
}))

vi.mock('@ged/services/Folder', () => ({
  fetchServicesFolders: vi.fn(),
}))

vi.mock('@ged/services/Services', () => ({
  fetchUserEntityServices: vi.fn(),
}))

const createWrapper = (): VueWrapper => {
  return mount(Ged, {
    global: {
      plugins: [piniaStore],
    },
  })
}

describe('ged when no account is set in the store', () => {
  beforeEach(() => {
    setActivePinia(piniaStore)
  })

  describe('treeview', () => {
    describe('interactions', () => {
      it('should not fetch user entity services when ged is rendered and account is not set', async () => {
        createWrapper()

        await nextTick()

        expect(vi.mocked(fetchUserEntityServices)).toHaveBeenCalledTimes(0)
      })

      it('should not fetch services folders when ged is rendered and account is not set', async () => {
        createWrapper()

        await nextTick()

        expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(0)
      })
    })
  })
})
