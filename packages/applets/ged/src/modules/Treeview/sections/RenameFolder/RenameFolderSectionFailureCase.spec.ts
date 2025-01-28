import RenameFolderSection from '@ged/modules/Treeview/sections/RenameFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest'
import { type RenameFolderSectionProps }
  from '@ged/modules/Treeview/sections/RenameFolder/RenameFolderSectionTypes'
import { createPinia, setActivePinia } from 'pinia'
import RenameFolderModal from '@ged/modules/Treeview/components/modals/Rename'
import { nextTick } from 'vue'
import { getMockedFolder } from '../../helpers/testHelper'
import { PNotification as PNotificationMock } from '@pulse/styleguide'

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

vi.mock('@pulse/styleguide')

const pinia = createPinia()

const children = [
  getMockedFolder(1, 2, 'TheFolder', { serviceId: 'some-service' }),
]
const parentFolder = getMockedFolder(0, 1, 'A', {
  children,
  permissions: ['CAN_CREATE_FOLDER', 'CAN_RENAME_FOLDER'],
  serviceId: 'some-service',
})

const defaultProps: RenameFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  parentFolder,
  isRenameFolderModalVisible: false,
  folderName: 'newFolderName',
  folderId: 2,
}

const createWrapper = (props: RenameFolderSectionProps = defaultProps) => {
  return mount(RenameFolderSection, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}

vi.mock('@ged/services/Folder', () => ({
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

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
    })
  })
})
