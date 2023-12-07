<template>
  <ElForm
    ref="formRef"
    :model="pModel"
    :rules="pRules"
    :inline="pInline"
    :labelPosition="pLabelPosition"
    :labelWidth="pLabelWidth"
    :labelSuffix="pLabelSuffix"
    :hideRequiredAsterisk="pHideRequiredAsterisk"
    :requireAsteriskPosition="pRequireAsteriskPosition"
    :showMessage="pShowMessage"
    :inlineMessage="pInlineMessage"
    :statusIcon="pStatusIcon"
    :validateOnRuleChange="pValidateOnRuleChange"
    :size="pSize"
    :disabled="pDisabled"
    :scrollToError="pScrollToError"
    :scrollIntoViewOptions="pScrollIntoViewOptions"
  >
    <slot />
  </ElForm>
</template>

<script setup lang="ts">
import { ElForm, type FormInstance, type FormItemProp } from 'element-plus'
import type { PFormProps } from './PFormTypes'
import { ref } from 'vue'

const formRef = ref<FormInstance>()

withDefaults(defineProps<PFormProps>(), {
  pModel: undefined,
  pRules: undefined,
  pInline: false,
  pLabelPosition: 'right',
  pLabelWidth: '',
  pLabelSuffix: '',
  pHideRequiredAsterisks: false,
  pRequireAsteriskPosition: 'left',
  pShowMessage: true,
  pInlineMessage: false,
  pStatusIcon: false,
  pValidateOnRuleChange: true,
  pSize: undefined,
  pDisabled: false,
  pScrollToError: false,
  pScrollIntoViewOptions: undefined
})

defineExpose({
  resetFields: () => formRef?.value?.resetFields(),
  validate: () => formRef?.value?.validate(),
  validateField: () => formRef?.value?.validateField(),
  scrollToField: (prop: FormItemProp) => formRef?.value?.scrollToField(prop),
  clearValidate: () => formRef?.value?.clearValidate()
})
</script>
