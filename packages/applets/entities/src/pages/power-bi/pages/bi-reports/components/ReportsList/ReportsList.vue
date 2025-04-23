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
          v-for="{ reportId, type, updateDate, dataUpdateDate, reportLabel } in reports"
          :key="reportId"
        >
          <ReportCard
            :name="reportLabel"
            :updatedDate="getMostRecentDate(updateDate, dataUpdateDate)"
            :type="type.customerLabel"
            :isSelected="internalSelectedReport.reportId === reportId"
            class="margin-bottom--3"
            @select-report="handleReportSelection(reportId)"
          />
        </li>
      </ul>
    </PScrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PScrollbar } from '@pulse/styleguide/components'
import type { ReportsListProps } from './ReportsListTypes'
import type { Report } from '@entities/common/types/BIReportsTypes'
import { getMostRecentDate } from '@entities/helper'
import ReportCard from './components/index'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ReportsListProps>()
const emit = defineEmits<{
  'update:selectedReport': [Report]
}>()

const internalSelectedReport = computed({
  get() {
    return props.selectedReport
  },
  set(report) {
    emit('update:selectedReport', report)
  },
})

const handleReportSelection = (reportId: number) => {
  internalSelectedReport.value = props.reports.find(
    (report) => report.reportId === reportId,
  ) as Report
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
