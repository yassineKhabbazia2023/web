<template>
  <PDrawer
    v-model="isReportErrorDrawerVisible"
    pSize="40%"
    :pTitle="t('manageError')"
    data-testid="report-error-drawer"
    @close-drawer-button="handleCloseDrawer"
  >
    <ReportErrorCard
      v-for="(reportError, index) in reportErrors"
      :key="index"
      v-bind="reportError"
      data-testid="report-error-card"
    />
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PDrawer } from '@pulse/styleguide/components'
import ReportErrorCard from './components/ReportErrorCard'
import type { ReportErrorDrawerProps } from './report-error-drawer.type'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      manageError: 'Show errors',
    },
    'fr-FR': {
      manageError: 'Afficher les anomalies',
    },
  },
})

defineProps<ReportErrorDrawerProps>()

// #region drawer values and events
const isReportErrorDrawerVisible = defineModel<boolean>({
  default: false,
})

const handleCloseDrawer = () => {
  isReportErrorDrawerVisible.value = false
}
// #endregion
</script>

