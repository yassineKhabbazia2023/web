<template>
  <div class="contribution-heatmap">
    <div class="contribution-heatmap__month-labels">
      <span
        v-for="month in monthLabels"
        :key="month.label + month.column"
        class="contribution-heatmap__month-label"
        :style="{ gridColumn: month.column }"
      >
        {{ month.label }}
      </span>
    </div>

    <div class="contribution-heatmap__grid-wrapper">
      <div class="contribution-heatmap__day-labels">
        <span
          v-for="(label, index) in DAY_LABELS"
          :key="label"
          class="contribution-heatmap__day-label"
          :style="{ gridRow: index + 1 }"
        >
          {{ label }}
        </span>
      </div>

      <div class="contribution-heatmap__grid">
        <PTooltip
          v-for="(cell, index) in cells"
          :key="index"
          :pContent="`${cell.count} contribution${cell.count !== 1 ? 's' : ''} le ${cell.label}`"
          pPlacement="right"
        >
          <div
            class="contribution-heatmap__cell"
            :class="[
              `contribution-heatmap__cell--level-${getColorLevel(cell.count)}`,
              { 'contribution-heatmap__cell--selected': cell.dateKey === props.selectedDate },
            ]"
            :style="{ gridColumn: cell.column, gridRow: cell.row }"
            @click="emit('selectDate', cell.dateKey)"
          />
        </PTooltip>
      </div>
    </div>

    <div class="contribution-heatmap__legend">
      <span class="font-small text-color--neutral-gray-500">Moins</span>
      <div
        v-for="level in 5"
        :key="level"
        class="contribution-heatmap__cell"
        :class="`contribution-heatmap__cell--level-${level - 1}`"
      />
      <span class="font-small text-color--neutral-gray-500">Plus</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PTooltip } from '@pulse/styleguide/components'
import {
  DAY_LABELS, MONTH_NAMES, toDateKey, toUtcDays, formatDate, getColorLevel,
} from './contribution-graph.helper'

interface HeatmapCell {
  dateKey: string
  count: number
  label: string
  column: number
  row: number
}

interface MonthLabel {
  label: string
  column: number
}

const props = defineProps<{
  contributionsByDate: Map<string, number>
  startDate: Date
  endDate: Date
  selectedDate?: string | null
}>()

const emit = defineEmits<{
  selectDate: [dateKey: string]
}>()

const cells = computed((): HeatmapCell[] => {
  const result: HeatmapCell[] = []
  const current = new Date(props.startDate)

  while (current <= props.endDate) {
    const dayOfWeek = current.getDay()
    // Convert Sunday=0..Saturday=6 to Monday=1..Sunday=7
    const row = dayOfWeek === 0 ? 7 : dayOfWeek
    const daysSinceStart = toUtcDays(current) - toUtcDays(props.startDate)
    const column = Math.floor(daysSinceStart / 7) + 1

    const dateKey = toDateKey(current)
    const count = props.contributionsByDate.get(dateKey) ?? 0

    result.push({
      dateKey,
      count,
      label: formatDate(current),
      column,
      row,
    })

    current.setDate(current.getDate() + 1)
  }

  return result
})

const monthLabels = computed((): MonthLabel[] => {
  const labels: MonthLabel[] = []
  const seen = new Set<string>()
  const current = new Date(props.startDate)

  while (current <= props.endDate) {
    const monthKey = `${current.getFullYear()}-${current.getMonth()}`

    if (seen.has(monthKey) === false) {
      seen.add(monthKey)
      const daysSinceStart = toUtcDays(current) - toUtcDays(props.startDate)
      const column = Math.floor(daysSinceStart / 7) + 1

      labels.push({
        label: MONTH_NAMES[current.getMonth()],
        column,
      })
    }

    // Jump to first day of next month
    current.setMonth(current.getMonth() + 1, 1)
  }

  return labels
})
</script>

<style scoped>
.contribution-heatmap {
  --heatmap-level-0: #ebedf0;
  --heatmap-level-1: #9be9a8;
  --heatmap-level-2: #40c463;
  --heatmap-level-3: #30a14e;
  --heatmap-level-4: #216e39;

  display: inline-flex;
  flex-direction: column;
  gap: 8px;
}

.contribution-heatmap__month-labels {
  display: grid;
  grid-auto-columns: 14px;
  gap: 2px;
  padding-left: 32px;
  font-size: 11px;
  color: var(--el-text-color-secondary, #909399);
}

.contribution-heatmap__month-label {
  white-space: nowrap;
}

.contribution-heatmap__grid-wrapper {
  display: flex;
  gap: 4px;
}

.contribution-heatmap__day-labels {
  display: grid;
  grid-template-rows: repeat(7, 14px);
  gap: 2px;
  width: 28px;
}

.contribution-heatmap__day-label {
  font-size: 11px;
  color: var(--el-text-color-secondary, #909399);
  display: flex;
  align-items: center;
}

.contribution-heatmap__grid {
  display: grid;
  grid-template-rows: repeat(7, 14px);
  grid-auto-columns: 14px;
  gap: 2px;
}

.contribution-heatmap__cell {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  cursor: pointer;
}

.contribution-heatmap__cell--selected {
  outline: 2px solid var(--el-color-primary, #409eff);
  outline-offset: 1px;
}

.contribution-heatmap__cell--level-0 {
  background-color: var(--heatmap-level-0);
}

.contribution-heatmap__cell--level-1 {
  background-color: var(--heatmap-level-1);
}

.contribution-heatmap__cell--level-2 {
  background-color: var(--heatmap-level-2);
}

.contribution-heatmap__cell--level-3 {
  background-color: var(--heatmap-level-3);
}

.contribution-heatmap__cell--level-4 {
  background-color: var(--heatmap-level-4);
}

.contribution-heatmap__legend {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
}
</style>
