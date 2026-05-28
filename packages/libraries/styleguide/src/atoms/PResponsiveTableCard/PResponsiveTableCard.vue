<template>
  <div
    :class="[
      'p-responsive-table-card',
      'padding--3',
      {
        'p-responsive-table-card--clickable': pClickable,
        'p-responsive-table-card--striped': pStriped,
        'p-responsive-table-card--selected': pSelected,
      }
    ]"
    @click="onClick"
  >
    <div class="p-responsive-table-card__header flex flex--justify-content-space-between flex--align-items-center">
      <div class="p-responsive-table-card__title">
        <slot name="title" :row="pRow" />
      </div>
      <div class="p-responsive-table-card__actions">
        <slot name="actions" :row="pRow" />
      </div>
    </div>
    <div
      v-if="hasBodySlot"
      class="p-responsive-table-card__body margin-top--2"
    >
      <slot name="body" :row="pRow" />
    </div>
    <slot :row="pRow" />
  </div>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import type { PResponsiveTableCardProps } from './PResponsiveTableCardTypes'

const props = withDefaults(defineProps<PResponsiveTableCardProps>(), {
  pClickable: false,
  pStriped: false,
  pSelected: false,
})

const slots = useSlots()
const hasBodySlot = computed(() => !!slots.body)

const emit = defineEmits<{
  click: [row: Record<string, any>]
}>()

const onClick = () => {
  if (props.pClickable) {
    emit('click', props.pRow)
  }
}
</script>

<style lang="scss" scoped>
.p-responsive-table-card {
  background-color: var(--p-white);
  border-left: 4px solid transparent;

  &--striped {
    background-color: var(--p-gray-50);
  }

  &--selected {
    border-left-color: var(--p-jungle-400);
  }

  &--clickable {
    cursor: pointer;

    &:hover {
      background-color: var(--p-gray-100);
    }

    &:active {
      background-color: var(--p-gray-200);
    }
  }

  &__title {
    flex: 1;
    min-width: 0;
  }

  &__actions {
    flex-shrink: 0;
    margin-left: 0.8rem;
  }

  &__body {
    font-size: 1.4rem;
    color: var(--p-gray-600);
  }
}
</style>
