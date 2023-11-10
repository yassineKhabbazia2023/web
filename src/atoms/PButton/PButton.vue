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
    <slot />
  </ElButton>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { ElButton } from 'element-plus'
import type { PButtonProps } from './PButtonTypes'

const props = withDefaults(defineProps<PButtonProps>(), {
  pType: 'default',
  pPlain: false,
  pRound: false,
  pCircle: false,
  pDisabled: false,
  pLoading: false,
  pSize: 'default'
})

const nativeTypes = ['default', 'primary', 'success', 'warning', 'danger']

const parentType = inject('childType', undefined, true) // type from group button

const button = computed(() => getButtonType(parentType?.pType || props.pType))

const getButtonType = (buttonType) => (
  {
    buttonType,
    class: nativeTypes.includes(buttonType) ? buttonType : 'default'
  })

const buttonSizeParent = computed(() =>
  parentType?.pSize !== undefined ? parentType.pSize : props.pSize)

const pClassMapper = computed(() =>
  nativeTypes.includes(button.value.buttonType)
    ? ''
    : ({
        [`p-button--${button.value.buttonType}`]: true
      })
)
</script>
