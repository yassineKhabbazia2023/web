import { computed, ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormRules } from 'element-plus'
import type { AppointmentDetails } from './booking-appointment-configuration.types'
import { validationRules } from '@pulse/styleguide/utils/validators'

/**
 * Validation rules for booking appointment configuration form
 */
export function useBookingAppointmentValidation(
  formData: ComputedRef<AppointmentDetails>,
) {
  const { t } = useI18n({ useScope: 'global' })

  const rules = ref<FormRules<AppointmentDetails>>({
    // Name: required text input
    name: [
      validationRules.requiredTextInput(
        t('booking-appointment-configuration.name.error'),
      ),
    ],

    // Location: conditionally required (only if not online)
    location: [
      validationRules.conditionalRequired(
        () => formData.value.isOnline === false,
        t('booking-appointment-configuration.location.error'),
      ),
    ],

    // Duration: required select
    duration: [
      validationRules.requiredSelect(
        t('booking-appointment-configuration.duration.error'),
      ),
    ],
  })

  const durationOptions = computed(() => [
    { pValue: 15, pLabel: t('booking-appointment-configuration.duration.15min') },
    { pValue: 30, pLabel: t('booking-appointment-configuration.duration.30min') },
    { pValue: 45, pLabel: t('booking-appointment-configuration.duration.45min') },
    { pValue: 60, pLabel: t('booking-appointment-configuration.duration.1hour') },
    { pValue: 75, pLabel: t('booking-appointment-configuration.duration.1hour15') },
    { pValue: 90, pLabel: t('booking-appointment-configuration.duration.1hour30') },
    { pValue: 105, pLabel: t('booking-appointment-configuration.duration.1hour45') },
    { pValue: 120, pLabel: t('booking-appointment-configuration.duration.2hours') },
    { pValue: 135, pLabel: t('booking-appointment-configuration.duration.2hours15') },
    { pValue: 150, pLabel: t('booking-appointment-configuration.duration.2hours30') },
    { pValue: 165, pLabel: t('booking-appointment-configuration.duration.2hours45') },
    { pValue: 180, pLabel: t('booking-appointment-configuration.duration.3hours') },
    { pValue: 195, pLabel: t('booking-appointment-configuration.duration.3hours15') },
    { pValue: 210, pLabel: t('booking-appointment-configuration.duration.3hours30') },
    { pValue: 225, pLabel: t('booking-appointment-configuration.duration.3hours45') },
    { pValue: 240, pLabel: t('booking-appointment-configuration.duration.4hours') },
  ])

  return {
    rules,
    durationOptions,
  }
}
