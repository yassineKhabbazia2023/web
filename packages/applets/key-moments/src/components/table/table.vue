<template>
  <PTable
    class="key-moments-table"
    :pData="rows"
    :pCellStyle="getCellStyle"
    :pTestId="`key-moments-${widgetId}-table`"
    pRowKey="id"
    pStripe
  >
    <PTableColumn
      :pLabel="t('keyMoments.table.label')"
      pClassName="key-moments-table__label-cell"
      pLabelClassName="key-moments-table__label-header"
      :pMinWidth="resolvedLabelMinWidth"
    >
      <template #default="{ row }">
        <span :class="getRowClasses(row)">{{ row.label }}</span>
        <DefinitionHint
          v-if="row.description !== undefined"
          :definition="row.description"
          :testId="`key-moments-${widgetId}-${row.id}-definition`"
        />
      </template>
    </PTableColumn>
    <PTableColumn
      v-for="column in columns"
      :key="column.key"
      :pLabelClassName="column.isVariation ? 'key-moments-table__variation-header' : undefined"
      pAlign="right"
      pHeaderAlign="right"
      :pMinWidth="resolvedValueMinWidth"
    >
      <!-- The header cell is a flex row: the wrapper is what stacks the two lines -->
      <template #header>
        <span
          class="
            key-moments-table__header
            flex
            flex--direction-column
            flex--align-items-flex-end
          "
        >
          <span
            class="
              key-moments-table__header-title
              font-bold
              text-uppercase
            "
          >
            {{ column.title }}
          </span>
          <span
            v-if="column.caption !== undefined"
            class="key-moments-table__header-caption font-normal"
          >
            {{ column.caption }}
          </span>
        </span>
      </template>
      <template #default="{ row }">
        <span
          class="key-moments-table__value no-wrap"
          :class="getCellClasses(row, column.key)"
        >
          {{ getCell(row, column.key).value }}
        </span>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CSSProperties } from 'vue'
import { useResponsive } from '@pulse/styleguide'
import { PTable, PTableColumn } from '@pulse/styleguide/components'
import { LineRole } from '../../enums/key-moments.enums'
import { ROLE_CELL_STYLE, TREND_TEXT_COLOR_CLASS } from '../../const/key-moments.consts'
import DefinitionHint from '../definition-hint/definition-hint.vue'
import type { Cell, Row, TableView } from '../../types/key-moments.types'

const DEFAULT_LABEL_MIN_WIDTH = 260

// Keeps the first column of figures on screen, which says the table scrolls sideways
const MOBILE_LABEL_MIN_WIDTH = 150

const VALUE_MIN_WIDTH = 96

// Floor below which an amount, never wrapped nor cut, would overflow its column
const MOBILE_VALUE_MIN_WIDTH = 68

const props = withDefaults(defineProps<{
  widgetId: string
  columns: TableView['columns']
  rows: TableView['rows']
  /** Narrowed when the widget is shared: a label can wrap, an amount cannot. */
  labelMinWidth?: number
}>(), {
  labelMinWidth: DEFAULT_LABEL_MIN_WIDTH,
})

const { t } = useI18n()

const { isMobile } = useResponsive()

// Never wider than what the caller asked for
const resolvedLabelMinWidth = computed(() => (isMobile.value
  ? Math.min(props.labelMinWidth, MOBILE_LABEL_MIN_WIDTH)
  : props.labelMinWidth))

const resolvedValueMinWidth = computed(
  () => (isMobile.value ? MOBILE_VALUE_MIN_WIDTH : VALUE_MIN_WIDTH),
)

function getRowClasses(row: Row): string[] {
  if (row.role === LineRole.MEMO) {
    return ['font-italic', 'text-color--text-neutral']
  }

  if (row.role === LineRole.TOTAL || row.role === LineRole.SUBTOTAL) {
    return ['font-bold']
  }

  return []
}

function getCell(row: Row, columnKey: string): Cell {
  return row.cells[columnKey]
}

function getCellClasses(row: Row, columnKey: string): string[] {
  return [...getRowClasses(row), TREND_TEXT_COLOR_CLASS[getCell(row, columnKey).trend]]
}

// Element-plus only lets a background reach the cell itself, not a column class
function getCellStyle({ row }: { row: Record<string, unknown> }): CSSProperties {
  const { role } = row as unknown as Row

  return role === undefined ? {} : ROLE_CELL_STYLE[role] ?? {}
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.key-moments-table {
  --el-table-header-bg-color: var(--p-black-rock-900);
  --el-table-header-text-color: var(--p-text-white);
  --el-table-row-hover-bg-color: var(--p-mint-tulip-100);
  --el-table-border-color: var(--key-moments-line);
  --el-fill-color-lighter: var(--key-moments-stripe-surface);

  font-size: 13px;

  :deep(thead th.el-table__cell) {
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.02em;

    .cell {
      min-height: 34px;
    }
  }

  :deep(thead th.el-table__cell.key-moments-table__label-header .cell) {
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__header {
    line-height: 1.25;
  }

  &__header-title {
    letter-spacing: 0.06em;
  }

  &__header-caption {
    font-size: 10.5px;
    letter-spacing: 0;
    opacity: 0.75;
  }

  // The styleguide drops the cell borders, the report separates every line
  :deep(tbody td.el-table__cell) {
    border-bottom: 1px solid var(--key-moments-line);

    .cell {
      min-height: 32px;
    }
  }

  :deep(.key-moments-table__label-cell .cell) {
    white-space: normal;
  }

  &__value {
    font-variant-numeric: tabular-nums;
  }

  :deep(thead th.el-table__cell.key-moments-table__variation-header) {
    background-color: var(--p-jungle-400);
    border-left: 1px solid var(--p-text-white);
  }

  @include breakpoints.media(xs) {
    font-size: 11px;

    :deep(thead th.el-table__cell) {
      font-size: 10px;
    }

    // The dates restate the title and would set the width of every column
    &__header-caption {
      display: none;
    }

    :deep(td.el-table__cell .cell),
    :deep(th.el-table__cell .cell) {
      padding: 0 6px;
    }
  }
}
</style>
