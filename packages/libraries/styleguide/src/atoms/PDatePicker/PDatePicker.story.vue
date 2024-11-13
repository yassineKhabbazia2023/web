<template>
  <Story
    title="2. Atoms/DatePicker"
    icon="carbon:calendar"
    :layout="{ type: 'grid', width: 480 }"
  >
    <Variant title="Basic Usage">
      <PDatePicker
        v-model="date"
        pType="date"
        pValueFormat="DD/MM/YYYY"
        pFormat="DD/MM/YYYY"
        pPlaceholder="Pick a day"
        :pDisabledDate="disabledDate"
        @blur="logEvent('blur', $event)"
        @focus="logEvent('focus', $event)"
        @change="handleChange"
        @visible-change="visibleChange"
      />
    </Variant>

    <Variant title="Quick options">
      <div class="block">
        <span class="demonstration">Picker with quick options</span>
        <PDatePicker
          v-model="date"
          pType="date"
          pPlaceholder="Pick a day"
          :pDisabledDate="disabledDate"
          :pShortcuts="shortcuts"
          pValueFormat="DD/MM/YYYY"
          pFormat="DD/MM/YYYY"
        />
      </div>

      <template #controls>
        <HstText v-model="date" title="date input" />
      </template>
    </Variant>

    <Variant title="Other measurements">
      <div class="demo-date-picker">
        <div class="container">
          <div class="block">
            <span class="demonstration">Week</span>
            <PDatePicker
              v-model="date"
              pType="week"
              pFormat="[Semaine] ww"
              pPlaceholder="Pick a week" />
          </div>
          <div class="block">
            <span class="demonstration">Month</span>
            <PDatePicker
              v-model="date2"
              pType="month"
              pPlaceholder="Pick a month"
              pFormat="MM/YYYY" />
          </div>
        </div>
        <div class="container">
          <div class="block">
            <span class="demonstration">Year</span>
            <PDatePicker
              v-model="date3"
              pType="year"
              pPlaceholder="Pick a year" />
          </div>
          <div class="block">
            <span class="demonstration">Dates</span>
            <PDatePicker
              v-model="date4"
              pType="dates"
              pFormat="DD/MM/YYYY"
              pPlaceholder="Pick one or more dates" />
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Date Range">
      <div class="demo-date-picker">
        <div class="block">
          <span class="demonstration">Default</span>
          <PDatePicker
            v-model="dateRange"
            pType="daterange"
            pRangeSeparator="To"
            pStartPlaceholder="Start date"
            pEndPlaceholder="End date"
            pFormat="DD/MM/YYYY"
            @calendar-change="calendarChange"
          />
        </div>
        <div class="block">
          <span class="demonstration">With quick options</span>
          <PDatePicker
            v-model="dateRange2"
            pType="daterange"
            pUnlinkPanels
            pRangeSeparator="To"
            pStartPlaceholder="Start date"
            pEndPlaceholder="End date"
            :pShortcuts="shortcutsDataRange"
            @calendar-change="calendarChange"
            pFormat="DD/MM/YYYY"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Month Range">
      <div class="demo-date-picker">
        <div class="block">
          <span class="demonstration">Default</span>
          <PDatePicker
            v-model="dateMonth"
            pType="monthrange"
            pRangeSeparator="To"
            pStartPlaceholder="Start month"
            pEndPlaceholder="End month"
            pFormat="MM/YYYY"
          />
        </div>
        <div class="block">
          <span class="demonstration">With quick options</span>
          <PDatePicker
            v-model="dateMonth2"
            pType="monthrange"
            pUnlinkPanels
            pRangeSeparator="To"
            pStartPlaceholder="Start month"
            pEndPlaceholder="End month"
            :pShortcuts="shortcutsMountRange"
          />
        </div>
      </div>
    </Variant>

    <Variant title="Calendar Lite">
      <div>
        <PDatePicker
          v-model="dateCalendar"
          pType="date"
          pValueFormat="YYYY-MM-DD"
          pFormat="YYYY-MM-DD"
          pCalendarLite
          :pTeleported="false"
          :pSchedulesCollection="pSchedulesCollection"
        />
      </div>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { logEvent } from 'histoire/client'
