<template>
  <PDrawer
    v-model="isErrorDrawerVisible"
    :pTitle="t('manageError')"
    pSize="40%"
    data-testid="report-error-drawer"
    @close-drawer-button="handleCloseDrawer"
  >
    <ReportErrorCard
      v-for="(error, index) in props.errors"
      :key="index"
      data-testid="report-error-card"
      :reportName="error.reportName"
      :embedReportId="error.embedReportId"
      :messages="error.messages"
      :detectionDate="error.detectionDate"
      :reportType="error.reportType"
    />
  </PDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer } from '@pulse/styleguide/components'
import ReportErrorCard from './components/ReportErrorCard'
import type { ReportErrorDrawerProps } from './types/report-error-drawer.type.ts'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ReportErrorDrawerProps>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

// #region drawer values and events
const isErrorDrawerVisible = computed({
  get() {
    return props.modelValue
  },
  set(isVisible: boolean) {
    emit('update:modelValue', isVisible)
  },
})
const handleCloseDrawer = () => {
  isErrorDrawerVisible.value = false
}
// #endregion
</script>

<i18n lang="yaml">
en-US:
  manageError: 'Show errors'
fr-FR:
  manageError: 'Afficher les anomalies'
</i18n>
