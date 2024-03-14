import RenameFolderSection from '@/modules/Treeview/sections/RenameFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type RenameFolderSectionProps }
  from '@/modules/Treeview/sections/RenameFolder/RenameFolderSectionTypes'
import type { Folder, FolderProperties } from '@/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import RenameFolderModal from '@/modules/Treeview/components/modals/Rename'
import { nextTick } from 'vue'

vi.mock('@kpmg/common', async () => ({
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

const defaultProps: RenameFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  parentFolder: {
    id: 1,
    children: [
      {
        id: 2,
        children: [{} as Folder],
        name: 'TheFolder',
        parent: { id: 1 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service',
      } as Folder,
    ],
    name: 'A',
    parent: { id: 0 },
    permissions: ['CAN_CREATE_FOLDER', 'CAN_RENAME_FOLDER'],
    properties: {} as FolderProperties,
    serviceId: 'some-service',
  } as Folder,
  isRenameFolderModalVisible: false,
  folderName: 'newFolderName',
  folderId: 2,
}

const mockToastPlugin = vi.fn()

const createWrapper = (props: RenameFolderSectionProps = defaultProps) => {
  return mount(RenameFolderSection, {
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
  tokenValue: 'mocked token',
  RenameFolder: () => {
    throw new Error('Something uncool')
  },
}))

describe('renameFolderSection', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('interactions', () => {
    it('should display error notification correctly on fail rename', async () => {
      const updatedProps: RenameFolderSectionProps = {
        ...defaultProps,
        isRenameFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = await wrapper.findComponent(RenameFolderModal)

      await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
      await nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
    })
  })
})
