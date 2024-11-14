<template>
  <div
    class="
      p-skewed-button
      font-base
      font-semibold
      cursor-pointer
      padding-x--6
      padding-y--4
    "
    :class="disabledClass"
    @click="handleClick">
    <button
      class="p-skewed-button__button"
      :disabled="pDisabled"
    >

      {{ pContent }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
// eslint-disable-next-line import/extensions
import type { PSkewedButtonProps } from './PSkewedButton.types'

const props = withDefaults(defineProps<PSkewedButtonProps>(), {
  pDisabled: false,
})

const disabledClass = computed(() => ({ 'p-skewed-button--disabled': props.pDisabled }))

function handleClick(event: MouseEvent) {
  if (props.pDisabled) {
    event.stopImmediatePropagation()
  }
}
</script>

<style scoped lang="scss">
.p-skewed-button {
  $self: &;
  display: inline-block;
  background: var(--el-color-base-blue-pulse);
  // A top-left angle of 120° and a bottom-left angle of 60°
  // are achieved with a 30° skew, based on the skew function’s mathematical result.
  transform: skew(-30deg);
  color: var(--el-color-base-white);
  // The skew effect is lengthening the button on the sides.
  // It increases the width by approximately 16px with a 30 degree skew and the paddings (4) on the y-axis.
  margin-left: 16px;
  transition: all 100ms ease-in-out;
  line-height: 1.6rem;

  &__button {
    transform: skew(30deg);
    // resetting native button styles
    background: none;
    color: inherit;
    border: none;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    padding: 0;
    line-height: 1.6rem;
  }

  &:not(&--disabled) {
    &:hover {
      background: var(--el-color-persian-600);
    }

    &:active {
      background: var(--el-color-persian-400);
    }
  }

  &--disabled {
    cursor: not-allowed;
    background: var(--el-color-neutral-gray-100);

    button {
      cursor: not-allowed;
    }
  }
}
</style>
