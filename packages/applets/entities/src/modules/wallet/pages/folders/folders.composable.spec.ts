import { nextTick, reactive } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { logger } from '@pulse/toolbox'
import { withSetup } from '@pulse/toolbox/utils/test'
import { getStoreMock, isMobileMockRef } from '@pulse/common/mocks/vitest'
import { getMockedEntities } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'
import { fetchFavoriteEntities, manageFavoriteEntities } from '@entities/services/wallet'
import { getMockedMappedAccount, getMockedWalletQueryResult } from '@entities/__mocks__/deploy-utils.mocks'
import { EntityStatus } from '@entities/modules/wallet/enums'
import { fetchWalletData } from './FoldersUtils'
import { useFolders } from './folders.composable'
import { DESKTOP_FOLDERS_PAGE_SIZE, MOBILE_FOLDERS_PAGE_SIZE } from './folders.consts'

const userStoreMock = getStoreMock(useUserStore)
const fetchWalletDataMock = vi.mocked(fetchWalletData)
const fetchFavoriteEntitiesMock = vi.mocked(fetchFavoriteEntities)
const manageFavoriteEntitiesMock = vi.mocked(manageFavoriteEntities)

const routerReplaceMock = vi.fn()

const routeMock = reactive({
  name: RouteName.FOLDERS as string,
  query: {} as Record<string, string | string[] | undefined>,
})

const mountFolders = () => withSetup(() => useFolders())

