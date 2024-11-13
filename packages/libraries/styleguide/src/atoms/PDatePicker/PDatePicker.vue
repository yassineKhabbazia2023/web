<template>
  <ElDatePicker
    :prefixIcon="PICalendarEvent"
    v-model="datepickerModel"
    :popperClass="popperClassComputed"
    :class="{ 'p-date-picker__input--hidden': pCalendarLite }"
    :type="pType"
    :rangeSeparator="pRangeSeparator"
    :startPlaceholder="pStartPlaceholder"
    :endPlaceholder="pEndPlaceholder"
    :format="pFormat"
    :unlinkPanels="pUnlinkPanels"
    :shortcuts="pShortcuts"
    @change="handleChange"
    @calendar-change="calendarChange"
    @panel-change="panelChange"
    :disabled="pDisabled"
    :placeholder="pPlaceholder"
    :clearable="pClearable"
    :teleported="pTeleported"
  >
    <template
      #default="{ isCurrent, dayjs, text, type }"
      v-if="pCalendarLite"
    >
      <div
        :class="{ current:isCurrent, 'el-date-table-cell': true }"
        @click="selectedDate(dayjs.format('YYYY-MM-DD'))"
        data-testid="date-picker-table-cell"
      >
        <span class="el-date-table-cell__text">{{ text }}</span>
        <span
          v-if="isScheduledDay(dayjs)"
          :class="scheduleDateStyle(type)"
        />
      </div>
    </template>
    <slot v-if="!pCalendarLite" />
  </ElDatePicker>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { ElDatePicker } from 'element-plus'
import { PICalendarEvent } from '../../atoms/PIcon/components'
import type { PDatePickerProps, PDatePickerModelValue, calendarEvent } from './PDatePickerTypes'
import { getCurrentDate, getWeekCount } from './PDatePickerUtils'

const props = withDefaults(defineProps<PDatePickerProps>(), {
  pCalendarLite: false,
  pMonth: '',
  pReadonly: false,
  pDisabled: false,
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
  'update:modelValue': [PDatePickerModelValue]
  'calendar-change': [[Date, Date]]
  'panel-change': [PDatePickerModelValue]
  'change': [Date]
}>()

const datepickerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
const panelDate = ref<PDatePickerModelValue>()

watch(() => props.pMonth, (value: calendarEvent) => {
  if (value) {
    actOnDatepicker(value)
  }
})

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

const isScheduledDay = (dayjs: any) => {
  return Array.isArray(props.pSchedulesCollection) && props.pSchedulesCollection.includes(dayjs.format('YYYY-MM-DD'))
}

const scheduleDateStyle = (type: string) => {
  const commonClass = {
    cell__schedule: true,
  }
  if (type === 'prev-month' || type === 'next-month') {
    return Object.assign(commonClass, {
      'cell__schedule--inactive': true,
    })
  }
  return Object.assign(commonClass, {
    'cell__schedule--active': true,
  })
}

const actOnDatepicker = (value: calendarEvent) => {
  if (value === 'next-month' || value === 'prev-month') {
    const classMapper = {
      'next-month': 'el-picker-panel__icon-btn arrow-right',
      'prev-month': 'el-picker-panel__icon-btn arrow-left',
    }
    const element: HTMLElement = document.getElementsByClassName(classMapper[value])[0] as HTMLElement
    return element.click()
  }
  datepickerModel.value = (new Date()).toISOString().split('T')[0]
}

function calendarChange(val: [Date, Date]) {
  emit('calendar-change', val)
}

function panelChange(val: PDatePickerModelValue) {
  panelDate.value = val
  emit('panel-change', val)
}

function handleChange(val: Date) {
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
    color: var(--el-color-persian-500);
  }
  .current {
    font-weight: 600;
  }
  .cell {
    &__schedule {
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      bottom: -2px;
      left: 50%;
      transform: translateX(-51%);
      outline: 2px solid white;
      &--active {
        background: var(--el-color-functionnal-red);
      }
      &--inactive {
        background: var(--el-color-neutral-gray-300);
      }
    }
  }
  .el-date-picker__header {
    display: flex;
    justify-content: space-between;
    span:nth-child(1) {
      order: 1;
    }
    span:nth-child(2) {
      order: 3;
      flex-grow: 2;
      text-align: left;
    }
    span:nth-child(3) {
      order: 2;
      flex-grow: 2;
      text-align: right;
    }
    span:nth-child(4) {
      order: 4;
    }
  }
  &--is-last-week-hidden .el-picker-panel__content {
    tr:nth-child(7) {
      display: none;
    }
  }
}

</style>
