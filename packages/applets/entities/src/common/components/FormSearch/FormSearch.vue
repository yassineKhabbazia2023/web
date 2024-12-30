<template>
  <PForm
    ref="formRef"
    :pRules="rules"
    :pModel="formValues"
    @submit.prevent
  >
    <PFormItem prop="search" :pHasMargin="false">
      <PInput
        v-model="formValues.search"
        :pPlaceholder="placeholder"
        pPrefixIconName="search"
        pName="search"
        pSize="small"
        pType="search"
        pAutofocus
        @keyup="handleSearchSubmit"
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
} from '@pulse/styleguide/components'
import type { FormInstance, FormRules } from '@pulse/styleguide/types'
import type { Props } from './types'
import { watch, reactive, ref } from 'vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Rechercher', // should not use i18n in default props. Better not to give any default value
  forcedValue: '',
})

const emit = defineEmits<{
  searchValueSubmitted: [string]
}>()

const formRef = ref<FormInstance>()
const formValues = reactive({
  search: props.forcedValue,
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

watch(() => props.forcedValue, (value) => {
  formValues.search = value
  emit('searchValueSubmitted', formValues.search)
})

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
