<template>
  <div :class="['toolbox-item', { 'with-icon': hasIcon, disabled: disabled }]">
    <div class="toolbox-item__icon" v-if="hasIcon">
      <slot name="icon" />
    </div>
    <p class="toolbox-item__text">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface PToolboxItemProps {
  value: string | number;
  hasIcon?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<PToolboxItemProps>(), {
  hasIcon: false,
  disabled: false
})
</script>

<style lang="scss">
.toolbox-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;

  font-size: 1.4rem;
  line-height: 120%;
  color: var(--pulse-color-neutral-gray-900, #171717);
  user-select: none;

  cursor: pointer;

  &__icon {
    display: flex;
  }

  &:not(.disabled) {
    &:hover,
    &:active {
      background: var(--el-color-persian-50);
    }
    &:active {
      color: var(--el-color-persian-500);
      font-weight: 600;
    }
  }

  &.disabled {
    color: var(--el-color-neutral-gray-200);
    cursor: not-allowed;

    &__icon {
      fill: var(--el-color-neutral-gray-200);
    }
  }

  &__icon + &__text {
    margin-left: 8px;
  }
  &__text {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
