<template>
  <div
    :class="[pClassMapper, 'p-text', { disabled, selected }]"
    :disabled="disabled"
    :selected="selected"
  >
    <div v-if="pIconName" class="p-text__icon">
      <PIcon
        v-if="pIconName"
        :size="16"
        :pName="pIconName"
      />
    </div>
    <div
      :class="['p-text__content', { 'font-bold': pBold }]"
      @click="$emit('p-text-content-clicked')"
    >
      {{ pContent ?? '' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PIcon from '../PIcon'
import type { PTextProps } from './PTextTypes'

const props = withDefaults(defineProps<PTextProps>(), {
  pBold: false,
  selected: false,
  disabled: false,
  pIsUnderlinedOnHover: false,
})

defineEmits<{
  'p-text-content-clicked': [void],
}>()

const pClassMapper = computed(() => ({
  [`p-text--type-${props.pType}`]: true,
  ['p-text--is-underlined-on-hover']: props.pIsUnderlinedOnHover,
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
    background-color: var(--p-jungle-400);
    color:  var(--p-white);
  }

  &--type-drag[disabled='true']:not([selected='true']) {
    background-color: var(--p-gray-300);
    color:  var(--p-gray-700);
  }

  &[disabled='true'] {
    background-color: var(--el-fill-color-extra-light);
    color: var(--el-fill-color);
  }

  &[selected='true'] {
    background-color: var(--p-jungle-200);
    color:  var(--p-gray-800);
  }

  &--is-underlined-on-hover {
    .p-text__content:hover {
      text-decoration: underline;
    }
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
