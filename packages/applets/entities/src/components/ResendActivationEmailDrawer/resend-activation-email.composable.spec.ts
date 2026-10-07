import { flushPromises } from '@vue/test-utils'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { AccountType } from '@pulse/common/enums'
import { inviteCustomers } from '@entities/services/contact'
import { useResendActivationEmail } from './resend-activation-email.composable'

const ACCOUNT_ID = 601
const SINGLE_CUSTOMER_IDS = [188]
const MULTIPLE_CUSTOMER_IDS = [188, 189, 190]
const I18N_KEY = 'entities.resendActivationEmail'

const refreshUsers = vi.fn(() => Promise.resolve())

const createComposable = (selectedCustomerIds: number[], accountType = AccountType.REGULAR) => {
  const composable = useResendActivationEmail({
    accountId: ACCOUNT_ID,
    accountType,
    refreshUsers,
  })
  composable.selectedCustomerIds.value = selectedCustomerIds

  return composable
}

describe('useResendActivationEmail', () => {
  beforeEach(() => {
    refreshUsers.mockImplementation(() => Promise.resolve())
  })

  describe('sendActivationEmails', () => {
    it('invites a single customer and notifies the success', async () => {
      vi.mocked(inviteCustomers).mockResolvedValue(SINGLE_CUSTOMER_IDS)
      const { sendActivationEmails } = createComposable(SINGLE_CUSTOMER_IDS)

      await sendActivationEmails()

      expect(inviteCustomers).toHaveBeenCalledWith(SINGLE_CUSTOMER_IDS, ACCOUNT_ID, AccountType.REGULAR)
      expect(displayNotification).toHaveBeenCalledExactlyOnceWith('success', `${I18N_KEY}.success`)
      expect(AmplitudeService.track).toHaveBeenCalledWith('Onboarding Relaunched', {
        onboarding_relaunch_result: 'succeeded',
      })
      expect(refreshUsers).toHaveBeenCalledOnce()
    })

    it('invites multiple customers and notifies the success', async () => {
      vi.mocked(inviteCustomers).mockResolvedValue(MULTIPLE_CUSTOMER_IDS)
      const { sendActivationEmails } = createComposable(MULTIPLE_CUSTOMER_IDS)

      await sendActivationEmails()

      expect(inviteCustomers).toHaveBeenCalledWith(MULTIPLE_CUSTOMER_IDS, ACCOUNT_ID, AccountType.REGULAR)
      expect(displayNotification).toHaveBeenCalledExactlyOnceWith('success', `${I18N_KEY}.success`)
      expect(refreshUsers).toHaveBeenCalledOnce()
    })

    it('forwards the prospect account type', async () => {
      vi.mocked(inviteCustomers).mockResolvedValue(SINGLE_CUSTOMER_IDS)
      const { sendActivationEmails } = createComposable(SINGLE_CUSTOMER_IDS, AccountType.PROSPECT)

      await sendActivationEmails()

      expect(inviteCustomers).toHaveBeenCalledWith(SINGLE_CUSTOMER_IDS, ACCOUNT_ID, AccountType.PROSPECT)
    })

    it('notifies a partial sending when fewer customers than selected are invited', async () => {
      vi.mocked(inviteCustomers).mockResolvedValue([MULTIPLE_CUSTOMER_IDS[0]])
      const { sendActivationEmails } = createComposable(MULTIPLE_CUSTOMER_IDS)

      await sendActivationEmails()

      expect(displayNotification).toHaveBeenCalledExactlyOnceWith('warning', `${I18N_KEY}.partialInvitation`)
      expect(refreshUsers).toHaveBeenCalledOnce()
    })

    it.each([
      { case: 'an empty array', response: [] },
      { case: 'an empty body', response: '' },
      { case: 'no body', response: undefined },
      { case: 'an unexpected object', response: { invitedCount: 3 } },
    ])('warns that the sending is not confirmed when the response is $case', async ({ response }) => {
      vi.mocked(inviteCustomers).mockResolvedValue(response as unknown as number[])
      const { sendActivationEmails } = createComposable(MULTIPLE_CUSTOMER_IDS)

      await sendActivationEmails()

      expect(displayNotification).toHaveBeenCalledExactlyOnceWith('warning', `${I18N_KEY}.invitationNotConfirmed`)
      expect(AmplitudeService.track).not.toHaveBeenCalled()
      expect(refreshUsers).toHaveBeenCalledOnce()
    })

    it('notifies the error and does not refresh the users when the invitation fails', async () => {
      const error = new Error('invitation failed')
      vi.mocked(inviteCustomers).mockRejectedValue(error)
      const { sendActivationEmails, isSubmitting, selectedCustomerIds } = createComposable(MULTIPLE_CUSTOMER_IDS)

      await sendActivationEmails()

      expect(displayNotification).toHaveBeenCalledExactlyOnceWith('error', `${I18N_KEY}.error`)
      expect(AmplitudeService.track).toHaveBeenCalledWith('Onboarding Relaunched', {
        onboarding_relaunch_result: 'failed',
      })
      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Error inviting customers :', error)
      expect(refreshUsers).not.toHaveBeenCalled()
      expect(isSubmitting.value).toBe(false)
      expect(selectedCustomerIds.value).toEqual([])
    })

    it('notifies the success before the users refresh has completed', async () => {
      vi.mocked(inviteCustomers).mockResolvedValue(MULTIPLE_CUSTOMER_IDS)
      refreshUsers.mockImplementation(() => new Promise(() => undefined))
      const { sendActivationEmails, isSubmitting } = createComposable(MULTIPLE_CUSTOMER_IDS)

      sendActivationEmails()
      await flushPromises()

      expect(displayNotification).toHaveBeenCalledExactlyOnceWith('success', `${I18N_KEY}.success`)
      expect(isSubmitting.value).toBe(false)
    })

    it('does not report a failing users refresh as an invitation failure', async () => {
      const error = new Error('refresh failed')
      vi.mocked(inviteCustomers).mockResolvedValue(MULTIPLE_CUSTOMER_IDS)
      refreshUsers.mockRejectedValue(error)
      const { sendActivationEmails } = createComposable(MULTIPLE_CUSTOMER_IDS)

      await sendActivationEmails()

      expect(displayNotification).toHaveBeenCalledExactlyOnceWith('success', `${I18N_KEY}.success`)
      expect(vi.mocked(logger.error)).toHaveBeenCalledWith('Error refreshing users after invitation :', error)
    })

    it('flags the submission while the invitation is pending and ignores double submissions', async () => {
      let resolveInvitation: (invitedCustomerIds: number[]) => void = () => undefined
      vi.mocked(inviteCustomers).mockReturnValue(new Promise((resolve) => {
        resolveInvitation = resolve
      }))
      const { sendActivationEmails, isSubmitting, selectedCustomerIds } = createComposable(MULTIPLE_CUSTOMER_IDS)

      const firstSubmission = sendActivationEmails()
      const secondSubmission = sendActivationEmails()

      expect(isSubmitting.value).toBe(true)
      expect(inviteCustomers).toHaveBeenCalledOnce()

      resolveInvitation(MULTIPLE_CUSTOMER_IDS)
      await Promise.all([firstSubmission, secondSubmission])

      expect(isSubmitting.value).toBe(false)
      expect(selectedCustomerIds.value).toEqual([])
      expect(displayNotification).toHaveBeenCalledOnce()
    })

    it('does nothing when no customer is selected', async () => {
      const { sendActivationEmails } = createComposable([])

      await sendActivationEmails()

      expect(inviteCustomers).not.toHaveBeenCalled()
      expect(displayNotification).not.toHaveBeenCalled()
    })
  })
})
