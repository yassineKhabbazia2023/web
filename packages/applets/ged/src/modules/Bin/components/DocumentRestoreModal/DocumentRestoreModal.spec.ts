/* eslint-disable vitest/require-hook */
/* eslint-disable vitest/no-hooks */
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import DocumentRestoreModal from '@ged/modules/Bin/components/DocumentRestoreModal'
import { restoreDocuments } from '@ged/services/BinDocuments'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { type DocumentRestoreModalTypesProps }
  from '@ged/modules/Bin/components/DocumentRestoreModal/DocumentRestoreModalTypes'
import { createPinia, setActivePinia } from 'pinia'
import ConfirmationPopup from '@ged/modules/common/templates/popups'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

const defaultProps: DocumentRestoreModalTypesProps = {
  isVisible: false,
  document: {
    id: 'd595982f-d90f-4374-8ecb-fea0b4202c6d',
    name: 'this-is-a-test.txt',
    deleted: '2023-12-08T09:00:00.000',
    path: ['Comptabilité', 'Dépôt', 'A classer', 'Test'],
  },
  serviceId: 'serv',
  entityId: 'ent',
}
const i18n = createI18n({
  locale: 'fr-FR',
})
const pinia = createPinia()

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: DocumentRestoreModalTypesProps = defaultProps,
) => {
  return mount(DocumentRestoreModal, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
        i18n,
      },
    },
  })
}

vi.mock('@ged/services/BinDocuments', () => ({
  restoreDocuments: vi.fn(() => {
    return [{
      id: 'd595982f-d90f-4374-8ecb-fea0b4202c6d',
      folderId: 12345,
    }]
  }),
}))

const findConfirmationPopup = (wrapper: VueWrapper) => wrapper.findComponent(ConfirmationPopup)

describe('documentRestoreModal', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('props', () => {
    it('should display confirmation popup when isVisible is true', async () => {
      expect.hasAssertions()
      const updatedProps: DocumentRestoreModalTypesProps = {
        ...defaultProps,
        isVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await nextTick()
      expect(popup.exists()).toBeTruthy()

      // eslint-disable-next-line max-len
      const confirmationMessage = 'Si vous cliquez sur "Confirmer", le document sera restauré dans son dossier d\'origine.'
      const popupMessage = popup.props('message').trim()
      expect(popupMessage).toStrictEqual(confirmationMessage.trim())
      expect(popup.props('title')).toBe('Restaurer ce document ?')
      expect(popup.props('isPopupVisible')).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('should emit confirm-restore-document when confirmation button click',
      async () => {
        expect.hasAssertions()
        const updatedProps: DocumentRestoreModalTypesProps = {
          ...defaultProps,
          isVisible: true,
        }

        const wrapper = createWrapper(updatedProps)

        const popup = findConfirmationPopup(wrapper)
        await popup.vm.$emit('on-confirm-button-click')
        await nextTick()

        expect(vi.mocked(restoreDocuments)).toHaveBeenCalledWith(
          'serv',
          'ent',
          ['d595982f-d90f-4374-8ecb-fea0b4202c6d'],
        )
        await nextTick()
        expect(wrapper.emitted('confirm-restore-document')).toBeTruthy()
        expect(mockToastPlugin).toHaveBeenCalledTimes(1)
        const callArguments = mockToastPlugin.mock.calls[0][0]
        expect(callArguments.message)
          .toBe('1 document restauré dans le dossier Test - Voir le document')
        expect(callArguments.customClass).toBe('success')
      })

    it('should emit cancel-restore-document when cancel button click', async () => {
      expect.hasAssertions()
      const updatedProps: DocumentRestoreModalTypesProps = {
        ...defaultProps,
        isVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      await popup.vm.$emit('on-cancel-button-click')
      await nextTick()
      expect(wrapper.emitted('cancel-restore-document')).toBeTruthy()
    })

    it('should emit cancel-delete-folder when closing the popup', () => {
      expect.hasAssertions()
      const updatedProps: DocumentRestoreModalTypesProps = {
        ...defaultProps,
        isVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const popup = findConfirmationPopup(wrapper)
      popup.vm.$emit('on-close-popup')
      expect(wrapper.emitted('cancel-restore-document')).toBeTruthy()
    })
  })
})
