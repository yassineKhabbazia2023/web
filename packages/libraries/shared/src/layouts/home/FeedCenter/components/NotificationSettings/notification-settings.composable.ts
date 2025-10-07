import { computed, ref, onMounted } from 'vue'
import { getNotificationSettings } from '../../services/notifications.service'
import type { NotificationSettingsConfiguration } from '../../types/notification.type'
import { SettingsType } from '../../feed-center.enum'
import type { UpdateSettingsParams } from './notification-settings.types'
import { logger } from '@pulse/core'

export function useNotificationSettings() {
  const notificationSettings = ref<NotificationSettingsConfiguration>()

  const areSettingsLoading = ref(false)

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
    },
  })

  const settingsByDomain = computed(() => notificationSettings.value?.domainSettings ?? [])

  function handleDomainSettingsSwitch(isEnabled: boolean, domainIndex: number) {
    const concernedDomain = notificationSettings.value?.domainSettings.at(domainIndex)
    if (concernedDomain === undefined) {
      return
    }

    concernedDomain.settings.forEach((setting) => {
      if (setting.feedcenterValue !== null) {
        setting.feedcenterValue = isEnabled
      }
      if (setting.emailValue !== null) {
        setting.emailValue = isEnabled
      }
    })
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
  }

  return {
    areSettingsLoading,
    hasOnlyFavouritesDisplayed,
    handleDomainSettingsSwitch,
    notificationSettings,
    settingsByDomain,
    updateSetting,
  }
}
