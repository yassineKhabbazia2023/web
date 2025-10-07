<template>
  <PDrawer
    v-model="internalIsOpened"
    :pTitle="title"
    pSize="50%"
    @close-drawer-button="internalIsOpened = false"
  >
    <template #header-prefix>
      <p class="text-color--neutral-gray-400">
        {{ t('headerPrefix') }}
      </p>
    </template>

    <BookingConfiguration
      v-if="bookingDrawerState === BookingDrawerState.IDLE"
      ref="bookingConfiguration"
      v-model:bookingConfigurationFormData="bookingConfigurationFormData"
    />
    <BookingConfigurationSuccess
      v-if="bookingDrawerState === BookingDrawerState.SUCCESS"
    />
    <BookingConfigurationFailed
      v-if="bookingDrawerState === BookingDrawerState.FAILED"
    />

    <template #footer>
      <PButton
        pType="primary"
        :pDisabled="isMainButtonDisabled"
        @click="onClickMainButton"
      >
        {{ mainButtonLabel }}
      </PButton>
    </template>
  </PDrawer>
</template>
<script lang="ts" setup>
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/core'
import { PDrawer, PButton } from '@pulse/styleguide/components'
import type { BookingDrawerProps } from './booking-drawer.types'
import type { BookingConfigurationFormData } from '../booking.type'
import BookingConfiguration from '../booking-configuration/booking-configuration.vue'
import BookingConfigurationSuccess from '../booking-configuration-success/booking-configuration-success.vue'
import BookingConfigurationFailed from '../booking-configuration-failed/booking-configuration-failed.vue'
import { BookingDrawerState } from './booking-drawer.enum'
import { BookingService } from '@pulse/common/services/booking'
import { AmplitudeService } from '@pulse/common/services/amplitude'

const props = defineProps<BookingDrawerProps>()

const bookingConfigurationRef = useTemplateRef('bookingConfiguration')

const emit = defineEmits<{
  'update:isOpened': [boolean]
}>()

const internalIsOpened = computed({
  get: () => props.isOpened,
  set: (isOpened: boolean) => {
    emit('update:isOpened', isOpened)
  },
})

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isMainButtonDisabled = computed(() =>
  bookingConfigurationFormData.value.configurationLink.length === 0
  && bookingDrawerState.value === BookingDrawerState.IDLE,
)
const bookingDrawerState = ref<BookingDrawerState>(BookingDrawerState.IDLE)
const bookingConfigurationFormData = ref<BookingConfigurationFormData>({
  configurationLink: '',
})

async function onClickMainButton() {
  if (bookingDrawerState.value === BookingDrawerState.IDLE) {
    validate()
    return
  }
  internalIsOpened.value = false
}

async function validate() {
  const isValid = bookingConfigurationRef.value?.checkForm()

  if (isValid === true) {
    await saveConfigurationLink()
  } else {
    amplitudeTrack('wrong link')
  }
}

async function saveConfigurationLink() {
  try {
    await BookingService.createBookingConfiguration(bookingConfigurationFormData.value.configurationLink)
    bookingDrawerState.value = BookingDrawerState.SUCCESS
    amplitudeTrack('succeeded')
  } catch (error) {
    logger.error('Error saving booking configuration', error)
    bookingDrawerState.value = BookingDrawerState.FAILED
    amplitudeTrack('failed')
  }
}

const titleByState: Record<BookingDrawerState, string>= {
  [BookingDrawerState.IDLE]: t('title.idle'),
  [BookingDrawerState.SUCCESS]: t('title.success'),
  [BookingDrawerState.FAILED]: t('title.failed'),
}

const title = computed(() => titleByState[bookingDrawerState.value])

const mainButtonLabelByState: Record<BookingDrawerState, string>= {
  [BookingDrawerState.IDLE]: t('mainButton.idle'),
  [BookingDrawerState.SUCCESS]: t('mainButton.success'),
  [BookingDrawerState.FAILED]: t('mainButton.failed'),
}
const mainButtonLabel = computed(() => mainButtonLabelByState[bookingDrawerState.value])

watch(() => props.isOpened, (newVal) => {
  if (newVal === true) {
    bookingConfigurationFormData.value = {
      configurationLink: '',
    }
    bookingDrawerState.value = BookingDrawerState.IDLE
    bookingConfigurationRef.value?.clearState()
  }
})

function amplitudeTrack(result: 'succeeded' | 'failed' | 'wrong link') {
  AmplitudeService.track('Booking Configuration View Completed', {
    booking_config_view_completed_result: result,
  })
}
</script>

<i18n lang="yaml">
  en-US:
    title:
      idle: 'Simplify scheduling appointments with your clients'
      success: 'Appointments are now accessible to your clients!'
      failed: 'The configuration could not be completed.'
    headerPrefix: 'Make an appointment'
    mainButton:
      idle: 'Validate'
      success: 'Close'
      failed: 'Close'
  fr-FR:
    title:
      idle: 'Simplifier la prise de rendez-vous avec vos clients'
      success: 'La prise de rendez-vous est maintenant accessible à vos clients !'
      failed: 'La configuration n’a pas pu être terminée.'
    headerPrefix: 'Prise de rendez-vous'
    mainButton:
      idle: 'Valider'
      success: 'Fermer'
      failed: 'Fermer'
</i18n>
