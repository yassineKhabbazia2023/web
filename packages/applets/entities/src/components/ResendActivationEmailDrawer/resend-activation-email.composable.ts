import { ref, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { inviteCustomers } from '@entities/services/contact'
import type { UseResendActivationEmailOptions } from './resend-activation-email.types'

const I18N_KEY = 'entities.resendActivationEmail'

export function useResendActivationEmail({
  accountId,
  accountType,
  refreshUsers,
}: UseResendActivationEmailOptions) {
  const { t } = useI18n({ useScope: 'global' })

  const isSubmitting = ref(false)
  const selectedCustomerIds = ref<number[]>([])

  const trackOnboardingRelaunched = (result: 'succeeded' | 'failed') => {
    AmplitudeService.track('Onboarding Relaunched', {
      onboarding_relaunch_result: result,
    })
  }

  // The endpoint contract is not formally documented: only an array of invited
  // customer IDs is trusted, any other body is reported as an unconfirmed sending
  const notifyInvitationResult = (invitationResponse: unknown, selectedCount: number) => {
    if (Array.isArray(invitationResponse) === false) {
      logger.warn('Unexpected bulk invitation response:', invitationResponse)
      displayNotification('warning', t(`${I18N_KEY}.invitationNotConfirmed`))
      return
    }

    const invitedCount = invitationResponse.length

    if (invitedCount === 0) {
      displayNotification('warning', t(`${I18N_KEY}.invitationNotConfirmed`))
      return
    }

    if (invitedCount < selectedCount) {
      displayNotification(
        'warning',
        t(`${I18N_KEY}.partialInvitation`, { invitedCount, selectedCount }, invitedCount),
      )
    } else {
      displayNotification('success', t(`${I18N_KEY}.success`, invitedCount))
    }

    trackOnboardingRelaunched('succeeded')
  }

  const sendActivationEmails = async () => {
    if (isSubmitting.value || selectedCustomerIds.value.length === 0) {
      return
    }

    const customerIds = selectedCustomerIds.value
    isSubmitting.value = true

    let invitationResponse: unknown
    try {
      invitationResponse = await inviteCustomers(customerIds, toValue(accountId), toValue(accountType))
    } catch (error) {
      logger.error('Error inviting customers :', error)
      displayNotification('error', t(`${I18N_KEY}.error`))
      trackOnboardingRelaunched('failed')
      return
    } finally {
      selectedCustomerIds.value = []
      isSubmitting.value = false
    }

    // Notify as soon as the invitation result is known, without waiting for the refresh
    notifyInvitationResult(invitationResponse, customerIds.length)

    try {
      await refreshUsers()
    } catch (error) {
      logger.error('Error refreshing users after invitation :', error)
    }
  }

  return {
    isSubmitting,
    selectedCustomerIds,
    sendActivationEmails,
  }
}
