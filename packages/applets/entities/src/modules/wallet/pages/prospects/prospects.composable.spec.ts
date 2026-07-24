import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import type { AxiosError } from 'axios'
import { withSetup } from '@pulse/toolbox/utils/test'
import { logger } from '@pulse/toolbox'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import { CurrentUserService } from '@pulse/common/services/current-user'
import { displayNotification } from '@pulse/styleguide'
import type { ProspectCreationPayload } from '@entities/modules/wallet/types'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { ProspectsManager } from './prospects.manager'
import { useProspects } from './prospects.composable'

const userStore = getStoreMock(useUserStore)

const displayNotificationMock = vi.mocked(displayNotification)

const prospectPayload = {} as ProspectCreationPayload

const defaultFetchResult = {
  items: [],
  currentPage: 0,
  totalItems: 0,
  totalPage: 0,
}

describe('useProspects', () => {
  beforeEach(() => {
    userStore.isCollab = false
    vi.spyOn(ProspectsManager, 'fetchProspectsData').mockResolvedValue(defaultFetchResult)
    vi.spyOn(CurrentUserService, 'getUserWalletInformation').mockResolvedValue(
      {} as unknown as Awaited<ReturnType<typeof CurrentUserService.getUserWalletInformation>>,
    )
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

  describe('openProspectCreationDrawer', () => {
    it('opens the prospect creation drawer', async () => {
      const [result, app] = withSetup(() => useProspects())
      await flushPromises()

      expect(result.isProspectCreationDrawerOpened.value).toBe(false)

      result.openProspectCreationDrawer()

      expect(result.isProspectCreationDrawerOpened.value).toBe(true)

      app.unmount()
    })
  })

  describe('onProspectCreationSubmit', () => {
    it('closes the drawer, notifies success and refetches when creation succeeds', async () => {
      vi.spyOn(ProspectsService, 'createProspect').mockResolvedValue()

      const [result, app] = withSetup(() => useProspects())
      await flushPromises()
      result.openProspectCreationDrawer()
      vi.mocked(ProspectsManager.fetchProspectsData).mockClear()

      await result.onProspectCreationSubmit(prospectPayload)

      expect(vi.mocked(ProspectsService.createProspect)).toHaveBeenCalledWith(prospectPayload)
      expect(result.isProspectCreationDrawerOpened.value).toBe(false)
      expect(result.isProspectSubmitting.value).toBe(false)
      expect(displayNotificationMock).toHaveBeenCalledWith('success', 'entities.wallet.prospectCreate.success')
      expect(vi.mocked(ProspectsManager.fetchProspectsData)).toHaveBeenCalledOnce()

      app.unmount()
    })

    it('displays the server errorMessage in the toaster on a 422 error', async () => {
      const serverMessage = 'Ce prospect existe déjà'
      vi.spyOn(ProspectsService, 'createProspect').mockRejectedValue({
        response: { status: 422, data: { errorMessage: serverMessage } },
      } as AxiosError)

      const [result, app] = withSetup(() => useProspects())
      await flushPromises()
      result.openProspectCreationDrawer()

      await result.onProspectCreationSubmit(prospectPayload)

      expect(displayNotificationMock).toHaveBeenCalledWith('error', serverMessage, 'bottom-right', 5000)
      expect(vi.mocked(logger.error)).not.toHaveBeenCalled()
      // Business error keeps the user on the still-open drawer
      expect(result.isProspectCreationDrawerOpened.value).toBe(true)
      expect(result.isProspectSubmitting.value).toBe(false)

      app.unmount()
    })

    it('falls back to the generic error message on a 422 without errorMessage', async () => {
      vi.spyOn(ProspectsService, 'createProspect').mockRejectedValue({
        response: { status: 422, data: {} },
      } as AxiosError)

      const [result, app] = withSetup(() => useProspects())
      await flushPromises()
      result.openProspectCreationDrawer()

      await result.onProspectCreationSubmit(prospectPayload)

      expect(displayNotificationMock).toHaveBeenCalledWith('error', 'entities.wallet.prospectCreate.error')
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(result.isProspectCreationDrawerOpened.value).toBe(true)

      app.unmount()
    })

    it('falls back to the generic error message on a non-422 error', async () => {
      vi.spyOn(ProspectsService, 'createProspect').mockRejectedValue({
        response: { status: 500, data: {} },
      } as AxiosError)

      const [result, app] = withSetup(() => useProspects())
      await flushPromises()
      result.openProspectCreationDrawer()

      await result.onProspectCreationSubmit(prospectPayload)

      expect(displayNotificationMock).toHaveBeenCalledWith('error', 'entities.wallet.prospectCreate.error')
      expect(vi.mocked(logger.error)).toHaveBeenCalled()
      expect(result.isProspectCreationDrawerOpened.value).toBe(true)

      app.unmount()
    })
  })
})
