<template>
  <div
    class="
      key-moments-balance-sheet
      grid
      grid-cols--2
    "
    :data-testid="`key-moments-${widgetId}-balance-sheet`"
  >
    <section
      v-for="side in sides"
      :key="side.key"
      class="key-moments-balance-sheet__side"
    >
      <h4
        class="
          key-moments-balance-sheet__title
          margin-bottom--2
          font-size--12
          font-semibold
          text-uppercase
        "
      >
        {{ t(`keyMoments.balanceSheet.${side.key}`) }}
      </h4>
      <Table
        :widgetId="`${widgetId}-${side.key}`"
        :columns="side.view.columns"
        :rows="side.view.rows"
        :labelMinWidth="SIDE_LABEL_MIN_WIDTH"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Table from '../table/table.vue'
import type { BalanceSheetView, TableView } from '../../types/key-moments.types'

const props = defineProps<{
  widgetId: string
  balanceSheet: BalanceSheetView
}>()

const { t } = useI18n()

// Minimum width so a label wraps instead of pushing the figure out
const SIDE_LABEL_MIN_WIDTH = 150

interface BalanceSheetSide {
  key: 'assets' | 'liabilities'
  view: TableView
}

/** Assets then liabilities — the reading order of a balance sheet. */
const sides = computed<BalanceSheetSide[]>(() => [
  { key: 'assets', view: props.balanceSheet.assets },
  { key: 'liabilities', view: props.balanceSheet.liabilities },
])
</script>

<style scoped lang="scss">
// Grid gutter separates the two halves so each reads as its own widget
.key-moments-balance-sheet {
  gap: 24px 26px;

  &__title {
    letter-spacing: 0.08em;
    color: var(--p-text-heading);
  }
}

// Stacks when widgets fall back to full width
@media (width <= 1050px) {
  .key-moments-balance-sheet {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
