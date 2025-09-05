<template>
  <PTooltip
    v-if="pContentTooltip"
    :pContent="pContentTooltip"
    :pPlacement="pPlacementTooltip"
  >
    <button
      type="button"
      :class="['p-toolbox-item', pClassMapper]"
      :disabled="disabled"
    >
      <div v-if="pIconName" class="p-toolbox-item__icon margin-right--2">
        <PIcon size="16" :pName="pIconName" />
      </div>
      <p class="p-toolbox-item__text">
        {{ pValue }}
      </p>
    </button>
  </PTooltip>
  <button
    v-else
    type="button"
    :class="['p-toolbox-item', pClassMapper]"
    :disabled="disabled"
  >
    <div v-if="pIconName" class="p-toolbox-item__icon margin-right--2">
      <PIcon size="16" :pName="pIconName" />
    </div>
    <p class="p-toolbox-item__text">
      {{ pValue }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PTooltip from '../../atoms/PTooltip'
import type { PToolboxItemProps } from './PToolboxItemTypes'
import PIcon from '../../atoms/PIcon'

const props = withDefaults(defineProps<PToolboxItemProps>(), {
  disabled: false,
  pState: 'default',
  pIcon: '',
  pPlacementTooltip: 'left',
  pContentTooltip: undefined,
})

const pClassMapper = computed(() => ({
  [`p-toolbox-item--state-${props.pState}`]: true,
}))
</script>

<style lang="scss" scoped>
.p-toolbox-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 16px;
  background: none;
  border: none;
  appearance: none;
  font-size: 1.4rem;
  line-height: 120%;
  text-align: left;
  color: var(--p-gray-900);
  user-select: none;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  $self: &;

  &#{$self}--state {
    &-danger {
      color: var(--p-red-500);

      &:not([disabled]) {
        &:hover {
          color: var(--p-red-800);
        }

        &:hover,
        &:active,
        &:focus {
          background: var(--p-red-100);
        }

        &:active,
        &:focus {
          font-weight: 600;
          color: var(--p-red-500);
        }
      }
    }
  }

  &__icon {
    display: flex;
  }

  &:not([disabled]) {
    &:hover {
      background: var(--p-jungle-50);
    }
    &:active {
      background: var(--p-jungle-75);
    }
    &:active {
      color: var(--p-jungle-400);
      font-weight: 600;
    }
  }

  &:disabled {
    color: var(--p-gray-300);
    cursor: not-allowed;

    &__icon {
      fill: var(--p-gray-300);
    }
  }

  &__text {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
