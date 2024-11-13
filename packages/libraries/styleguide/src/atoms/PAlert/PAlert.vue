<template>
  <div class="p-alert" :class="[typeModifierClass]">
    <PIcon
      class="p-alert__icon"
      :size="iconSize"
      :pName="iconName"
    />
    <div class="p-alert__content margin-left--3">
      <span class="font-bold"><slot name="bold-text"/></span>
      <slot />
    </div>
    <button
      v-if="pClosable"
      @click="$emit('close')"
      class="p-alert__close-btn padding--0 margin-left--2"
    >
      <PIcon
        :color="AppColors.PERSIAN_900"
        size="16"
        pName="x"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PIcon from '../../atoms/PIcon'
import type { PAlertProps } from './PAlertTypes'
import { AppColors } from '../../utils/AppColorsEnum'
// eslint-disable-next-line import/extensions
import type { PIconProps } from '../PIcon/PIcon.types'

const props = withDefaults(defineProps<PAlertProps>(), {
  pType: 'main',
  pClosable: false,
})

defineEmits<{
  'close': []
}>()

const typeModifierClass = computed(() => `p-alert--type-${props.pType}`)
const iconSize = computed(() => props.pIcon ? 32 : 16)

const iconName = computed<PIconProps['pName']>(() => {
  switch (props.pType) {
  case 'success':
    return 'checkCircle'
  case 'warning':
    return 'exclamationTriangle'
  case 'danger':
    return 'xCircle'
  default:
    return props.pIcon ?? 'infoCircle'
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
