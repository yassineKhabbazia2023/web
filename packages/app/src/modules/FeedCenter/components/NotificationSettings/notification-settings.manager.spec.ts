import { describe, it, expect, vi } from 'vitest'
import { PNotification } from '@pulse/styleguide'
import { saveNotificationSettings, fetchNotifications } from '@app/modules/FeedCenter/services/notifications.service'
import { NotificationSettingsManager } from './notification-settings.manager'
import {
  getNotificationSettingsWithTrueAndNull,
  getNotificationSettingsWithTrueAndFalse,
  getNotificationSettingsWithTrueFalseAndNull,
  getDomainNotificationSettingsWithTrueAndFalse,
  getDomainNotificationSettingsWithTrueAndNull,
  getNotificationSettingsWithFalseAndNull,
  getNotificationSettingsConfiguration,
  getNotificationSettingsConfigurationWithFavourites,
  getEmptyNotificationSettingsConfiguration,
  getSingleDomainNotificationSettingsConfiguration,
} from '@app/__mocks__/notification-settings.mocks'
import { useFeedCenterStore } from '@app/modules/FeedCenter/stores/feed-center.store'
import { getStoreMock } from '@pulse/common/mocks'

getStoreMock(useFeedCenterStore)

vi.mock('@app/modules/FeedCenter/services/notifications.service')
vi.mock('@pulse/styleguide')

