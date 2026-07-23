<template>
  <ElButton
    :type="button.class"
    :circle="pCircle"
    :disabled="isDisabled"
    :loading="pLoading"
    :size="buttonSizeParent"
    :class="pClassMapper"
    :tag="pTag"
    :data-testid="pTestId"
  >
    <template #loading>
      <PIcon class="is-loading" pName="loader" />
    </template>
    <slot />
  </ElButton>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import PIcon from '../../atoms/PIcon'
import { ElButton } from 'element-plus'
import type { PButtonProps } from './PButtonTypes'
import { injectionButtonKey } from '../../atoms/PButtonGroup/PButtonGroupTypes'

const props = withDefaults(defineProps<PButtonProps>(), {
  pType: 'default',
  pCircle: false,
  pDisabled: undefined,
  pLoading: false,
  pSize: 'default',
  pIconOnly: false,
  pIsActive: false,
  pIsUnderlined: false,
  pTag: 'button',
  pTestId: undefined,
})

const nativeTypes = ['default', 'primary', 'success', 'warning', 'danger']

const parentType = inject(
  injectionButtonKey,
  undefined,
) // type from group button

const button = computed(() => getButtonType(parentType?.pType || props.pType))

const getButtonType = (buttonType: any) => (
  {
    buttonType,
    class: nativeTypes.includes(buttonType) ? buttonType : 'default',
  })

const buttonSizeParent = computed(() =>
  parentType?.pSize !== undefined ? parentType.pSize : props.pSize)

const isDisabled = computed(() => (props.pLoading === true ? true : props.pDisabled))

const pClassMapper = computed(() => {
  const buttonTypeClass = nativeTypes.includes(button.value.buttonType)
    ? ''
    : {
      [`p-button--${button.value.buttonType}`]: true,
    }
  return [
    'p-button',
    { 'p-button--icon': props.pIconOnly },
    buttonTypeClass,
    { 'p-button--is-active': props.pIsActive },
    { 'p-button--is-underlined': props.pIsUnderlined },
  ]
})
</script>
