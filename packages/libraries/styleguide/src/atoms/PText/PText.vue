<template>
  <div
    :class="[pClassMapper, 'p-text', { disabled, selected }]"
    :disabled="disabled"
    :selected="selected"
  >
    <div v-if="pIcon" class="p-text__icon">
      <PIcon :size="16">
        <component :is="pIcon" />
      </PIcon>
    </div>
    <div :class="['p-text__content', { 'font-bold': pBold }]">
      {{ pContent ?? '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PIcon from '../PIcon'
import type { PTextProps } from './PTextTypes'

const props = withDefaults(defineProps<PTextProps>(), {
  pIcon: undefined,
  pBold: false,
  selected: false,
  disabled: false,
})

const pClassMapper = computed(() => ({
  [`p-text--type-${props.pType}`]: true,
}))
</script>

<style lang="scss" scoped>
.p-text {
  display: flex;
  align-items: center;
  min-height: 40px;
  overflow: hidden;

  &--type-primary:not([disabled='true'], [selected='true']) {
    background-color: transparent;
  }

  &--type-secondary:not([disabled='true'], [selected='true']) {
    background-color: var(--el-fill-color-light);
  }

  &--type-drag:not([disabled='true'], [selected='true']) {
    background-color: var(--el-color-primary);
    color:  var(--el-fill-color-blank);
  }

  &--type-drag[disabled='true']:not([selected='true']) {
    background-color: var(--el-color-neutral-gray-300);
    color:  var(--el-color-neutral-gray-700);
  }

  &[disabled='true'] {
    background-color: var(--el-fill-color-extra-light);
    color: var(--el-fill-color);
  }

  &[selected='true'] {
    background-color: var(--el-color-persian-200);
    color:  var(--el-text-color-primary);
  }

  &__icon {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }

  &__content {
    font-weight: normal;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
