<template>
  <div class="booking-configuration">
    <PSteps
      :pActive="currentStepIndex"
      :pSteps="bookingConfigurationSteps"
      class="margin-bottom--9"
    />

    <Transition name="slide-fade" mode="out-in">
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
        @next-step="goToNextStep"
        @previous-step="goToPreviousStep"
      />
      <BookingConfirmation
        v-else-if="currentStep === BookingConfigurationSteps.CONFIRMATION"
        :is-submitting="isSubmitting"
        :booking-url="bookingUrl"
      />
    </Transition>

    <Teleport
      v-if="isConfirmationStep"
      to="#booking-drawer__footer"
    >
      <div class="margin-left--auto">
        <PButton
          pType="primary"
          :pDisabled="isSubmitting"
          @click="closeDrawer"
        >
          {{ t('booking-configuration.buttons.close') }}
        </PButton>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PSteps } from '@pulse/styleguide/components'
import BookingConfigurationText from '../booking-configuration-text/booking-configuration-text.vue'
import { BookingConfigurationSteps } from './booking-configuration.enums'
import { useBookingConfiguration } from './booking-configuration.composable'
import BookingAppointmentConfiguration from '../booking-appointment-configuration/booking-appointment-configuration.vue'
import BookingTimeSlotsConfiguration from '../booking-time-slots-configuration/booking-time-slots-configuration.vue'
import BookingConfirmation from '../booking-confirmation/booking-confirmation.vue'
import type { PStepsItem } from '@pulse/styleguide/types'
import { useBookingUrl } from '@booking/composables/use-booking-url.composable'

const { t } = useI18n({ useScope: 'global' })

const {
  appointmentDetails,
  timeSlotsConfiguration,
  currentStep,
  currentStepIndex,
  drawerTitle,
  isSubmitting,
  isConfirmationStep,
  goToNextStep,
  goToPreviousStep,
  closeDrawer,
} = useBookingConfiguration()

const { bookingUrl } = useBookingUrl()

const emit = defineEmits<{
  'update-title': [title: string]
}>()

const bookingConfigurationSteps = computed<PStepsItem[]>(() => [
  { pTitle: t('booking-configuration.steps.intro') },
  { pTitle: t('booking-configuration.steps.customize-meeting') },
  { pTitle: t('booking-configuration.steps.configure-slots') },
  { pTitle: t('booking-configuration.steps.confirmation') },
])

watch(drawerTitle, (newTitle) => {
  emit('update-title', newTitle)
}, { immediate: true })
</script>
