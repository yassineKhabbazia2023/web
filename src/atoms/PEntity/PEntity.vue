<template>
  <div
    :type="type"
    :class="['p-entity', { selected }]"
    :selected="selected"
  >
    <div class="p-entity__avatar">
      <PAvatar
        :pShape="iconShape"
        :pType="iconType"
        :pColor="iconColor">
        <PIcon>
          <component :is="icon" />
        </PIcon>
      </PAvatar>
    </div>
    <div :class="['p-entity__content', 'text-left', { 'p-entity__content--bold': bold }]">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'

export interface PTextProps {
  content: string
  icon?: Component | string
  type: 'primary' | 'secondary'
  iconShape: string
  iconColor: string
  iconType: string
  bold?: boolean
  selected: boolean
}

withDefaults(defineProps<PTextProps>(), {
  type: 'primary',
  icon: '',
  iconShape: 'circle',
  iconColor: 'persian-gradient',
  iconType: 'xsmall',
  bold: false,
  selected: false
})
</script>

<style lang="scss" scoped>
.p-entity {
  display: flex;
  align-items: center;
  min-height: 40px;
  gap: 8px;
  color: var(--el-fill-color-regular);

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
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0em;

    &--bold {
      font-weight: 700;
    }
  }
}
</style>
