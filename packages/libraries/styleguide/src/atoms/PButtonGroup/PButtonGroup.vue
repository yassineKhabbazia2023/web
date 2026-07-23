<template>
  <ElButtonGroup
    :type="computedType"
    :size="pSize"
    :data-testid="pTestId"
  >
    <slot />
  </ElButtonGroup>
</template>
<script lang="ts" setup>
import { ElButtonGroup } from 'element-plus'
import { computed, provide } from 'vue'
import { type PButtonGroupProps, injectionButtonKey } from './PButtonGroupTypes'

const props = withDefaults(defineProps<PButtonGroupProps>(), {
  pType: 'default',
  pSize: 'default',
  pTestId: undefined,
})

const nativeTypes = ['default', 'primary', 'success', 'warning', 'danger']
type computedButtonGroupType =
  'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
const computedType = computed(() =>
  nativeTypes.includes(props.pType) ? props.pType as computedButtonGroupType : 'default')

provide(
  injectionButtonKey,
  props,
)
</script>
