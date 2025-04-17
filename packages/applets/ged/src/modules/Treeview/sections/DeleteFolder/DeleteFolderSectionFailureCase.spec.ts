import { mount } from '@vue/test-utils'
import { type Mock } from 'vitest'
import { loggerMock } from '@pulse/core/mocks'
import { getMockedFolder } from '@ged/__mocks__/treeview.mocks'
import { deleteFolderFailMock } from '@ged/__mocks__/folder.service.mocks'
import { nextTick } from 'vue'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import type { FolderProperties } from '@ged/models/Folder'
import type { DeleteFolderSectionProps } from './DeleteFolderSectionTypes'

import DeleteFolderSection from './DeleteFolderSection.vue'

vi.mock('@pulse/styleguide')
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

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
  accountId: 1234,
}

const createWrapper = (props: DeleteFolderSectionProps = defaultProps) => {
  return mount(DeleteFolderSection, {
    props,
  })
}

vi.mock('@ged/services/Folder', () => ({
  deleteFolder: deleteFolderFailMock,
}))

describe('deleteFolderSection', () => {
  describe('interactions', () => {
    it('should display error notification correctly on fail delete', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })

      popup.vm.$emit('confirm-delete-folder')
      await nextTick()

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
      vi.clearAllMocks()
    })
  })
})
