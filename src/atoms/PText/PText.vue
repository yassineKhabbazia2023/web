<template>
  <div
    :type="type"
    :class="['p-text', 'padding--4', { disabled, selected }]"
    :disabled="disabled"
    :selected="selected">
    <div class="p-text__icon" v-if="icon">
      <PIcon :size="16">
        <component :is="icon" />
      </PIcon>
    </div>
    <div :class="['p-text__content', { 'p-text__content--bold': bold }]">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'

export interface PTextProps {
  icon?: Component | string
  content: string
  bold?: boolean
  type: 'primary' | 'secondary' | 'drag'
  selected: boolean
  disabled: boolean
}

withDefaults(defineProps<PTextProps>(), {
  icon: undefined,
  bold: false,
  background: false
})
</script>
<style lang="scss" scoped>
.p-text {
  display: flex;
  align-items: center;
  min-height: 40px;
  gap: 8px;

  &[type="primary"]:not([disabled='true'], [selected='true']) {
    background-color: transparent;
  }

  &[type="secondary"]:not([disabled='true'], [selected='true']) {
    background-color: var(--el-fill-color-light);
  }

  &[type="drag"]:not([disabled='true'], [selected='true']) {
    background-color: var(--el-color-primary);
    color:  var(--el-fill-color-blank);
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
  }

  &__content {
    font-weight: normal;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    &--bold {
      font-weight: 700;
    }
  }
}
</style>
