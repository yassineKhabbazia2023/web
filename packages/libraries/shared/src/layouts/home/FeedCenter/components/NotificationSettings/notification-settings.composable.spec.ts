import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useNotificationSettings } from './notification-settings.composable'
import { getNotificationSettings } from '../../services/notifications.service'
import type { NotificationSettingsConfiguration } from '../../types/notification.type'
import { SettingsType } from '../../feed-center.enum'
import {
  getDomainNotificationSettingsWithTrueAndFalse,
  getDomainNotificationSettingsWithTrueFalseAndNull,
  getDomainNotificationSettingsAfterEnableAll,
  getDomainNotificationSettingsAfterDisableAll,
  getDomainNotificationSettingsAfterEnableAllWithNulls,
} from '../../__mocks__/notification-settings.mocks'

vi.mock('../../services/notifications.service')

const mockNotificationSettings: NotificationSettingsConfiguration = {
  domainSettings: [
    getDomainNotificationSettingsWithTrueAndFalse(),
    getDomainNotificationSettingsWithTrueFalseAndNull(),
  ],
  preferenceSettings: {
    hasOnlyFavouritesDisplayed: false,
  },
}

describe('useNotificationSettings', () => {
  let app: any

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getNotificationSettings).mockResolvedValue(mockNotificationSettings)
  })

  // In order to unmount the composable and reset the mock state between tests
  afterEach(() => {
    if (app) {
      app.unmount()
      app = null
    }
  })

  describe('initialization', () => {
    it('should initialize with empty settings and loading state true', async () => {
      vi.useFakeTimers()

      const [{ settingsByDomain, areSettingsLoading }, appInstance] = withSetup(() => useNotificationSettings())
      app = appInstance

      expect(areSettingsLoading.value).toBe(true)
      expect(getNotificationSettings).toHaveBeenCalledOnce()

      await flushPromises()

      expect(settingsByDomain.value).toEqual(mockNotificationSettings.domainSettings)
      expect(areSettingsLoading.value).toBe(true)

      vi.advanceTimersByTime(400)
      await flushPromises()

      expect(areSettingsLoading.value).toBe(false)

      vi.useRealTimers()
    })
  })

  describe('hasOnlyFavouritesDisplayed', () => {
    it.each([
      {
        description: 'should get and set the correct value when notification settings are loaded',
        mockSettings: mockNotificationSettings,
        expectedInitialValue: false,
        newValue: true,
        expectedFinalValue: true,
      },
      {
        description: 'should return undefined and not update when notification settings are not loaded',
        mockSettings: undefined as any,
        expectedInitialValue: undefined,
        newValue: true,
        expectedFinalValue: undefined,
      },
    ])('$description', async ({ mockSettings, expectedInitialValue, newValue, expectedFinalValue }) => {
      vi.mocked(getNotificationSettings).mockResolvedValue(mockSettings)

      const [{ hasOnlyFavouritesDisplayed }, appInstance] = withSetup(() => useNotificationSettings())
      app = appInstance

      await flushPromises()

      // Test getter
      expect(hasOnlyFavouritesDisplayed.value).toBe(expectedInitialValue)

      // Test setter
      hasOnlyFavouritesDisplayed.value = newValue

      expect(hasOnlyFavouritesDisplayed.value).toBe(expectedFinalValue)
    })
  })

  describe('handleDomainSettingsSwitch', () => {
    it.each([
      {
        description: 'should enable all non-null settings when isEnabled is true',
        isEnabled: true,
        domainIndex: 0,
        expectedSettings: getDomainNotificationSettingsAfterEnableAll().settings,
      },
      {
        description: 'should disable all non-null settings when isEnabled is false',
        isEnabled: false,
        domainIndex: 0,
        expectedSettings: getDomainNotificationSettingsAfterDisableAll().settings,
      },
      {
        description: 'should enable settings while preserving existing behavior for domain with nulls',
        isEnabled: true,
        domainIndex: 1,
        expectedSettings: getDomainNotificationSettingsAfterEnableAllWithNulls().settings,
      },
    ])('$description', async ({ isEnabled, domainIndex, expectedSettings }) => {
      const [{ handleDomainSettingsSwitch, settingsByDomain }, appInstance] = withSetup(
        () => useNotificationSettings(),
      )
      app = appInstance

      await flushPromises()

      handleDomainSettingsSwitch(isEnabled, domainIndex)

      expect(settingsByDomain.value[domainIndex].settings).toEqual(expectedSettings)
    })

    it('should do nothing when domain index is out of bounds', async () => {
      const [{ handleDomainSettingsSwitch, settingsByDomain }, appInstance] = withSetup(
        () => useNotificationSettings(),
      )
      app = appInstance

      await flushPromises()
      const originalSettings = JSON.parse(JSON.stringify(settingsByDomain.value))

      handleDomainSettingsSwitch(true, 999)

      expect(settingsByDomain.value).toEqual(originalSettings)
    })
  })

  describe('updateSetting', () => {
    it.each([
      {
        description: 'should update email setting when settingType is EMAIL',
        isActivated: true,
        settingId: 1,
        domainIndex: 0,
        settingType: SettingsType.EMAIL,
        expectedEmailValue: true,
        expectedFeedcenterValue: false,
      },
      {
        description: 'should update feedcenter setting when settingType is FEED_CENTER',
        isActivated: false,
        settingId: 1,
        domainIndex: 0,
        settingType: SettingsType.FEED_CENTER,
        expectedEmailValue: true,
        expectedFeedcenterValue: false,
      },
    ])('$description', async ({ isActivated, settingId, domainIndex, settingType, expectedEmailValue, expectedFeedcenterValue }) => {
      const [{ updateSetting, settingsByDomain }, appInstance] = withSetup(() => useNotificationSettings())
      app = appInstance

      await flushPromises()

      updateSetting({ isActivated, settingId, domainIndex, settingType })

      const updatedSetting = settingsByDomain.value[domainIndex].settings.find(s => s.id === settingId)
      expect(updatedSetting?.emailValue).toBe(expectedEmailValue)
      expect(updatedSetting?.feedcenterValue).toBe(expectedFeedcenterValue)
    })
  })
})
