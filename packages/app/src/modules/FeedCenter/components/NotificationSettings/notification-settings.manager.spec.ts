import { describe, it, expect, vi } from 'vitest'
import { PNotification } from '@pulse/styleguide'
import { i18n } from '@pulse/common/i18n'
import { saveNotificationSettings } from '@app/modules/FeedCenter/services/notifications.service'
import type { NotificationDomainSettings } from '@app/modules/FeedCenter/types/notification.type'
import { NotificationSettingsManager } from './notification-settings.manager'
import {
  getNotificationSettingsWithTrueAndNull,
  getNotificationSettingsWithTrueAndFalse,
  getNotificationSettingsWithTrueFalseAndNull,
  getDomainNotificationSettingsWithTrueAndFalse,
  getDomainNotificationSettingsWithTrueAndNull,
  getMultipleDomainNotificationSettings,
  getEmptyDomainNotificationSettings,
  getNotificationSettingsWithFalseAndNull,
} from '@app/__mocks__/notification-settings.mocks'

vi.mock('@app/modules/FeedCenter/services/notifications.service')
vi.mock('@pulse/styleguide')
vi.mock('@pulse/common/i18n', () => ({
  i18n: {
    global: {
      t: vi.fn(),
    },
  },
}))

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
      const settingsByDomain: NotificationDomainSettings[] = [
        getDomainNotificationSettingsWithTrueAndFalse(),
      ]
      const mockTranslation = 'Settings saved successfully'
      vi.mocked(i18n.global.t).mockReturnValue(mockTranslation)
      vi.mocked(saveNotificationSettings).mockResolvedValue(undefined)

      await NotificationSettingsManager.saveSettings(settingsByDomain)

      const expectedFormattedSettings = [
        {
          notificationDefinitionId: 1,
          feedCenterValue: true,
        },
        {
          notificationDefinitionId: 2,
          feedCenterValue: false,
        },
      ]

      expect(saveNotificationSettings).toHaveBeenCalledWith(expectedFormattedSettings)
      expect(PNotification).toHaveBeenCalledWith({
        message: mockTranslation,
        iconName: 'check',
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
      })
    })

    it('should display error notification when save fails', async () => {
      const settingsByDomain: NotificationDomainSettings[] = [
        getDomainNotificationSettingsWithTrueAndFalse(),
      ]
      const mockTranslation = 'An error occurred while saving settings'
      const mockError = new Error('Save failed')
      vi.mocked(i18n.global.t).mockReturnValue(mockTranslation)
      vi.mocked(saveNotificationSettings).mockRejectedValue(mockError)

      await NotificationSettingsManager.saveSettings(settingsByDomain)

      expect(PNotification).toHaveBeenCalledWith({
        message: mockTranslation,
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
      })
    })
  })

  describe('formatSettingsForSave', () => {
    it('should format notification domain settings for save correctly', () => {
      const settingsByDomain = getMultipleDomainNotificationSettings()

      const result = NotificationSettingsManager.formatSettingsForSave(settingsByDomain)

      expect(result).toEqual([
        {
          notificationDefinitionId: settingsByDomain[0].settings[0].id,
          feedCenterValue: true,
        },
        {
          notificationDefinitionId: settingsByDomain[0].settings[1].id,
          feedCenterValue: null,
        },
        {
          notificationDefinitionId: settingsByDomain[1].settings[0].id,
          feedCenterValue: false,
        },
      ])
    })

    it('should return empty array when no settings provided', () => {
      const settingsByDomain: NotificationDomainSettings[] = []

      const result = NotificationSettingsManager.formatSettingsForSave(settingsByDomain)

      expect(result).toEqual([])
    })

    it('should handle domains with empty settings array', () => {
      const settingsByDomain = getEmptyDomainNotificationSettings()

      const result = NotificationSettingsManager.formatSettingsForSave(settingsByDomain)

      expect(result).toEqual([])
    })

    it('should format single domain settings correctly', () => {
      const settingsByDomain = [getDomainNotificationSettingsWithTrueAndFalse()]

      const result = NotificationSettingsManager.formatSettingsForSave(settingsByDomain)

      expect(result).toEqual([
        {
          notificationDefinitionId: 1,
          feedCenterValue: true,
        },
        {
          notificationDefinitionId: 2,
          feedCenterValue: false,
        },
      ])
    })
  })

  describe('displaySaveSuccessNotification', () => {
    it('should display success notification with correct parameters', () => {
      const mockTranslation = 'Settings saved successfully'
      vi.mocked(i18n.global.t).mockReturnValue(mockTranslation)

      NotificationSettingsManager.displaySaveSuccessNotification()

      expect(i18n.global.t).toHaveBeenCalledWith('feedCenter.settingsDrawer.success')
      expect(PNotification).toHaveBeenCalledWith({
        message: mockTranslation,
        iconName: 'check',
        showClose: true,
        customClass: 'success',
        position: 'bottom-right',
      })
    })
  })

  describe('displaySaveErrorNotification', () => {
    it('should display error notification with correct parameters', () => {
      const mockTranslation = 'An error occurred while saving settings'
      vi.mocked(i18n.global.t).mockReturnValue(mockTranslation)

      NotificationSettingsManager.displaySaveErrorNotification()

      expect(i18n.global.t).toHaveBeenCalledWith('feedCenter.settingsDrawer.success')
      expect(PNotification).toHaveBeenCalledWith({
        message: mockTranslation,
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
      })
    })
  })
})
