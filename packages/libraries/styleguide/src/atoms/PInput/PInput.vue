<template>
  <ElInput
    ref="inputRef"
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
    :class="{'p-input--focused': isInputFocused}"
    @focus="isInputFocused=true"
    @blur="isInputFocused=false"
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
import { computed, useSlots, ref } from 'vue'
import { mutable } from 'element-plus/es/utils/typescript'
import { getIconComponent } from '../../utils/iconHelper'
import { ElInput } from 'element-plus'
import type { PInputProps } from './PInputTypes'
const slots = useSlots()
const isInputFocused = ref(false)

const prefixIcon = computed(() => {
  return props.pPrefixIconName ? getIconComponent(props.pPrefixIconName) : undefined
})

const suffixIcon = computed(() => {
  return props.pSuffixIconName ? getIconComponent(props.pSuffixIconName) : undefined
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
  pDisabled: undefined,
  pSize: undefined,
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
const inputRef = ref<InstanceType<typeof ElInput>>()

function focus() {
  inputRef.value?.focus()
}

defineExpose({
  focus,
})
</script>

<style scoped lang="scss">
.p-input--focused {
  border-bottom-color: var(--p-stroke-press);
}
</style>
