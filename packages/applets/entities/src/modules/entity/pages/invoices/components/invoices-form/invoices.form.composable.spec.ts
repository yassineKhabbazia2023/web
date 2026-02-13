import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { InvoicesService } from '@entities/modules/entity/services/invoices.service'
import { getContactById } from '@entities/services/contact'
import { InvoicesFormStep } from '@entities/modules/entity/enums'
import { InvoicesTabState } from '@pulse/common/services/invoices-access'
import { useInvoicesForm } from './invoices.form.composable'

vi.mock('@entities/modules/entity/services/invoices.service')
vi.mock('@entities/services/contact')

const mockTabState = ref<InvoicesTabState | null>(null)
const mockContactWithAccess = ref<string | null>(null)

// Manual mock needed: useInvoicesAccessStore returns reactive refs that must be controlled from tests (getStoreMock does not support refs)
vi.mock('@pulse/common/stores', async (importOriginal) => {
  const original = await importOriginal<typeof import('@pulse/common/stores')>()
  return {
    ...original,
    useInvoicesAccessStore: () => ({
      tabState: mockTabState,
      contactWithAccess: mockContactWithAccess,
    }),
  }
})

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('useInvoicesForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userStoreMock.user = { email: 'requester@example.com' } as any
    currentEntityStoreMock.currentEntity = { accountNumber: 'ACC-123' } as any
    mockTabState.value = null
    mockContactWithAccess.value = null
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

  describe('status to step mapping via store', () => {
    it('should set currentStep to EMAIL_AND_TERMS when tabState is form-start', () => {
      mockTabState.value = InvoicesTabState.FORM_START

      const { currentStep } = useInvoicesForm()

      expect(currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)
    })

    it('should set currentStep to VAULT_BEING_CREATED when tabState is form-submitted', () => {
      mockTabState.value = InvoicesTabState.FORM_SUBMITTED

      const { currentStep } = useInvoicesForm()

      expect(currentStep.value).toBe(InvoicesFormStep.VAULT_BEING_CREATED)
    })

    it('should set currentStep to ACCESS_VAULT when tabState is connection-ready-locked', () => {
      mockTabState.value = InvoicesTabState.CONNECTION_READY_LOCKED

      const { currentStep } = useInvoicesForm()

      expect(currentStep.value).toBe(InvoicesFormStep.ACCESS_VAULT)
    })

    it('should set currentStep to ACCESS_VAULT when tabState is connection-ready-unlocked', () => {
      mockTabState.value = InvoicesTabState.CONNECTION_READY_UNLOCKED

      const { currentStep } = useInvoicesForm()

      expect(currentStep.value).toBe(InvoicesFormStep.ACCESS_VAULT)
    })

    it('should keep currentStep at EMAIL_AND_TERMS when tabState is null', () => {
      mockTabState.value = null

      const { currentStep } = useInvoicesForm()

      expect(currentStep.value).toBe(InvoicesFormStep.EMAIL_AND_TERMS)
    })
  })

  describe('shouldShowVaultBeingCreated', () => {
    it('should return false when currentStep is EMAIL_AND_TERMS and tabState is null', () => {
      const { shouldShowVaultBeingCreated } = useInvoicesForm()

      expect(shouldShowVaultBeingCreated.value).toBe(false)
    })

    it('should return true when currentStep is VAULT_BEING_CREATED', () => {
      const { shouldShowVaultBeingCreated, goToVaultBeingCreated } = useInvoicesForm()

      goToVaultBeingCreated()

      expect(shouldShowVaultBeingCreated.value).toBe(true)
    })

    it('should return true when tabState is FORM_SUBMITTED (mapped to VAULT_BEING_CREATED via watch)', () => {
      mockTabState.value = InvoicesTabState.FORM_SUBMITTED

      const { shouldShowVaultBeingCreated } = useInvoicesForm()

      expect(shouldShowVaultBeingCreated.value).toBe(true)
    })

    it('should return false when currentStep is SELECT_CONTACT and tabState is null', () => {
      const { shouldShowVaultBeingCreated, goToNextStep } = useInvoicesForm()

      goToNextStep()

      expect(shouldShowVaultBeingCreated.value).toBe(false)
    })
  })

  describe('shouldHideFormHeader', () => {
    it('should return false when currentStep is EMAIL_AND_TERMS and tabState is null', () => {
      const { shouldHideFormHeader } = useInvoicesForm()

      expect(shouldHideFormHeader.value).toBe(false)
    })

    it('should return true when currentStep is VAULT_BEING_CREATED', () => {
      const { shouldHideFormHeader, goToVaultBeingCreated } = useInvoicesForm()

      goToVaultBeingCreated()

      expect(shouldHideFormHeader.value).toBe(true)
    })

    it('should return true when currentStep is ACCESS_VAULT', () => {
      mockTabState.value = InvoicesTabState.CONNECTION_READY_LOCKED

      const { shouldHideFormHeader } = useInvoicesForm()

      expect(shouldHideFormHeader.value).toBe(true)
    })

    it('should return true when tabState is FORM_SUBMITTED (mapped to VAULT_BEING_CREATED via watch)', () => {
      mockTabState.value = InvoicesTabState.FORM_SUBMITTED

      const { shouldHideFormHeader } = useInvoicesForm()

      expect(shouldHideFormHeader.value).toBe(true)
    })

    it('should return false when currentStep is SELECT_CONTACT and tabState is null', () => {
      const { shouldHideFormHeader, goToNextStep } = useInvoicesForm()

      goToNextStep()

      expect(shouldHideFormHeader.value).toBe(false)
    })
  })

  describe('isAllowedToAccessVault', () => {
    it('should return false by default when tabState is null', () => {
      const { isAllowedToAccessVault } = useInvoicesForm()

      expect(isAllowedToAccessVault.value).toBe(false)
    })

    it('should return true when tabState is connection-ready-unlocked', () => {
      mockTabState.value = InvoicesTabState.CONNECTION_READY_UNLOCKED

      const { isAllowedToAccessVault } = useInvoicesForm()

      expect(isAllowedToAccessVault.value).toBe(true)
    })

    it('should return false when tabState is connection-ready-locked with contactWithAccess', () => {
      mockTabState.value = InvoicesTabState.CONNECTION_READY_LOCKED
      mockContactWithAccess.value = 'jean.soto@gmail.com'

      const { isAllowedToAccessVault, contactWithAccess } = useInvoicesForm()

      expect(isAllowedToAccessVault.value).toBe(false)
      expect(contactWithAccess.value).toBe('jean.soto@gmail.com')
    })
  })

  describe('shouldShowVaultAccessDenied', () => {
    it('should return false by default', () => {
      const { shouldShowVaultAccessDenied } = useInvoicesForm()

      expect(shouldShowVaultAccessDenied.value).toBe(false)
    })

    it('should return true when access is denied and step is ACCESS_VAULT', () => {
      mockTabState.value = InvoicesTabState.CONNECTION_READY_LOCKED

      const { shouldShowVaultAccessDenied } = useInvoicesForm()

      expect(shouldShowVaultAccessDenied.value).toBe(true)
    })

    it('should return false when access is granted and step is ACCESS_VAULT', () => {
      mockTabState.value = InvoicesTabState.CONNECTION_READY_UNLOCKED

      const { shouldShowVaultAccessDenied } = useInvoicesForm()

      expect(shouldShowVaultAccessDenied.value).toBe(false)
    })
  })

  describe('submitIntegration', () => {
    it('should submit integration with contact and requester details', async () => {
      const { formData, submitIntegration, hasIntegrationError } = useInvoicesForm()

      formData.value.email = 'billing@example.com'
      formData.value.selectedContactId = 123

      await submitIntegration()
      await flushPromises()

      expect(hasIntegrationError.value).toBe(false)
      expect(vi.mocked(getContactById)).toHaveBeenCalledWith(123)
      expect(vi.mocked(InvoicesService.submitIntegration)).toHaveBeenCalledWith('ACC-123', {
        dematerializationEmail: 'billing@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        vaultEmail: 'vault@example.com',
        requesterEmail: 'requester@example.com',
      })
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

    it('should set integration error when submission fails', async () => {
      vi.mocked(InvoicesService.submitIntegration).mockRejectedValueOnce(new Error('Boom'))

      const { formData, submitIntegration, hasIntegrationError } = useInvoicesForm()

      formData.value.email = 'billing@example.com'
      formData.value.selectedContactId = 123

      await submitIntegration()
      await flushPromises()

      expect(hasIntegrationError.value).toBe(true)
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
