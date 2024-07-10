<template>
  <PForm
    @submit.prevent="handleSearchSubmit(formRef)"
    ref="formRef"
    :pRules="rules"
    :pModel="formValues"
  >
    <PFormItem prop="search">
      <PInput
        @keyup="handleSearchSubmit(formRef)"
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
  placeholder: () => useI18n().t('search'),
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
const handleSearchSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  if (formEl.validate) {
    try {
      await formEl.validate()
    } catch (error) {
      return false
    }
  }
  emit('searchValueSubmitted', formValues.search)
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
    search: 'Search'
    errorSearchInvalid: 'Minimum three characters required'
  fr-FR:
    search: 'Rechercher'
    errorSearchInvalid: 'Trois caractères minimum requis'
</i18n>
