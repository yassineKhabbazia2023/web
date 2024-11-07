<template>
  <div
    class="p-double-text"
    :type="pType"
    :disabled="pDisabled"
    :selected="pSelected"
  >
    <div class="p-double-text__icon" v-if="pIcon">
      <PIcon :size="16">
        <component :is="pIcon" />
      </PIcon>
    </div>
    <div class="p-double-text__icon" v-if="pProfile">
      <PAvatar
        :pShape="pIconShape"
        :pType="pIconType"
        :pColor="pIconColor">
        {{ pProfile }}
      </PAvatar>
    </div>
    <div :class="{ 'p-double-text__content': true, 'p-double-text--bold': pBold }">
      <div
        class="p-double-text__content-title"
        :disabled="pDisabled"
        :selected="pSelected"
      >
        {{ pTitle }}
      </div>
      <div
        class="p-double-text__content-description"
        :disabled="pDisabled"
        :selected="pSelected"
      >
        {{ pContent }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PAvatar from '@styleguide/atoms/PAvatar'
import PIcon from '@styleguide/atoms/PIcon'
import type { PDoubleTextProps } from './PDoubleTextTypes'

withDefaults(defineProps<PDoubleTextProps>(), {
  pIcon: undefined,
  pIconShape: 'circle',
  pIconColor: 'persian-gradient',
  pBold: false,
  pIconType: 'small',
  pSelected: false,
  pDisabled: false,
})
</script>

<style lang="scss" scoped>
.p-double-text {
  display: flex;
  align-items: center;
  height: 65px;
  gap: 8px;

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
      text-overflow: ellipsis;
      overflow: hidden;

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
      text-overflow: ellipsis;
      overflow: hidden;

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
