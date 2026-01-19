<template>
  <PDrawer
    :model-value="isOpened"
    :pTitle="t('booking-appointment-drawer.title')"
    pSize="33%"
    @close="closeDrawer"
    @close-drawer-button="closeDrawer"
  >
    <PSteps
      :pActive="currentStep"
      pAlignCenter
    >
      <PStep
        v-for="(step, index) in steps"
        :key="index"
        :pTitle="step.label"
      />
    </PSteps>
    <BookingAppointmentChooseExpert
      v-if="currentStep === BookingAppointmentDrawerTabs.CHOOSE_EXPERT"
      :experts="availableExperts"
      :selectedExpertId="selectedExpertId"
      @update:selected-expert-id="onSelectExpert"
    />
    <BookingAppointmentChooseTimeSlot
      v-if="currentStep === BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT"
      :iframeUrl="expertIframeUrl"
    />

    <template
      v-if="currentStep !== BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT"
      #footer
    >
      <div class="flex flex--justify-content-flex-end">
        <PButton
          pType="primary"
          pPlain
          data-testid="catalog-drawer-close-button"
          @click="closeDrawer"
        >
          {{ t('booking-appointment-drawer.close') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PDrawer, PButton, PSteps, PStep } from '@pulse/styleguide/components'
import { BookingAppointmentDrawerTabs } from './booking-appointment-drawer.enum'
import { useBookingAppointmentDrawer } from './booking-appointment-drawer.composable'
import BookingAppointmentChooseExpert from '../choose-expert/booking-appointment-choose-expert.vue'
import BookingAppointmentChooseTimeSlot from '../choose-time-slot/booking-appointment-choose-time-slot.vue'

const { t } = useI18n({ useScope: 'global' })

const isOpened = defineModel<boolean>('isOpened', { required: true })

const {
  availableExperts,
  selectedExpertId,
  expertIframeUrl,
  steps,
  currentStep,
  closeDrawer,
  onSelectExpert,
} = useBookingAppointmentDrawer(isOpened)
</script>
