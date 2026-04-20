<template>
  <ElFormItem
    :class="{
      'el-form-item--no-margin': !pHasMargin,
      'el-form-item--fixed-width': pWidth !== undefined,
    }"
    :style="fixedWidthStyle"
    :prop="pProp"
    :label="pLabel"
    :labelWidth="pLabelWidth"
    :required="pRequired"
    :rules="pRules"
    :error="pError"
    :showMessage="pShowMessage"
    :inlineMessage="pInlineMessage"
    :size="pSize"
    :for="pFor"
    :validateStatus="pValidateStatus"
  >
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <slot />
    <template v-if="$slots.error" #error>
      <slot name="error" />
    </template>
  </ElFormItem>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElFormItem } from 'element-plus'
import type { PFormItemProps } from './PFormItemTypes'

const props = withDefaults(defineProps<PFormItemProps>(), {
  pProp: undefined,
  pLabel: undefined,
  pLabelWidth: '',
  pRequired: undefined,
  pRules: undefined,
  pError: undefined,
  pShowMessage: true,
  pInlineMessage: '',
  pSize: '',
  pFor: undefined,
  pValidateStatus: undefined,
  pHasMargin: true,
  pWidth: undefined,
})

const fixedWidthStyle = computed(() => {
  if (props.pWidth === undefined) {
    return undefined
  }
  const width = typeof props.pWidth === 'number' ? `${props.pWidth}px` : props.pWidth
  return { width }
})
</script>
