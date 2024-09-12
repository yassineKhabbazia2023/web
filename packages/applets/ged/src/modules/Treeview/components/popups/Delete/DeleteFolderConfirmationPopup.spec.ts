/* eslint-disable vitest/require-hook */
/* eslint-disable vitest/no-hooks */
import DeleteFolderConfirmationPopup from '@/modules/Treeview/components/popups/Delete'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach } from 'vitest'
import { type DeleteFolderConfirmationPopupProps }
  from '@/modules/Treeview/components/popups/Delete/DeleteFolderConfirmationPopupTypes'
import { createPinia, setActivePinia } from 'pinia'
import ConfirmationPopup from '@/modules/common/templates/popups'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'

const defaultProps: DeleteFolderConfirmationPopupProps = {
  isDeleteFolderPopupVisible: false,
  title: '',
  folderName: '',
  confirmButtonContent: '',
  cancelButtonContent: '',
  isConfirmButtonLoading: false,
}

type DeleteFolderConfirmationPopupSetup = {
  isPopupVisible: boolean
}

export type DeleteFolderConfirmationPopupWrapper = VueWrapper<
  ComponentPublicInstance<
    DeleteFolderConfirmationPopupProps,
    DeleteFolderConfirmationPopupSetup
  >
>

const pinia = createPinia()

const createWrapper = (
  props: DeleteFolderConfirmationPopupProps = defaultProps,
): DeleteFolderConfirmationPopupWrapper => {
  return mount(DeleteFolderConfirmationPopup, {
    props,
    global: {
      plugins: [pinia],
    },
  }) as unknown as DeleteFolderConfirmationPopupWrapper
}

describe('deleteFolderConfirmationPopup', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should display confirmation popup when isDeleteFolderPopupVisible is true', async () => {
      const updatedProps: DeleteFolderConfirmationPopupProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent(ConfirmationPopup)
      await nextTick()
      expect(popup.exists()).toBeTruthy()
    })

    it('should set the correct confirmation popup validation message', () => {
      const updatedProps: DeleteFolderConfirmationPopupProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
        folderName: 'folderToDelete',
      }

      // eslint-disable-next-line max-len
      const confirmationMessage = 'Si vous cliquez sur "Confirmer", tous les fichiers et sous dossiers à partir du dossier "folderToDelete" seront supprimés et envoyés à la corbeille.'

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent(ConfirmationPopup)

      const popupMessage = popup.props('message').trim()
      expect(popupMessage).toStrictEqual(confirmationMessage.trim())
    })
  })

  describe('interactions', () => {
    it('should emit confirm-delete-folder when confirmation button click', async () => {
      const updatedProps: DeleteFolderConfirmationPopupProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent(ConfirmationPopup)
      await popup.vm.$emit('on-confirm-button-click')
      await nextTick()
      expect(wrapper.emitted('confirm-delete-folder')).toBeTruthy()
    })

    it('should emit cancel-delete-folder when cancel button click', async () => {
      const updatedProps: DeleteFolderConfirmationPopupProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent(ConfirmationPopup)
      await popup.vm.$emit('on-cancel-button-click')
      await nextTick()
      expect(wrapper.emitted('cancel-delete-folder')).toBeTruthy()
    })

    it('should emit cancel-delete-folder when closing the popup', async () => {
      const updatedProps: DeleteFolderConfirmationPopupProps = {
        ...defaultProps,
        isDeleteFolderPopupVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = wrapper.findComponent(ConfirmationPopup)
      await popup.vm.$emit('on-close-popup')
      await nextTick()
      expect(wrapper.emitted('cancel-delete-folder')).toBeTruthy()
    })

    it('should emit update:isDeleteFolderPopupVisible when isPopupVisible has changed',
      async () => {
        const wrapper = createWrapper()

        wrapper.vm.isPopupVisible = true
        await nextTick()

        expect(wrapper.emitted('update:isDeleteFolderPopupVisible')).toBeTruthy()
      })
  })
})
