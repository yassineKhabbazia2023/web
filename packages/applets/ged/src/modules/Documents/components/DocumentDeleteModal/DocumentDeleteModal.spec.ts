import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { loggerMock } from '@ged/__mocks__/logger.mocks'
import { documentsServiceMock } from '@ged/__mocks__/documents.service.mocks'
import { deleteDocuments } from '@ged/services/Documents'
import { createI18n } from 'vue-i18n'
import { trackDocumentDelete } from '@ged/services/tracking/tracking.service'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import { type DocumentDeleteModalTypesProps } from './DocumentDeleteModalTypes'

import DocumentDeleteModal from './DocumentDeleteModal.vue'

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const defaultProps: DocumentDeleteModalTypesProps = {
  isVisible: false,
  documentIds: [],
  serviceId: 'serv',
  entityId: 'ent',
  accountId: 1234,
}
const i18n = createI18n({
  locale: 'fr-FR',
})
const pinia = createPinia()

const createWrapper = (
  props: DocumentDeleteModalTypesProps = defaultProps,
) => {
  return mount(DocumentDeleteModal, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        i18n,
      },
    },
  })
}

vi.mock('@ged/services/Documents', () => documentsServiceMock)

vi.mock('@ged/services/tracking/tracking.service')
vi.mock('@pulse/styleguide')

const findConfirmationPopup = (wrapper: VueWrapper) => wrapper.findComponent({ name: 'ConfirmationPopup' })

describe('deleteFolderConfirmationPopup', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should display confirmation popup when isVisible is true and 1 documentId', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1'],
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await nextTick()
      expect(popup.exists()).toBeTruthy()


      const confirmationMessage = 'Si vous cliquez sur "Confirmer", le document sera supprimé du dossier. Vous pourrez le restaurer depuis la corbeille.'
      const popupMessage = popup.props('message').trim()
      expect(popupMessage).toStrictEqual(confirmationMessage.trim())
      expect(popup.props('title')).toBe('Supprimer ce document ?')
    })

    it('should display confirmation popup when isVisible is true and multi documents', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1', '2'],
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await nextTick()
      expect(popup.exists()).toBeTruthy()


      const confirmationMessage = 'Si vous cliquez sur "Confirmer", tous les documents seront supprimés du dossier. Vous pourrez les restaurer depuis la corbeille.'
      const popupMessage = popup.props('message').trim()
      expect(popupMessage).toStrictEqual(confirmationMessage.trim())
      expect(popup.props('title')).toBe('Supprimer ces documents ?')
    })

    it('should display confirmation popup when isVisible is true and 1 documents', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1'],
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await nextTick()
      expect(popup.exists()).toBeTruthy()


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
          documentIds: ['1'],
        }

        const wrapper = createWrapper(updatedProps)

        const popup = findConfirmationPopup(wrapper)
        await popup.vm.$emit('on-confirm-button-click')
        await nextTick()

        expect(vi.mocked(deleteDocuments)).toHaveBeenCalledWith(
          'serv',
          'ent',
          ['1'],
          1234,
        )

        expect(PNotificationMock).toHaveBeenCalledTimes(1)
        const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
        expect(callArguments.message).toBe('1 document supprimé.')
        expect(callArguments.customClass).toBe('success')
        expect(wrapper.emitted('confirm-delete-document')).toBeTruthy()
      })

    it('case multi documents : should emit confirm-delete-folder when confirmation button click',
      async () => {
        const updatedProps: DocumentDeleteModalTypesProps = {
          ...defaultProps,
          isVisible: true,
          documentIds: ['1', '2'],
        }

        const wrapper = createWrapper(updatedProps)

        const popup = findConfirmationPopup(wrapper)
        await popup.vm.$emit('on-confirm-button-click')
        await nextTick()

        expect(vi.mocked(deleteDocuments)).toHaveBeenCalledWith(
          'serv',
          'ent',
          ['1', '2'],
          1234,
        )

        expect(PNotificationMock).toHaveBeenCalledTimes(1)
        const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
        expect(callArguments.message).toBe('"2" documents supprimés.')
        expect(callArguments.customClass).toBe('success')
        expect(wrapper.emitted('confirm-delete-document')).toBeTruthy()
      })

    it('should emit cancel-delete-document when cancel button click', async () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1'],
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await popup.vm.$emit('on-cancel-button-click')
      await nextTick()
      expect(wrapper.emitted('cancel-delete-document')).toBeTruthy()
    })

    it('should emit cancel-delete-folder when closing the popup', () => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1'],
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      popup.vm.$emit('on-close-popup')
      expect(wrapper.emitted('cancel-delete-document')).toBeTruthy()
    })
  })

  describe('tracking', () => {
    let wrapper: VueWrapper
    beforeEach(() => {
      const updatedProps: DocumentDeleteModalTypesProps = {
        ...defaultProps,
        isVisible: true,
        documentIds: ['1'],
      }

      wrapper = createWrapper(updatedProps)
    })
    it('should track with "true" when document has been sucessfully deletes', async () => {
      const popup = findConfirmationPopup(wrapper)
      await popup.vm.$emit('on-confirm-button-click')
      await nextTick()

      expect(trackDocumentDelete).toHaveBeenCalledWith({ isDeleteSuccessful: true })
    })

    it('should track with "false" when document has failed to delete', async () => {
      vi.mocked(deleteDocuments).mockImplementationOnce(() => Promise.reject())

      const popup = findConfirmationPopup(wrapper)
      await popup.vm.$emit('on-confirm-button-click')
      await nextTick()

      expect(trackDocumentDelete).toHaveBeenCalledWith({ isDeleteSuccessful: false })
    })
  })
})
