/* eslint-disable vitest/no-hooks */
// until we find a way to enable multiple mocks on a single unit test
import DeleteFolderSection from '@/modules/Treeview/sections/DeleteFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type DeleteFolderSectionProps }
  from '@/modules/Treeview/sections/DeleteFolder/DeleteFolderSectionTypes'
import {
  dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'
import { Folder, FolderProperties } from '@/models/Folder'
import DeleteFolderConfirmationPopup from '@/modules/Treeview/components/popups/Delete'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))

const pinia = createPinia()

const defaultProps: DeleteFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  selectedFolder: {
    id: 1,
    children: [
      {
        id: 2,
        children: [{} as Folder],
        name: 'TheFolder',
        parent: { id: 1 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service'
      } as Folder
    ],
    name: 'A',
    parent: { id: 0 },
    permissions: [],
    properties: {} as FolderProperties,
    serviceId: 'some-service'
  } as Folder,
  isDeleteFolderPopupVisible: false
}

const mockToastPlugin = vi.fn()
const createWrapper = (props: DeleteFolderSectionProps = defaultProps) => {
  return mount(DeleteFolderSection, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin
      }
    }
  })
}

vi.mock('vue-inject', () => ({
  provide: vi.fn()
}))

vi.mock('@/services/Folder', () => ({
  tokenValue: 'mocked token',
  DeleteFolder: () => {
    throw new Error('Something uncool')
  }
}))

describe('deleteFolderSection', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('interactions', () => {
    it('should display error notification correctly on fail delete', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const popup = await dynamicUntilFoundComponent(
        wrapper,
        DeleteFolderConfirmationPopup
      )

      await popup.vm.$emit('confirm-delete-folder')
      await wrapper.vm.$nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
      vi.clearAllMocks()
    })
  })
})
