<template>
  <PDrawer
    :model-value="isOpened"
    :pTitle="t('booking-appointment-drawer.title')"
    pSize="33%"
    @close="closeDrawer"
    @close-drawer-button="closeDrawer"
  >
    <div class="padding-x--4 padding-y--1">
      <PSteps
        :pActive="currentStep"
      >
        <PStep
          v-for="(step, index) in steps"
          :key="index"
          :pTitle="step.label"
        />
      </PSteps>
    </div>
    <BookingAppointmentChooseExpert
      v-if="isExpertStep"
      :experts="availableExperts"
      :selectedExpertId="selectedExpertId"
      :isLoading="isLoadingExperts"
      @update:selected-expert-id="onSelectExpert"
    />
    <BookingAppointmentChooseTimeSlot
      v-if="isTimeSlotStep && selectedExpertId !== undefined"
      :collaboratorId="selectedExpertId"
      @previous-step="goToPreviousStep"
    />

    <template #footer>
      <div class="flex flex--justify-content-flex-start">
        <template v-if="currentStep === BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT">
          <PButton
            pType="secondary"
            pPlain
            class="margin-right--4"
            @click="goToPreviousStep"
          >
            {{ t('booking-configuration.buttons.previous') }}
          </PButton>
        </template>
      </div>
      <div class="flex flex--justify-content-flex-end">
        <PButton
          v-if="currentStep !== BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT"
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
  isLoadingExperts,
  steps,
  currentStep,
  isExpertStep,
  isTimeSlotStep,
  closeDrawer,
  onSelectExpert,
} = useBookingAppointmentDrawer(isOpened)

function goToPreviousStep() {
  if (currentStep.value === BookingAppointmentDrawerTabs.CHOOSE_TIME_SLOT) {
    currentStep.value = BookingAppointmentDrawerTabs.CHOOSE_EXPERT
  }
}
</script>
