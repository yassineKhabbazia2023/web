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
        :modelValue="formValues.search"
        :pAutofocus="pAutofocus"
        :pPlaceholder="pPlaceholder"
        :pClearable="pClearable"
        :pSize="pSize"
        pPrefixIconName="search"
        pName="search"
        pType="search"
        @input="onInput"
      />
    </PFormItem>
  </PForm>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import type { FormRules } from 'element-plus'
import { useDebounce } from '@pulse/core'

import PFormItem from '../../atoms/PFormItem/PFormItem.vue'
import PInput from '../../atoms/PInput/PInput.vue'
import PForm from '../../molecules/PForm/PForm.vue'
import type { PFormSearchProps } from './PFormSearch.types'

const DEFAULT_DEBOUNCE_DELAY_MS = 500

const props = withDefaults(defineProps<PFormSearchProps>(), {
  pMinLength: 3,
  pPlaceholder: '',
  pSearch: '',
  pAutofocus: false,
  pDebounceDelay: DEFAULT_DEBOUNCE_DELAY_MS,
})

const emit = defineEmits<{
  'update:pSearch': [string]
}>()

const formRef = useTemplateRef('form')
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
  setSearchValue(value)
  const isValid = await formRef.value?.validate()

  if (isValid) {
    emitUpdateSearchDebounced(value)
  }
}

const clearSearch = () => {
  setSearchValue('')
}

defineExpose({
  clearSearch,
})
</script>
