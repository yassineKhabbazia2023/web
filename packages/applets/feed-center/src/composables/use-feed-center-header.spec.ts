import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import { withSetup } from '@pulse/toolbox/utils/test'
import { fetchUnreadNotificationsCountMock } from '../__mocks__/notification.service.mocks'
import { trackFeedcenterOpenedMock } from '../__mocks__/tracking.service.mocks'
import { UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL } from '../constants'
import { useFeedCenterHeader } from './use-feed-center-header'

describe('useFeedCenterHeader', () => {
  it('should fetch unread notifications count on mounted', async () => {
    fetchUnreadNotificationsCountMock.mockResolvedValueOnce({ count: 7 })

    const [{ unreadNotificationsCount }, app] = withSetup(() => useFeedCenterHeader())
    await flushPromises()

    expect(fetchUnreadNotificationsCountMock).toHaveBeenCalledOnce()
    expect(unreadNotificationsCount.value).toBe(7)

    app.unmount()
  })

  it('should fetch unread notifications count when feed center opens', async () => {
    fetchUnreadNotificationsCountMock
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 3 })

    const [{ isFeedCenterOpened, unreadNotificationsCount }, app] = withSetup(() => useFeedCenterHeader())
    await flushPromises()

    isFeedCenterOpened.value = true
    await nextTick()
    await flushPromises()

    expect(fetchUnreadNotificationsCountMock).toHaveBeenCalledTimes(2)
    expect(trackFeedcenterOpenedMock).toHaveBeenCalledOnce()
    expect(unreadNotificationsCount.value).toBe(3)

    app.unmount()
  })

  it('should refresh unread notifications count while page is visible', async () => {
    vi.useFakeTimers()
    fetchUnreadNotificationsCountMock
      .mockResolvedValueOnce({ count: 2 })
      .mockResolvedValueOnce({ count: 4 })
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible')

    const [{ unreadNotificationsCount }, app] = withSetup(() => useFeedCenterHeader())
    await flushPromises()

    vi.advanceTimersByTime(UNREAD_NOTIFICATIONS_COUNT_FETCH_INTERVAL)
    await flushPromises()

    expect(fetchUnreadNotificationsCountMock).toHaveBeenCalledTimes(2)
    expect(unreadNotificationsCount.value).toBe(4)

    app.unmount()
    vi.useRealTimers()
  })

  it('should log error when unread notifications count fetch fails', async () => {
    fetchUnreadNotificationsCountMock.mockRejectedValueOnce({ error: 'error' })

    const [_result, app] = withSetup(() => useFeedCenterHeader())
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledWith('Notifications count fetch failed.', { error: 'error' })

    app.unmount()
  })
})
