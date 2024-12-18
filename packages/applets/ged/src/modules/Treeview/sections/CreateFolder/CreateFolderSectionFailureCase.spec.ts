import CreateFolderSection from '@ged/modules/Treeview/sections/CreateFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type CreateFolderSectionProps }
  from '@ged/modules/Treeview/sections/CreateFolder/CreateFolderSectionTypes'
import type { Folder } from '@ged/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import CreateFolderModal from '@ged/modules/Treeview/components/modals/Create'
import { nextTick } from 'vue'
import { getMockedFolder } from '../../helpers/testHelper'

const pinia = createPinia()

const child = getMockedFolder(1, 2, 'TheFolder', {
  children: [{} as Folder],
  serviceId: 'some-service',
})
const selectedFolder = getMockedFolder(0, 1, 'A', {
  children: [child],
  permissions: ['CAN_CREATE_FOLDER'],
  serviceId: 'some-service',
})

const defaultProps: CreateFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  isCreateFolderModalCentered: false,
  hasCreateFolderButton: true,
  selectedFolder,
  isCreateFolderModalVisible: false,
}

const mockToastPlugin = vi.fn()

const createWrapper = (props: CreateFolderSectionProps = defaultProps) => {
  return mount(CreateFolderSection, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  })
}

vi.mock('@ged/services/Folder', () => ({
  tokenValue: 'mocked token',
  CreateFolder: () => {
    throw new Error('Something uncool')
  },
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
        isCreateFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = await wrapper.findComponent(CreateFolderModal)

      await modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
    })
  })
})
