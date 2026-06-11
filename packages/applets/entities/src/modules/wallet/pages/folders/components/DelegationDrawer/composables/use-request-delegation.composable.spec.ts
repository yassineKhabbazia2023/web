import { ref, shallowRef, computed } from 'vue'
import { AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import type { Collab } from '@entities/types'
import { useRequestDelegation } from './use-request-delegation.composable'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

type RequestDelegationRefValue = {
  canGoNext: boolean
  selectedCollaborators: Collab[]
  initiallySelectedCollaborators: Collab[] | null
}

describe('useRequestDelegation', () => {
  const createComposable = (
    step = 0,
    canGoNext = false,
    selectedCollabs: Collab[] = [],
    defaultCollabs: Collab[] | null = [],
  ) => {
    const requestDelegationStep = ref(step)
    const requestDelegationRef = shallowRef<RequestDelegationRefValue | null>({
      canGoNext,
      selectedCollaborators: selectedCollabs,
      initiallySelectedCollaborators: defaultCollabs,
    })
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
      const requestDelegationRef = ref<RequestDelegationRefValue | null>(null)
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
      const requestDelegationRef = shallowRef<RequestDelegationRefValue | null>({
        canGoNext: false,
        selectedCollaborators: [],
        initiallySelectedCollaborators: [],
      })
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
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Delegation Request Company Validated')
    })

    it('should track "not modified" when collaborators unchanged on collab step', () => {
      const collabs = [{ contactId: 1 } as Collab, { contactId: 2 } as Collab]
      const { composable, requestDelegationStep } = createComposable(1, true, collabs, collabs)

      composable.handleRequestDelegationNext()

      expect(requestDelegationStep.value).toBe(2)
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Delegation Request Collaborators Validated', {
        delegation_request_collaborator_validated_update: 'not modified',
        delegation_request_collaborator_validated_number: 2,
      })
    })

    it('should track "modified" when collaborators differ from default on collab step', () => {
      const defaultCollabs = [{ contactId: 1 } as Collab, { contactId: 2 } as Collab]
      const selectedCollabs = [{ contactId: 1 } as Collab, { contactId: 3 } as Collab]
      const { composable, requestDelegationStep } = createComposable(1, true, selectedCollabs, defaultCollabs)

      composable.handleRequestDelegationNext()

      expect(requestDelegationStep.value).toBe(2)
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Delegation Request Collaborators Validated', {
        delegation_request_collaborator_validated_update: 'modified',
        delegation_request_collaborator_validated_number: 2,
      })
    })

    it('should track "modified" when collaborator count differs from default on collab step', () => {
      const defaultCollabs = [{ contactId: 1 } as Collab, { contactId: 2 } as Collab]
      const selectedCollabs = [{ contactId: 1 } as Collab]
      const { composable, requestDelegationStep } = createComposable(1, true, selectedCollabs, defaultCollabs)

      composable.handleRequestDelegationNext()

      expect(requestDelegationStep.value).toBe(2)
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Delegation Request Collaborators Validated', {
        delegation_request_collaborator_validated_update: 'modified',
        delegation_request_collaborator_validated_number: 1,
      })
    })

    it('should close drawer on final step', () => {
      const requestDelegationStep = ref(2)
      const requestDelegationRef = shallowRef<RequestDelegationRefValue | null>({
        canGoNext: true,
        selectedCollaborators: [],
        initiallySelectedCollaborators: [],
      })
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
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Delegation Request Summary Completed', {
        delegation_request_summary_completed_result: 'succeeded',
      })
    })
  })
})