describe('NotificationSettingsManager', () => {
  describe('hasAtLeastOneSettingEnabled', () => {
    it.each([
      {
        description: 'should return true when at least one feedcenter setting is enabled',
        settings: getNotificationSettingsWithTrueAndFalse(),
        expected: true,
      },
      {
        description: 'should return true when at least one email setting is enabled',
        settings: getNotificationSettingsWithTrueAndNull(),
        expected: true,
      },
      {
        description: 'should return true when both feedcenter and email settings are enabled',
        settings: getNotificationSettingsWithTrueFalseAndNull(),
        expected: true,
      },
      {
        description: 'should return false when all settings are disabled or null',
        settings: getNotificationSettingsWithFalseAndNull(),
        expected: false,
      },
    ])('$description', ({ settings, expected }) => {
      expect(NotificationSettingsManager.hasAtLeastOneSettingEnabled(settings)).toBe(expected)
    })
  })

  describe('hasDomainAtLeastOneDisabledSetting', () => {
    it.each([
      {
        description: 'should return true when at least one setting is explicitly disabled',
        domainSettings: getDomainNotificationSettingsWithTrueAndFalse(),
        expected: true,
      },
      {
        description: 'should return false when all settings are enabled or null',
        domainSettings: getDomainNotificationSettingsWithTrueAndNull(),
        expected: false,
      },
    ])('$description', ({ domainSettings, expected }) => {
      expect(NotificationSettingsManager.hasDomainAtLeastOneDisabledSetting(domainSettings)).toBe(expected)
    })
  })

  describe('saveSettings', () => {
    it('should call saveNotificationSettings with formatted settings and display success notification', async () => {
      const settingsConfiguration = getSingleDomainNotificationSettingsConfiguration()
      vi.mocked(saveNotificationSettings).mockResolvedValue(undefined)
      vi.mocked(fetchNotifications).mockResolvedValue({ notifications: [] })

      await NotificationSettingsManager.saveSettings(settingsConfiguration)

      const expectedFormattedSettings = {
        domainSettings: [
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[0].settings[0].id,
            feedcenterValue: settingsConfiguration.domainSettings[0].settings[0].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[0].settings[0].emailValue,
          },
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[0].settings[1].id,
            feedcenterValue: settingsConfiguration.domainSettings[0].settings[1].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[0].settings[1].emailValue,
          },
        ],
        preferenceSettings: {
          hasOnlyFavouritesDisplayed: settingsConfiguration.preferenceSettings.hasOnlyFavouritesDisplayed,
        },
      }

      expect(saveNotificationSettings).toHaveBeenCalledWith(expectedFormattedSettings)
      expect(PNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          iconName: 'check',
          showClose: true,
          customClass: 'success',
          position: 'bottom-right',
        }),
      )
    })

    it('should display error notification when save fails', async () => {
      const settingsConfiguration = getSingleDomainNotificationSettingsConfiguration()
      const mockError = new Error('Save failed')
      vi.mocked(saveNotificationSettings).mockRejectedValue(mockError)

      await NotificationSettingsManager.saveSettings(settingsConfiguration)

      expect(PNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          iconName: 'exclamationTriangle',
          showClose: true,
          customClass: 'error',
          position: 'bottom-right',
        }),
      )
    })
  })

  describe('formatSettingsForSave', () => {
    it('should format notification settings configuration for save correctly', () => {
      const settingsConfiguration = getNotificationSettingsConfiguration()
      const result = NotificationSettingsManager.formatSettingsForSave(settingsConfiguration)

      const expectedResult = {
        domainSettings: [
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[0].settings[0].id,
            feedcenterValue: settingsConfiguration.domainSettings[0].settings[0].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[0].settings[0].emailValue,
          },
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[0].settings[1].id,
            feedcenterValue: settingsConfiguration.domainSettings[0].settings[1].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[0].settings[1].emailValue,
          },
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[1].settings[0].id,
            feedcenterValue: settingsConfiguration.domainSettings[1].settings[0].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[1].settings[0].emailValue,
          },
        ],
        preferenceSettings: {
          hasOnlyFavouritesDisplayed: settingsConfiguration.preferenceSettings.hasOnlyFavouritesDisplayed,
        },
      }

      expect(result).toEqual(expectedResult)
    })

    it('should format settings configuration with favourites preference correctly', () => {
      const settingsConfiguration = getNotificationSettingsConfigurationWithFavourites()
      const result = NotificationSettingsManager.formatSettingsForSave(settingsConfiguration)

      const expectedResult = {
        domainSettings: [
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[0].settings[0].id,
            feedcenterValue: settingsConfiguration.domainSettings[0].settings[0].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[0].settings[0].emailValue,
          },
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[0].settings[1].id,
            feedcenterValue: settingsConfiguration.domainSettings[0].settings[1].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[0].settings[1].emailValue,
          },
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[1].settings[0].id,
            feedcenterValue: settingsConfiguration.domainSettings[1].settings[0].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[1].settings[0].emailValue,
          },
        ],
        preferenceSettings: {
          hasOnlyFavouritesDisplayed: settingsConfiguration.preferenceSettings.hasOnlyFavouritesDisplayed,
        },
      }

      expect(result).toEqual(expectedResult)
    })

    it('should return empty domain settings when no settings provided', () => {
      const settingsConfiguration = getEmptyNotificationSettingsConfiguration()
      const result = NotificationSettingsManager.formatSettingsForSave(settingsConfiguration)

      const expectedResult = {
        domainSettings: [],
        preferenceSettings: {
          hasOnlyFavouritesDisplayed: settingsConfiguration.preferenceSettings.hasOnlyFavouritesDisplayed,
        },
      }

      expect(result).toEqual(expectedResult)
    })

    it('should format single domain settings correctly', () => {
      const settingsConfiguration = getSingleDomainNotificationSettingsConfiguration()
      const result = NotificationSettingsManager.formatSettingsForSave(settingsConfiguration)

      const expectedResult = {
        domainSettings: [
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[0].settings[0].id,
            feedcenterValue: settingsConfiguration.domainSettings[0].settings[0].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[0].settings[0].emailValue,
          },
          {
            notificationDefinitionId: settingsConfiguration.domainSettings[0].settings[1].id,
            feedcenterValue: settingsConfiguration.domainSettings[0].settings[1].feedcenterValue,
            emailValue: settingsConfiguration.domainSettings[0].settings[1].emailValue,
          },
        ],
        preferenceSettings: {
          hasOnlyFavouritesDisplayed: settingsConfiguration.preferenceSettings.hasOnlyFavouritesDisplayed,
        },
      }

      expect(result).toEqual(expectedResult)
    })
  })

  describe('displaySaveSuccessNotification', () => {
    it('should display success notification with correct parameters', () => {
      NotificationSettingsManager.displaySaveSuccessNotification()

      expect(PNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          iconName: 'check',
          showClose: true,
          customClass: 'success',
          position: 'bottom-right',
        }),
      )
    })
  })

  describe('displaySaveErrorNotification', () => {
    it('should display error notification with correct parameters', () => {
      NotificationSettingsManager.displaySaveErrorNotification()

      expect(PNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          iconName: 'exclamationTriangle',
          showClose: true,
          customClass: 'error',
          position: 'bottom-right',
        }),
      )
    })
  })
})
