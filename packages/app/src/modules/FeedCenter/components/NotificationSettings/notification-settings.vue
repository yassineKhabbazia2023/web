<template>
  <PDrawer
    v-model="isNotificationSettingsDrawerOpened"
    :pTitle="t('notificationSettingsDrawer.title')"
    @close-drawer-button="closeDrawer"
  >
    <template #header-suffix>
      <div
        class="
          text-color--neutral-gray-300
          margin-top--2
          width--100
        "
      >
        {{ t('notificationSettingsDrawer.subTitle') }}
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PDrawer } from '@pulse/styleguide/components'

const { t } = useI18n()

const isNotificationSettingsDrawerOpened = defineModel({
  type: Boolean,
  default: false,
})

function closeDrawer() {
  isNotificationSettingsDrawerOpened.value = false
}
</script>
