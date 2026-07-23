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
        pTestId="entities-search-input"
        :pPlaceholder="placeholder"
        :pAutofocus="isDesktop"
        pPrefixIconName="search"
        pName="search"
        pSize="small"
        pType="search"
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
import { useResponsive } from '@pulse/styleguide'
import type { FormInstance, FormRules } from '@pulse/styleguide/types'
import type { Props } from './types'
import { watch, reactive, ref } from 'vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      errorSearchInvalid: 'Minimum three characters required',
    },
    'fr-FR': {
      errorSearchInvalid: 'Trois caractères minimum requis',
    },
  },
})

const { isDesktop } = useResponsive()

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  forcedValue: '',
})

const emit = defineEmits<{
  'search-value-submitted': [string]
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
      emit('search-value-submitted', formValues.search)
    }
  })
}

watch(() => props.forcedValue, (value) => {
  formValues.search = value
  emit('search-value-submitted', formValues.search)
})

const clearSearch = () => {
  formValues.search = ''
}

defineExpose({
  clearSearch,
})
</script>

