<template>
  <el-button-group
    :type="computedType"
    :size="pSize">
    <slot />
  </el-button-group>
</template>
<script lang="ts" setup>
import type { PButtonGroupProps } from './PButtonGroupTypes'
import { computed, provide, ref } from 'vue'

const props = withDefaults(defineProps<PButtonGroupProps>(), {
  pType: ref('default'),
  pSize: ref('default')
})

const nativeTypes = ['default', 'primary', 'success', 'warning', 'danger']
const computedType = computed(() =>
  nativeTypes.includes(props.pType) ? props.pType : 'default')

provide(
  'childType',
  props
)
</script>
