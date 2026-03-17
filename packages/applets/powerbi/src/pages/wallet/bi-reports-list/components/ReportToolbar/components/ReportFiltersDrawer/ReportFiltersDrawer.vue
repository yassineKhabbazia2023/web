<template>
  <PDrawer
    v-model="isReportFilterDrawerVisible"
    class="flex"
    pSize="40%"
    :pTitle="t('filters')"
    destroyOnClose
    data-testid="report-filters-drawer"
    @close="closeReportFiltersDrawer"
    @open="initializeFilters"
    @close-drawer-button="closeReportFiltersDrawer"
  >
    <PForm
      :pModel="internalFilters"
      pLabelPosition="top"
    >
      <!-- Report Type Dropdown -->
      <PFormItem :pLabel="t('labelTypeReport')">
        <PDropdown
          v-model="internalFilters.reportTypeIdFilter"
          :pPlaceholder="t('placeholderTypeReport')"
          :pOptions="reportTypeOptions"
          :pLoading="isLoadingReportTypes"
          pMultiple
          data-testid="report-filters-drawer__type-dropdown"
        />
      </PFormItem>

      <!-- Report Status Checkbox Group -->
      <PFormItem :pLabel="t('reportStatus')">
        <PCheckboxGroup
          v-model="internalFilters.reportStatusFilter"
          data-testid="report-filters-drawer__status-group"
        >
          <ul class="list-style-none">
            <li
              v-for="statusOption in REPORT_STATUS_OPTIONS"
              :key="statusOption.value"
            >
              <PCheckbox :pLabel="statusOption.value">
                {{ statusOption.label }}
              </PCheckbox>
            </li>
          </ul>
        </PCheckboxGroup>
      </PFormItem>
    </PForm>

    <template #footer>
      <div class="margin-left--auto">
        <PButton
          class="margin-right--4"
          pType="secondary"
          pPlain
          :pDisabled="hasActiveFilters === false"
          data-testid="report-filters-drawer__reset-button"
          @click="resetReportFilters"
        >
          {{ t('reset') }}
        </PButton>

        <PButton
          pType="primary"
          data-testid="report-filters-drawer__apply-button"
          @click="applyReportFilters"
        >
          {{ t('apply') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { PDrawer, PForm, PFormItem, PDropdown, PCheckboxGroup, PCheckbox, PButton } from '@pulse/styleguide/components'
import type { ReportFiltersDrawerProps } from './report-filters-drawer.types'
import type { ReportType, ReportFilters } from '@powerbi/types/bi-reports.types'
import { fetchBIReportTypes } from '@powerbi/services/reporting.service'
import { ReportStatus } from '@powerbi/enums/bi-reports.enum'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      filters: 'Filters',
      online: 'Online',
      apply: 'Apply',
      offline: 'Offline',
      reset: 'Reset',
      initialized: 'Initialized',
      failed: 'Failure',
      reportStatus: 'Report status',
      labelTypeReport: 'Report type',
      placeholderTypeReport: 'Select a type',
    },
    'fr-FR': {
      filters: 'Filtres',
      online: 'En ligne',
      offline: 'Hors ligne',
      apply: 'Appliquer',
      reset: 'Réinitialiser',
      initialized: 'Initialisé',
      failed: 'Incident',
      reportStatus: 'Statut de rapport',
      labelTypeReport: 'Type de rapport',
      placeholderTypeReport: 'Sélectionnez un type',
    },
  },
})

const props = defineProps<ReportFiltersDrawerProps>()
const emit = defineEmits<{
  'apply-filters': [ReportFilters]
  'reset-filters': []
}>()

const reportTypes = ref<ReportType[]>([])
const isLoadingReportTypes = ref(false)

// #region Types and Status Values
const REPORT_STATUS_OPTIONS = [
  {
    label: t('online'),
    value: ReportStatus.ONLINE,
  },
  {
    label: t('offline'),
    value: ReportStatus.OFFLINE,
  },
  {
    label: t('failed'),
    value: ReportStatus.FAILED,
  },
]

const reportTypeOptions = computed(() =>
  reportTypes.value.map(({ reportTypeId, collaboratorLabel, customerLabel }: ReportType) => ({
    pValue: reportTypeId,
    pLabel: `${collaboratorLabel} (${customerLabel})`,
  })),
)
// #endregion

// #region Actions Related to Filters
const internalFilters = ref<ReportFilters>({
  reportStatusFilter: [],
  reportTypeIdFilter: [],
})
const hasActiveFilters = defineModel<boolean>('hasActiveFilters', {
  default: false,
})

const applyReportFilters = () => {
  hasActiveFilters.value = true
  emit('apply-filters', internalFilters.value)
}

const resetReportFilters = () => {
  hasActiveFilters.value = false
  emit('reset-filters')
}
// #endregion

// #region Drawer State and Event Handlers
const isReportFilterDrawerVisible = defineModel<boolean>({
  default: false,
})

const initializeFilters = () => {
  internalFilters.value = {
    reportStatusFilter: props.reportFilters.reportStatusFilter,
    reportTypeIdFilter: props.reportFilters.reportTypeIdFilter,
  }
}

const closeReportFiltersDrawer = () => {
  if (!hasActiveFilters.value) {
    internalFilters.value = { reportStatusFilter: [], reportTypeIdFilter: [] }
  }
  isReportFilterDrawerVisible.value = false
}
// #endregion

onMounted(async () => {
  isLoadingReportTypes.value = true
  try {
    reportTypes.value = await fetchBIReportTypes()
  } catch (error) {
    logger.error('Unable to fetch report types: ', error)
  } finally {
    isLoadingReportTypes.value = false
  }
})
</script>

