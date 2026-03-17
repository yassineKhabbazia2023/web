<template>
  <div
    class="
      flex
      flex--align-items-center
      flex--justify-content-space-between
      margin-bottom--6"
  >
    <div class="flex flex--direction-column width--100 max-width-700">
      <ReportStatusFilter
        v-if="reportStatistics !== null && reportStatistics !== undefined"
        :reportStatistics
        :reportFilters
        data-testid="report-status-filter"
        @apply-status-filter="applyReportStatusFilter"
        @reset-status-filter="clearReportStatusFilter"
      />
      <div class="report-toolbar__filters flex flex--align-items-center">
        <PFormSearch
          class="width--50"
          :pPlaceholder="t('searchBy')"
          :pSearchInvalidMessage="t('invalidSearch')"
          :pMinLength="3"
          pSize="small"
          data-testid="report-toolbar__search-input"
          pClearable
          @update:p-search="handleSearchValueSubmitted"
        />
        <PButton
          pType="default"
          pSize="small"
          data-testid="report-toolbar__filter-button"
          @click="openFiltersDrawer"
        >
          <PIcon pName="sliders" />
          <span class="padding-left--2">{{ t('filter') }}</span>
          <Transition name="fade">
            <PPastille
              v-if="reportFiltersCount > 0"
              pType="persian"
              pSize="small"
              class="margin-left--2"
              data-testid="report-toolbar__filter-count"
            >
              {{ reportFiltersCount }}
            </PPastille>
          </Transition>
        </PButton>
        <Transition name="fade">
          <PButton
            v-if="reportFiltersCount > 0"
            pType="default"
            data-testid="report-toolbar__clear-filters-button"
            @click="clearAllReportFilters"
          >
            <span
              class="font-medium text-underline"
              data-testid="report-toolbar__clear-filters-text"
            >
              {{ t('clearAll') }}
            </span>
          </PButton>
        </Transition>
      </div>
    </div>
    <PButton
      pType="secondary"
      pSize="small"
      pPlain
      :pDisabled="reportErrorsData.totalItems === 0"
      class="flex--align-self-flex-end margin-bottom--1"
      data-testid="report-toolbar__show-errors-button"
      @click="handleOpenErrorDrawer"
    >
      <span>{{ t('showErrors') }}</span>
      <PPastille
        v-if="reportErrorsData.totalItems > 0"
        pType="warning"
        class="margin-left--3"
        data-testid="report-toolbar__error-count"
      >
        {{ reportErrorsData.totalItems }}
      </PPastille>
    </PButton>
  </div>
  <ReportErrorDrawer
    v-model="isErrorDrawerOpen"
    :reportErrors="reportErrorsData.errors"
    data-testid="report-error-drawer"
  />
  <ReportFiltersDrawer
    v-model="isFiltersDrawerOpen"
    v-model:hasActiveFilters="hasActiveFilters"
    :reportFilters
    data-testid="report-filters-drawer"
    @apply-filters="applyReportFilters"
    @reset-filters="clearAllReportFilters"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PPastille, PIcon, PFormSearch } from '@pulse/styleguide/components'
import type { ReportFilters, ReportErrorData } from '@powerbi/types/bi-reports.types'
import type { ReportToolbarProps } from './report-toolbar.types'
import ReportErrorDrawer from '../ReportErrorDrawer'
import ReportFiltersDrawer from './components/ReportFiltersDrawer'
import ReportStatusFilter from './components/ReportStatusFilter'
import { ReportStatus } from '@powerbi/enums/bi-reports.enum'
import { fetchReportErrors } from '@powerbi/services/reporting.service'
import { displayNotification } from '@pulse/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      showErrors: 'Show errors',
      searchBy: 'Search by company name, customer code...',
      filter: 'Filter',
      clearAll: 'Clear all',
      invalidSearch: '3 characters minimum required',
      errors: {
        reportErrorsFetch: 'We couldn\'t load the report errors. Please check your connection or try again shortly.\n',
      },
    },
    'fr-FR': {
      showErrors: 'Voir anomalies',
      searchBy: 'Rechercher par raison sociale, code client...',
      filter: 'Filtrer',
      clearAll: 'Tout effacer',
      invalidSearch: '3 caractères minimum requis',
      errors: {
        reportErrorsFetch: 'Nous n\'avons pas pu charger les erreurs de rapport. Veuillez vérifier votre connexion ou réessayer dans un instant.\n',
      },
    },
  },
})

const emit = defineEmits<{
  'search-report': [string]
  'apply-filters': [ReportFilters]
  'clear-filters': []
}>()

defineProps<ReportToolbarProps>()

// #region Report Statistics Filter
const applyReportStatusFilter = (appliedStatusFilter: ReportStatus) => {
  reportFilters.value = {
    reportStatusFilter: [appliedStatusFilter],
    reportTypeIdFilter: reportFilters.value.reportTypeIdFilter,
  }
  applyFilters()
}

const clearReportStatusFilter = (appliedStatusFilter: ReportStatus[]) => {
  reportFilters.value = {
    reportStatusFilter: appliedStatusFilter,
    reportTypeIdFilter: reportFilters.value.reportTypeIdFilter,
  }
  applyFilters()
}
// #endregion

// #region Report Filter Drawer State and Logic
const hasActiveFilters = ref(false)
const isFiltersDrawerOpen = ref(false)
const reportFilters = ref<ReportFilters>({
  reportStatusFilter: [],
  reportTypeIdFilter: [],
})

const openFiltersDrawer = () => {
  isFiltersDrawerOpen.value = true
}

const closeFiltersDrawer = () => {
  isFiltersDrawerOpen.value = false
}

const reportFiltersCount = computed(() => {
  const statusCount = reportFilters.value.reportStatusFilter?.length ?? 0
  const typeIdCount = reportFilters.value.reportTypeIdFilter?.length ?? 0
  return statusCount + typeIdCount
})

const applyFilters = () => {
  emit('apply-filters', reportFilters.value)
}

const applyReportFilters = (appliedFilters: ReportFilters) => {
  reportFilters.value = appliedFilters
  applyFilters()

  // Close the filter drawer after a short delay for smooth UX
  setTimeout(() => {
    closeFiltersDrawer()
  }, 300)
}

const clearAllReportFilters = () => {
  reportFilters.value = { reportStatusFilter: [], reportTypeIdFilter: [] }
  hasActiveFilters.value = false
  emit('clear-filters')

  // Close the filter drawer after a short delay for smooth UX
  setTimeout(() => {
    closeFiltersDrawer()
  }, 300)
}
// #endregion

// #region Report Errors Drawer State and Logic
const isErrorDrawerOpen = ref(false)
const reportErrorsData = reactive<ReportErrorData>({
  errors: [],
  totalItems: 0,
})

const handleSearchValueSubmitted = (search: string) => {
  emit('search-report', search)
}

const handleOpenErrorDrawer = () => {
  isErrorDrawerOpen.value = true
}

const fetchReportErrorsData = async () => {
  try {
    const { items, totalItems } = await fetchReportErrors()
    reportErrorsData.errors = items
    reportErrorsData.totalItems = totalItems
  } catch {
    displayNotification('error', t('errors.reportErrorsFetch'))
  }
}
// #endregion

onMounted(() => {
  fetchReportErrorsData()
})
</script>

<style lang="scss" scoped>
.report-toolbar__filters {
  // Prevents layout shift when dynamic UI elements like the "Clear" button are shown.
  min-height: 44px;
}

// Ensures a smooth transition when the filter count disappears
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
