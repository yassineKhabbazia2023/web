<template>
    <div
      :type="type"
      :class="{ 'p-double-text': true, disabled, selected }"
      :disabled="disabled"
      :selected="selected">
      <div class="p-double-text__icon" v-if="icon">
        <PIcon :size="16">
          <component :is="icon" />
        </PIcon>
      </div>
      <div class="p-double-text__icon" v-if="profile">
        <PAvatar
          :shape="iconShape"
          :size="iconSize"
          :color="iconColor">
          {{ profile }}
        </PAvatar>
      </div>
      <div :class="{ 'p-double-text__content': true, 'p-double-text--bold': bold }">
        <div
          :class="{ 'p-double-text__content-title': true, disabled, selected}"
          :disabled="disabled"
          :selected="selected"
        >
          {{ title }}
        </div>
        <div
          :class="{ 'p-double-text__content-description': true, disabled, selected }"
          :disabled="disabled"
          :selected="selected"
        >
          {{ content }}
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { type Component } from 'vue'

interface PDoubleTextProps {
  icon?: Component | string
  profile: string
  title: string
  content: string
  iconShape: string
  iconColor: string
  iconSize: string
  type: 'primary' | 'secondary'
  selected: boolean
  disabled: boolean
  bold?: boolean
}

withDefaults(defineProps<PDoubleTextProps>(), {
  icon: undefined,
  iconShape: 'circle',
  iconColor: 'persian-gradient',
  bold: false,
  iconSize: 'small'
})
</script>
<style lang="scss" scoped>
.p-double-text {
  display: flex;
  align-items: center;
  height: 65px;
  gap: 8px;
  padding: 0 12px;

  &[type="primary"]:not([disabled='true'], [selected='true']) {
    background-color: transparent;
  }

  &[type="secondary"]:not([disabled='true'], [selected='true']) {
    background-color: var(--el-color-neutral-gray-50);
  }

  &[disabled='true'] {
    background-color: var(--el-fill-color-extra-light);
    color: var(--el-color-neutral-gray-300);
    cursor: not-allowed;
  }

  &[selected='true'] {
    background-color: var(--el-color-persian-200);
    color: var(--el-text-color-primary);
  }

  &__icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    font-weight: normal;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 300px;

    &-title {
      font-size: 14px;
      line-height: 16.8px;
      color: var(--el-color-neutral-gray-900);

      &[disabled='true']{
          color: var(--el-color-neutral-gray-300);
      }
      &[selected='true']{
          background-color: var(--el-color-persian-200);
      }
    }

    &-description {
      margin-top: 10px;
      font-size: 12px;
      line-height: 14.4px;
      color: var(--el-color-neutral-gray-500);

      &[disabled='true']{
          color: var(--el-color-neutral-gray-300);
      }
      &[selected='true']{
          background-color: var(--el-color-persian-200);
      }
    }

    &--bold {
      font-weight: 700;
    }
  }
}
</style>
