<template>
  <ElButton
    :type="button.class"
    :plain="pPlain"
    :round="pRound"
    :circle="pCircle"
    :disabled="pDisabled"
    :loading="pLoading"
    :size="buttonSizeParent"
    :class="pClassMapper"
  >
    <template #loading>
      <PIcon class="is-loading">
        <PILoader />
      </PIcon>
    </template>
    <slot />
  </ElButton>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import PIcon from '@/atoms/PIcon'
import { PILoader } from '@/atoms/PIcon/components'
import { ElButton } from 'element-plus'
import type { PButtonProps } from './PButtonTypes'
import { injectionButtonKey } from '@/atoms/PButtonGroup/PButtonGroupTypes'

const props = withDefaults(defineProps<PButtonProps>(), {
  pType: 'default',
  pPlain: false,
  pRound: false,
  pCircle: false,
  pDisabled: false,
  pLoading: false,
  pSize: 'default',
  pIconOnly: false
})

const nativeTypes = ['default', 'primary', 'success', 'warning', 'danger']

const parentType = inject(
  injectionButtonKey,
  undefined
) // type from group button

const button = computed(() => getButtonType(parentType?.pType || props.pType))

const getButtonType = (buttonType: any) => (
  {
    buttonType,
    class: nativeTypes.includes(buttonType) ? buttonType : 'default'
  })

const buttonSizeParent = computed(() =>
  parentType?.pSize !== undefined ? parentType.pSize : props.pSize)

const pClassMapper = computed(() => {
  const buttonTypeClass = nativeTypes.includes(button.value.buttonType)
    ? ''
    : {
        [`p-button--${button.value.buttonType}`]: true
      }
  return ['p-button', { 'p-button--icon': props.pIconOnly }, buttonTypeClass]
})
</script>
