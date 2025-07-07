import { PNotification } from '@pulse/styleguide'
import { i18n } from '@pulse/common/i18n'
import { logger } from '@pulse/core'
import type
{
  NotificationDomainSettings,
  NotificationSettingsConfiguration,
  NotificationSettingsSavePayload,
} from '@app/modules/FeedCenter/types/notification.type'
import { fetchNotifications, saveNotificationSettings } from '@app/modules/FeedCenter/services/notifications.service'
import { useFeedCenterStore } from '@app/modules/FeedCenter/stores/feed-center.store'

export class NotificationSettingsManager {
  static hasAtLeastOneSettingEnabled(domainSettings: NotificationDomainSettings['settings']) {
    return domainSettings.some((setting) =>
      setting.feedcenterValue === true || setting.emailValue === true,
    )
  }

  static hasDomainAtLeastOneDisabledSetting(domainSettings: NotificationDomainSettings) {
    return domainSettings.settings.some((setting) =>
      (setting.feedcenterValue !== null && setting.feedcenterValue === false) ||
      (setting.emailValue !== null && setting.emailValue === false),
    )
  }

  static async saveSettings(settingsConfiguration: NotificationSettingsConfiguration) {
    const formattedSettingsForSave = this.formatSettingsForSave(settingsConfiguration)

    try {
      await saveNotificationSettings(formattedSettingsForSave)
      await this.refreshNotification()
      this.displaySaveSuccessNotification()
    } catch (error) {
      this.displaySaveErrorNotification()
      logger.error(error)
    }
  }

  static formatSettingsForSave(
    settingsConfiguration: NotificationSettingsConfiguration,
  ): NotificationSettingsSavePayload {
    const domainSettings = settingsConfiguration.domainSettings.flatMap(domain =>
      domain.settings.map(setting => ({
        notificationDefinitionId: setting.id,
        feedCenterValue: setting.feedcenterValue,
      })),
    )

    return {
      domainSettings,
      preferenceSettings: {
        hasOnlyFavouritesDisplayed: settingsConfiguration.preferenceSettings.hasOnlyFavouritesDisplayed,
      },
    }
  }

  static async refreshNotification() {
    const feedCenterStore = useFeedCenterStore()
    try {
      const { notifications } = await fetchNotifications()
      feedCenterStore.setNotifications(notifications)
    } catch (error) {
      logger.error('failed to refresh notifications after save', error)
    }
  }

  static displaySaveSuccessNotification() {
    PNotification({
      message: i18n.global.t('feedCenter.settingsDrawer.success'),
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
  }

  static displaySaveErrorNotification() {
    PNotification({
      message: i18n.global.t('feedCenter.settingsDrawer.error'),
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    })
  }
}
