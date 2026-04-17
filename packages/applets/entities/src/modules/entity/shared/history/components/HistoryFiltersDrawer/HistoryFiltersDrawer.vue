<template>
  <PDrawer
    v-model="isDrawerOpened"
    :pTitle="t('filters.title')"
    pSize="35%"
    pDirection="rtl"
    @close-drawer-button="handleClose"
  >
    <div>
      <p
        class="
          font-semibold
          margin-bottom--2
          color--jungle-900
          font-size--12
        "
      >
        {{ t('filters.periodLabel') }}
      </p>
      <PDatePicker
        v-model="localDateRange"
        pType="daterange"
        :pRangeSeparator="t('filters.dateRangeSeparator')"
        :pStartPlaceholder="t('filters.startDatePlaceholder')"
        :pEndPlaceholder="t('filters.endDatePlaceholder')"
        class="width--100 margin-bottom--4"
        pClearable
      />
    </div>

    <div
      v-for="theme in themes"
      :key="theme.themeId"
      class="margin-top--4"
    >
      <p class="font-semibold color--jungle-900 font-size--12 margin-bottom--2">
        {{ theme.name }}
      </p>
      <PCheckboxGroup v-model="localSelectedCategoryIds" class="flex flex--direction-column">
        <PCheckbox
          v-for="category in theme.categories"
          :key="category.categoryId"
          :pLabel="category.categoryId"
          class="margin-left--4"
        >
          {{ category.name }}
        </PCheckbox>
      </PCheckboxGroup>
    </div>

    <template #footer>
      <div class="flex flex--justify-content-space-between">
        <PButton
          pType="secondary"
          pPlain
          pSize="default"
          data-testid="history-drawer-reset-button"
          @click="handleResetClick"
        >
          {{ t('filters.reset') }}
        </PButton>
        <PButton
          pType="primary"
          pSize="default"
          data-testid="history-drawer-apply-button"
          @click="handleApplyClick"
        >
          {{ t('filters.apply') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer,
  PButton,
  PDatePicker,
  PCheckboxGroup,
  PCheckbox,
} from '@pulse/styleguide/components'
import { HistoryTrackingManager } from '@entities/managers/history-tracking/history-tracking.manager'
import type { HistoryFiltersDrawerProps, HistoryFiltersDrawerEmits } from './HistoryFiltersDrawer.types'

const props = defineProps<HistoryFiltersDrawerProps>()
const emit = defineEmits<HistoryFiltersDrawerEmits>()

const { t } = useI18n()

const isDrawerOpened = defineModel<boolean>('isOpened', { default: false })

const localSelectedCategoryIds = ref<number[]>([])
const localDateRange = ref<[Date, Date] | ''>('')

watch(
  () => isDrawerOpened.value,
  (isOpened) => {
    if (isOpened === true) {
      localSelectedCategoryIds.value = [...props.selectedCategoryIds]
      localDateRange.value = props.dateRange === null ? '' : props.dateRange
    }
  },
)

const handleClose = () => {
  isDrawerOpened.value = false
}

const handleResetClick = () => {
  isDrawerOpened.value = false
  emit('reset')
}

const handleApplyClick = () => {
  HistoryTrackingManager.trackFilterValidated()
  isDrawerOpened.value = false
  emit('apply', {
    categoryIds: localSelectedCategoryIds.value,
    dateRange: localDateRange.value === '' ? null : localDateRange.value,
  })
}
</script>
