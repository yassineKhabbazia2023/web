<template>
  <div class="reports-list padding-y--6">
    <p
      class="reports-list__title font-large margin-bottom--2 padding-x--6"
      data-testid="reports-list-title"
    >
      {{ t('reportsDeposited') }}
    </p>
    <PScrollbar
      class="padding-y--3 padding-x--6"
      data-testid="reports-list-scrollbar"
    >
      <ul class="list-style-none">
        <li
          v-for="{ reportId, type, updateDate, dataUpdateDate } in reports"
          :key="reportId"
        >
          <ReportCard
            :updatedDate="mostRecentDate(updateDate, dataUpdateDate)"
            :type="type.customerLabel"
            :isSelected="selectedReport.reportId === reportId"
            class="margin-bottom--3"
            @select-report="handleReportSelection(reportId)"
          />
        </li>
      </ul>
    </PScrollbar>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PScrollbar } from '@pulse/styleguide/components'
import { getMostRecentDate } from '@pulse/toolbox/utils/dates'
import type { ReportsListProps } from './reports-list.types'

import ReportCard from '@powerbi/components/ReportCard/ReportCard.vue'

const mostRecentDate = (updateDate?: string, dataUpdateDate?: string) => {
  return getMostRecentDate(updateDate, dataUpdateDate)
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<ReportsListProps>()
const emit = defineEmits<{
  'select-report': [number]
}>()


const handleReportSelection = (reportId: number) => {
  emit('select-report', reportId)
}
</script>

<style scoped lang="scss">
.reports-list {
  width: 351px;
  height: 100%;
  border-right: 1px solid var(--el-border-color);
}
</style>

<i18n lang="yaml">
en-US:
  reportsDeposited: 'BI reports deposited'
fr-FR:
  reportsDeposited: 'Rapports BI déposés'
</i18n>
