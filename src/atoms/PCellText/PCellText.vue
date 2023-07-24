<template>
  <div
    :type="type"
    :class="{ 'p-cell-text': true, 'padding--4': true, disabled, selected }"
    :disabled="disabled"
    :selected="selected">
    <div class="cell-icon" v-if="icon !== undefined">
      <PIcon :size="16">
        <component :is="icon" />
      </PIcon>
    </div>
    <div :class="{ 'cell-content': true, 'cell-content-bold': bold, 'text-left': true }">
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
  max-height: 40px;
  gap: 8px;
}

.p-cell-text[type="primary"]:not([disabled='true'], [selected='true']) {
  background-color: var(--el-fill-color-blank);
}

.p-cell-text[type="secondary"]:not([disabled='true'], [selected='true']) {
  background-color: var(--el-fill-color-light);
}

.p-cell-text[type="drag"]:not([disabled='true'], [selected='true']) {
  background-color: var(--el-color-primary);
  color:  var(--el-fill-color-blank);
}

.p-cell-text[disabled='true'] {
  background-color: var(--el-fill-color-extra-light);
  color: var(--el-fill-color);
}

.p-cell-text[selected='true'] {
  background-color: var(--el-color-persian-200);
  color:  var(--el-text-color-primary);
}

.cell-icon {
  top: 2px;
}

.cell-content {
  font-weight: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 300px;

  &-bold {
    font-weight: bold;
  }

}
</style>
