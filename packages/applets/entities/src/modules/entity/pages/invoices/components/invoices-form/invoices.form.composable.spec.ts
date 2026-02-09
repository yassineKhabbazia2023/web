import { flushPromises } from '@vue/test-utils'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { InvoicesService } from '@entities/modules/entity/services/invoices.service'
import { getContactById } from '@entities/services/contact'
import { DigitalSafeStatus, InvoicesFormStep } from '@entities/modules/entity/enums'
import { useInvoicesForm } from './invoices.form.composable'

vi.mock('@entities/modules/entity/services/invoices.service')
vi.mock('@entities/services/contact')

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('useInvoicesForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userStoreMock.user = { email: 'requester@example.com' } as any
    currentEntityStoreMock.currentEntity = { accountNumber: 'ACC-123' } as any
    vi.mocked(InvoicesService.submitIntegration).mockResolvedValue()
    vi.mocked(getContactById).mockResolvedValue({
      id: 123,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'vault@example.com',
    } as any)
  })

  describe('initial state', () => {
    it('should return currentStep with initial value of EMAIL_AND_TERMS', () => {
      const { currentStep } = useInvoicesForm()

      expect(currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)
    })

    it('should return formData with initial empty values', () => {
      const { formData } = useInvoicesForm()

      expect(formData.value).toEqual({
        email: '',
        acceptTerms: false,
        selectedContactId: null,
      })
    })

    it('should return goToNextStep function', () => {
      const { goToNextStep } = useInvoicesForm()

      expect(goToNextStep).toBeInstanceOf(Function)
    })

    it('should return goToPreviousStep function', () => {
      const { goToPreviousStep } = useInvoicesForm()

      expect(goToPreviousStep).toBeInstanceOf(Function)
    })

    it('should return goToVaultBeingCreated function', () => {
      const { goToVaultBeingCreated } = useInvoicesForm()

      expect(goToVaultBeingCreated).toBeInstanceOf(Function)
    })
  })

  describe('goToNextStep', () => {
    it('should set currentStep to SELECT_CONTACT', () => {
      const { currentStep, goToNextStep } = useInvoicesForm()

      goToNextStep()

      expect(currentStep.value).toBe(InvoicesFormStep.SELECT_CONTACT)
    })

    it('should not go beyond the last step', () => {
      const { currentStep, goToNextStep } = useInvoicesForm()

      goToNextStep()
      goToNextStep()

      expect(currentStep.value).toBe(InvoicesFormStep.SELECT_CONTACT)
    })
  })

  describe('goToPreviousStep', () => {
    it('should set currentStep to EMAIL_AND_TERMS', () => {
      const { currentStep, goToNextStep, goToPreviousStep } = useInvoicesForm()

      goToNextStep()
      expect(currentStep.value).toBe(InvoicesFormStep.SELECT_CONTACT)

      goToPreviousStep()
      expect(currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)
    })

    it('should not go below the first step', () => {
      const { currentStep, goToPreviousStep } = useInvoicesForm()

      goToPreviousStep()

      expect(currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)
    })
  })

  describe('goToVaultBeingCreated', () => {
    it('should set currentStep to VAULT_BEING_CREATED', () => {
      const { currentStep, goToVaultBeingCreated } = useInvoicesForm()

      goToVaultBeingCreated()

      expect(currentStep.value).toBe(InvoicesFormStep.VAULT_BEING_CREATED)
    })

    it('should set currentStep to VAULT_BEING_CREATED from any step', () => {
      const { currentStep, goToNextStep, goToVaultBeingCreated } = useInvoicesForm()

      goToNextStep()
      expect(currentStep.value).toBe(InvoicesFormStep.SELECT_CONTACT)

      goToVaultBeingCreated()

      expect(currentStep.value).toBe(InvoicesFormStep.VAULT_BEING_CREATED)
    })
  })

  describe('onMounted status to step mapping', () => {
    it('should set currentStep to VAULT_BEING_CREATED when status is SUBMITTED', async () => {
      vi.mocked(InvoicesService.getSubscriptionStatus).mockResolvedValueOnce(DigitalSafeStatus.SUBMITTED)

      const [result, app] = withSetup(() => useInvoicesForm())
      await flushPromises()

      expect(result.currentStep.value).toBe(InvoicesFormStep.VAULT_BEING_CREATED)

      app.unmount()
    })

    it('should set currentStep to VAULT_BEING_CREATED when status is COMPLETED', async () => {
      vi.mocked(InvoicesService.getSubscriptionStatus).mockResolvedValueOnce(DigitalSafeStatus.COMPLETED)

      const [result, app] = withSetup(() => useInvoicesForm())
      await flushPromises()

      expect(result.currentStep.value).toBe(InvoicesFormStep.VAULT_BEING_CREATED)

      app.unmount()
    })

    it('should keep currentStep at EMAIL_AND_TERMS when status is NOT_SUBSCRIBED', async () => {
      vi.mocked(InvoicesService.getSubscriptionStatus).mockResolvedValueOnce(DigitalSafeStatus.NOT_SUBSCRIBED)

      const [result, app] = withSetup(() => useInvoicesForm())
      await flushPromises()

      expect(result.currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)

      app.unmount()
    })
  })

  describe('shouldShowVaultBeingCreated', () => {
    it('should return false when currentStep is EMAIL_AND_TERMS and status is NOT_SUBSCRIBED', () => {
      const { shouldShowVaultBeingCreated } = useInvoicesForm()

      expect(shouldShowVaultBeingCreated.value).toBe(false)
    })

    it('should return true when currentStep is VAULT_BEING_CREATED', () => {
      const { shouldShowVaultBeingCreated, goToVaultBeingCreated } = useInvoicesForm()

      goToVaultBeingCreated()

      expect(shouldShowVaultBeingCreated.value).toBe(true)
    })

    it('should return true when userDigitalSafeSubscriptionStatus is SUBMITTED', async () => {
      vi.mocked(InvoicesService.getSubscriptionStatus).mockResolvedValueOnce(DigitalSafeStatus.SUBMITTED)

      const [result, app] = withSetup(() => useInvoicesForm())
      await flushPromises()

      expect(result.shouldShowVaultBeingCreated.value).toBe(true)

      app.unmount()
    })

    it('should return false when currentStep is SELECT_CONTACT and status is NOT_SUBSCRIBED', () => {
      const { shouldShowVaultBeingCreated, goToNextStep } = useInvoicesForm()

      goToNextStep()

      expect(shouldShowVaultBeingCreated.value).toBe(false)
    })

    it('should return true when currentStep is SELECT_CONTACT and status is SUBMITTED', async () => {
      vi.mocked(InvoicesService.getSubscriptionStatus).mockResolvedValueOnce(DigitalSafeStatus.SUBMITTED)

      const [result, app] = withSetup(() => useInvoicesForm())
      await flushPromises()

      result.goToNextStep()

      expect(result.shouldShowVaultBeingCreated.value).toBe(true)

      app.unmount()
    })
  })

  describe('submitIntegration', () => {
    it('should submit integration with contact and requester details', async () => {
      const { formData, submitIntegration } = useInvoicesForm()

      formData.value.email = 'billing@example.com'
      formData.value.selectedContactId = 123

      await submitIntegration()
      await flushPromises()

      expect(vi.mocked(getContactById)).toHaveBeenCalledWith(123)
      expect(vi.mocked(InvoicesService.submitIntegration)).toHaveBeenCalledWith('ACC-123', {
        dematerializationEmail: 'billing@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        vaultEmail: 'vault@example.com',
        requesterEmail: 'requester@example.com',
      })
    })

    it('should not submit integration when accountNumber is missing', async () => {
      currentEntityStoreMock.currentEntity = undefined

      const { formData, submitIntegration } = useInvoicesForm()

      formData.value.email = 'billing@example.com'
      formData.value.selectedContactId = 123

      await submitIntegration()
      await flushPromises()

      expect(vi.mocked(getContactById)).not.toHaveBeenCalled()
      expect(vi.mocked(InvoicesService.submitIntegration)).not.toHaveBeenCalled()
    })

    it('should not submit integration when selectedContactId is missing', async () => {
      const { formData, submitIntegration } = useInvoicesForm()

      formData.value.email = 'billing@example.com'
      formData.value.selectedContactId = null

      await submitIntegration()
      await flushPromises()

      expect(vi.mocked(getContactById)).not.toHaveBeenCalled()
      expect(vi.mocked(InvoicesService.submitIntegration)).not.toHaveBeenCalled()
    })

    it('should not submit integration when requester email is missing', async () => {
      userStoreMock.user = {} as any

      const { formData, submitIntegration } = useInvoicesForm()

      formData.value.email = 'billing@example.com'
      formData.value.selectedContactId = 123

      await submitIntegration()
      await flushPromises()

      expect(vi.mocked(getContactById)).not.toHaveBeenCalled()
      expect(vi.mocked(InvoicesService.submitIntegration)).not.toHaveBeenCalled()
    })

    it('should not submit integration when contact is missing', async () => {
      vi.mocked(getContactById).mockResolvedValueOnce(undefined)

      const { formData, submitIntegration } = useInvoicesForm()

      formData.value.email = 'billing@example.com'
      formData.value.selectedContactId = 123

      await submitIntegration()
      await flushPromises()

      expect(vi.mocked(getContactById)).toHaveBeenCalledWith(123)
      expect(vi.mocked(InvoicesService.submitIntegration)).not.toHaveBeenCalled()
    })
  })

  describe('formData persistence', () => {
    it('should preserve formData when navigating between steps', () => {
      const { formData, goToNextStep, goToPreviousStep } = useInvoicesForm()

      formData.value.email = 'test@example.com'
      formData.value.acceptTerms = true

      goToNextStep()

      formData.value.selectedContactId = 12345

      goToPreviousStep()

      expect(formData.value).toEqual({
        email: 'test@example.com',
        acceptTerms: true,
        selectedContactId: 12345,
      })
    })
  })
})
