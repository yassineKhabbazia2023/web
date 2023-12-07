<template>
  <ElInput
    :type="pType"
    :maxlength="pMaxlength"
    :minlength="pMinlength"
    :showWordLimit="pShowWordLimit"
    :placeholder="pPlaceholder"
    :clearable="pClearable"
    :formatter="pFormatter"
    :parser="pParser"
    :showPassword="pShowPassword"
    :disabled="pDisabled"
    :size="pSize"
    :prefixIcon="pPrefixIcon"
    :suffixIcon="pSuffixIcon"
    :rows="pRows"
    :autosize="pAutosize"
    :autocomplete="pAutocomplete"
    :name="pName"
    :readonly="pReadonly"
    :max="pMax"
    :min="pMin"
    :step="pStep"
    :resize="pResize"
    :autofocus="pAutofocus"
    :form="pForm"
    :label="pLabel"
    :tabindex="pTabindex"
    :validateEvent="pValidateEvent"
    :inputStyle="pInputStyle"
  >
    <slot />
  </ElInput>
</template>

<script setup lang="ts">
import { ElInput } from 'element-plus'
import type { PInputProps } from './PInputTypes'
import { mutable } from 'element-plus/es/utils/typescript'

withDefaults(defineProps<PInputProps>(), {
  pType: 'text',
  pMaxlength: undefined,
  pMinlength: undefined,
  pShowWordLimit: false,
  pPlaceholder: undefined,
  pClearable: false,
  pFormatter: undefined,
  pParser: undefined,
  pShowPassword: false,
  pDisabled: false,
  pSize: undefined,
  pPrefixIcon: undefined,
  pSuffixIcon: undefined,
  pRows: 2,
  pAutosize: false,
  pAutocomplete: 'off',
  pName: undefined,
  pReadonly: false,
  pMax: undefined,
  pMin: undefined,
  pStep: undefined,
  pResize: undefined,
  pAutofocus: false,
  pForm: undefined,
  pLabel: undefined,
  pTabindex: undefined,
  pValidateEvent: true,
  pInputStyle: () => mutable({} as const)
})
</script>
