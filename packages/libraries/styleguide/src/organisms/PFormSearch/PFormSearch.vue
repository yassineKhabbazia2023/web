<template>
  <PForm
    ref="form"
    :pRules="rules"
    :pModel="formValues"
    @submit.prevent
  >
    <PFormItem
      prop="search"
      :pHasMargin="false"
    >
      <PInput
        ref="inputRef"
        :modelValue="formValues.search"
        :pAutofocus="pAutofocus"
        :pPlaceholder="pPlaceholder"
        :pClearable="pClearable"
        :pSize="pSize"
        :pDisabled="pDisabled"
        pPrefixIconName="search"
        pName="search"
        pType="search"
        @input="onInput"
      >
        <template
          v-if="$slots.append !== undefined"
          #append
        >
          <slot name="append" />
        </template>
      </PInput>
    </PFormItem>
  </PForm>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import type { FormRules } from 'element-plus'
import { useDebounce } from '@pulse/toolbox'

import PFormItem from '../../atoms/PFormItem/PFormItem.vue'
import PInput from '../../atoms/PInput/PInput.vue'
import PForm from '../../molecules/PForm/PForm.vue'
import type { PFormSearchProps } from './PFormSearch.types'


const props = withDefaults(defineProps<PFormSearchProps>(), {
  pMinLength: 3,
  pPlaceholder: '',
  pSearch: '',
  pAutofocus: false,
  pDisabled: false,
})

const emit = defineEmits<{
  'update:pSearch': [string]
}>()

const formRef = useTemplateRef('form')
const inputRef = useTemplateRef('inputRef')
const formValues = ref<{
  search: string
}>({
  search: props.pSearch,
})

const rules: FormRules = {
  search: [{
    trigger: ['change', 'blur'],
    min: props.pMinLength,
    message: props.pSearchInvalidMessage,
  }],
}

function emitUpdateSearch(value: string) {
  emit('update:pSearch', value)
}
const emitUpdateSearchDebounced = useDebounce(emitUpdateSearch, props.pDebounceDelay)
function setSearchValue(value: string) {
  formValues.value.search = value
}

async function onInput(value: string) {
  try {
    setSearchValue(value)
    const isValid = await formRef.value?.validate()

    if (isValid) {
      emitUpdateSearchDebounced(value)
    }
  } catch (_error) {
    // silent validation failed
  }
}

const clearSearch = () => {
  setSearchValue('')
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({
  clearSearch,
  focus,
})
</script>
