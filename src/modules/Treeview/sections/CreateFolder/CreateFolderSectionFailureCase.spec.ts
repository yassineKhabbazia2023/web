import CreateFolderSection from '@/modules/Treeview/sections/CreateFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type CreateFolderSectionProps }
  from '@/modules/Treeview/sections/CreateFolder/CreateFolderSectionTypes'
import {
  dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'
import { Folder, FolderProperties } from '@/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import CreateFolderModal from '@/modules/Treeview/components/modals/Create'

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

const defaultProps: CreateFolderSectionProps = {
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
    permissions: ['CAN_CREATE_FOLDER'],
    properties: {} as FolderProperties,
    serviceId: 'some-service'
  } as Folder,
  isCreateFolderModalVisible: false
}

const mockToastPlugin = vi.fn()

const createWrapper = (props: CreateFolderSectionProps = defaultProps) => {
  return mount(CreateFolderSection, {
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
  CreateFolder: () => {
    throw new Error('Something uncool')
  }
}))

describe('createFolderSection', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('interactions', () => {

    it('should display success notification correctly on success create', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const modal = await dynamicUntilFoundComponent(wrapper, CreateFolderModal)

      await modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await wrapper.vm.$nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
    })
  })
})

