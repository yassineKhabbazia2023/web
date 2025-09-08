<template>
  <div class="p-alert" :class="[typeModifierClass]">
    <PIcon
      class="p-alert__icon"
      :size="iconSize"
      :pName="iconName"
    />
    <div class="p-alert__content margin-left--3">
      <span class="font-bold"><slot name="bold-text" /></span>
      <slot />
    </div>
    <button
      v-if="pClosable"
      class="
        p-alert__close-btn
        padding--0
        margin-left--2
        flex--align-self-flex-start
      "
      @click="$emit('close')"
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
import type { PIconProps } from '../PIcon/PIcon.types'

const props = withDefaults(defineProps<PAlertProps>(), {
  pType: 'main',
  pClosable: false,
})

defineEmits<{
  'close': []
}>()

const typeModifierClass = computed(() => `p-alert--type-${props.pType}`)
const iconSize = computed(() => props.pIconName ? 32 : 16)

const iconName = computed<PIconProps['pName']>(() => {
  switch (props.pType) {
    case 'success':
      return 'checkCircle'
    case 'warning':
      return 'exclamationTriangle'
    case 'danger':
      return 'xCircle'
    default:
      return props.pIconName ?? 'infoCircle'
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
  border-radius: 4px;

  padding: 12px 16px;

  color: var(--p-gray-900);
  background-color: var(--p-black-rock-100);

  &--type-main {
    color: var(--p-gray-900);
    #{$self}__icon {
      color: var(--p-black-rock-900)
    }
  }

  &--type-success {
    color: var(--p-green-800);
    background-color: var(--p-green-100);
  }

  &--type-warning {
    color: var(--p-orange-800);
    background-color: var(--p-orange-100);
  }

  &--type-danger {
    color: var(--p-red-800);
    background-color: var(--p-red-100);
  }

  &--type-information {
    color: var(--p-mint-tulip-800);
    background-color: var(--p-teal-100);
  }
  &__close-btn {
    appearance: none;
    background: none;
    border: none;
    line-height: 1;
  }
}
</style>
