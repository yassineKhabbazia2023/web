<template>
  <div class="p-responsive-table">
    <!-- Desktop: PTable (always rendered for ElTableColumn context, hidden on mobile) -->
    <PTable
      :pData="pData"
      :pStripe="pStripe"
      :pFit="pFit"
      :pHeaderCellStyle="pHeaderCellStyle"
      :pCellStyle="pCellStyle"
      :pDefaultSort="pDefaultSort"
      :class="{ 'p-responsive-table--hidden': shouldDisplayResponsiveCard === true }"
      v-bind="$attrs"
      @row-click="$emit('row-click', $event)"
    >
      <slot />
    </PTable>

    <!-- Mobile: Card list -->
    <div
      v-if="shouldDisplayResponsiveCard === true"
      class="p-responsive-table__mobile-list flex flex--direction-column"
    >
      <PResponsiveTableCard
        v-for="(row, index) in pData"
        :key="pRowKey ? row[pRowKey] : index"
        :pRow="row"
        :pClickable="pCardClickable"
        :pStriped="pStripe && index % 2 === 1"
        :pSelected="pIsRowSelected ? pIsRowSelected(row) : false"
        @click="onCardClick"
      >
        <template #title>
          <slot
            name="mobile-title"
            :row="row"
            :index="index"
          />
        </template>
        <template #actions>
          <slot
            name="mobile-actions"
            :row="row"
            :index="index"
          />
        </template>
        <template
          v-if="$slots['mobile-body']"
          #body
        >
          <slot
            name="mobile-body"
            :row="row"
            :index="index"
          />
        </template>
      </PResponsiveTableCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useResponsive } from '../../composables/use-responsive.composable'
import PTable from '../../atoms/PTable'
import PResponsiveTableCard from '../../atoms/PResponsiveTableCard'
import type { PResponsiveTableProps } from './PResponsiveTableTypes'
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PResponsiveTableProps>(), {
  pStripe: false,
  pFit: true,
  pCardClickable: false,
  pDisableResponsive: false,
})

const { isMobile } = useResponsive()
const shouldDisplayResponsiveCard = computed(() => props.pDisableResponsive === false && isMobile.value === true)

const emit = defineEmits<{
  'row-click': [row: Record<string, any>]
  'card-click': [row: Record<string, any>]
}>()

const onCardClick = (row: Record<string, any>) => {
  emit('row-click', row)
  emit('card-click', row)
}
</script>

<style lang="scss" scoped>
.p-responsive-table {
  &--hidden {
    display: none;
  }

  &__mobile-list {
    gap: 0;
  }
}
</style>
