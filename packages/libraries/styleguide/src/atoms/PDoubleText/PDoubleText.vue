<template>
  <div
    class="p-double-text"
    :type="pType"
    :disabled="pDisabled"
    :selected="pSelected"
  >
    <div v-if="pIconName" class="p-double-text__icon">
      <PIcon
        v-if="pIconName"
        :size="16"
        :pName="pIconName"
      />
    </div>
    <div v-if="pProfile" class="p-double-text__icon">
      <PAvatar
        :pShape="pIconShape"
        :pType="pIconType"
        :pColor="pAvatarRole ? '' : pIconColor"
        :pRole="pAvatarRole"
      >
        {{ pProfile }}
      </PAvatar>
    </div>
    <div
      class="p-double-text__content"
      :class="{ 'font-bold': pBold }"
    >
      <div
        class="p-double-text__content-title"
        :disabled="pDisabled"
        :selected="pSelected"
      >
        {{ pTitle ?? '' }}
      </div>
      <div
        class="p-double-text__content-description"
        :disabled="pDisabled"
        :selected="pSelected"
      >
        {{ pContent ?? '' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PAvatar from '../../atoms/PAvatar'
import PIcon from '../../atoms/PIcon'
import type { PDoubleTextProps } from './PDoubleTextTypes'

withDefaults(defineProps<PDoubleTextProps>(), {
  pIconShape: 'circle',
  pIconColor: 'blue-pulse',
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
    background-color: var(--p-gray-50);
  }

  &[disabled='true'] {
    background-color: var(--el-fill-color-extra-light);
    color: var(--p-gray-300);
    cursor: not-allowed;
  }

  &[selected='true'] {
    background-color: var(--p-jungle-200);
    color: var(--p-gray-800);
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
      color: var(--p-gray-900);
      text-overflow: ellipsis;
      overflow: hidden;

      &[disabled='true']{
          color: var(--p-gray-300);
      }
      &[selected='true']{
          background-color: var(--p-jungle-200);
      }
    }

    &-description {
      font-size: 12px;
      color: var(--p-gray-500);
      text-overflow: ellipsis;
      overflow: hidden;

      &[disabled='true']{
          color: var(--p-gray-300);
      }
      &[selected='true']{
          background-color: var(--p-jungle-200);
      }
    }
  }
}
</style>
