<template>
  <div class="p-alert" :class="[typeModifierClass]">
    <PIcon
      class="p-alert__icon"
      :pSize="pIconSize"
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
        :pColor="AppColors.JUNGLE_900"
        pSize="16"
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
  pIconSize: '16',
  pClosable: false,
})

defineEmits<{
  'close': []
}>()

const typeModifierClass = computed(() => `p-alert--type-${props.pType}`)

const iconName = computed<PIconProps['pName']>(() => {
  // An explicit icon always wins, even on a typed alert (e.g. a lock on a success alert).
  if (props.pIconName !== undefined) {
    return props.pIconName
  }
  switch (props.pType) {
    case 'success':
      return 'checkCircle'
    case 'warning':
      return 'exclamationTriangle'
    case 'danger':
      return 'xCircle'
    default:
      return 'infoCircle'
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

  color: var(--p-text-basic-body);
  background-color: var(--p-black-rock-100);

  &__icon {
    color: var(--p-black-rock-900)
  }

  &--type-main {
    #{$self}__icon {
      color: var(--p-black-rock-900)
    }
  }

  &--type-success {
    background-color: var(--p-green-100);

    #{$self}__icon {
      color: var(--p-green-800)
    }
  }

  &--type-warning {
    background-color: var(--p-orange-100);

    #{$self}__icon {
      color: var(--p-orange-800)
    }
  }

  &--type-danger {
    background-color: var(--p-red-100);

    #{$self}__icon {
      color: var(--p-red-800)
    }
  }

  &--type-information {
    background-color: var(--p-teal-100);

    #{$self}__icon {
      color: var(--p-mint-tulip-800)
    }
  }
  &__close-btn {
    appearance: none;
    background: none;
    border: none;
    line-height: 1;
  }
}
</style>
