import { computed } from 'vue'
import type { PDropdownOption } from '@pulse/styleguide/types'
import type {
  AiMonitoringFiltersProps,
  DateRangeValue,
  UseAiMonitoringFiltersEmit,
  UseAiMonitoringFiltersReturn,
} from './ai-monitoring-filters.type'

export function useAiMonitoringFilters(
  props: AiMonitoringFiltersProps,
  emit: UseAiMonitoringFiltersEmit,
): UseAiMonitoringFiltersReturn {
  // PDatePicker expects '' for empty state, not null
  const dateRangeModel = computed<DateRangeValue>({
    get: () => props.filters.dateRange ?? '',
    set: (value: DateRangeValue) => {
      const dateRange = value === '' ? null : value
      emit('update:filters', { ...props.filters, dateRange })
    },
  })

  const featureModel = computed<string | null>({
    get: () => props.filters.feature,
    set: (value: string | null) => {
      const normalizedValue = value === '' ? null : value
      // Reset sub-feature when feature changes
      emit('update:filters', {
        ...props.filters,
        feature: normalizedValue,
        subFeature: null,
      })
    },
  })

  const subFeatureModel = computed<string | null>({
    get: () => props.filters.subFeature,
    set: (value: string | null) => {
      const normalizedValue = value === '' ? null : value
      emit('update:filters', { ...props.filters, subFeature: normalizedValue })
    },
  })

  const userModel = computed<string | null>({
    get: () => props.filters.user,
    set: (value: string | null) => {
      const normalizedValue = value === '' ? null : value
      emit('update:filters', { ...props.filters, user: normalizedValue })
    },
  })

  const featureOptions = computed<PDropdownOption[]>(() =>
    props.features.map((feature) => ({
      pValue: feature.value,
      pLabel: feature.label,
    })),
  )

  const subFeatureOptions = computed<PDropdownOption[]>(() => {
    if (props.filters.feature === null) {
      return []
    }

    const selectedFeature = props.features.find(
      (feature) => feature.value === props.filters.feature,
    )

    if (selectedFeature === undefined) {
      return []
    }

    return selectedFeature.sub_features.map((subFeature) => ({
      pValue: subFeature.value,
      pLabel: subFeature.label,
    }))
  })

  const userOptions = computed<PDropdownOption[]>(() =>
    props.users.map((user) => ({
      pValue: user.value,
      pLabel: user.label,
    })),
  )

  // Disable sub-feature when no feature is selected or when loading
  const isSubFeatureDisabled = computed<boolean>(() =>
    props.isLoading === true || props.filters.feature === null,
  )

  // Check if any filter is active
  const hasActiveFilters = computed<boolean>(() =>
    props.filters.dateRange !== null ||
    props.filters.feature !== null ||
    props.filters.subFeature !== null ||
    props.filters.user !== null,
  )

  const handleFilterChange = (): void => {
    emit('filter-change')
  }

  const handleReset = (): void => {
    emit('reset-filters')
  }

  return {
    dateRangeModel,
    featureModel,
    subFeatureModel,
    userModel,
    featureOptions,
    subFeatureOptions,
    userOptions,
    isSubFeatureDisabled,
    hasActiveFilters,
    handleFilterChange,
    handleReset,
  }
}
