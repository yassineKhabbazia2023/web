import { ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { logger } from '@pulse/toolbox'
import { SortDirection } from '@pulse/common/enums'
import { getSeresInvoicesResponseMock } from './__mocks__/seres-invoices.mocks'
import { SeresInvoicesService } from './seres-invoices.service'
import { useSeresInvoices } from './seres-invoices.composable'
import type { SeresInvoicesResponse } from './seres-invoices.types'

const accountId = ref<number | null>(123)
const search = ref('')

const mountComposable = async () => {
  const [result] = withSetup(() => useSeresInvoices(accountId, search))
  await flushPromises()

  return result
}

describe('useSeresInvoices', () => {
  beforeEach(() => {
    accountId.value = 123
    search.value = ''
    vi.spyOn(SeresInvoicesService, 'fetchInvoices').mockResolvedValue(getSeresInvoicesResponseMock())
  })

  it('should load the first page on mount without any sorting', async () => {
    const result = await mountComposable()

    expect(vi.mocked(SeresInvoicesService.fetchInvoices)).toHaveBeenCalledWith(123, {
      page: 1,
      pageSize: 15,
      search: '',
      sortBy: '',
      sortOrder: null,
    })
    expect(result.isLoading.value).toBe(false)
    expect(result.invoices.value).toHaveLength(1)
    expect(result.totalItems.value).toBe(1)
  })

  it('should not call the service when the account id is unknown', async () => {
    accountId.value = null

    const result = await mountComposable()

    expect(vi.mocked(SeresInvoicesService.fetchInvoices)).not.toHaveBeenCalled()
    expect(result.invoices.value).toEqual([])
    expect(result.isLoading.value).toBe(false)
  })

  it('should reload the current page when the page changes', async () => {
    const result = await mountComposable()

    await result.onUpdateCurrentPage(3)

    expect(result.currentPage.value).toBe(3)
    expect(vi.mocked(SeresInvoicesService.fetchInvoices)).toHaveBeenLastCalledWith(
      123,
      expect.objectContaining({ page: 3 }),
    )
  })

  it('should reset to the first page when the page size changes', async () => {
    const result = await mountComposable()
    await result.onUpdateCurrentPage(3)

    await result.onPageRangeChanged(30)

    expect(result.currentPage.value).toBe(1)
    expect(vi.mocked(SeresInvoicesService.fetchInvoices)).toHaveBeenLastCalledWith(
      123,
      expect.objectContaining({ page: 1, pageSize: 30 }),
    )
  })

  it('should reset to the first page and refetch when the search query changes', async () => {
    const result = await mountComposable()
    await result.onUpdateCurrentPage(2)

    search.value = 'FAC-2026'
    await flushPromises()

    expect(result.currentPage.value).toBe(1)
    expect(vi.mocked(SeresInvoicesService.fetchInvoices)).toHaveBeenLastCalledWith(
      123,
      expect.objectContaining({ page: 1, search: 'FAC-2026' }),
    )
  })

  it('should apply the requested sorting and go back to the first page', async () => {
    const result = await mountComposable()
    await result.onUpdateCurrentPage(2)

    await result.onSortChange({ column: null, prop: 'invoiceYear', order: SortDirection.ASCENDING })

    expect(vi.mocked(SeresInvoicesService.fetchInvoices)).toHaveBeenLastCalledWith(
      123,
      expect.objectContaining({ sortBy: 'invoiceYear', sortOrder: SortDirection.ASCENDING, page: 1 }),
    )
  })

  it('should drop the sort order when the table clears its sorting', async () => {
    const result = await mountComposable()
    await result.onSortChange({ column: null, prop: 'invoiceYear', order: SortDirection.ASCENDING })

    await result.onSortChange({ column: null, prop: 'invoiceYear', order: null })

    expect(vi.mocked(SeresInvoicesService.fetchInvoices)).toHaveBeenLastCalledWith(
      123,
      expect.objectContaining({ sortOrder: null }),
    )
  })

  it('should ignore an outdated response when a newer request has been sent', async () => {
    const result = await mountComposable()
    let resolveOutdatedFetch: (response: SeresInvoicesResponse) => void = () => undefined
    vi.mocked(SeresInvoicesService.fetchInvoices).mockImplementationOnce(
      () => new Promise((resolve) => {
        resolveOutdatedFetch = resolve
      }),
    )

    const outdatedLoad = result.onUpdateCurrentPage(2)
    const latestLoad = result.onUpdateCurrentPage(3)
    await latestLoad
    resolveOutdatedFetch(getSeresInvoicesResponseMock({ items: [], totalItems: 0 }))
    await outdatedLoad

    expect(result.invoices.value).toHaveLength(1)
    expect(result.totalItems.value).toBe(1)
  })

  it('should empty the list and log the error when the fetch fails', async () => {
    vi.mocked(SeresInvoicesService.fetchInvoices).mockRejectedValueOnce(new Error('boom'))

    const result = await mountComposable()

    expect(result.invoices.value).toEqual([])
    expect(result.totalItems.value).toBe(0)
    expect(result.isLoading.value).toBe(false)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})
