<template>
  <PTable
    :pData="settings"
    pStripe
  >
    <PTableColumn
      pProp="label"
      :pLabel="t('feedCenter.settingsDrawer.columns.notificationType')"
    >
      <template #default="scope">
        <p class="notification-type-column padding-y--3">
          {{ scope.row.label }}
        </p>
      </template>
    </PTableColumn>
    <PTableColumn
      pProp="emailValue"
      :pLabel="t('feedCenter.settingsDrawer.columns.email')"
      pAlign="center"
      pWidth="80"
    >
      <template #default="scope">
        <PCheckbox
          v-if="scope.row.emailValue !== null"
          :modelValue="scope.row.emailValue"
          @update:model-value="(isChecked) => emitUpdateSetting(isChecked, scope.row.id, SettingsType.EMAIL)"
        />
        <span v-if="scope.row.emailValue === null">-</span>
      </template>
    </PTableColumn>
    <PTableColumn
      pProp="feedcenterValue"
      :pLabel="t('feedCenter.settingsDrawer.columns.inFeedCenter')"
      pAlign="center"
      pWidth="80"
    >
      <template #default="scope">
        <PCheckbox
          v-if="scope.row.feedcenterValue !== null"
          :modelValue="scope.row.feedcenterValue === true"
          @update:model-value="(isChecked) => emitUpdateSetting(isChecked, scope.row.id, SettingsType.FEED_CENTER)"
        />
        <span v-if="scope.row.feedcenterValue === null">-</span>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PCheckbox, PTable, PTableColumn } from '@pulse/styleguide/components'
import type { SettingsTableProps } from './settings-table.type'
import { SettingsType } from '../../feed-center.enum'

const { t } = useI18n({ useScope: 'global' })
defineProps<SettingsTableProps>()

const emit = defineEmits<{
  'setting-update': [boolean, number, SettingsType]
}>()

function emitUpdateSetting(value: boolean, settingId: number, settingType: SettingsType) {
  emit('setting-update', value, settingId, settingType)
}
</script>

<style lang="scss">
.notification-type-column {
  word-break: break-word;
  white-space: normal;
}
</style>
