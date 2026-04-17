import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { getMockedUserInfo } from '@pulse/common/mocks'
import { getMockedPermanentDelegationApiItems } from '@entities/__mocks__/permanent-delegations.mocks'
import { usePermanentDelegations } from './permanent-delegations.composable'
import { fetchPermanentDelegations, deleteAccountDelegation } from '@entities/services/account'

vi.mock('@entities/services/account')
vi.mock('@entities/managers/delegation-tracking/delegation-tracking.manager')

import { DelegationTrackingManager } from '@entities/managers/delegation-tracking/delegation-tracking.manager'

const userStoreMock = getStoreMock(useUserStore)
const userMock = getMockedUserInfo({ id: 42 })
const delegationApiItems = getMockedPermanentDelegationApiItems()

const deleteSuccessResponse = {
  status: 200,
  data: {},
  statusText: 'OK',
  headers: {},
  config: {},
} as any

describe('usePermanentDelegations', () => {
  beforeEach(() => {
    userStoreMock.user = userMock
    vi.mocked(fetchPermanentDelegations).mockResolvedValue({
      items: delegationApiItems,
      currentPage: 1,
      totalPage: 1,
      totalItems: 2,
    })
    vi.mocked(deleteAccountDelegation).mockResolvedValue(deleteSuccessResponse)
  })

  it('should initialize with provided data', () => {
    const [result, app] = withSetup(() => usePermanentDelegations(delegationApiItems))

    expect(result.permanentDelegations.value).toHaveLength(2)
    expect(result.permanentDelegations.value[0].delegationId).toBe(100)
    expect(result.permanentDelegations.value[1].delegationId).toBe(200)
    expect(result.isLoading.value).toBe(false)

    app.unmount()
  })

  it('should initialize with empty array when no data provided', () => {
    const [result, app] = withSetup(() => usePermanentDelegations([]))

    expect(result.permanentDelegations.value).toEqual([])

    app.unmount()
  })

  it('should remove a delegation and track success', async () => {
    const [result, app] = withSetup(() => usePermanentDelegations(delegationApiItems))

    const delegationToRemove = result.permanentDelegations.value[0]
    await result.removeDelegation(delegationToRemove)
    await flushPromises()

    expect(vi.mocked(deleteAccountDelegation)).toHaveBeenCalledWith(100, 42, 1)
    expect(vi.mocked(fetchPermanentDelegations)).toHaveBeenCalledOnce()
    expect(vi.mocked(DelegationTrackingManager.trackPermanentDeleteCompleted)).toHaveBeenCalledWith('succeeded')

    app.unmount()
  })

  it('should throw when user is not available', async () => {
    userStoreMock.user = null as any

    const [result, app] = withSetup(() => usePermanentDelegations(delegationApiItems))

    await expect(result.removeDelegation(result.permanentDelegations.value[0]))
      .rejects.toThrow('User not available')
    expect(vi.mocked(deleteAccountDelegation)).not.toHaveBeenCalled()

    app.unmount()
  })

  it('should throw and track failure on delete error', async () => {
    vi.mocked(deleteAccountDelegation).mockRejectedValueOnce(new Error('Delete error'))

    const [result, app] = withSetup(() => usePermanentDelegations(delegationApiItems))

    await expect(result.removeDelegation(result.permanentDelegations.value[0]))
      .rejects.toThrow('Delete error')
    expect(result.permanentDelegations.value).toHaveLength(2)
    expect(vi.mocked(DelegationTrackingManager.trackPermanentDeleteCompleted)).toHaveBeenCalledWith('failed')

    app.unmount()
  })

  it('should handle undefined API response after delete', async () => {
    vi.mocked(fetchPermanentDelegations).mockResolvedValue(undefined as any)

    const [result, app] = withSetup(() => usePermanentDelegations(delegationApiItems))

    await result.removeDelegation(result.permanentDelegations.value[0])
    await flushPromises()

    expect(result.permanentDelegations.value).toEqual([])

    app.unmount()
  })
})
