<template>
  <div class="p-alert" :class="[typeModifierClass]">
    <PIcon class="p-alert__icon" :size="iconSize">
      <component :is="typeIcon" />
    </PIcon>
    <div class="p-alert__content margin-left--3">
      <span class="font-bold"><slot name="bold-text"/></span>
      <slot />
    </div>
    <button
      v-if="pClosable"
      @click="$emit('close')"
      class="p-alert__close-btn padding--0 margin-left--2"
    >
      <PIcon :color="AppColors.PERSIAN_900" size="16" pName="x" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PIcon from '@styleguide/atoms/PIcon'
import {} from '@styleguide/atoms/PIcon/components'
import type { PAlertProps } from './PAlertTypes'
import { iconResolver } from '@styleguide/utils/iconResolver'
import { AppColors } from '@styleguide/utils/AppColorsEnum'

const props = withDefaults(defineProps<PAlertProps>(), {
  pType: 'main',
  pIcon: '',
  pClosable: false,
})

defineEmits<{
  'close': []
}>()

const typeModifierClass = computed(() => `p-alert--type-${props.pType}`)
const iconSize = computed(() => props.pIcon ? 32 : 16)

const typeIcon = computed(() => {
  switch (props.pType) {
    case 'success':
      return iconResolver('PICheckCircle')

    case 'warning':
      return iconResolver('PIExclamationTriangle')

    case 'danger':
      return iconResolver('PIXCircle')

    default: return props.pIcon ? iconResolver(props.pIcon) : iconResolver('PIInfoCircle')
  }
})

</script>

<style scoped lang="scss">
.p-alert {
  $self: &;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  border-radius: var(--el-border-radius-base);

  padding: 12px 16px;

  color: var(--el-color-gray-900);
  background-color: var(--el-color-persian-50);

  &--type-main {
    #{$self}__icon {
      color: var(--el-color-persian-500)
    }
  }

  &--type-success {
    color: var(--el-color-functionnal-green-txt);
    background-color: var(--el-color-functionnal-green-bg);
  }

  &--type-warning {
    color: var(--el-color-functionnal-orange-txt);
    background-color: var(--el-color-functionnal-orange-bg);
  }

  &--type-danger {
    color: var(--el-color-functionnal-red-txt);
    background-color: var(--el-color-functionnal-red-bg);
  }

  &--type-information {
    color: var(--el-color-secondary-cyan-txt);
    background-color: var(--el-color-secondary-cyan-bg);
  }
  &__close-btn {
    appearance: none;
    background: none;
    border: none;
    line-height: 1;
  }
}
</style>
