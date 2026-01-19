<template>
  <PDrawer
    v-model="isNotificationSettingsDrawerOpened"
    :beforeClose="handleBeforeClose"
    :pTitle="t('feedCenter.settingsDrawer.title')"
    destroyOnClose
    pSize="50%"
    @close-drawer-button="handleBeforeClose"
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
          <PSwitch v-model="hasOnlyFavouritesDisplayed" :pActiveColor="AppColors.JUNGLE_400" />
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
                  :pActiveColor="AppColors.JUNGLE_400"
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
        @click="handleBeforeClose"
      >
        {{ t('feedCenter.settingsDrawer.close') }}
      </PButton>
      <PButton
        pType="primary"
        @click="handleSave"
      >
        {{ t('feedCenter.settingsDrawer.save') }}
      </PButton>
    </template>

    <!-- Confirmation popup -->
    <UnsavedChangesConfirmationModal
      v-model="isConfirmationModalOpen"
      @cancel="handleCancelLeave"
      @confirm-leave="handleConfirmLeave"
    />
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AppColors } from '@pulse/styleguide'
import { PButton, PCollapse, PCollapseItem, PDrawer, PLoader, PSwitch } from '@pulse/styleguide/components'
import { useNotificationSettings } from './notification-settings.composable'
import { NotificationSettingsManager } from './notification-settings.manager'
import SettingsTable from '../SettingsTable/settings-table.vue'
import UnsavedChangesConfirmationModal from './components/unsaved-changes-confirmation-modal.vue'

const { t } = useI18n({ useScope: 'global' })

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isNotificationSettingsDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const isConfirmationModalOpen = ref(false)

const {
  areSettingsLoading,
  hasOnlyFavouritesDisplayed,
  handleDomainSettingsSwitch,
  notificationSettings,
  settingsByDomain,
  updateSetting,
  hasUnsavedChanges,
  markAsSaved,
} = useNotificationSettings()

function closeDrawer() {
  isNotificationSettingsDrawerOpened.value = false
}

function handleBeforeClose(done?: () => void) {
  if (hasUnsavedChanges.value === true) {
    isConfirmationModalOpen.value = true
    return
  }

  if (typeof done === 'function') {
    done()
  }

  closeDrawer()
}

async function handleSave() {
  if (notificationSettings.value === undefined) {
    return
  }
  const { success } = await NotificationSettingsManager.saveSettings(notificationSettings.value)

  if (success === true) {
    markAsSaved()
  }
}

function handleConfirmLeave() {
  isConfirmationModalOpen.value = false
  hasUnsavedChanges.value = false
  closeDrawer()
}

function handleCancelLeave() {
  isConfirmationModalOpen.value = false
}

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
