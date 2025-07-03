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
                  @update:model-value="(isEnabled) => handleDomainSettingsSwitch(isEnabled, index)"
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
          size="80"
        />
      </div>
    </Transition>
    <template #footer>
      <PButton
        class="margin-right--4"
        pType="secondary"
        @click="closeDrawer"
      >
        {{ t('feedCenter.settingsDrawer.close') }}
      </PButton>
      <PButton
        pType="primary"
        @click="NotificationSettingsManager.saveSettings(settingsByDomain)"
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
  handleDomainSettingsSwitch,
  settingsByDomain,
  updateSetting,
} = useNotificationSettings()


</script>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
