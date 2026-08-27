import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useI18n } from 'vue-i18n'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore, useDematMailStore, useUserStore } from '@pulse/common/stores'
import { getMockedUser, getMockedEntitySummary } from '@pulse/common/mocks'
import type { FormInstance } from '@pulse/styleguide/types'
import { useDematMailDialog } from './demat-mail-dialog.composable'

const EMAIL = 'facture@example.com'

const validateMock = vi.fn()
const translateMock = vi.fn((key: string) => key)
const formRef = ref({ validate: validateMock } as unknown as FormInstance | null)

function setUpStore() {
  const store = useDematMailStore()
  vi.spyOn(store, 'submit').mockResolvedValue(true)
  vi.spyOn(store, 'closeDialog').mockReturnValue(undefined)

  return store
}

describe('useDematMailDialog', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    formRef.value = { validate: validateMock } as unknown as FormInstance
    validateMock.mockResolvedValue(true)
    // vue-i18n is spy-wrapped project-wide (doctrine: shared-hubs): the composable
    // runs outside a component context here, so the shared spy is armed per test.
    vi.mocked(useI18n).mockReturnValue({ t: translateMock } as unknown as ReturnType<typeof useI18n>)
  })

  describe('handleConfirm', () => {
    it('should submit the typed email once the form is valid', async () => {
      const store = setUpStore()
      const { formModel, handleConfirm } = useDematMailDialog(formRef)
      formModel.email = EMAIL

      await handleConfirm()

      expect(vi.mocked(store.submit)).toHaveBeenCalledExactlyOnceWith(EMAIL)
    })

    it('should notify the success and clear the field', async () => {
      setUpStore()
      const { formModel, handleConfirm } = useDematMailDialog(formRef)
      formModel.email = EMAIL

      await handleConfirm()

      expect(formModel.email).toBe('')
      expect(vi.mocked(displayNotification)).toHaveBeenCalledOnce()
      expect(translateMock).toHaveBeenCalledWith('entities.dematMail.dialog.submitSuccess')
    })

    it('should not notify when the submission fails', async () => {
      const store = setUpStore()
      vi.mocked(store.submit).mockResolvedValue(false)
      const { formModel, handleConfirm } = useDematMailDialog(formRef)
      formModel.email = EMAIL

      await handleConfirm()

      expect(formModel.email).toBe(EMAIL)
      expect(vi.mocked(displayNotification)).not.toHaveBeenCalled()
    })

    it('should not submit when the form is invalid', async () => {
      const store = setUpStore()
      validateMock.mockRejectedValue(new Error('invalid'))
      const { formModel, handleConfirm } = useDematMailDialog(formRef)
      formModel.email = 'not-an-email'

      await handleConfirm()

      expect(vi.mocked(store.submit)).not.toHaveBeenCalled()
    })

    it('should not submit when the form is not mounted', async () => {
      const store = setUpStore()
      formRef.value = null
      const { handleConfirm } = useDematMailDialog(formRef)

      await handleConfirm()

      expect(vi.mocked(store.submit)).not.toHaveBeenCalled()
    })
  })

  describe('handleClose', () => {
    it('should clear the typed email and dismiss the dialog', () => {
      const store = setUpStore()
      const { formModel, handleClose } = useDematMailDialog(formRef)
      formModel.email = EMAIL

      handleClose()

      expect(formModel.email).toBe('')
      expect(vi.mocked(store.closeDialog)).toHaveBeenCalledOnce()
    })
  })

  describe('isDialogOpen', () => {
    it('should mirror the store state', () => {
      const store = setUpStore()
      const { isDialogOpen } = useDematMailDialog(formRef)

      expect(isDialogOpen.value).toBe(false)

      store.isDialogOpen = true

      expect(isDialogOpen.value).toBe(true)
    })

    it('should dismiss the dialog when set to false', () => {
      const store = setUpStore()
      const { isDialogOpen } = useDematMailDialog(formRef)

      isDialogOpen.value = false

      expect(vi.mocked(store.closeDialog)).toHaveBeenCalledOnce()
    })
  })

  describe('handleOpenAssistance', () => {
    it('should open the assistance dialog', () => {
      setUpStore()
      const { isAssistanceOpen, handleOpenAssistance } = useDematMailDialog(formRef)

      expect(isAssistanceOpen.value).toBe(false)

      handleOpenAssistance()

      expect(isAssistanceOpen.value).toBe(true)
    })
  })

  describe('assistanceIframeUrl', () => {
    it('should prefill the HubSpot form with the user and the entity', () => {
      setUpStore()
      useUserStore().setUser(getMockedUser({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
      }))
      useCurrentEntityStore().setCurrentEntity(getMockedEntitySummary({
        legalName: 'Iced Latte',
        accountNumber: 'EC89859122',
      }))

      const { assistanceIframeUrl } = useDematMailDialog(formRef)

      expect(assistanceIframeUrl.value).toContain('hsforms.com')
      expect(assistanceIframeUrl.value).toContain('firstname=Ada')
      expect(assistanceIframeUrl.value).toContain('ada%40example.com')
      expect(assistanceIframeUrl.value).toContain('Iced+Latte')
      expect(assistanceIframeUrl.value).toContain('EC89859122')
    })
  })
})
