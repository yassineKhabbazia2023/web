import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { useOnboardingSteps } from './onboarding-steps.composable'
import { OnboardingStep, OnboardingStepStatus } from './prospect-conformity.enums'
import { PROSPECT_CONFORMITY_STEPS } from './prospect-conformity.consts'

vi.mock('@entities/services/prospects/prospects.service')
vi.mock('@pulse/toolbox')

const fetchOnboardingStepsMock = vi.mocked(ProspectsService.fetchOnboardingSteps)

const accountIdMock = 1971

const stepsResponseMock = [
  { id: OnboardingStep.CommercialProposal, status: OnboardingStepStatus.Completed },
  { id: OnboardingStep.SupportingDocuments, status: OnboardingStepStatus.Completed },
  { id: OnboardingStep.Beneficiary, status: OnboardingStepStatus.ToDo },
  { id: OnboardingStep.EngagementLetter, status: OnboardingStepStatus.InReview },
  { id: OnboardingStep.PaymentMethod, status: OnboardingStepStatus.ToDo },
]

describe('onboarding-steps.composable', () => {
  beforeEach(() => {
    fetchOnboardingStepsMock.mockResolvedValue(stepsResponseMock)
  })

  describe('initial loading on mount', () => {
    it('should fetch the steps and expose the status map', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))

      expect(result.isLoadingSteps.value).toBe(true)

      await flushPromises()

      expect(fetchOnboardingStepsMock).toHaveBeenCalledWith(accountIdMock)
      expect(result.isLoadingSteps.value).toBe(false)
      expect(result.stepStatusById.value.get(OnboardingStep.CommercialProposal)).toBe(OnboardingStepStatus.Completed)
      expect(result.stepStatusById.value.get(OnboardingStep.Beneficiary)).toBe(OnboardingStepStatus.ToDo)
    })

    it('should compute the counts strictly from the API response', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      expect(result.totalCount.value).toBe(5)
      expect(result.completedCount.value).toBe(2)
    })
  })

  describe('availableSteps', () => {
    it('should expose the available steps in front-defined order regardless of the API order', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      // stepsResponseMock is deliberately not in display order.
      expect(result.availableSteps.value).toEqual(PROSPECT_CONFORMITY_STEPS)
    })

    it('should expose only the steps returned by the API', async () => {
      fetchOnboardingStepsMock.mockResolvedValue([
        { id: OnboardingStep.CommercialProposal, status: OnboardingStepStatus.Completed },
        { id: OnboardingStep.Beneficiary, status: OnboardingStepStatus.ToDo },
        { id: OnboardingStep.EngagementLetter, status: OnboardingStepStatus.InReview },
      ])

      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      expect(result.availableSteps.value.map((step) => step.id)).toEqual([
        OnboardingStep.Beneficiary,
        OnboardingStep.CommercialProposal,
        OnboardingStep.EngagementLetter,
      ])
    })

    it('should expose an empty list while loading', () => {
      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))

      expect(result.isLoadingSteps.value).toBe(true)
      expect(result.availableSteps.value).toEqual([])
    })

    it('should expose an empty list when the API returns no steps', async () => {
      fetchOnboardingStepsMock.mockResolvedValue([])

      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      expect(result.availableSteps.value).toEqual([])
    })
  })

  describe('areAllStepsCompleted', () => {
    it('should be true when every step returned by the API is completed', async () => {
      fetchOnboardingStepsMock.mockResolvedValue([
        { id: OnboardingStep.CommercialProposal, status: OnboardingStepStatus.Completed },
        { id: OnboardingStep.Beneficiary, status: OnboardingStepStatus.Completed },
        { id: OnboardingStep.EngagementLetter, status: OnboardingStepStatus.Completed },
      ])

      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      expect(result.areAllStepsCompleted.value).toBe(true)
    })

    it('should be false when at least one step is not completed', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      expect(result.areAllStepsCompleted.value).toBe(false)
    })

    it('should be false while loading and when the API returns no steps', async () => {
      fetchOnboardingStepsMock.mockResolvedValue([])

      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))

      expect(result.areAllStepsCompleted.value).toBe(false)

      await flushPromises()

      expect(result.areAllStepsCompleted.value).toBe(false)
    })

    it('should flip to true after a reload where every step is completed', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      expect(result.areAllStepsCompleted.value).toBe(false)

      fetchOnboardingStepsMock.mockResolvedValue(
        stepsResponseMock.map((step) => ({ ...step, status: OnboardingStepStatus.Completed })),
      )

      await result.reload()

      expect(result.areAllStepsCompleted.value).toBe(true)
    })
  })

  describe('missing account id', () => {
    it('should not fetch and stop loading when the account id is undefined', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => undefined))
      await flushPromises()

      expect(fetchOnboardingStepsMock).not.toHaveBeenCalled()
      expect(result.isLoadingSteps.value).toBe(false)
      expect(result.totalCount.value).toBe(0)
    })
  })

  describe('reload', () => {
    it('should re-fetch the steps and refresh the exposed state', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      fetchOnboardingStepsMock.mockResolvedValue([
        { id: OnboardingStep.PaymentMethod, status: OnboardingStepStatus.Completed },
      ])

      await result.reload()

      expect(fetchOnboardingStepsMock).toHaveBeenLastCalledWith(accountIdMock)
      expect(result.totalCount.value).toBe(1)
      expect(result.completedCount.value).toBe(1)
      expect(result.stepStatusById.value.get(OnboardingStep.PaymentMethod)).toBe(OnboardingStepStatus.Completed)
      expect(result.availableSteps.value.map((step) => step.id)).toEqual([OnboardingStep.PaymentMethod])
    })
  })

  describe('error handling', () => {
    it('should keep the previous state and stop loading when the fetch fails', async () => {
      const [result] = withSetup(() => useOnboardingSteps(() => accountIdMock))
      await flushPromises()

      fetchOnboardingStepsMock.mockRejectedValue(new Error('API Error'))

      await result.reload()

      expect(result.totalCount.value).toBe(5)
      expect(result.availableSteps.value).toEqual(PROSPECT_CONFORMITY_STEPS)
      expect(result.isLoadingSteps.value).toBe(false)
    })
  })
})
