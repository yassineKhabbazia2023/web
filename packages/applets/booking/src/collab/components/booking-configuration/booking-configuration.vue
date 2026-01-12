<template>
  <div class="booking-configuration">
    <PSteps :pActive="currentStepIndex" class="margin-bottom--9">
      <PStep :pTitle="t('booking-configuration.steps.intro')" />
      <PStep :pTitle="t('booking-configuration.steps.customize-meeting')" />
      <PStep :pTitle="t('booking-configuration.steps.configure-slots')" />
    </PSteps>

    <Transition name="fade" mode="out-in">
      <!-- This contains all the booking configuration steps (meeting customization, time slots ...) -->
      <BookingConfigurationText
        v-if="currentStep === BookingConfigurationSteps.INTRO"
        @next-step="goToNextStep"
      />
      <BookingAppointmentConfiguration
        v-else-if="currentStep === BookingConfigurationSteps.CUSTOMIZE_MEETING"
        v-model="appointmentDetails"
        @next-step="goToNextStep"
        @previous-step="goToPreviousStep"
      />
      <BookingTimeSlotsConfiguration
        v-else-if="currentStep === BookingConfigurationSteps.CONFIGURE_SLOTS"
        v-model="timeSlotsConfiguration"
        :is-submitting="isSubmitting"
        @next-step="goToNextStep"
        @previous-step="goToPreviousStep"
      />
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PStep, PSteps } from '@pulse/styleguide/components'
import BookingConfigurationText from '../booking-configuration-text/booking-configuration-text.vue'
import { BookingConfigurationSteps } from './booking-configuration.enums'
import { useBookingConfiguration } from './booking-configuration.composable'
import BookingAppointmentConfiguration from '../booking-appointment-configuration/booking-appointment-configuration.vue'
import BookingTimeSlotsConfiguration from '../booking-time-slots-configuration/booking-time-slots-configuration.vue'

const { t } = useI18n({ useScope: 'global' })

const {
  appointmentDetails,
  timeSlotsConfiguration,
  currentStep,
  currentStepIndex,
  drawerTitle,
  isSubmitting,
  goToNextStep,
  goToPreviousStep,
} = useBookingConfiguration()

const emit = defineEmits<{
  'update-title': [title: string]
}>()

watch(drawerTitle, (newTitle) => {
  emit('update-title', newTitle)
}, { immediate: true })

</script>
