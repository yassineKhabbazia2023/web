<template>
  <ElDatePicker
    v-model="datepickerModel"
    :prefixIcon="prefixIcon"
    :popperClass="popperClassComputed"
    :class="{ 'p-date-picker__input--hidden': pCalendarLite }"
    :type="pType"
    :rangeSeparator="pRangeSeparator"
    :startPlaceholder="pStartPlaceholder"
    :endPlaceholder="pEndPlaceholder"
    :format="pFormat"
    :unlinkPanels="pUnlinkPanels"
    :shortcuts="pShortcuts"
    :disabled="pDisabled"
    :placeholder="pPlaceholder"
    :clearable="pClearable"
    :teleported="pTeleported"
    @change="handleChange"
    @calendar-change="calendarChange"
    @panel-change="panelChange"
  >
    <template
      v-if="pCalendarLite"
      #default="{ isCurrent, dayjs, text }"
    >
      <div
        :class="{ current:isCurrent, 'el-date-table-cell': true }"
        data-testid="date-picker-table-cell"
        @click="selectedDate(dayjs.format('YYYY-MM-DD'))"
      >
        <span class="el-date-table-cell__text">{{ text }}</span>
      </div>
    </template>
    <slot v-if="!pCalendarLite" />
  </ElDatePicker>
</template>

<script setup lang="ts" generic="T extends PDatePickerModelValue">
import { computed, watch, ref } from 'vue'
import { ElDatePicker } from 'element-plus'
import { getIconComponent } from '../../utils/iconHelper'
import type { PDatePickerProps, PDatePickerModelValue } from './PDatePickerTypes'
import { getCurrentDate, getWeekCount } from './PDatePickerUtils'

const props = withDefaults(defineProps<PDatePickerProps<T>>(), {
  pCalendarLite: false,
  pReadonly: false,
  pDisabled: undefined,
  pClearable: true,
  pType: 'date',
  pFormat: 'YYYY-MM-DD',
  pPlaceholder: '',
  pUnlinkPanels: false,
  pRangeSeparator: '-',
  pTeleported: true,
})

const emit = defineEmits<{
  'selected-date': [string]
  'calendar-change': [[Date, Date]]
  'panel-change': [T]
  'change': [T]
}>()

const datepickerModel = defineModel<T>()
const panelDate = ref<PDatePickerModelValue>()

watch(() => props.modelValue, () => {
  panelDate.value = undefined
})

const popperClassComputed = computed(() => {
  const popperClasses = []
  if (props.pCalendarLite) {
    popperClasses.push('p-date-picker')
    if (isLastWeekHidden.value) {
      popperClasses.push('p-date-picker--is-last-week-hidden')
    }
  }
  return popperClasses.join(' ')
})

function calendarChange(val: [Date, Date]) {
  emit('calendar-change', val)
}

function panelChange(val: PDatePickerModelValue) {
  panelDate.value = val
  emit('panel-change', val as T)
}

function handleChange(val: T) {
  emit('change', val)
}

function selectedDate(date: string) {
  emit('selected-date', date)
}

const isLastWeekHidden = computed(() => {
  const currentDate = getCurrentDate(props.modelValue, panelDate.value)
  const weekCount = getWeekCount(currentDate)

  return weekCount < 6
})

const prefixIcon = computed(() => getIconComponent('calendarEvent'))
</script>
<style lang="scss">
.p-date-picker {
  inset: unset !important;
  display: block !important;
  box-shadow: none !important;
  border: none !important;
  position: relative !important;
  &__input--hidden {
    display: none;
  }
  .d-arrow-left, .d-arrow-right {
    display: none !important;
  }
  .el-date-picker {
    width: 100%;
    .el-date-picker__header {
      margin: 0;
    }
    .el-picker-panel__content {
      width: 100%;
      margin: 0;
    }
  }
  .today {
    font-weight: 600;
    color: var(--p-jungle-400);
  }
  .current {
    font-weight: 600;
  }
  .el-date-picker__header {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 0;
    padding: 0 26px;
    margin-bottom: 7px;

    .el-date-picker__prev-btn,
    .el-date-picker__next-btn {
      position: absolute;
      top: 0;
      bottom: 0;
    }

    .el-date-picker__prev-btn {
      left: 0;
    }

    > span:nth-child(2) {
      order: 2;
    }

    > span:nth-child(3) {
      order: 1;
    }

    .el-date-picker__next-btn {
      right: 0;
    }
  }
  &--is-last-week-hidden .el-picker-panel__content {
    tr:nth-child(7) {
      display: none;
    }
  }
}

</style>
