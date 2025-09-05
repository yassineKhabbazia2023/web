<template>
  <div
    class="
      p-skewed-button
      font-base
      font-semibold
      cursor-pointer
      padding-x--6
    "
    :class="{
      'p-skewed-button--primary': props.pType === 'primary',
      'p-skewed-button--secondary': props.pType === 'secondary',
      'p-skewed-button--disabled': props.pDisabled,
    }"
    @click="handleClick"
  >
    <button
      class="
        p-skewed-button__button
        flex
        flex--align-items-center
      "
      :disabled="pDisabled"
    >
      <PLoader
        v-if="pHasLoader"
        pSize="16"
        pType="no-color"
        class="margin-right--3"
      />
      {{ pContent }}
    </button>
  </div>
</template>

<script setup lang="ts">
import PLoader from '../../atoms/PLoader'
import type { PSkewedButtonProps } from './PSkewedButton.types'

const props = withDefaults(defineProps<PSkewedButtonProps>(), {
  pType: 'primary',
  pDisabled: false,
})

function handleClick(event: MouseEvent) {
  if (props.pDisabled) {
    event.stopImmediatePropagation()
  }
}
</script>

<style scoped lang="scss">
@use '../../assets/scss/pegase/breakpoints';

.p-skewed-button {
  $self: &;
  display: inline-block;
  background: var(--p-black-rock-900);
  // A top-left angle of 120° and a bottom-left angle of 60°
  // are achieved with a 30° skew, based on the skew function's mathematical result.
  transform: skew(-30deg);
  color: var(--p-white);
  // The skew effect is lengthening the button on the sides.
  // It increases the width by approximately 13px with a 30 degree skew and the paddings (4) on the y-axis.
  margin-left: 13px;
  margin-right: 13px;
  transition: all 100ms ease-in-out;
  line-height: 1.6rem;
  // Intentionally ignoring our spacing rules here due to the component's unusual design
  padding-top: 14px;
  padding-bottom: 14px;

  @include breakpoints.media(xxs) {
    font-size: 1.2rem;
    padding-top: 12px;
    padding-bottom: 12px;
  }

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

  &--primary {
    &:hover {
      background: var(--p-jungle-600);
    }

    &:active {
      background: var(--p-jungle-400);
    }
  }

  &--secondary {
    background: var(--p-jungle-50);
    color: var(--p-black-rock-900);

    &:hover {
      background: var(--p-humming-bird-100);
    }

    &:active {
      background: var(--p-humming-bird-200);
    }
  }

  &--disabled {
    cursor: not-allowed;
    background: var(--p-gray-100);
    color: var(--p-gray-500);

    button {
      cursor: not-allowed;
    }

    &:hover {
      background: var(--p-gray-100);
    }
  }
}
</style>
