
// until we find a way to enable multiple mocks on a single unit test
import DeleteFolderSection from '@ged/modules/Treeview/sections/DeleteFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest'
import { type DeleteFolderSectionProps }
  from '@ged/modules/Treeview/sections/DeleteFolder/DeleteFolderSectionTypes'
import type { FolderProperties } from '@ged/models/Folder'
import DeleteFolderConfirmationPopup from '@ged/modules/Treeview/components/popups/Delete'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { getMockedFolder } from '../../helpers/testHelper'
import { PNotification as PNotificationMock } from '@pulse/styleguide'

vi.mock('@pulse/styleguide')

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

const createWrapper = (props: DeleteFolderSectionProps = defaultProps) => {
  return mount(DeleteFolderSection, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}

vi.mock('@ged/services/Folder', () => ({
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

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
      vi.clearAllMocks()
    })
  })
})
