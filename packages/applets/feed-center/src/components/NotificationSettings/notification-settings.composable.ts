import { computed, ref, onMounted } from 'vue'
import { getNotificationSettings } from '../../services/notifications.service'
import type { NotificationSettingsConfiguration } from '../../types/notification.type'
import { SettingsType } from '../../feed-center.enum'
import type { UpdateSettingsParams } from './notification-settings.types'
import { logger } from '@pulse/toolbox'

export function useNotificationSettings() {
  const notificationSettings = ref<NotificationSettingsConfiguration>()

  const areSettingsLoading = ref(false)
  const settingsModified = ref(false)

  onMounted(async () => {
    areSettingsLoading.value = true
    notificationSettings.value = await getNotificationSettings()

    // In order to make the transition between loading and content smoother
    setTimeout(() => {
      areSettingsLoading.value = false
    }, 400)
  })

  const hasOnlyFavouritesDisplayed = computed({
    get() {
      return notificationSettings.value?.preferenceSettings.hasOnlyFavouritesDisplayed
    },
    set(value: boolean) {
      if (notificationSettings.value === undefined) {
        return
      }
      notificationSettings.value.preferenceSettings.hasOnlyFavouritesDisplayed = value
      settingsModified.value = true
    },
  })

  const settingsByDomain = computed(() => notificationSettings.value?.domainSettings ?? [])

  function handleDomainSettingsSwitch(isEnabled: boolean, domainIndex: number) {
    const concernedDomain = notificationSettings.value?.domainSettings.at(domainIndex)
    if (concernedDomain === undefined) {
      return
    }

    for (const setting of concernedDomain.settings) {
      if (setting.feedcenterValue !== null) {
        setting.feedcenterValue = isEnabled
      }
      if (setting.emailValue !== null) {
        setting.emailValue = isEnabled
      }
    }

    settingsModified.value = true
  }

  function updateSetting(
    {
      isActivated,
      settingId,
      domainIndex,
      settingType,
    }: UpdateSettingsParams,
  ) {
    const domain = settingsByDomain.value.at(domainIndex)
    if (domain === undefined) {
      logger.error('domain to update is undefined')
      return
    }

    const settingToUpdate = domain.settings.find((setting) => setting.id === settingId)
    if (settingToUpdate === undefined) {
      return
    }

    if (settingType === SettingsType.EMAIL) {
      settingToUpdate.emailValue = isActivated

    }

    if (settingType === SettingsType.FEED_CENTER) {
      settingToUpdate.feedcenterValue = isActivated
    }

    settingsModified.value = true
  }

  // Mark settings as saved after successful save
  function markAsSaved() {
    settingsModified.value = false
  }

  return {
    areSettingsLoading,
    hasOnlyFavouritesDisplayed,
    handleDomainSettingsSwitch,
    notificationSettings,
    settingsByDomain,
    updateSetting,
    hasUnsavedChanges: settingsModified,
    markAsSaved,
  }
}
