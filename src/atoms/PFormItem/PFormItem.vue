<template>
  <ElFormItem
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
    <slot />
  </ElFormItem>
</template>

<script lang="ts" setup>
import { ElFormItem } from 'element-plus'
import type { PFormItemProps } from './PFormItemTypes'

withDefaults(defineProps<PFormItemProps>(), {
  pProp: undefined,
  pLabel: undefined,
  pLabelWidth: '',
  pRequired: undefined,
  pRules: undefined,
  pError: undefined,
  pShowMessage: true,
  pInlineMessage: '',
  pSize: undefined,
  pFor: undefined,
  pValidateStatus: undefined
})
</script>
