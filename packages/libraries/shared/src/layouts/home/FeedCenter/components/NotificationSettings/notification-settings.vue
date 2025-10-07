<template>
  <PDrawer
    v-model="isNotificationSettingsDrawerOpened"
    destroyOnClose
    :pTitle="t('feedCenter.settingsDrawer.title')"
    pSize="50%"
    @close-drawer-button="closeDrawer"
  >
    <template #header-suffix>
      <div class="text-color--neutral-gray-300 margin-top--2 width--100 ">
        {{ t('feedCenter.settingsDrawer.subTitle') }}
      </div>
    </template>
    <Transition mode="out-in">
      <div
        v-if="areSettingsLoading === false"
        class="margin-top--10"
      >
        <!-- FAVOURITE -->
        <div
          class="
          settings-drawer__favourite
          flex
          flex--align-items-center
          bg--neutral-gray-50
          border-radius--4
          padding--4
          margin-bottom--4
        "
        >
          <PSwitch v-model="hasOnlyFavouritesDisplayed" :pActiveColor="AppColors.PERSIAN_400" />
          <span class="text-color--neutral-gray-900 padding-left--4 font-semibold">
            {{ t('feedCenter.settingsDrawer.favouritesOnly') }}
          </span>
        </div>
        <!-- FAVOURITE END -->

        <PCollapse>
          <PCollapseItem
            v-for="(domainSetting, index) in settingsByDomain"
            :key="index"
            :pTitleCollapseItem="domainSetting.domain"
          >
            <template #before-title>
              <div class="margin-right--2">
                <!-- click.stop is here in order to prevent accordion to fold / unfold when clicking the switch -->
                <PSwitch
                  :modelValue="NotificationSettingsManager.hasAtLeastOneSettingEnabled(domainSetting.settings)"
                  :pActiveColor="AppColors.PERSIAN_400"
                  @click.stop
                  @update:model-value="(isEnabled: boolean) => handleDomainSettingsSwitch(isEnabled, index)"
                />
              </div>
            </template>

            <SettingsTable
              :settings="domainSetting.settings"
              @setting-update="
                (isActivated, settingId, settingType) => updateSetting({
                  isActivated,
                  settingId,
                  domainIndex: index,
                  settingType
                })
              "
            />
          </PCollapseItem>
        </PCollapse>
      </div>
      <div
        v-else-if="areSettingsLoading === true"
        class="
          height--100
          flex
          flex--align-items-center
          flex--justify-content-center
        "
      >
        <PLoader
          pType="primary"
          size="64"
        />
      </div>
    </Transition>

    <template
      v-if="notificationSettings !== undefined"
      #footer
    >
      <PButton
        class="margin-right--4"
        pType="secondary"
        @click="closeDrawer"
      >
        {{ t('feedCenter.settingsDrawer.close') }}
      </PButton>
      <PButton
        pType="primary"
        @click="NotificationSettingsManager.saveSettings(notificationSettings)"
      >
        {{ t('feedCenter.settingsDrawer.save') }}
      </PButton>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { AppColors } from '@pulse/styleguide'
import { PButton, PCollapse, PCollapseItem, PDrawer, PLoader, PSwitch } from '@pulse/styleguide/components'
import { useNotificationSettings } from './notification-settings.composable'
import { NotificationSettingsManager } from './notification-settings.manager'
import SettingsTable from '../SettingsTable/settings-table.vue'

const { t } = useI18n()

const isNotificationSettingsDrawerOpened = defineModel({
  type: Boolean,
  default: false,
})

function closeDrawer() {
  isNotificationSettingsDrawerOpened.value = false
}

const {
  areSettingsLoading,
  hasOnlyFavouritesDisplayed,
  handleDomainSettingsSwitch,
  notificationSettings,
  settingsByDomain,
  updateSetting,
} = useNotificationSettings()


</script>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.buttons-fade-in-enter-active {
  transition: opacity 0.2s ease;
  transition-delay: 0.4s;
}
.buttons-fade-in-enter-from {
  opacity: 0;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.settings_drawer {
  &__favourite {
    border-radius: 8px;
  }
}
</style>
