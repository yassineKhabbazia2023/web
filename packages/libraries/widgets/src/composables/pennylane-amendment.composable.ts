import { ref, computed } from 'vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { FeatureFlagManager } from '@pulse/common/managers'
import { logger, isNotNullNorEmpty } from '@pulse/toolbox'
import type { PennylaneAccessDetails, PennylaneFreeTrialInfo } from '@pulse/common/services/pennylane'
import { PennylaneAmendmentTrackingManager } from '../widgets/gridless/pennylane-sso/pennylane-amendment-tracking.manager'

export function usePennylaneAmendment() {
  const isCheckingPennylaneAccess = ref(false)
  const canAccessPennylane = ref<boolean | undefined>(undefined)
  const isPennylaneSignatory = ref<boolean | undefined>(undefined)
  const pennylaneAccessDetails = ref<PennylaneAccessDetails>()
  const pennylaneFreeTrialInfo = ref<PennylaneFreeTrialInfo>()
  // free trial info frozen at acceptance time, so the success dialog keeps describing
  // the amendment that was just signed even after the post-acceptance access re-check
  const acceptedFreeTrialInfo = ref<PennylaneFreeTrialInfo>()

  const showPennylaneAmendmentDialog = ref(false)
  const showPennylaneAmendmentSuccessDialog = ref(false)
  const showPennylaneAmendmentDeclineDialog = ref(false)
  const showPennylaneAccessBlockedDialog = ref(false)

  const shouldShowPennylaneAmendmentDialog = computed(() => {
    if (FeatureFlagManager.isPennylaneAmendmentFlowActivated() === false) {
      return false
    }

    if (canAccessPennylane.value === undefined || isPennylaneSignatory.value === undefined) {
      return false
    }

    if (isNotNullNorEmpty(pennylaneAccessDetails.value) === false) {
      return false
    }

    if (isNotNullNorEmpty(pennylaneFreeTrialInfo.value?.freeTrialEndDate) === false) {
      return false
    }

    if (isNotNullNorEmpty(pennylaneFreeTrialInfo.value?.billingMonth) === false) {
      return false
    }

    if (isNotNullNorEmpty(pennylaneAccessDetails.value?.terms) === false) {
      return false
    }

    return canAccessPennylane.value === false && isPennylaneSignatory.value === true
  })

  const shouldShowPennylaneAccessBlockedDialog = computed(() => {
    if (FeatureFlagManager.isPennylaneAmendmentFlowActivated() === false) {
      return false
    }

    if (canAccessPennylane.value === undefined || isPennylaneSignatory.value === undefined) {
      return false
    }

    return canAccessPennylane.value === false && isPennylaneSignatory.value === false
  })

  async function checkPennylaneAccess(accountId?: number): Promise<void> {
    if (FeatureFlagManager.isPennylaneAmendmentFlowActivated() === false) {
      return
    }

    isCheckingPennylaneAccess.value = true
    try {
      const response = await PennylaneService.checkPennylaneAccess(accountId)

      canAccessPennylane.value = response.canAccess
      isPennylaneSignatory.value = response.isPennylaneSignatory
      pennylaneAccessDetails.value = response.details
      pennylaneFreeTrialInfo.value = {
        freeTrialEndDate: response.freeTrialEndDate,
        billingMonth: response.billingMonth,
        isFreeTrialExpired: response.isFreeTrialExpired,
      }
    } catch (error) {
      logger.error('Pennylane amendment check failed', error)
      canAccessPennylane.value = undefined
      isPennylaneSignatory.value = undefined
      pennylaneAccessDetails.value = undefined
      pennylaneFreeTrialInfo.value = undefined
    } finally {
      isCheckingPennylaneAccess.value = false
    }
  }

  // freeze the current free trial info for the success dialog; must be called before the
  // post-acceptance access re-check, which overwrites pennylaneFreeTrialInfo
  function captureAcceptedFreeTrialInfo(): void {
    acceptedFreeTrialInfo.value = pennylaneFreeTrialInfo.value
  }

  function onPennylaneAmendmentAcceptSuccess(): void {
    showPennylaneAmendmentDialog.value = false
    showPennylaneAmendmentSuccessDialog.value = true
    PennylaneAmendmentTrackingManager.trackOutroOK()
  }

  function onPennylaneAmendmentDecline(): void {
    showPennylaneAmendmentDialog.value = false
    showPennylaneAmendmentDeclineDialog.value = true
    PennylaneAmendmentTrackingManager.trackOutroKO()
  }

  return {
    isCheckingPennylaneAccess,
    canAccessPennylane,
    isPennylaneSignatory,
    pennylaneAccessDetails,
    pennylaneFreeTrialInfo,
    acceptedFreeTrialInfo,
    showPennylaneAmendmentDialog,
    showPennylaneAmendmentSuccessDialog,
    showPennylaneAmendmentDeclineDialog,
    showPennylaneAccessBlockedDialog,
    shouldShowPennylaneAmendmentDialog,
    shouldShowPennylaneAccessBlockedDialog,
    checkPennylaneAccess,
    captureAcceptedFreeTrialInfo,
    onPennylaneAmendmentAcceptSuccess,
    onPennylaneAmendmentDecline,
  }
}
