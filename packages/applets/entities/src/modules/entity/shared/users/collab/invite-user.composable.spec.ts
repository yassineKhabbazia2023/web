import { flushPromises } from '@vue/test-utils'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { getMockedEntity, getMockedEntitySummary } from '@pulse/common/mocks'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { AccountType } from '@pulse/common/enums'
import { inviteCustomers } from '@entities/services/contact'
import { getMockedCollabUser } from '@entities/__mocks__/contact.mocks'
import { UserActions } from '@entities/enums'
import { useInviteUser } from './invite-user.composable'
import { InviteUserTracking } from '../services/invite-user.tracking.service'

const ACCOUNT_ID = 123
const CONTACT_ID = 188
const entitySummaryMock = getMockedEntitySummary(getMockedEntity({ accountId: ACCOUNT_ID }))

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const refreshUsers = vi.fn(() => Promise.resolve())

const createComposable = () => useInviteUser({ refreshUsers })

describe('useInviteUser', () => {
  beforeEach(() => {
    currentEntityStoreMock.currentEntity = entitySummaryMock
    currentEntityStoreMock.currentAccountType = AccountType.PROSPECT
    vi.mocked(inviteCustomers).mockResolvedValue([CONTACT_ID])
    vi.spyOn(InviteUserTracking, 'trackOnboardingRelaunchedSuccess').mockImplementation(() => undefined)
    vi.spyOn(InviteUserTracking, 'trackOnboardingRelaunchedFail').mockImplementation(() => undefined)
  })

  describe('inviteUserToolboxItems', () => {
    it('exposes the prospect invitation item for a prospect entity', () => {
      const { inviteUserToolboxItems } = createComposable()

      expect(inviteUserToolboxItems.value).toEqual([
        {
          pIconName: 'send',
          pValue: 'entities.wallet.entitiesListProspects.inviteProspectToTheirSpace',
          pActionName: UserActions.INVITE_USER,
          pState: 'default',
        },
      ])
    })

    it('exposes the activation email item for a regular entity', () => {
      currentEntityStoreMock.currentAccountType = AccountType.REGULAR

      const { inviteUserToolboxItems } = createComposable()

      expect(inviteUserToolboxItems.value).toEqual([
        {
          pIconName: 'send',
          pValue: 'entities.wallet.entitiesListRegular.resendActivationEmail',
          pActionName: UserActions.INVITE_USER,
          pState: 'default',
        },
      ])
    })
  })

  describe('handleInviteUserAction', () => {
    it('ignores unrelated actions', () => {
      const { handleInviteUserAction } = createComposable()

      expect(handleInviteUserAction(UserActions.MODIFY_RIGHTS, getMockedCollabUser())).toBe(false)
      expect(inviteCustomers).not.toHaveBeenCalled()
    })

    it('invites the selected user and refreshes the users list', async () => {
      const { handleInviteUserAction } = createComposable()

      const handled = handleInviteUserAction(
        UserActions.INVITE_USER,
        getMockedCollabUser({ contactId: CONTACT_ID }),
      )
      await flushPromises()

      expect(handled).toBe(true)
      expect(inviteCustomers).toHaveBeenCalledWith([CONTACT_ID], ACCOUNT_ID, AccountType.PROSPECT)
      expect(refreshUsers).toHaveBeenCalled()
      expect(displayNotification).toHaveBeenCalledWith('success', 'entities.users.inviteUser.success')
      expect(vi.mocked(InviteUserTracking.trackOnboardingRelaunchedSuccess)).toHaveBeenCalled()
    })

    it('invites the selected user with the regular account type for a regular entity', async () => {
      currentEntityStoreMock.currentAccountType = AccountType.REGULAR

      const { handleInviteUserAction } = createComposable()
      handleInviteUserAction(UserActions.INVITE_USER, getMockedCollabUser({ contactId: CONTACT_ID }))
      await flushPromises()

      expect(inviteCustomers).toHaveBeenCalledWith([CONTACT_ID], ACCOUNT_ID, AccountType.REGULAR)
    })

    it('does nothing when there is no current entity', async () => {
      currentEntityStoreMock.currentEntity = undefined

      const { handleInviteUserAction } = createComposable()
      handleInviteUserAction(UserActions.INVITE_USER, getMockedCollabUser())
      await flushPromises()

      expect(inviteCustomers).not.toHaveBeenCalled()
    })

    it('notifies an error and does not refresh when the invitation fails', async () => {
      vi.mocked(inviteCustomers).mockRejectedValue(new Error('boom'))

      const { handleInviteUserAction } = createComposable()
      handleInviteUserAction(UserActions.INVITE_USER, getMockedCollabUser())
      await flushPromises()

      expect(refreshUsers).not.toHaveBeenCalled()
      expect(displayNotification).toHaveBeenCalledWith('error', 'entities.users.inviteUser.error')
      expect(vi.mocked(InviteUserTracking.trackOnboardingRelaunchedFail)).toHaveBeenCalled()
    })
  })
})
