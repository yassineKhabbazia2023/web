import type { NotificationDomainSettings } from '@app/modules/FeedCenter/types/notification.type'
import { saveNotificationSettings } from '@app/modules/FeedCenter/services/notifications.service'
import { PNotification } from '@pulse/styleguide'
import { i18n } from '@pulse/common/i18n'
import { logger } from '@pulse/core'

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

  static async saveSettings(settingsByDomain: NotificationDomainSettings[]) {
    const formattedSettings = this.formatSettingsForSave(settingsByDomain)

    try {
      await saveNotificationSettings(formattedSettings)
      this.displaySaveSuccessNotification()
    } catch (error) {
      this.displaySaveErrorNotification()
      logger.error(error)
    }
  }

  static formatSettingsForSave(notificationDomainSettings: NotificationDomainSettings[]) {
    return notificationDomainSettings.flatMap(domain =>
      domain.settings.map(setting => ({
        notificationDefinitionId: setting.id,
        feedCenterValue: setting.feedcenterValue,
      })),
    )
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
      message: i18n.global.t('feedCenter.settingsDrawer.success'),
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    })
  }
}
