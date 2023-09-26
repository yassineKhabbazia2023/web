/* eslint-disable vitest/no-hooks */
import DeleteFolderSection from '@/modules/Treeview/sections/DeleteFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type DeleteFolderSectionProps }
  from '@/modules/Treeview/sections/DeleteFolder/DeleteFolderSectionTypes'
import { dynamicUntilFound, dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
import { Folder, FolderProperties } from '@/models/Folder'
import DeleteFolderConfirmationPopup from '@/modules/Treeview/components/popups/Delete'
import { createPinia, setActivePinia } from 'pinia'
import { DeleteFolder } from '@/services/Folder'

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

const defaultProps: DeleteFolderSectionProps = {
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
    permissions: [],
    properties: {} as FolderProperties,
    serviceId: 'some-service'
  } as Folder,
  isDeleteFolderPopupVisible: false
}

const mockToastPlugin = vi.fn()
const createWrapper = (props: DeleteFolderSectionProps = defaultProps) => {
  return mount(DeleteFolderSection, {
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
  DeleteFolder: vi.fn()
}))

describe('deleteFolderSection', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('props', () => {
    it('should set the correct popup title', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const popup = await dynamicUntilFoundComponent(
        wrapper,
        DeleteFolderConfirmationPopup
      )

      const popupTitle = popup.props('title').trim()
      const expectedTitle = 'Supprimer ce dossier ?'
      expect(popupTitle).toBe(expectedTitle.trim())
    })
    it('should set the correct confirmation button content', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const popup = await dynamicUntilFoundComponent(
        wrapper,
        DeleteFolderConfirmationPopup
      )

      const confirmButton = await dynamicUntilFound(
        popup,
        '.confirmation-popup__confirm-button'
      )
      // To update when toggeling between lang is availabe
      // the test should be based on the selected language
      expect(confirmButton.element.textContent).toBe('Confirmer')
    })

    it('should set the correct cancel button content', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const popup = await dynamicUntilFoundComponent(
        wrapper,
        DeleteFolderConfirmationPopup
      )

      const cancelButton = await dynamicUntilFound(
        popup,
        '.confirmation-popup__cancel-button'
      )

      expect(cancelButton.element.textContent).toBe('Annuler')
    })
  })

  describe('interactions', () => {
    it('should call DeleteFolder method of the Folder service when confirm button click',
      async () => {

        const updatedProps: DeleteFolderSectionProps = {
          ...defaultProps,
          isDeleteFolderPopupVisible: true
        }

        const wrapper = createWrapper(updatedProps)

        const popup = await dynamicUntilFoundComponent(
          wrapper,
          DeleteFolderConfirmationPopup
        )

        await popup.vm.$emit('confirm-delete-folder')
        await wrapper.vm.$nextTick()

        expect(vi.mocked(DeleteFolder)).toHaveBeenCalledWith(
          '',
          'service-id',
          'entity-id',
          1,
          false
        )
      })

    it('should close popup when api call is completed', async () => {

      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const popup = await dynamicUntilFoundComponent(
        wrapper,
        DeleteFolderConfirmationPopup
      )

      await popup.vm.$emit('confirm-delete-folder')
      await wrapper.vm.$nextTick()

      expect(popup.props('isDeleteFolderPopupVisible')).toBeFalsy()
    })
    it('should emit on-delete-folder-completed on success delete folder', async () => {

      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const popup = await dynamicUntilFoundComponent(
        wrapper,
        DeleteFolderConfirmationPopup
      )

      await popup.vm.$emit('confirm-delete-folder')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-delete-folder-completed')).toBeTruthy()
      expect(wrapper.emitted('on-delete-folder-completed')).toStrictEqual([
        [defaultProps.selectedFolder]
      ])

    })
    it('should display success notification correctly on success delete', async () => {

      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const popup = await dynamicUntilFoundComponent(
        wrapper,
        DeleteFolderConfirmationPopup
      )

      await popup.vm.$emit('confirm-delete-folder')
      await wrapper.vm.$nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe('Dossier "A" supprimé.')
      expect(callArguments.customClass).toBe('success')
    })
    it('should emit on-close-delete-folder when cancel button is clicked', async () => {
      const updatedProps: DeleteFolderSectionProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const popup = await dynamicUntilFoundComponent(
        wrapper,
        DeleteFolderConfirmationPopup
      )

      await popup.vm.$emit('cancel-delete-folder')
      await wrapper.vm.$nextTick()

      expect(wrapper.emitted('on-close-delete-folder')).toBeTruthy()
    })
  })
})
