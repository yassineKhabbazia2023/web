import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { loggerMock } from '@pulse/core/mocks'
import { getMockedFolder } from '@ged/__mocks__/treeview.mocks'
import { renameFolderFailMock, tokenValueMock } from '@ged/__mocks__/folder.service.mocks'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import type { RenameFolderSectionProps } from './RenameFolderSectionTypes'

import RenameFolderSection from './RenameFolderSection.vue'

vi.mock('@pulse/styleguide')
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

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
  accountId: 1234,
  parentFolder,
  isRenameFolderModalVisible: false,
  folderName: 'newFolderName',
  folderId: 2,
}

const createWrapper = (props: RenameFolderSectionProps = defaultProps) => {
  return mount(RenameFolderSection, {
    props,
  })
}

vi.mock('@ged/services/Folder', () => ({
  tokenValue: tokenValueMock,
  RenameFolder: renameFolderFailMock,
}))

describe('renameFolderSection', () => {
  describe('interactions', () => {
    it('should display error notification correctly on fail rename', async () => {
      const updatedProps: RenameFolderSectionProps = {
        ...defaultProps,
        isRenameFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent({ name: 'RenameFolderModal' })

      await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
      await nextTick()

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (PNotificationMock as any).mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
    })
  })
})
