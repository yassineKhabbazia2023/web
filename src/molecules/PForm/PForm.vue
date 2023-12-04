<template>
  <ElForm
    :rules="pRules"
    :inline="pInline"
    :labelPosition="pLabelPosition"
    :labelWidth="pLabelWidth"
    :labelSuffix="pLabelSuffix"
    :hideRequiredAsterisk="pHideRequiredAsterisk"
    :requireAsteriskPosition="pRequiredAsteriskPosition"
    :showMessage="pShowMessage"
    :inlineMessage="pInlineMessage"
    :statusIcon="pStatusIcon"
    :validateOnRuleChange="pValidateOnRuleChange"
    :size="pSize"
    :disabled="pDisabled"
    :scrollToError="pScrollToError"
  >
    <slot />
  </ElForm>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import type { PFormProps } from './PFormTypes'

withDefaults(defineProps<PFormProps>(), {
  pRules: undefined,
  pInline: false,
  pLabelPosition: 'right',
  pLabelWidth: '',
  pLabelSuffix: '',
  pHideRequiredAsterisks: false,
  pRequiredAsteriskPosition: 'left',
  pShowMessage: true,
  pInlineMessage: false,
  pStatusIcon: false,
  pValidateOnRuleChange: true,
  pSize: undefined,
  pDisabled: false,
  pScrollToError: false
})
</script>