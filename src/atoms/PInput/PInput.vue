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
    :prefixIcon="prefixIcon"
    :suffixIcon="suffixIcon"
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
    <template v-if="!!slots['suffix']" #suffix>
      <slot name="suffix" />
    </template>
    <template v-if="!!slots['prefix']" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="!!slots['prepend']" #prepend>
      <slot name="prepend" />
    </template>
    <template v-if="!!slots['append']" #append>
      <slot name="append" />
    </template>
  </ElInput>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { mutable } from 'element-plus/es/utils/typescript'
import { iconResolver } from '@/utils/iconResolver'
import { ElInput } from 'element-plus'
import type { PInputProps } from './PInputTypes'

const slots = useSlots()

const prefixIcon = computed(() => {
  return props.pPrefixIcon ? iconResolver(props.pPrefixIcon) : null
})

const suffixIcon = computed(() => {
  return props.pSuffixIcon ? iconResolver(props.pSuffixIcon) : null
})

const props = withDefaults(defineProps<PInputProps>(), {
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
  pInputStyle: () => mutable({} as const),
})
</script>
