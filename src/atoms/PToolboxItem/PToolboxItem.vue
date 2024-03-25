<template>
  <button
    type="button"
    :class="['p-toolbox-item', pClassMapper]"
    :disabled="disabled"
  >
    <div v-if="pIconName" class="p-toolbox-item__icon margin-right--2">
      <PIcon size="16">
        <component :is="resolvedIcons"></component>
      </PIcon>
    </div>
    <p class="p-toolbox-item__text">
      {{ pValue }}
    </p>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { iconResolver } from '@/utils/iconResolver'
import type { PToolboxItemProps } from './PToolboxItemTypes'

const props = withDefaults(defineProps<PToolboxItemProps>(), {
  disabled: false,
  pState: 'default',
  pIconName: '',
})

const pClassMapper = computed(() => ({
  [`p-toolbox-item--state-${props.pState}`]: true,
}))

const resolvedIcons = computed(() => {
  return iconResolver(props.pIconName)
})
</script>

<style lang="scss" scoped>
.p-toolbox-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px 16px;
  background: none;
  border: none;
  appearance: none;
  font-size: 1.4rem;
  line-height: 120%;
  text-align: left;
  color: var(--el-color-neutral-gray-900);
  user-select: none;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  $self: &;

  &#{$self}--state {
    &-danger {
      color: var(--el-color-functionnal-red);

      &:not([disabled]) {
        &:hover {
          color: var(--el-color-functionnal-red-txt);
        }

        &:hover,
        &:active,
        &:focus {
          background: var(--el-color-functionnal-red-bg);
        }

        &:active,
        &:focus {
          font-weight: 600;
          color: var(--el-color-functionnal-red);
        }
      }
    }
  }

  &__icon {
    display: flex;
  }

  &:not([disabled]) {
    &:hover,
    &:active {
      background: var(--el-color-persian-50);
    }
    &:active {
      color: var(--el-color-persian-500);
      font-weight: 600;
    }
  }

  &:disabled {
    color: var(--el-color-neutral-gray-300);
    cursor: not-allowed;

    &__icon {
      fill: var(--el-color-neutral-gray-300);
    }
  }

  &__text {
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
