import { ref, computed } from 'vue'
import { useRequestDelegation } from './use-request-delegation.composable'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

describe('useRequestDelegation', () => {
  const createComposable = (step = 0, canGoNext = false) => {
    const requestDelegationStep = ref(step)
    const requestDelegationRef = ref<{ canGoNext: boolean } | null>({ canGoNext })
    const isDelegationDrawerOpened = computed({
      get: () => true,
      set: vi.fn(),
    })

    return {
      composable: useRequestDelegation({
        requestDelegationStep,
        requestDelegationRef,
        isDelegationDrawerOpened,
      }),
      requestDelegationStep,
      requestDelegationRef,
      isDelegationDrawerOpened,
    }
  }

  describe('requestDelegationBackCTA', () => {
    it('should show cancel label on first step', () => {
      const { composable } = createComposable(0)

      expect(composable.requestDelegationBackCTA.value).toEqual({
        pLabel: 'entities.delegationDrawer.cancelButtonLabel',
        pTestId: 'request-delegation-previous-button',
      })
    })

    it('should show back label on other steps', () => {
      const { composable } = createComposable(1)

      expect(composable.requestDelegationBackCTA.value).toEqual({
        pLabel: 'entities.delegationDrawer.backButtonLabel',
        pTestId: 'request-delegation-previous-button',
      })
    })
  })

  describe('requestDelegationPrimaryCTA', () => {
    it('should show next label on first step', () => {
      const { composable } = createComposable(0, true)

      expect(composable.requestDelegationPrimaryCTA.value).toEqual({
        pLabel: 'entities.delegationDrawer.primaryButtonLabel',
        pDisabled: false,
        pTestId: 'request-delegation-next-button',
      })
    })

    it('should show submit label on final step', () => {
      const { composable } = createComposable(2, true)

      expect(composable.requestDelegationPrimaryCTA.value).toEqual({
        pLabel: 'entities.delegationDrawer.submitButtonLabel',
        pDisabled: false,
        pTestId: 'request-delegation-next-button',
      })
    })

    it('should be disabled when canGoNext is false', () => {
      const { composable } = createComposable(0, false)

      expect(composable.requestDelegationPrimaryCTA.value.pDisabled).toBe(true)
    })

    it('should be disabled when ref is null', () => {
      const requestDelegationStep = ref(0)
      const requestDelegationRef = ref<{ canGoNext: boolean } | null>(null)
      const isDelegationDrawerOpened = computed({
        get: () => true,
        set: vi.fn(),
      })

      const composable = useRequestDelegation({
        requestDelegationStep,
        requestDelegationRef,
        isDelegationDrawerOpened,
      })

      expect(composable.requestDelegationPrimaryCTA.value.pDisabled).toBe(true)
    })
  })

  describe('handleRequestDelegationPrevious', () => {
    it('should close drawer on first step', () => {
      const requestDelegationStep = ref(0)
      const requestDelegationRef = ref<{ canGoNext: boolean } | null>({ canGoNext: false })
      const setMock = vi.fn()
      const isDelegationDrawerOpened = computed({
        get: () => true,
        set: setMock,
      })

      const composable = useRequestDelegation({
        requestDelegationStep,
        requestDelegationRef,
        isDelegationDrawerOpened,
      })

      composable.handleRequestDelegationPrevious()

      expect(setMock).toHaveBeenCalledWith(false)
    })

    it('should decrement step on other steps', () => {
      const { composable, requestDelegationStep } = createComposable(1)

      composable.handleRequestDelegationPrevious()

      expect(requestDelegationStep.value).toBe(0)
    })
  })

  describe('handleRequestDelegationNext', () => {
    it('should increment step on non-final step', () => {
      const { composable, requestDelegationStep } = createComposable(0)

      composable.handleRequestDelegationNext()

      expect(requestDelegationStep.value).toBe(1)
    })

    it('should close drawer on final step', () => {
      const requestDelegationStep = ref(2)
      const requestDelegationRef = ref<{ canGoNext: boolean } | null>({ canGoNext: true })
      const setMock = vi.fn()
      const isDelegationDrawerOpened = computed({
        get: () => true,
        set: setMock,
      })

      const composable = useRequestDelegation({
        requestDelegationStep,
        requestDelegationRef,
        isDelegationDrawerOpened,
      })

      composable.handleRequestDelegationNext()

      expect(setMock).toHaveBeenCalledWith(false)
    })
  })
})
