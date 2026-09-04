import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import {
  fetchPendingDelegationRequests,
  acceptDelegationRequests,
  refuseDelegationRequests,
} from '@entities/services/account'
import { getMockedDelegationRequestApiItems } from '@entities/__mocks__/pending-requests.mocks'
import { usePendingRequests } from './pending-requests.composable'

const mockedItems = getMockedDelegationRequestApiItems()

describe('usePendingRequests', () => {
  beforeEach(() => {
    vi.mocked(fetchPendingDelegationRequests).mockResolvedValue({
      items: mockedItems,
      currentPage: 1,
      totalPage: 1,
      totalItems: 1,
    })
    vi.mocked(acceptDelegationRequests).mockResolvedValue({} as any)
    vi.mocked(refuseDelegationRequests).mockResolvedValue({} as any)
  })

  it('should load pending requests on mount', async () => {
    const [result, app] = withSetup(() => usePendingRequests())

    expect(result.isLoading.value).toBe(true)
    await flushPromises()

    expect(vi.mocked(fetchPendingDelegationRequests)).toHaveBeenCalledWith(1, expect.any(Number))
    expect(result.items.value).toHaveLength(1)
    expect(result.totalItems.value).toBe(1)
    expect(result.isLoading.value).toBe(false)

    app.unmount()
  })

  it('should reset the list when the fetch fails', async () => {
    vi.mocked(fetchPendingDelegationRequests).mockRejectedValueOnce(new Error('Fetch error'))

    const [result, app] = withSetup(() => usePendingRequests())
    await flushPromises()

    expect(result.items.value).toEqual([])
    expect(result.totalItems.value).toBe(0)

    app.unmount()
  })

  it('should change page, reset selection and refetch', async () => {
    const [result, app] = withSetup(() => usePendingRequests())
    await flushPromises()

    result.selectedIds.value = [1]
    await result.changePage(2)

    expect(result.currentPage.value).toBe(2)
    expect(result.selectedIds.value).toEqual([])
    expect(vi.mocked(fetchPendingDelegationRequests)).toHaveBeenCalledWith(2, expect.any(Number))

    app.unmount()
  })

  it('should change page size, reset to first page and refetch', async () => {
    const [result, app] = withSetup(() => usePendingRequests())
    await flushPromises()

    await result.changePageSize(30)

    expect(result.pageSize.value).toBe(30)
    expect(result.currentPage.value).toBe(1)
    expect(vi.mocked(fetchPendingDelegationRequests)).toHaveBeenCalledWith(1, 30)

    app.unmount()
  })

  it('should accept selected requests, clear selection and refresh', async () => {
    const [result, app] = withSetup(() => usePendingRequests())
    await flushPromises()

    result.selectedIds.value = [1]
    const acceptPromise = result.acceptSelected()
    expect(result.isAccepting.value).toBe(true)
    expect(result.isRefusing.value).toBe(false)
    await acceptPromise

    expect(vi.mocked(acceptDelegationRequests)).toHaveBeenCalledWith([1])
    expect(result.selectedIds.value).toEqual([])
    expect(vi.mocked(fetchPendingDelegationRequests)).toHaveBeenCalledTimes(2)
    expect(result.isAccepting.value).toBe(false)

    app.unmount()
  })

  it('should throw and reset isAccepting when accepting fails', async () => {
    vi.mocked(acceptDelegationRequests).mockRejectedValue(new Error('Accept error'))

    const [result, app] = withSetup(() => usePendingRequests())
    await flushPromises()

    result.selectedIds.value = [1]
    await expect(result.acceptSelected()).rejects.toThrow('Accept error')
    expect(result.isAccepting.value).toBe(false)

    app.unmount()
  })

  it('should refuse selected requests, clear selection and refresh', async () => {
    const [result, app] = withSetup(() => usePendingRequests())
    await flushPromises()

    result.selectedIds.value = [1]
    const refusePromise = result.refuseSelected()
    expect(result.isRefusing.value).toBe(true)
    expect(result.isAccepting.value).toBe(false)
    await refusePromise

    expect(vi.mocked(refuseDelegationRequests)).toHaveBeenCalledWith([1])
    expect(result.selectedIds.value).toEqual([])
    expect(result.isRefusing.value).toBe(false)

    app.unmount()
  })

  it('should throw and reset isRefusing when refusing fails', async () => {
    vi.mocked(refuseDelegationRequests).mockRejectedValue(new Error('Refuse error'))

    const [result, app] = withSetup(() => usePendingRequests())
    await flushPromises()

    result.selectedIds.value = [1]
    await expect(result.refuseSelected()).rejects.toThrow('Refuse error')
    expect(result.isRefusing.value).toBe(false)

    app.unmount()
  })

  it('should roll back to the previous page when it becomes empty after accepting', async () => {
    const [result, app] = withSetup(() => usePendingRequests())
    await flushPromises()

    await result.changePage(2)
    vi.mocked(fetchPendingDelegationRequests).mockResolvedValueOnce({
      items: [],
      currentPage: 2,
      totalPage: 1,
      totalItems: 1,
    })

    result.selectedIds.value = [1]
    await result.acceptSelected()

    expect(result.currentPage.value).toBe(1)
    expect(vi.mocked(fetchPendingDelegationRequests)).toHaveBeenLastCalledWith(1, expect.any(Number))

    app.unmount()
  })
})
