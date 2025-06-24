import { mount } from '@vue/test-utils'
import { type Mock } from 'vitest'
import { getMockedFolder } from '@ged/__mocks__/treeview.mocks'
import { folderServiceMock } from '@ged/__mocks__/folder.service.mocks'
import { type DeleteFolderSectionProps }
  from '@ged/modules/Treeview/sections/DeleteFolder/DeleteFolderSectionTypes'
import type { Folder } from '@ged/models/Folder'
import { deleteFolder } from '@ged/services/Folder'
import { nextTick } from 'vue'
import { PNotification as PNotificationMock } from '@pulse/styleguide'

import DeleteFolderSection from '@ged/modules/Treeview/sections/DeleteFolder'

vi.mock('@pulse/styleguide')

const child = getMockedFolder(1, 2, 'TheFolder', {
  children: [{} as Folder],
  permissions: [],
  serviceId: 'some-service',
})

const selectedFolder = getMockedFolder(0, 1, 'A', {
  children: [child],
  permissions: [],
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

vi.mock('@ged/services/Folder', () => folderServiceMock)

describe('deleteFolderSection', () => {
  describe('props', () => {
    it('should set the correct popup title', () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })

      const popupTitle = popup.props('title').trim()
      const expectedTitle = 'Supprimer ce dossier ?'
      expect(popupTitle).toBe(expectedTitle.trim())
    })
    it('should set the correct confirmation button content', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })
      await nextTick()
      const confirmButton = popup.find('.confirmation-popup__confirm-button')
      expect(confirmButton.element.textContent).toBe('Confirmer')
    })

    it('should set the correct cancel button content', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })
      await nextTick()
      const cancelButton = popup.find('.confirmation-popup__cancel-button')
      expect(cancelButton.element.textContent).toBe('Annuler')
    })
  })

  describe('interactions', () => {
    it('should call DeleteFolder method of the Folder service when confirm button click',
      async () => {
        const updatedProps: DeleteFolderSectionProps = {
          ...defaultProps,
          isDeleteFolderPopupVisible: true,
        }

        const wrapper = createWrapper(updatedProps)

        const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })

        await popup.vm.$emit('confirm-delete-folder')
        await nextTick()

        expect(vi.mocked(deleteFolder)).toHaveBeenCalledWith(
          'service-id',
          'entity-id',
          1,
          false,
          1234,
        )
      })

    it('should close popup when api call is completed', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })

      await popup.vm.$emit('confirm-delete-folder')
      await nextTick()

      expect(popup.props('isDeleteFolderPopupVisible')).toBeFalsy()
    })
    it('should emit on-delete-folder-completed on success delete folder', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })

      await popup.vm.$emit('confirm-delete-folder')
      await nextTick()

      expect(wrapper.emitted('on-delete-folder-completed')).toBeTruthy()
      expect(wrapper.emitted('on-delete-folder-completed')).toStrictEqual([
        [defaultProps.selectedFolder],
      ])
    })
    it('should display success notification correctly on success delete', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })

      await popup.vm.$emit('confirm-delete-folder')
      await nextTick()

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
      expect(callArguments.message).toBe('Dossier "A" supprimé.')
      expect(callArguments.customClass).toBe('success')
    })
    it('should emit on-close-delete-folder when cancel button is clicked', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent({ name: 'DeleteFolderConfirmationPopup' })

      await popup.vm.$emit('cancel-delete-folder')
      await nextTick()

      expect(wrapper.emitted('on-close-delete-folder')).toBeTruthy()
    })
  })
})