describe('useFolders', () => {
  beforeEach(() => {
    routeMock.name = RouteName.FOLDERS
    routeMock.query = {}
    isMobileMockRef.value = false
    fetchWalletDataMock.mockResolvedValue(getMockedWalletQueryResult())
    fetchFavoriteEntitiesMock.mockResolvedValue([])
    manageFavoriteEntitiesMock.mockResolvedValue(undefined)
    vi.mocked(onBeforeRouteUpdate).mockImplementation(() => undefined)
    vi.mocked(useRouter).mockReturnValue({ replace: routerReplaceMock } as unknown as Router)
    vi.mocked(useRoute).mockImplementation(() => routeMock as unknown as RouteLocationNormalizedLoaded)
  })

  it('loads the folders and the favorites on mount', async () => {
    const mockedEntities = getMockedEntities()
    fetchFavoriteEntitiesMock.mockResolvedValueOnce(mockedEntities)

    const [{ isLoading, searchResult, totalAccounts }, app] = mountFolders()
    await flushPromises()

    expect(fetchWalletDataMock).toHaveBeenCalledOnce()
    expect(isLoading.value).toBe(false)
    expect(searchResult.value.items).toHaveLength(getMockedWalletQueryResult().items.length)
    expect(totalAccounts.value).toBe(searchResult.value.totalItems)
    expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledExactlyOnceWith(
      mockedEntities.map((entity) => ({ ...entity, color: 'persian' })),
    )

    app.unmount()
  })

  it('logs the error and stops loading when the fetch fails', async () => {
    fetchWalletDataMock.mockRejectedValueOnce(new Error('boom'))

    const [{ isLoading }, app] = mountFolders()
    await flushPromises()

    expect(vi.mocked(logger.error)).toHaveBeenCalledOnce()
    expect(isLoading.value).toBe(false)

    app.unmount()
  })

  it('binds the accountNumbers route query to the search without triggering an extra fetch', async () => {
    routeMock.query = { accountNumbers: ['100', '200'] }

    const [{ searchCriteria }, app] = mountFolders()
    await flushPromises()

    expect(searchCriteria.value.search).toBe('100')
    expect(routerReplaceMock).toHaveBeenCalledWith({ query: {} })
    expect(fetchWalletDataMock).toHaveBeenCalledOnce()

    app.unmount()
  })

  it('ignores an empty accountNumbers route query', async () => {
    routeMock.query = { accountNumbers: undefined }

    const [{ searchCriteria }, app] = mountFolders()
    await flushPromises()

    expect(searchCriteria.value.search).toBe('')
    expect(fetchWalletDataMock).toHaveBeenCalledOnce()

    app.unmount()
  })

  it('refetches from the first page when a search is submitted', async () => {
    const [{ handleSearchValueSubmitted }, app] = mountFolders()
    await flushPromises()

    handleSearchValueSubmitted('acme')
    await flushPromises()

    expect(fetchWalletDataMock).toHaveBeenCalledTimes(2)
    expect(fetchWalletDataMock).toHaveBeenNthCalledWith(2, expect.anything(), expect.objectContaining({
      currentPage: 1,
      search: 'acme',
    }))

    app.unmount()
  })

  it('appends the results when loading more', async () => {
    const firstFolder = getMockedMappedAccount({ accountId: 1, accountNumber: '1' })
    const secondFolder = getMockedMappedAccount({ accountId: 2, accountNumber: '2' })
    fetchWalletDataMock
      .mockResolvedValueOnce(getMockedWalletQueryResult({
        currentPage: 0,
        items: [firstFolder],
        totalItems: 2,
        totalPage: 2,
      }))
      .mockResolvedValueOnce(getMockedWalletQueryResult({
        currentPage: 1,
        items: [secondFolder],
        totalItems: 2,
        totalPage: 2,
      }))

    const [{ hasMoreResults, isLoadingMore, loadMoreResults, searchResult }, app] = mountFolders()
    await flushPromises()

    expect(hasMoreResults.value).toBe(true)

    loadMoreResults()
    await flushPromises()

    expect(searchResult.value.items).toStrictEqual([firstFolder, secondFolder])
    expect(isLoadingMore.value).toBe(false)
    expect(hasMoreResults.value).toBe(false)

    app.unmount()
  })

  it('does not load more when everything is already displayed', async () => {
    fetchWalletDataMock.mockResolvedValueOnce(getMockedWalletQueryResult({
      currentPage: 0,
      items: [getMockedMappedAccount({ accountId: 1 })],
      totalItems: 1,
      totalPage: 1,
    }))

    const [{ loadMoreResults }, app] = mountFolders()
    await flushPromises()

    loadMoreResults()
    await flushPromises()

    expect(fetchWalletDataMock).toHaveBeenCalledOnce()

    app.unmount()
  })

  it('refetches when the page range or the current page changes', async () => {
    const [{ handlePageRangeChanged, onUpdateCurrentPage }, app] = mountFolders()
    await flushPromises()

    handlePageRangeChanged(30)
    await flushPromises()

    expect(fetchWalletDataMock).toHaveBeenNthCalledWith(2, expect.anything(), expect.objectContaining({
      currentPage: 1,
      limit: 30,
    }))

    onUpdateCurrentPage(4)
    await flushPromises()

    expect(fetchWalletDataMock).toHaveBeenNthCalledWith(3, expect.anything(), expect.objectContaining({
      currentPage: 4,
    }))

    app.unmount()
  })

  it('resets every criterion but the deployment status', async () => {
    const [{ resetSearchCriteria, searchCriteria }, app] = mountFolders()
    await flushPromises()

    resetSearchCriteria(EntityStatus.TO_DEPLOY)
    await flushPromises()

    expect(searchCriteria.value).toStrictEqual({
      currentPage: 0,
      limit: DESKTOP_FOLDERS_PAGE_SIZE,
      filterByDeploymentStatus: [EntityStatus.TO_DEPLOY.toString()],
      sorting: {
        field: '',
        descending: false,
      },
    })

    app.unmount()
  })

  it('refreshes the folders and the favorites after a favorite toggle', async () => {
    const [{ handleAddFavorite }, app] = mountFolders()
    await flushPromises()

    await handleAddFavorite(12, true)

    expect(manageFavoriteEntitiesMock).toHaveBeenCalledExactlyOnceWith(12, true)
    expect(fetchWalletDataMock).toHaveBeenCalledTimes(2)

    app.unmount()
  })

  it('resets the pagination with the mobile page size when switching to mobile', async () => {
    const [{ searchCriteria }, app] = mountFolders()
    await flushPromises()

    isMobileMockRef.value = true
    await nextTick()

    expect(searchCriteria.value.limit).toBe(MOBILE_FOLDERS_PAGE_SIZE)
    expect(searchCriteria.value.currentPage).toBe(0)

    isMobileMockRef.value = false
    app.unmount()
  })
})
