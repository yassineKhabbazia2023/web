<template>
  <PForm
    :pModel="bookingConfigurationFormData"
  >
    <PFormItem
      pProp="configurationLink"
      :pError="formError?.configurationLink"
    >
      <PInput
        :modelValue="bookingConfigurationFormData.configurationLink"
        :pPlaceholder="t('placeholder')"
        @update:model-value="onFormDataChange('configurationLink', $event)"
      />
    </PFormItem>
  </PForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebounce } from '@pulse/core'
import { PForm, PFormItem, PInput } from '@pulse/styleguide/components'
import { getFormErrors } from './booking-configuration-form.helper'
import type { BookingConfigurationFormData } from '../booking.type'
import { BookingConfigurationFormProps } from './booking-configuration-form.type'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const checkFormDebounceDelay = 300
const debouncedCheckForm = useDebounce(checkForm, checkFormDebounceDelay)

const props = defineProps<BookingConfigurationFormProps>()

const emit = defineEmits<{
  'update:booking-configuration-form-data': [BookingConfigurationFormData]
}>()

const formError = ref<BookingConfigurationFormData>()

function onFormDataChange(fieldKey: string, value: string) {
  const formData = {
    ...props.bookingConfigurationFormData,
    [fieldKey]: value,
  }
  // clear all errors on change
  formError.value = undefined

  emit('update:booking-configuration-form-data', formData)
  debouncedCheckForm()
}

function checkForm() {
  formError.value = getFormErrors({
    formData: props.bookingConfigurationFormData,
    requiredErrorMessage: t('requiredErrorMessage'),
    wrongFormatErrorMessage: t('wrongFormatErrorMessage'),
  })

  const isValid = Object.values(formError.value).every((error) => error === '')

  return isValid
}

function clearState() {
  formError.value = undefined
}

defineExpose({
  checkForm,
  clearState,
})
</script>

<i18n lang="yaml">
  en-US:
    placeholder: 'Paste your Microsoft Bookings link'
    requiredErrorMessage: 'Please enter your Microsoft Bookings link'
    wrongFormatErrorMessage: 'The Microsoft Bookings link format is incorrect'
  fr-FR:
    placeholder: 'Coller votre lien Microsoft Bookings'
    requiredErrorMessage: 'Veuillez saisir votre lien Microsoft Bookings'
    wrongFormatErrorMessage: 'Le format du lien Microsoft Bookings est incorrect'
</i18n>
