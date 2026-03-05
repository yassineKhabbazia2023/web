import { reactive } from 'vue'
import { useAiMonitoringFilters } from './use-ai-monitoring-filters.composable'
import type { AiMonitoringFiltersProps, UseAiMonitoringFiltersEmit } from './ai-monitoring-filters.type'
import type { AiMonitoringFiltersState } from '@backoffice/types/ai-monitoring.type'

describe('useAiMonitoringFilters', () => {
  const createProps = (overrides: Partial<AiMonitoringFiltersProps> = {}): AiMonitoringFiltersProps =>
    reactive({
      filters: {
        dateRange: null,
        feature: null,
        subFeature: null,
        user: null,
      },
      features: [
        {
          value: 'GED',
          label: 'GED',
          sub_features: [
            { value: 'Recherche', label: 'Recherche' },
            { value: 'Explication', label: 'Explication' },
          ],
        },
        {
          value: 'Catalogue',
          label: 'Catalogue des offres',
          sub_features: [
            { value: 'Vente', label: 'Vente' },
          ],
        },
      ],
      users: [
        { value: 'john@example.com', label: 'John Doe' },
        { value: 'jane@example.com', label: 'Jane Doe' },
      ],
      isLoading: false,
      ...overrides,
    })

  const createEmit = (): UseAiMonitoringFiltersEmit => vi.fn()

  describe('dateRangeModel', () => {
    it('should return empty string when dateRange is null', () => {
      const props = createProps()
      const emit = createEmit()

      const { dateRangeModel } = useAiMonitoringFilters(props, emit)

      expect(dateRangeModel.value).toBe('')
    })

    it('should return dateRange when it has value', () => {
      const dateRange: [Date, Date] = [new Date('2024-01-01'), new Date('2024-01-31')]
      const props = createProps({ filters: { dateRange, feature: null, subFeature: null, user: null } })
      const emit = createEmit()

      const { dateRangeModel } = useAiMonitoringFilters(props, emit)

      expect(dateRangeModel.value).toEqual(dateRange)
    })

    it('should emit update:filters with null when setting empty string', () => {
      const props = createProps()
      const emit = createEmit()

      const { dateRangeModel } = useAiMonitoringFilters(props, emit)
      dateRangeModel.value = ''

      expect(emit).toHaveBeenCalledWith('update:filters', expect.objectContaining({
        dateRange: null,
      }))
    })

    it('should emit update:filters with date range when setting value', () => {
      const props = createProps()
      const emit = createEmit()
      const newDateRange: [Date, Date] = [new Date('2024-02-01'), new Date('2024-02-28')]

      const { dateRangeModel } = useAiMonitoringFilters(props, emit)
      dateRangeModel.value = newDateRange

      expect(emit).toHaveBeenCalledWith('update:filters', expect.objectContaining({
        dateRange: newDateRange,
      }))
    })
  })

  describe('featureModel', () => {
    it('should return feature value from props', () => {
      const props = createProps({ filters: { dateRange: null, feature: 'GED', subFeature: null, user: null } })
      const emit = createEmit()

      const { featureModel } = useAiMonitoringFilters(props, emit)

      expect(featureModel.value).toBe('GED')
    })

    it('should reset subFeature when feature changes', () => {
      const props = createProps({
        filters: { dateRange: null, feature: 'GED', subFeature: 'Recherche', user: null },
      })
      const emit = createEmit()

      const { featureModel } = useAiMonitoringFilters(props, emit)
      featureModel.value = 'Catalogue'

      expect(emit).toHaveBeenCalledWith('update:filters', {
        dateRange: null,
        feature: 'Catalogue',
        subFeature: null,
        user: null,
      })
    })

    it('should normalize empty string to null when clearing', () => {
      const props = createProps({
        filters: { dateRange: null, feature: 'GED', subFeature: 'Recherche', user: null },
      })
      const emit = createEmit()

      const { featureModel } = useAiMonitoringFilters(props, emit)
      featureModel.value = '' as unknown as string | null

      expect(emit).toHaveBeenCalledWith('update:filters', {
        dateRange: null,
        feature: null,
        subFeature: null,
        user: null,
      })
    })
  })

  describe('subFeatureModel', () => {
    it('should normalize empty string to null when clearing', () => {
      const props = createProps({
        filters: { dateRange: null, feature: 'GED', subFeature: 'Recherche', user: null },
      })
      const emit = createEmit()

      const { subFeatureModel } = useAiMonitoringFilters(props, emit)
      subFeatureModel.value = '' as unknown as string | null

      expect(emit).toHaveBeenCalledWith('update:filters', expect.objectContaining({
        subFeature: null,
      }))
    })

    it('should emit update:filters when subFeature changes', () => {
      const props = createProps({ filters: { dateRange: null, feature: 'GED', subFeature: null, user: null } })
      const emit = createEmit()

      const { subFeatureModel } = useAiMonitoringFilters(props, emit)
      subFeatureModel.value = 'Recherche'

      expect(emit).toHaveBeenCalledWith('update:filters', expect.objectContaining({
        subFeature: 'Recherche',
      }))
    })
  })

  describe('userModel', () => {
    it('should emit update:filters when user changes', () => {
      const props = createProps()
      const emit = createEmit()

      const { userModel } = useAiMonitoringFilters(props, emit)
      userModel.value = 'john@example.com'

      expect(emit).toHaveBeenCalledWith('update:filters', expect.objectContaining({
        user: 'john@example.com',
      }))
    })

    it('should normalize empty string to null when clearing', () => {
      const props = createProps({
        filters: { dateRange: null, feature: null, subFeature: null, user: 'john@example.com' },
      })
      const emit = createEmit()

      const { userModel } = useAiMonitoringFilters(props, emit)
      userModel.value = '' as unknown as string | null

      expect(emit).toHaveBeenCalledWith('update:filters', expect.objectContaining({
        user: null,
      }))
    })
  })

  describe('featureOptions', () => {
    it('should map features to PDropdownOption format', () => {
      const props = createProps()
      const emit = createEmit()

      const { featureOptions } = useAiMonitoringFilters(props, emit)

      expect(featureOptions.value).toEqual([
        { pValue: 'GED', pLabel: 'GED' },
        { pValue: 'Catalogue', pLabel: 'Catalogue des offres' },
      ])
    })
  })

  describe('subFeatureOptions', () => {
    it('should return empty array when no feature is selected', () => {
      const props = createProps()
      const emit = createEmit()

      const { subFeatureOptions } = useAiMonitoringFilters(props, emit)

      expect(subFeatureOptions.value).toEqual([])
    })

    it('should return sub-features for selected feature', () => {
      const props = createProps({ filters: { dateRange: null, feature: 'GED', subFeature: null, user: null } })
      const emit = createEmit()

      const { subFeatureOptions } = useAiMonitoringFilters(props, emit)

      expect(subFeatureOptions.value).toEqual([
        { pValue: 'Recherche', pLabel: 'Recherche' },
        { pValue: 'Explication', pLabel: 'Explication' },
      ])
    })

    it('should return empty array when feature is not found', () => {
      const props = createProps({ filters: { dateRange: null, feature: 'Unknown', subFeature: null, user: null } })
      const emit = createEmit()

      const { subFeatureOptions } = useAiMonitoringFilters(props, emit)

      expect(subFeatureOptions.value).toEqual([])
    })
  })

  describe('userOptions', () => {
    it('should map users to PDropdownOption format', () => {
      const props = createProps()
      const emit = createEmit()

      const { userOptions } = useAiMonitoringFilters(props, emit)

      expect(userOptions.value).toEqual([
        { pValue: 'john@example.com', pLabel: 'John Doe' },
        { pValue: 'jane@example.com', pLabel: 'Jane Doe' },
      ])
    })
  })

  describe('isSubFeatureDisabled', () => {
    it('should be true when isLoading is true', () => {
      const props = createProps({ isLoading: true })
      const emit = createEmit()

      const { isSubFeatureDisabled } = useAiMonitoringFilters(props, emit)

      expect(isSubFeatureDisabled.value).toBe(true)
    })

    it('should be true when feature is null', () => {
      const props = createProps()
      const emit = createEmit()

      const { isSubFeatureDisabled } = useAiMonitoringFilters(props, emit)

      expect(isSubFeatureDisabled.value).toBe(true)
    })

    it('should be false when not loading and feature is selected', () => {
      const props = createProps({
        isLoading: false,
        filters: { dateRange: null, feature: 'GED', subFeature: null, user: null },
      })
      const emit = createEmit()

      const { isSubFeatureDisabled } = useAiMonitoringFilters(props, emit)

      expect(isSubFeatureDisabled.value).toBe(false)
    })
  })

  describe('hasActiveFilters', () => {
    it('should be false when all filters are null', () => {
      const props = createProps()
      const emit = createEmit()

      const { hasActiveFilters } = useAiMonitoringFilters(props, emit)

      expect(hasActiveFilters.value).toBe(false)
    })

    it.each<[keyof AiMonitoringFiltersState, unknown]>([
      ['dateRange', [new Date(), new Date()]],
      ['feature', 'GED'],
      ['subFeature', 'Recherche'],
      ['user', 'john@example.com'],
    ])('should be true when %s is set', (filterKey, filterValue) => {
      const filters: AiMonitoringFiltersState = {
        dateRange: null,
        feature: null,
        subFeature: null,
        user: null,
        [filterKey]: filterValue,
      }
      const props = createProps({ filters })
      const emit = createEmit()

      const { hasActiveFilters } = useAiMonitoringFilters(props, emit)

      expect(hasActiveFilters.value).toBe(true)
    })
  })

  describe('handleFilterChange', () => {
    it('should emit filter-change event', () => {
      const props = createProps()
      const emit = createEmit()

      const { handleFilterChange } = useAiMonitoringFilters(props, emit)
      handleFilterChange()

      expect(emit).toHaveBeenCalledWith('filter-change')
    })
  })

  describe('handleReset', () => {
    it('should emit reset-filters event', () => {
      const props = createProps()
      const emit = createEmit()

      const { handleReset } = useAiMonitoringFilters(props, emit)
      handleReset()

      expect(emit).toHaveBeenCalledWith('reset-filters')
    })
  })
})
