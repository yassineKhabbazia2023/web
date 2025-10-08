<template>
  <PDrawer
    :model-value="isOpened"
    :pTitle="t('title')"
    pSize="60%"
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
    <BookingRendezVousChooseExpert
      v-if="currentStep === BookingRendezVousDrawerTabs.CHOOSE_EXPERT"
      :experts="availableExperts"
      :selectedExpertId="selectedExpertId"
      @update:selected-expert-id="onSelectExpert"
    />
    <BookingRendezVousChooseTimeSlot
      v-if="currentStep === BookingRendezVousDrawerTabs.CHOOSE_TIME_SLOT"
    />

    <template #footer>
      <div class="flex flex--justify-content-flex-end">
        <PButton
          pType="primary"
          pPlain
          data-testid="catalog-drawer-close-button"
          @click="closeDrawer"
        >
          {{ t('close') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'
import { PDrawer, PButton, PSteps, PStep } from '@pulse/styleguide/components'
import { useBookingStore } from '@pulse/common/stores'
import type { BookingRendezVousDrawerProps } from './booking-rendez-vous-drawer.type'
import { BookingRendezVousDrawerTabs } from './booking-rendez-vous-drawer.enum'
import BookingRendezVousChooseExpert from '../booking-rendez-vous-choose-expert/booking-rendez-vous-choose-expert.vue'
import BookingRendezVousChooseTimeSlot from '../booking-rendez-vous-choose-time-slot/booking-rendez-vous-choose-time-slot.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<BookingRendezVousDrawerProps>()
const emit = defineEmits<{
  'update:is-opened': [boolean]
  'open-pdf': []
}>()

const bookingStore = useBookingStore()
const availableExperts = computed(() => bookingStore.getAvailableExperts())

const selectedExpertId = ref()

function closeDrawer() {
  internalIsOpened.value = false
}

const steps = [{
  label: t('steps.choose-expert'),
}, {
  label: t('steps.choose-time-slot'),
}]
const currentStep = ref<BookingRendezVousDrawerTabs>(BookingRendezVousDrawerTabs.CHOOSE_EXPERT)

const internalIsOpened = computed({
  get() {
    return props.isOpened
  },
  set(value: boolean) {
    emit('update:is-opened', value)
  },
})

function openFirstTab() {
  currentStep.value = BookingRendezVousDrawerTabs.CHOOSE_EXPERT
}

function onSelectExpert(expertId: number) {
  selectedExpertId.value = expertId
  currentStep.value = BookingRendezVousDrawerTabs.CHOOSE_TIME_SLOT
}

watch(() => props.isOpened, () => {
  if (props.isOpened === true) {
    openFirstTab()
  }
})
</script>

<i18n lang="yaml">
  en-US:
    title: 'Make an appointment with an expert'
    close: 'Close'
    steps:
      choose-expert: 'Choose an expert'
      choose-time-slot: 'Choose a time slot'
  fr-FR:
    title: 'Prendre rendez-vous avec un expert'
    close: 'Fermer'
    steps:
      choose-expert: 'Choisissez un expert'
      choose-time-slot: 'Choisissez un créneau'
</i18n>
