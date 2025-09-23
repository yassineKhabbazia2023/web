<template>
  <div v-if="isReportStatisticsAvailable">
    <p
      class="text-color--neutral-gray-300 margin-bottom--2"
    >
      {{ t('reportStatuses') }}
    </p>
    <PFilterGroup
      :modelValue="activeFilters"
      :pFilters="onBoardingFilters"
      class="padding-right--3 margin-bottom--3"
      data-testid="report-status-filter-group"
      @toggle="onToggleFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watch } from 'vue'
import { ReportStatus } from '@powerbi/enums/bi-reports.enum'
import type { FilterOption } from '@pulse/styleguide/types'
import { PFilterGroup } from '@pulse/styleguide/components'
import { getReportStatusFilter } from './utils/report-status-filter.utils'
import type { ReportStatusFilterProps } from './report-status-filter.types'
import type { ReportFilters } from '@powerbi/types/bi-reports.types'

const props = defineProps<ReportStatusFilterProps>()

const activeFilters = ref<ReportStatus[]>([])
const onBoardingFilters = ref<FilterOption<ReportStatus | undefined>[]>([])

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'apply-status-filter': [ReportStatus]
  'reset-status-filter': [ReportStatus[]]
}>()

const FILTER_LABELS: Record<string, string> = {
  failed: t('failed'),
  offline: t('offline'),
  online: t('online'),
}

const isReportStatisticsAvailable = ref(false)

function onToggleFilter(filterKey: ReportStatus | undefined, isSelected: boolean) {
  if (isSelected && filterKey) {
    activeFilters.value = [filterKey]
    emit('apply-status-filter', filterKey)
  } else {
    activeFilters.value = activeFilters.value.filter((filter) => filter !== filterKey)
    emit('reset-status-filter', activeFilters.value)
  }
}

watch(
  () => props.reportFilters,
  (reportFilters: ReportFilters) => {
    if (reportFilters && reportFilters.reportStatusFilter) {
      activeFilters.value = reportFilters.reportStatusFilter
    }
  },
)

const loadReportStatisticsData = () => {
  if (props.reportStatistics != null) {
    isReportStatisticsAvailable.value = true
    onBoardingFilters.value = getReportStatusFilter(FILTER_LABELS, props.reportStatistics)
  }
}

watch(
  () => props.reportStatistics,
  loadReportStatisticsData,
  {
    // Trigger immediately to avoid having to call loadReportStatisticsData in onMounted
    immediate: true,
  },
)
</script>

<i18n lang="yaml">
en-US:
  online: 'Online'
  offline: 'Offline'
  failed: 'Failure'
  reportStatuses: 'BI Reports Status'
fr-FR:
  online: 'En ligne'
  offline: 'Hors ligne'
  failed: 'Incident'
  reportStatuses: 'Statut des rapports BI'
</i18n>
