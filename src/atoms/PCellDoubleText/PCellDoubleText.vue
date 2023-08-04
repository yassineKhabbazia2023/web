<template>
    <div
      :type="type"
      :class="{ 'p-cell-double-text': true, disabled, selected }"
      :disabled="disabled"
      :selected="selected">
      <div class="p-cell-double-text__icon" v-if="icon !== undefined">
        <PIcon :size="16">
          <component :is="icon" />
        </PIcon>
        <PAvatar
          :shape="iconShape"
          :size="iconSize"
          :color="iconColor">
          {{ profile }}
        </PAvatar>
      </div>
      <div class="p-cell-double-text__content">
        <div
          :class="{ 'p-cell-double-text__content-title': true, disabled, selected}"
          :disabled="disabled"
          :selected="selected"
        >
          {{ title }}
        </div>
        <div
          :class="{ 'p-cell-double-text__content-description': true, disabled, selected }"
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

interface pCellDoubleTextProps {
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
}

withDefaults(defineProps<pCellDoubleTextProps>(), {
  icon: undefined,
  iconShape: 'circle',
  iconColor: 'persian-gradient',
  iconSize: 'small'
})
</script>
<style lang="scss" scoped>
.p-cell-double-text {
  display: flex;
  align-items: center;
  height: 65px;
  gap: 8px;
  padding: 0 12px;

  &[type="primary"]:not([disabled='true'], [selected='true']) {
    background-color: transparent;

    &:hover {
      background-color: var(--el-color-persian-100);
    }
  }

  &[type="secondary"]:not([disabled='true'], [selected='true']) {
    background-color: var(--el-color-neutral-gray-50);

    &:hover {
      background-color: var(--el-color-persian-100);
    }
  }

  &[disabled='true'] {
    background-color: var(--el-fill-color-extra-light);
    color: var(--el-color-neutral-gray-300);
    cursor: not-allowed;
  }

  &[selected='true'] {
    background-color: var(--el-color-persian-200);
    color:  var(--el-text-color-primary);
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
  }
}
</style>
