import { ref, computed, onMounted } from 'vue'
import { FeatureFlagManager } from '@pulse/common/managers'
import { PennylaneService } from '@pulse/common/services/pennylane'
import type { PennylaneAccessDetails, PennylaneFreeTrialInfo } from '@pulse/common/services/pennylane'
import { useCurrentEntityStore } from '@pulse/common/stores'

export function usePennylaneAmendmentFlow() {
  const currentEntityStore = useCurrentEntityStore()

  const isCheckingPennylaneAccess = ref(false)
  const canAccess = ref<boolean | undefined>(undefined)
  const isPennylaneSignatory = ref<boolean | undefined>(undefined)
  const accessDetails = ref<PennylaneAccessDetails | undefined>(undefined)
  const freeTrialInfo = ref<PennylaneFreeTrialInfo>()
  // free trial info frozen at acceptance time, so the success dialog keeps describing
  // the amendment that was just signed even after the post-acceptance access re-check
  const acceptedFreeTrialInfo = ref<PennylaneFreeTrialInfo>()

  const isAccessBlockedDialogOpen = ref(false)
  const isAmendmentFlowDialogOpen = ref(false)
  const isSuccessDialogOpen = ref(false)
  const isDeclineDialogOpen = ref(false)

  const currentAccountId = computed(() => currentEntityStore.currentEntityId)

  const shouldBlockAccess = computed(() => {
    if (FeatureFlagManager.isPennylaneAmendmentFlowActivated() === false) {
      return false
    }
    return canAccess.value === false
  })

  const shouldShowBlockedDialog = computed(() => {
    if (FeatureFlagManager.isPennylaneAmendmentFlowActivated() === false) {
      return false
    }
    if (canAccess.value === undefined || isPennylaneSignatory.value === undefined) {
      return false
    }
    return canAccess.value === false && isPennylaneSignatory.value === false
  })

  const shouldShowAmendmentFlowDialog = computed(() => {
    if (FeatureFlagManager.isPennylaneAmendmentFlowActivated() === false) {
      return false
    }
    if (canAccess.value === undefined || isPennylaneSignatory.value === undefined) {
      return false
    }
    return canAccess.value === false && isPennylaneSignatory.value === true
  })

  async function checkPennylaneAccess() {
    if (FeatureFlagManager.isPennylaneAmendmentFlowActivated() === false) {
      return
    }

    const accountId = currentAccountId.value
    if (accountId === undefined) {
      return
    }

    isCheckingPennylaneAccess.value = true
    try {
      const response = await PennylaneService.checkPennylaneAccess(accountId)
      canAccess.value = response.canAccess
      isPennylaneSignatory.value = response.isPennylaneSignatory
      accessDetails.value = response.details
      freeTrialInfo.value = {
        freeTrialEndDate: response.freeTrialEndDate,
        billingMonth: response.billingMonth,
        isFreeTrialExpired: response.isFreeTrialExpired,
      }
    } catch {
      canAccess.value = undefined
      isPennylaneSignatory.value = undefined
      accessDetails.value = undefined
    } finally {
      isCheckingPennylaneAccess.value = false
    }
  }

  function handlePennylaneClick() {
    if (isCheckingPennylaneAccess.value === true) {
      return
    }

    if (shouldShowBlockedDialog.value === true) {
      isAccessBlockedDialogOpen.value = true
      return
    }

    if (shouldShowAmendmentFlowDialog.value === true) {
      isAmendmentFlowDialogOpen.value = true
    }
  }

  function handleAmendmentFlowContinue() {
    isAmendmentFlowDialogOpen.value = false
  }

  async function handleAcceptSuccess() {
    // snapshot the free trial info before the re-check overwrites it with the
    // post-acceptance state, but open the success dialog once the re-check is done
    acceptedFreeTrialInfo.value = freeTrialInfo.value
    await checkPennylaneAccess()
    isSuccessDialogOpen.value = true
  }

  function handleDecline() {
    isDeclineDialogOpen.value = true
  }

  onMounted(() => {
    checkPennylaneAccess()
  })

  return {
    isCheckingPennylaneAccess,
    canAccess,
    accessDetails,
    currentAccountId,
    isAccessBlockedDialogOpen,
    isAmendmentFlowDialogOpen,
    isSuccessDialogOpen,
    isDeclineDialogOpen,
    shouldBlockAccess,
    freeTrialInfo,
    acceptedFreeTrialInfo,
    checkPennylaneAccess,
    handlePennylaneClick,
    handleAmendmentFlowContinue,
    handleAcceptSuccess,
    handleDecline,
  }
}
