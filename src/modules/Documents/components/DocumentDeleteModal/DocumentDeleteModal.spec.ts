/* eslint-disable vitest/require-hook */
/* eslint-disable vitest/no-hooks */
import { VueWrapper, mount } from '@vue/test-utils'
import DocumentDeleteModal
  from '@/modules/Documents/components/DocumentDeleteModal'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { type DocumentDeleteModalTypesProps }
  from '@/modules/Documents/components/DocumentDeleteModal/DocumentDeleteModalTypes'
import { createPinia, setActivePinia } from 'pinia'
import ConfirmationPopup from '@/modules/common/templates/popups'
import { nextTick } from 'vue'
import { deleteDocuments } from '@/services/Documents'
import { createI18n } from 'vue-i18n'

const defaultProps: DocumentDeleteModalTypesProps = {
  isVisible: false,
  documentIds: [],
  serviceId: 'serv',
  entityId: 'ent'
}
const i18n = createI18n({
  locale: 'fr-FR'
})
const pinia = createPinia()

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: DocumentDeleteModalTypesProps = defaultProps
) => {
  return mount(DocumentDeleteModal, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
        i18n
      }
    }
  })
}

vi.mock('vue-inject', () => ({
  provide: vi.fn()
}))

vi.mock('@/services/Documents', () => ({
  deleteDocuments: vi.fn()
}))

const findConfirmationPopup = (wrapper: VueWrapper) => wrapper.findComponent(ConfirmationPopup)

describe('deleteFolderConfirmationPopup', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should display confirmation popup when isVisible is true and 1 documentId', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1']
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await nextTick()
      expect(popup.exists()).toBeTruthy()

      // eslint-disable-next-line max-len
      const confirmationMessage = 'Si vous cliquez sur "Confirmer", le document sera supprimé du dossier. Vous pourrez le restaurer depuis la corbeille.'
      const popupMessage = popup.props('message').trim()
      expect(popupMessage).toStrictEqual(confirmationMessage.trim())
      expect(popup.props('title')).toBe('Supprimer ce document ?')
    })

    it('should display confirmation popup when isVisible is true and multi documents', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1', '2']
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await nextTick()
      expect(popup.exists()).toBeTruthy()

      // eslint-disable-next-line max-len
      const confirmationMessage = 'Si vous cliquez sur "Confirmer", tous les documents seront supprimés du dossier. Vous pourrez les restaurer depuis la corbeille.'
      const popupMessage = popup.props('message').trim()
      expect(popupMessage).toStrictEqual(confirmationMessage.trim())
      expect(popup.props('title')).toBe('Supprimer ces documents ?')
    })

    it('should display confirmation popup when isVisible is true and 1 documents', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1']
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await nextTick()
      expect(popup.exists()).toBeTruthy()

      // eslint-disable-next-line max-len
      const confirmationMessage = 'Si vous cliquez sur "Confirmer", le document sera supprimé du dossier. Vous pourrez le restaurer depuis la corbeille.'
      const popupMessage = popup.props('message').trim()
      expect(popupMessage).toStrictEqual(confirmationMessage.trim())
      expect(popup.props('title')).toBe('Supprimer ce document ?')
    })
  })

  describe('interactions', () => {
    it('case single document : should emit confirm-delete-folder when confirmation button click',
      async () => {
        const updatedProps: DocumentDeleteModalTypesProps = {
          ...defaultProps,
          isVisible: true,
          documentIds: ['1']
        }

        const wrapper = createWrapper(updatedProps)

        const popup = findConfirmationPopup(wrapper)
        await popup.vm.$emit('on-confirm-button-click')

        expect(vi.mocked(deleteDocuments)).toHaveBeenCalledWith(
          'serv',
          'ent',
          ['1']
        )

        expect(mockToastPlugin).toHaveBeenCalledTimes(1)
        const callArguments = mockToastPlugin.mock.calls[0][0]
        expect(callArguments.message).toBe('1 document supprimé.')
        expect(callArguments.customClass).toBe('success')
        expect(wrapper.emitted('confirm-delete-document')).toBeTruthy()
      })

    it('case multi documents : should emit confirm-delete-folder when confirmation button click',
      async () => {
        const updatedProps: DocumentDeleteModalTypesProps = {
          ...defaultProps,
          isVisible: true,
          documentIds: ['1', '2']
        }

        const wrapper = createWrapper(updatedProps)

        const popup = findConfirmationPopup(wrapper)
        await popup.vm.$emit('on-confirm-button-click')

        expect(vi.mocked(deleteDocuments)).toHaveBeenCalledWith(
          'serv',
          'ent',
          ['1', '2']
        )

        expect(mockToastPlugin).toHaveBeenCalledTimes(1)
        const callArguments = mockToastPlugin.mock.calls[0][0]
        expect(callArguments.message).toBe('"2" documents supprimés.')
        expect(callArguments.customClass).toBe('success')
        expect(wrapper.emitted('confirm-delete-document')).toBeTruthy()
      })

    it('should emit cancel-delete-document when cancel button click', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1']
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await popup.vm.$emit('on-cancel-button-click')
      expect(wrapper.emitted('cancel-delete-document')).toBeTruthy()
    })

    it('should emit cancel-delete-folder when closing the popup', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1']
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      popup.vm.$emit('on-close-popup')
      expect(wrapper.emitted('cancel-delete-document')).toBeTruthy()
    })
  })
})
