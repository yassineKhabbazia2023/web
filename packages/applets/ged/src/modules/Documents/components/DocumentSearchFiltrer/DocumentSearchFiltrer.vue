<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('title')"
    pSize="35%"
    pDirection="rtl"
    @close-drawer-button="handleClose"
  >
    <template v-if="isDrawerOpened">
      <div>
        <p class="doc-search-filter-label">
          {{ t('dropdownLabel') }}
        </p>
        <PDropdown
          v-model="selectedPeriod"
          :pPlaceholder="t('dropdownPlaceholder')"
          pClearable
          :pOptions="periods"
          @change="handlePeriodChange"
        />
      </div>
      <div class="margin-top--6">
        <p class="doc-search-filter-label">
          {{ t('datePickerLabel') }}
        </p>
        <PDatePicker
          v-model="dateRange"
          type="daterange"
          :rangeSeparator="t('datePickerSeparator')"
          :startPlaceholder="t('datePickerStartDate')"
          :endPlaceholder="t('datePickerEndDate')"
          format="DD/MM/YYYY"
          @calendar-change="handleCalendarChange"
        />
      </div>
    </template>
    <template #footer>
      <div>
        <PButton
          pType="primary"
          pPlain
          pSize="default"
          class="margin-right--4"
          @click="handleResetClick"
        >
          {{ t('reset') }}
        </PButton>
        <PButton
          type="primary"
          pSize="default"
          @click="handleApplyClick"
        >
          {{ t('apply') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { PDrawer, PDropdown, PButton, PDatePicker } from '@pulse/styleguide/components'
import type { DocumentSearchFiltrerProps } from './DocumentSearchFiltrerTypes'
import { useI18n } from 'vue-i18n'
import type { DocumentSearchFilters } from '@ged/models/DocumentSearchFilters'
import { Period } from '@ged/models/DocumentSearchFilters'

const props = defineProps<DocumentSearchFiltrerProps>()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'close-filters-drawer': []
  'apply-filters-drawer': [DocumentSearchFilters]
  'reset-filters-drawer': []
  'update:modelValue': [boolean]
}>()

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const selectedPeriod = ref<string>('')

const periods = [
  {
    pValue: Period.DAY.toString(),
    pLabel: t('dropdownItems.today'),
  },
  {
    pValue: Period.WEEK.toString(),
    pLabel: t('dropdownItems.week'),
  },
  {
    pValue: Period.MONTH.toString(),
    pLabel: t('dropdownItems.month'),
  },
]

const dateRange = ref<[Date, Date ] | ''>('')
const isDateRange = (range: [Date, Date] | ''): range is [Date, Date] => {
  return range !== ''
}

const handlePeriodChange = (value: string) => {
  switch (value) {
  case Period.DAY:
    dateRange.value = [new Date(new Date().setHours(0, 0, 0, 0)), new Date()]
    break
  case Period.WEEK:
    dateRange.value = [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()]
    break
  case Period.MONTH:
    dateRange.value = [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]
    break
  }
}

const handleCalendarChange = () => {
  selectedPeriod.value = ''
}

const handleClose = () => {
  emit('close-filters-drawer')
}

const handleResetClick = () => {
  emit('reset-filters-drawer')
}

const handleApplyClick = () => {
  const filtersUpdated: DocumentSearchFilters = {
    selectedPeriod: selectedPeriod.value ? selectedPeriod.value : null,
    startDate: isDateRange(dateRange.value) ? dateRange.value[0] : null,
    endDate: isDateRange(dateRange.value) ? dateRange.value[1] : null,
  }
  emit('apply-filters-drawer', filtersUpdated)
}

// Main component actions
onMounted(() => {
  if (!props.filters) {
    return
  }
  if (props.filters.startDate && props.filters.endDate) {
    dateRange.value = [new Date(), new Date()]
    dateRange.value[0] = props.filters.startDate
    dateRange.value[1] = props.filters.endDate
  }
  if (props.filters.selectedPeriod) {
    selectedPeriod.value = props.filters.selectedPeriod
  }
})
</script>
<style lang="scss" scoped>
.doc-search-filter-label {
  font-size: 12px;
  line-height: 14px;
  min-height: 14px;
  margin-bottom: 8px;
  font-weight: 600;
}
</style>

<i18n lang="yaml">
  en-US:
    title: Filtres
    reset: Réinitialiser
    apply: Appliquer
    dropdownLabel: Période
    dropdownPlaceholder: Sélectionner une période
    dropdownItems:
      today: Les dernières 24h
      week: Les 7 derniers jours
      month: Les 30 derniers jours
    datePickerLabel: Période personnalisée
    datePickerSeparator: À
    datePickerStartDate: Date de début
    datePickerEndDate: Date de fin

  fr-FR:
    title: Filtres
    reset: Réinitialiser
    apply: Appliquer
    dropdownLabel: Période
    dropdownPlaceholder: Sélectionner une période
    dropdownItems:
      today: Les dernières 24h
      week: Les 7 derniers jours
      month: Les 30 derniers jours
    datePickerLabel: Période personnalisée
    datePickerSeparator: À
    datePickerStartDate: Date de début
    datePickerEndDate: Date de fin
  </i18n>
