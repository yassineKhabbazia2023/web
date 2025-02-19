import CreateFolderSection from '@ged/modules/Treeview/sections/CreateFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest'
import { type CreateFolderSectionProps }
  from '@ged/modules/Treeview/sections/CreateFolder/CreateFolderSectionTypes'
import type { Folder } from '@ged/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import CreateFolderModal from '@ged/modules/Treeview/components/modals/Create'
import { nextTick } from 'vue'
import { getMockedFolder } from '../../helpers/testHelper'
import { PNotification as PNotificationMock } from '@pulse/styleguide'

vi.mock('@pulse/styleguide')

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

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
  accountId: 1234,
  isCreateFolderModalCentered: false,
  hasCreateFolderButton: true,
  selectedFolder,
  isCreateFolderModalVisible: false,
}

const createWrapper = (props: CreateFolderSectionProps = defaultProps) => {
  return mount(CreateFolderSection, {
    props,
    global: {
      plugins: [pinia],
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

      const modal = wrapper.findComponent(CreateFolderModal)

      await modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
    })
  })
})
