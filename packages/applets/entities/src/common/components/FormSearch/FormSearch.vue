<template>
  <PForm
    @submit.prevent
    ref="formRef"
    :pRules="rules"
    :pModel="formValues"
  >
    <PFormItem prop="search">
      <PInput
        @keyup="handleSearchSubmit"
        v-model="formValues.search"
        :pPlaceholder="placeholder"
        :pPrefixIcon="PISearch"
        pName="search"
        pSize="small"
        pType="search"
        pAutofocus
      />
    </PFormItem>
  </PForm>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import {
  PForm,
  PFormItem,
  PInput,
  PISearch,
} from '@kpmg/styleguide'
import type { FormInstance, FormRules } from '@kpmg/styleguide'
import type { Props } from './types'
import { reactive, ref } from 'vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher', // should not use i18n in default props. Better not to give any default value
})

const emit = defineEmits<{
  searchValueSubmitted: [string]
}>()

const formRef = ref<FormInstance>()
const formValues = reactive({
  search: '',
})
const rules = reactive<FormRules<typeof formValues>>({
  search: [{
    trigger: 'change',
    min: 3,
    message: t('errorSearchInvalid'),
  }],
})
const handleSearchSubmit = () => {
  formRef.value?.validate((isValid) => {
    if (isValid) {
      emit('searchValueSubmitted', formValues.search)
    }
  })
}

const clearSearch = () => {
  formValues.search = ''
}

defineExpose({
  clearSearch,
})
</script>

<i18n lang="yaml">
  en-US:
    errorSearchInvalid: 'Minimum three characters required'
  fr-FR:
    errorSearchInvalid: 'Trois caractères minimum requis'
</i18n>
