<template>
  <div
    :type="type"
    :class="{ 'p-cell-text': true, 'padding--4': true, disabled, selected }"
    :disabled="disabled"
    :selected="selected">
    <div class="p-cell-text__icon" v-if="icon !== undefined">
      <PIcon :size="16">
        <component :is="icon" />
      </PIcon>
    </div>
    <div :class="{ 'p-cell-text__content': true, 'p-cell-text__content--bold': bold }">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'

interface PCellTextProps {
  icon?: Component | string
  content: string
  bold?: boolean
  type: 'primary' | 'secondary' | 'drag'
  selected: boolean
  disabled: boolean
}

withDefaults(defineProps<PCellTextProps>(), {
  icon: undefined,
  bold: false,
  background: false
})
</script>
<style lang="scss" scoped>
.p-cell-text {
  display: flex;
  align-items: center;
  height: 40px;
  gap: 8px;

  &[type="primary"]:not([disabled='true'], [selected='true']) {
    background-color: transparent;
  }

  &[type="primary"]:hover {
    background-color: var(--el-color-persian-100);
  }

  &[type="secondary"]:not([disabled='true'], [selected='true']) {
    background-color: var(--el-fill-color-light);
  }

  &[type="secondary"]:hover {
    background-color: var(--el-color-persian-200);
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

  &[disabled='true']:hover {
    background-color: var(--el-color-persian-100);
    color: var(--el-fill-color);
  }

  &[selected='true']:hover {
    background-color: var(--el-color-persian-300);
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
