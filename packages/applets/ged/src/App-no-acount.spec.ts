
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { accountingHubConnectionServiceMock } from '@ged/__mocks__/accounting-hub-connection.service.mocks'
import { folderServiceMock } from './__mocks__/folder.service.mocks'
import { fetchUserEntityServices } from '@ged/services/Services'
import { fetchServicesFolders } from '@ged/services/Folder'
import { nextTick } from 'vue'

import Ged from './'

const piniaStore = createPinia()

vi.mock('@ged/models/AccountingHubConnection', () => accountingHubConnectionServiceMock)

vi.mock('@ged/services/Folder', () => folderServiceMock)

vi.mock('@ged/services/Services', () => ({
  fetchUserEntityServices: vi.fn(),
}))

const createWrapper = (): VueWrapper => {
  return mount(Ged, {
    shallow: true,
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
