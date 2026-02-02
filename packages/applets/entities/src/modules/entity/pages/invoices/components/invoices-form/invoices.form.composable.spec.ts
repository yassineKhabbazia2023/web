import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { InvoicesService } from '@entities/modules/entity/services/invoices.service'
import { getContactById } from '@entities/services/contact'
import { InvoicesFormStep } from '../../invoices.enums'
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