import PDatePicker from '../../atoms/PDatePicker'

const date = ref('')
const dateRange = ref('')
const dateRange2 = ref('')
const dateMonth = ref('')
const dateMonth2 = ref('')
const date2 = ref('')
const date3 = ref('')
const date4 = ref('')
const dateCalendar = ref('')
const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]
const shortcutsDataRange = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const shortcutsMountRange = [
  {
    text: 'This month',
    value: [new Date(), new Date()],
  },
  {
    text: 'This year',
    value: () => {
      const end = new Date()
      const start = new Date(new Date().getFullYear(), 0)
      return [start, end]
    },
  },
  {
    text: 'Last 6 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 6)
      return [start, end]
    },
  },
]

const days = [5, 15, 23]
const pSchedulesCollection = days.map((day) => {
  const date = new Date()
  date.setDate(day)
  return date.toISOString().substring(0, 10)
})

function disabledDate(time: Date) {
  return time.getTime() > Date.now()
}
function handleChange(val: typeof date) {
  logEvent('change', { date: val })
}
function calendarChange(val: [Date, Date]) {
  logEvent('calendar-change', { calendarValue: val })
}
function visibleChange(val: boolean) {
  logEvent('visible-change', { visible: val })
}
</script>

<style>
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  flex: 1;
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}

.demo-date-picker .container {
  flex: 1;
}

.demo-date-picker .container .block {
  border-right: none;
}

.demo-date-picker .container:last-child {
  border-right: none;
}

</style>

<docs lang="md">
# DatePicker

Use Date Picker for date input.

<div class="reponsive-iframe-container">
  <iframe class="responsive-iframe"
  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D291%253A990%26mode%3Ddev" allowfullscreen></iframe>
</div>

## Basic Usage

Basic date picker measured by 'day'.

The measurement is determined by the `type` attribute.
You can enable quick options via `shortcuts` property.
The disabled date is set by `disabledDate`, which is a function.

## Other measurements

You can choose week, month, year or multiple dates by extending the standard date picker component.

## Date range

Picking a date range is supported.

When in range mode, the left and right panels are linked by default. If you want the two panels to switch current months independently, you can use the unlink-panels attribute.

## Month range

Picking a month range is supported.

When in range mode, the left and right panels are linked by default. If you want the two panels to switch current years independently, you can use the `unlink-panels` attribute.

## Default Value

If user hasn't picked a date, shows today's calendar by default. You can use `default-value` to set another date. Its value should be parsable by `new Date()`.

If type is `daterange`, `default-value` sets the left side calendar.

## Date Formats

Use `format` to control displayed text's format in the input box. Use `value-format` to control binding value's format.

By default, the component accepts and emits a `Date` object.

Check the list [here](https://day.js.org/docs/en/display/format#list-of-all-available-formats) of all available formats of Day.js.

> **WARNING**
> Pay attention to capitalization

## Default time for start date and end date

When picking a date range, you can assign the time part for start date and end date.

By default, the time part of start date and end date are both `00:00:00`. Setting `default-time` can change their time respectively. It accepts an array of up to two Date objects. The first string sets the time for the start date, and the second for the end date.

## Set custom content of prefix

The content of prefix can be customized.

Setting `prefix-icon` to component which you import form other .vue or generated by the render function.

## Custom content

The content of cell can be customized, in scoped-slot you can get the cell data.

## Localization

The default locale of is English, if you need to use other languages, please check [Internationalization](https://element-plus.gitee.io/en-US/guide/i18n.html)

Note, date time locale (month name, first day of the week ...) are also configured in localization.
</docs>
