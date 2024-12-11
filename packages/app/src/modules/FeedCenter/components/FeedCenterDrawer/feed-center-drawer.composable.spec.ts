import { vi, describe, it, expect } from 'vitest'
import { computed, nextTick, ref } from 'vue'
import { flushPromises } from '@vue/test-utils'
import { useFeedCenterDrawer } from './feed-center-drawer.composable'
import { fetchNotificationsMock } from '@app/../vitest.setup'

function initializeTestState(initialDrawervalue = false) {
  const unreadNotificationsCount = ref(0)
  const drawerOpenedValue = ref(initialDrawervalue)
  const isDrawerOpened = computed({
    get: () => drawerOpenedValue.value,
    set: (value: boolean) => {
      drawerOpenedValue.value = value
    },
  })

  return { unreadNotificationsCount, isDrawerOpened, drawerOpenedValue }
}

const loggerDebugSpy = vi.hoisted(() => vi.fn())
const loggerWarnSpy = vi.hoisted(() => vi.fn())
const loggerErrorSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/core', () => ({
  logger: {
    debug: loggerDebugSpy,
    warn: loggerWarnSpy,
    error: loggerErrorSpy,
  },
}))

describe('feed center drawer composable', () => {
  it('should fetch notifications when drawer is being opened', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState()

    useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount)
    expect(fetchNotificationsMock).not.toHaveBeenCalled()
    isDrawerOpened.value = true
    await flushPromises()
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
  })

  it('should NOT fetch notification when drawer is being closed', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount)
    isDrawerOpened.value = false
    await flushPromises()
    expect(fetchNotificationsMock).not.toHaveBeenCalled()
  })

  it('should log error when fetch fails', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState()
    
    fetchNotificationsMock.mockRejectedValueOnce({ error: 'error' })

    useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount)
    expect(fetchNotificationsMock).not.toHaveBeenCalled()
    isDrawerOpened.value = true
    await flushPromises()
    expect(loggerErrorSpy).toHaveBeenCalledOnce()
  })

  it('should fetch notifications if unread notifiactions value changes while drawer is opened', async () => {
    const { unreadNotificationsCount, isDrawerOpened } = initializeTestState(true)

    useFeedCenterDrawer(isDrawerOpened, unreadNotificationsCount)
    unreadNotificationsCount.value = 2
    await flushPromises()
    await nextTick()
    expect(fetchNotificationsMock).toHaveBeenCalledOnce()
  })
})
