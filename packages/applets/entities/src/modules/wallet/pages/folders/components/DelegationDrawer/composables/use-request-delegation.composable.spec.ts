import { ref, shallowRef, computed } from 'vue'
import { AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import type { Collab } from '@entities/types'
import type { SearchAccountItem } from '@entities/services/account/account.type'
import { useRequestDelegation } from './use-request-delegation.composable'
import type { RequestDelegationRef } from './use-request-delegation.composable.types'
import { createDelegationRequest } from '@entities/services/account'
import { displayNotification } from '@pulse/styleguide'

const createDelegationRequestMock = vi.mocked(createDelegationRequest)
const displayNotificationMock = vi.mocked(displayNotification)

beforeEach(() => {
  createDelegationRequestMock.mockResolvedValue(undefined as unknown as Awaited<ReturnType<typeof createDelegationRequest>>)
  displayNotificationMock.mockImplementation(() => undefined)
})

const mockAccount: SearchAccountItem = {
  accountId: 10,
  legalName: 'ACME',
  accountNumber: 'A123',
}

describe('useRequestDelegation', () => {
  const createComposable = (
    step = 0,
    canGoNext = false,
    selectedCollabs: Collab[] = [],
    defaultCollabs: Collab[] | null = [],
    selectedAccount: SearchAccountItem | null = null,
  ) => {
    const requestDelegationStep = ref(step)
    const requestDelegationRef = shallowRef<RequestDelegationRef | null>({
      canGoNext,
      selectedAccount,
      selectedCollaborators: selectedCollabs,
      initiallySelectedCollaborators: defaultCollabs,
    })
    const setDrawerMock = vi.fn()
    const isDelegationDrawerOpened = computed({
      get: () => true,
      set: setDrawerMock,
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
      setDrawerMock,
    }
  }

  describe('requestDelegationBackCTA', () => {
    it('should show cancel label on first step', () => {
      const { composable } = createComposable(0)

      expect(composable.requestDelegationBackCTA.value).toEqual({
        pLabel: 'entities.delegationDrawer.cancelButtonLabel',
        pDisabled: false,
        pTestId: 'request-delegation-previous-button',
      })
    })

    it('should show back label on other steps', () => {
      const { composable } = createComposable(1)

      expect(composable.requestDelegationBackCTA.value).toEqual({
        pLabel: 'entities.delegationDrawer.backButtonLabel',
        pDisabled: false,
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
        pLoading: false,
        pTestId: 'request-delegation-next-button',
      })
    })

    it('should show send request label on final step', () => {
      const { composable } = createComposable(2, true)

      expect(composable.requestDelegationPrimaryCTA.value).toEqual({
        pLabel: 'entities.requestDelegation.sendRequest',
        pDisabled: false,
        pLoading: false,
        pTestId: 'request-delegation-next-button',
      })
    })

    it('should be disabled when canGoNext is false', () => {
      const { composable } = createComposable(0, false)

      expect(composable.requestDelegationPrimaryCTA.value.pDisabled).toBe(true)
    })

    it('should be disabled when ref is null', () => {
      const requestDelegationStep = ref(0)
      const requestDelegationRef = ref<RequestDelegationRef | null>(null)
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
      const { composable, setDrawerMock } = createComposable(0)

      composable.handleRequestDelegationPrevious()

      expect(setDrawerMock).toHaveBeenCalledWith(false)
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

    it('should send the request, notify success and close drawer on final step', async () => {
      const collabs = [{ contactId: 1 } as Collab, { contactId: 2 } as Collab]
      const { composable, setDrawerMock } = createComposable(2, true, collabs, collabs, mockAccount)

      await composable.handleRequestDelegationNext()

      expect(createDelegationRequestMock).toHaveBeenCalledWith({
        accountId: mockAccount.accountId,
        recipientIds: [1, 2],
      })
      expect(displayNotificationMock).toHaveBeenCalledWith('success', 'entities.requestDelegation.requestSentSuccess')
      expect(setDrawerMock).toHaveBeenCalledWith(false)
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Delegation Request Summary Completed', {
        delegation_request_summary_completed_result: 'succeeded',
      })
    })

    it('should notify error and keep drawer open when the request fails on final step', async () => {
      createDelegationRequestMock.mockRejectedValue(new Error('boom'))
      const collabs = [{ contactId: 1 } as Collab]
      const { composable, setDrawerMock } = createComposable(2, true, collabs, collabs, mockAccount)

      await composable.handleRequestDelegationNext()

      expect(displayNotificationMock).toHaveBeenCalledWith('error', 'entities.requestDelegation.requestSentError')
      expect(setDrawerMock).not.toHaveBeenCalled()
      expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Delegation Request Summary Completed', {
        delegation_request_summary_completed_result: 'failed',
      })
    })

    it('should not send the request when no account is selected on final step', async () => {
      const collabs = [{ contactId: 1 } as Collab]
      const { composable, setDrawerMock } = createComposable(2, true, collabs, collabs, null)

      await composable.handleRequestDelegationNext()

      expect(createDelegationRequestMock).not.toHaveBeenCalled()
      expect(setDrawerMock).not.toHaveBeenCalled()
    })
  })
})
