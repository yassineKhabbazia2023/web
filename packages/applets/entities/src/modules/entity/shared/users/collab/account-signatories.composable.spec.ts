import { flushPromises } from '@vue/test-utils'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { getMockedEntity, getMockedEntitySummary } from '@pulse/common/mocks'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { getAccountSignatories, updateSignatoryStatus } from '@entities/services/account'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { displayNotification } from '@pulse/styleguide'
import { UserActions } from '@entities/enums'
import { useAccountSignatories } from './account-signatories.composable'
import type { AccountSignatories } from '@entities/services/account/account.type'
import type { User } from '@entities/types'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))
vi.mock('@pulse/styleguide')
vi.mock('@pulse/common/services/amplitude')
vi.mock('@entities/services/account')

const ACCOUNT_ID = 123
const entitySummaryMock = getMockedEntitySummary(getMockedEntity({ accountId: ACCOUNT_ID }))

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const refreshUsers = vi.fn(() => Promise.resolve())

const createComposable = () => useAccountSignatories({ refreshUsers })

const buildUser = (overrides: Partial<User> = {}): User => ({
  contactId: 188,
  fullName: 'Test User',
  email: 'test@test.fr',
  isSignatory: false,
  ...overrides,
} as User)

// hasMultipleSignatories only cares about the list length
const buildSignatories = (count: number): AccountSignatories[] =>
  Array.from({ length: count }, () => ({}) as AccountSignatories)

describe('useAccountSignatories', () => {
  beforeEach(() => {
    currentEntityStoreMock.currentEntity = entitySummaryMock
    refreshUsers.mockClear()
    vi.mocked(getAccountSignatories).mockResolvedValue([])
    vi.mocked(updateSignatoryStatus).mockResolvedValue(undefined as never)
    vi.mocked(displayNotification).mockClear()
    vi.mocked(AmplitudeService.track).mockClear()
  })

  describe('loadAccountSignatories', () => {
    it('fetches the signatories of the current entity', async () => {
      vi.mocked(getAccountSignatories).mockResolvedValue(buildSignatories(2))

      const { loadAccountSignatories } = createComposable()
      await loadAccountSignatories()

      expect(getAccountSignatories).toHaveBeenCalledWith(ACCOUNT_ID)
    })

    it('does nothing when there is no current entity', async () => {
      currentEntityStoreMock.currentEntity = undefined

      const { loadAccountSignatories } = createComposable()
      await loadAccountSignatories()

      expect(getAccountSignatories).not.toHaveBeenCalled()
    })
  })

  describe('getSignatoryToolboxItems', () => {
    it('returns the assign item for a non-signatory user', () => {
      const { getSignatoryToolboxItems } = createComposable()

      expect(getSignatoryToolboxItems(buildUser({ isSignatory: false }))).toEqual([
        {
          pIconName: 'patchCheck',
          pValue: 'entities.users.signatory.assign',
          pActionName: UserActions.ASSIGN_SIGNATORY,
          pState: 'default',
        },
      ])
    })

    it('returns a disabled remove item with a tooltip when the user is the only signatory', async () => {
      vi.mocked(getAccountSignatories).mockResolvedValue(buildSignatories(1))

      const { loadAccountSignatories, getSignatoryToolboxItems } = createComposable()
      await loadAccountSignatories()

      expect(getSignatoryToolboxItems(buildUser({ isSignatory: true }))).toEqual([
        {
          pIconName: 'patchCheck',
          pValue: 'entities.users.signatory.remove',
          pActionName: UserActions.UNASSIGN_SIGNATORY,
          pState: 'default',
          disabled: true,
          pContentTooltip: 'entities.users.signatory.deleteTooltip',
        },
      ])
    })

    it('returns an enabled remove item when there are several signatories', async () => {
      vi.mocked(getAccountSignatories).mockResolvedValue(buildSignatories(2))

      const { loadAccountSignatories, getSignatoryToolboxItems } = createComposable()
      await loadAccountSignatories()

      expect(getSignatoryToolboxItems(buildUser({ isSignatory: true }))).toEqual([
        {
          pIconName: 'patchCheck',
          pValue: 'entities.users.signatory.remove',
          pActionName: UserActions.UNASSIGN_SIGNATORY,
          pState: 'default',
          disabled: false,
          pContentTooltip: undefined,
        },
      ])
    })
  })

  describe('handleSignatoryAction', () => {
    it('ignores unrelated actions', () => {
      const { handleSignatoryAction } = createComposable()

      expect(handleSignatoryAction(UserActions.MODIFY_RIGHTS, buildUser())).toBe(false)
    })

    it('assigns a signatory and refreshes the data', async () => {
      const user = buildUser({ contactId: 188, fullName: 'John Doe', email: 'john@test.fr' })
      const { handleSignatoryAction } = createComposable()

      const handled = handleSignatoryAction(UserActions.ASSIGN_SIGNATORY, user)
      await flushPromises()

      expect(handled).toBe(true)
      expect(updateSignatoryStatus).toHaveBeenCalledWith(ACCOUNT_ID, 188, true)
      expect(refreshUsers).toHaveBeenCalled()
      expect(getAccountSignatories).toHaveBeenCalled()
      expect(displayNotification).toHaveBeenCalled()
      expect(AmplitudeService.track).toHaveBeenCalledWith('Signatory Updated', {
        signatory_status_after_update: 'On',
        signatory_target_mail: 'john@test.fr',
      })
    })

    it('unassigns a signatory and refreshes the data', async () => {
      const user = buildUser({ contactId: 188, email: 'john@test.fr', isSignatory: true })
      const { handleSignatoryAction } = createComposable()

      const handled = handleSignatoryAction(UserActions.UNASSIGN_SIGNATORY, user)
      await flushPromises()

      expect(handled).toBe(true)
      expect(updateSignatoryStatus).toHaveBeenCalledWith(ACCOUNT_ID, 188, false)
      expect(displayNotification).toHaveBeenCalled()
      expect(AmplitudeService.track).toHaveBeenCalledWith('Signatory Updated', {
        signatory_status_after_update: 'Off',
        signatory_target_mail: 'john@test.fr',
      })
    })

    it('shows a technical error and does not refresh when the update fails', async () => {
      vi.mocked(updateSignatoryStatus).mockRejectedValue(new Error('boom'))

      const { handleSignatoryAction } = createComposable()
      handleSignatoryAction(UserActions.ASSIGN_SIGNATORY, buildUser())
      await flushPromises()

      expect(displayNotification).toHaveBeenCalled()
      expect(refreshUsers).not.toHaveBeenCalled()
    })
  })
})
