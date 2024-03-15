/* eslint-disable vitest/no-hooks */
// until we find a way to enable multiple mocks on a single unit test
import DeleteFolderSection from '@/modules/Treeview/sections/DeleteFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type DeleteFolderSectionProps }
  from '@/modules/Treeview/sections/DeleteFolder/DeleteFolderSectionTypes'
import type { FolderProperties } from '@/models/Folder'
import DeleteFolderConfirmationPopup from '@/modules/Treeview/components/popups/Delete'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { getMockedFolder } from '../../helpers/testHelper'

vi.mock('@kpmg/common', () => ({
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

const pinia = createPinia()

const selectedFolder = getMockedFolder(0, 1, 'A', {
  children: [
    getMockedFolder(1, 2, 'TheFolder', { serviceId: 'some-service' }),
  ],
  permissions: [],
  properties: {} as FolderProperties,
  serviceId: 'some-service',
})
const defaultProps: DeleteFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  selectedFolder,
  isDeleteFolderPopupVisible: false,
}

const mockToastPlugin = vi.fn()
const createWrapper = (props: DeleteFolderSectionProps = defaultProps) => {
  return mount(DeleteFolderSection, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  })
}

vi.mock('vue-inject', () => ({
  provide: vi.fn(),
}))

vi.mock('@/services/Folder', () => ({
  DeleteFolder: () => {
    throw new Error('Something uncool')
  },
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
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent(DeleteFolderConfirmationPopup)

      popup.vm.$emit('confirm-delete-folder')
      await nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
      vi.clearAllMocks()
    })
  })
})
