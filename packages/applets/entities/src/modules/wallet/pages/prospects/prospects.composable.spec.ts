import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { ProspectsManager } from './prospects.manager'
import { useProspects } from './prospects.composable'

vi.mock('./prospects.manager')
vi.mock('@pulse/common/services/current-user')
vi.mock('@pulse/styleguide', () => ({
  useResponsive: () => ({ isMobile: { value: false }, isDesktop: { value: true } }),
}))
vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (key: string) => key }),
}))

const userStore = getStoreMock(useUserStore)

const defaultFetchResult = {
  items: [],
  currentPage: 0,
  totalItems: 0,
  totalPage: 0,
}

describe('useProspects', () => {
  beforeEach(() => {
    userStore.isCollab = false
    vi.mocked(ProspectsManager.fetchProspectsData).mockResolvedValue(defaultFetchResult)
    vi.mocked(CurrentUserService.getUserWalletInformation).mockResolvedValue({} as any)
  })

  it('fetches prospects on mount', async () => {
    const [, app] = withSetup(() => useProspects())
    await flushPromises()

    expect(vi.mocked(ProspectsManager.fetchProspectsData)).toHaveBeenCalledOnce()

    app.unmount()
  })

  it('sets isLoading to false after fetch completes', async () => {
    const [result, app] = withSetup(() => useProspects())
    await flushPromises()

    expect(result.isLoading.value).toBe(false)

    app.unmount()
  })

  it('updates searchResult with fetched data', async () => {
    const mockResult = {
      items: [{ accountId: 1, name: 'Test' }],
      currentPage: 1,
      totalItems: 1,
      totalPage: 1,
    }
    vi.mocked(ProspectsManager.fetchProspectsData).mockResolvedValue(mockResult as any)

    const [result, app] = withSetup(() => useProspects())
    await flushPromises()

    expect(result.searchResult.value.items).toHaveLength(1)
    expect(result.searchResult.value.totalItems).toBe(1)

    app.unmount()
  })

  it('handleSearchValueSubmitted resets page to 1 and sets search', async () => {
    const [result, app] = withSetup(() => useProspects())
    await flushPromises()

    result.handleSearchValueSubmitted('test')

    expect(result.searchCriteria.value.currentPage).toBe(1)
    expect(result.searchCriteria.value.search).toBe('test')

    app.unmount()
  })

  it('handlePageRangeChanged resets page to 1 and updates limit', async () => {
    const [result, app] = withSetup(() => useProspects())
    await flushPromises()

    result.handlePageRangeChanged(30)

    expect(result.searchCriteria.value.currentPage).toBe(1)
    expect(result.searchCriteria.value.limit).toBe(30)

    app.unmount()
  })

  it('onUpdateCurrentPage updates searchCriteria.currentPage', async () => {
    const [result, app] = withSetup(() => useProspects())
    await flushPromises()

    result.onUpdateCurrentPage(3)

    expect(result.searchCriteria.value.currentPage).toBe(3)

    app.unmount()
  })

  it('refetches when searchCriteria changes', async () => {
    const [result, app] = withSetup(() => useProspects())
    await flushPromises()

    vi.mocked(ProspectsManager.fetchProspectsData).mockClear()

    result.searchCriteria.value.currentPage = 2
    await nextTick()
    await flushPromises()

    expect(vi.mocked(ProspectsManager.fetchProspectsData)).toHaveBeenCalledOnce()

    app.unmount()
  })
})
