<template>
  <div class="p-alert" :class="[typeModifierClass]">
    <PIcon class="p-alert__icon" size="16">
      <component :is="typeIcon" />
    </PIcon>
    <div class="p-alert__content">
      <span class="p-alert__content--bold"><slot name="bold-text"/></span>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PAlertProps } from './PAlertTypes'
import { iconResolver } from '@/utils/iconResolver'

const props = withDefaults(defineProps<PAlertProps>(), {
  pType: 'main'
})

const typeModifierClass = computed(() => `p-alert--type-${props.pType}`)

const typeIcon = computed(() => {
  switch (props.pType) {
    case 'success':
      return iconResolver('PICheckCircle')

    case 'warning':
      return iconResolver('PIExclamationTriangle')

    case 'danger':
      return iconResolver('PIXCircle')

    default: return iconResolver('PIInfoCircle')
  }
})

</script>

<style scoped lang="scss">
.p-alert {
  $self: &;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 376px;
  border-radius: 8px;

  padding: 12px 16px;

  color: var(--el-color-gray-900);
  background-color: var(--el-color-persian-50);

  &--main {
    #{$self}__icon {
      color: var(--el-color-persian-500)
    }
  }

  &--success {
    color: var(--el-color-functionnal-green-txt);
    background-color: var(--el-color-functionnal-green-bg);
  }

  &--warning {
    color: var(--el-color-functionnal-orange-txt);
    background-color: var(--el-color-functionnal-orange-bg);
  }

  &--danger {
    color: var(--el-color-functionnal-red-txt);
    background-color: var(--el-color-functionnal-red-bg);
  }

  &--information {
    color: var(--el-color-secondary-cyan-txt);
    background-color: var(--el-color-secondary-cyan-bg);
  }

  &__content {
    margin-left: 12px;

    &--bold {
      font-weight: 700;
    }
  }
}
</style>
