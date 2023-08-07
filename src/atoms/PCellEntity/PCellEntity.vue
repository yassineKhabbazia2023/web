<template>
  <div
    :type="type"
    :class="{ 'p-cell-entity': true, selected }"
    :selected="selected"
  >
    <div class="p-cell-entity__avatar">
      <PAvatar
        :shape="iconShape"
        :size="iconSize"
        :color="iconColor">
        <PIcon>
          <component :is="icon" />
        </PIcon>
      </PAvatar>
    </div>
    <div :class="{ 'p-cell-entity__content': true, 'text-left': true }">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'

interface PCellTextProps {
  content: string
  icon?: Component | string
  type: 'primary' | 'secondary'
  iconShape: string
  iconColor: string
  iconSize: string
  selected: boolean
}

withDefaults(defineProps<PCellTextProps>(), {
  type: 'primary',
  icon: '',
  iconShape: 'circle',
  iconColor: 'persian-gradient',
  iconSize: 'xsmall',
  selected: false
})
</script>

<style lang="scss" scoped>
.p-cell-entity {
  display: flex;
  align-items: center;
  min-height: 40px;
  gap: 8px;
  color: var(--el-fill-color-regular);
  padding: 0 12px;

  &[type="primary"]:not([selected="true"]) {
    background-color: transparent;
  }

  &[type="secondary"]:not([selected="true"]) {
    background-color: var(--el-fill-color-lighter);
  }

  &[selected="true"] {
    background-color: var(--el-color-persian-200);
  }

  &__avatar {
    top: 2px;
  }

  &__content {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 300px;
    font-family: Open Sans;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0em;
  }
}
</style>
