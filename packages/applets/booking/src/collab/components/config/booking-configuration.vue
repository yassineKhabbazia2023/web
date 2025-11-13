<template>
  <div>
    <BookingConfigurationText />
    <BookingConfigurationForm
      ref="bookingConfigurationForm"
      v-model:bookingConfigurationFormData="internalBookingConfigurationFormData"
      class="margin-top--10"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, useTemplateRef } from 'vue'
import BookingConfigurationText from '../config-text/booking-configuration-text.vue'
import BookingConfigurationForm from '../config-form/booking-configuration-form.vue'
import type { BookingConfigurationProps } from './booking-configuration.type'
import type { BookingConfigurationFormData } from '../../../shared/types/booking-forms.type'

const props = defineProps<BookingConfigurationProps>()

const bookingConfigurationFormRef = useTemplateRef('bookingConfigurationForm')

const emit = defineEmits<{
  'update:booking-configuration-form-data': [BookingConfigurationFormData]
}>()

const internalBookingConfigurationFormData = computed({
  get: () => props.bookingConfigurationFormData,
  set: (bookingConfigurationFormData: BookingConfigurationFormData) => {
    emit('update:booking-configuration-form-data', bookingConfigurationFormData)
  },
})

function checkForm() {
  return bookingConfigurationFormRef.value?.checkForm()
}

function clearState() {
  return bookingConfigurationFormRef.value?.clearState()
}

defineExpose({
  checkForm,
  clearState,
})
</script>
