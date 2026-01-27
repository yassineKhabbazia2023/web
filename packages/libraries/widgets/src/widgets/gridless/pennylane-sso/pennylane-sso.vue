<template>
  <div
    class="widget-sso"
    data-testid="widget-pennylane-sso"
  >
    <!-- Mobile version: card style like launcher -->
    <div
      v-if="isMobile === true"
      class="
        widget-sso__mobile-card
        bg--gray-50
        hover-bg--jungle-75
        padding--3
        cursor-pointer
      "
      @click="onSSOConnection"
    >
      <div
        class="
          flex
          flex--direction-column
          flex--align-items-center
          flex--justify-content-center
        "
      >
        <PLoader
          v-if="isCheckingPennylaneAccess === true"
          pSize="24"
          pType="primary"
          class="margin-bottom--2"
        />
        <PImage
          v-else
          pName="pennylane-color"
          class="widget-sso__mobile-image margin-bottom--2"
        />
        <span
          class="
            font-size--18
            font-semibold
            text-center
            text-color--gray-900
          "
        >
          Pennylane
        </span>
        <span
          class="
            font-size--16
            font-normal
            text-center
            text-color--gray-400
          "
        >
          {{ t('widgets.pennylaneSSO.accounting') }}
        </span>
        <PIcon
          pName="arrowRight"
          pSize="16"
          class="margin-top--2"
        />
      </div>
    </div>

    <!-- Desktop version: horizontal button with arrow -->
    <PButton
      v-else
      @click="onSSOConnection"
    >
      <PIcon pName="pennylaneColor" />

      <div class="margin-x--2">
        {{ t('widgets.pennylaneSSO.accessToPennylane') }}
      </div>

      <PLoader
        v-if="isCheckingPennylaneAccess === true"
        pSize="16"
        pType="primary"
      />
      <PIcon
        v-else-if="canAccess === undefined"
        pName="exclamationTriangle"
      />
      <PIcon v-else-if="canAccess !== undefined" pName="arrowRight" />
    </PButton>

    <PennylaneAccessBlockedDialog v-model="isAccessBlockedDialogOpen" />

    <PennylaneAmendmentFlowDialog
      v-if="isAmendmentFlowDialogOpen && currentAccountId"
      v-model="isAmendmentFlowDialogOpen"
      :access-details="accessDetails"
      :current-account-id="currentAccountId"
      @accept-success="handleAcceptSuccess"
      @decline="handleDecline"
    />

    <PennylaneAmendmentSuccessDialog v-model="isSuccessDialogOpen" />
    <PennylaneAmendmentDeclineDialog v-model="isDeclineDialogOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon, PImage, PLoader } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import { useRoute } from 'vue-router'
import { RouterHelpers } from '@pulse/common/helpers'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { FeatureFlagManager, PennylaneSsoManager } from '@pulse/common/managers'
import type { PennylaneAccessDetails } from '@pulse/common/services/pennylane'
import { PennylaneSSOProps } from './pennylane-sso.types'
import { SsoTracking } from './pennylane-sso.enums'
import { AmplitudeTrackingLocation, RouteParam } from '@pulse/common/enums'
import { PennylaneService } from '@pulse/common/services/pennylane'
import PennylaneAccessBlockedDialog from './components/pennylane-access-blocked-dialog.vue'
import PennylaneAmendmentFlowDialog from './components/pennylane-amendment-flow-dialog.vue'
import PennylaneAmendmentSuccessDialog from './components/pennylane-amendment-success-dialog.vue'
import PennylaneAmendmentDeclineDialog from './components/pennylane-amendment-decline-dialog.vue'
import { PennylaneAmendmentTrackingManager } from './pennylane-amendment-tracking.manager'
import { PennylaneAmendmentStep } from './components/pennylane-amendment-flow-dialog/pennylane-amendment-flow-dialog.enum'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const route = useRoute()
const { isMobile } = useResponsive()
const props = defineProps<PennylaneSSOProps>()

const ssoUrl = computed(() => PennylaneSsoManager.getUrl(props.isCollab))

const isAccessBlockedDialogOpen = ref(false)
const isAmendmentFlowDialogOpen = ref(false)
const isSuccessDialogOpen = ref(false)
const isDeclineDialogOpen = ref(false)
const isCheckingPennylaneAccess = ref(false)
const canAccess = ref<boolean | undefined>(undefined)
const isPennylaneSignatory = ref<boolean | undefined>(undefined)
const accessDetails = ref<PennylaneAccessDetails | undefined>(undefined)

const currentAccountId = RouterHelpers.getRouteParamAsInt(route, RouteParam.ENTITY_ID)

const shouldShowValidationDialog = computed(() => {
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

const onSSOConnection = () => {
  if (isCheckingPennylaneAccess.value === true) {
    return
  }

  AmplitudeService.track('Feature Consulted', {
    feature_name: SsoTracking.SSO_PENNYLANE,
    feature_consultation_localisation: AmplitudeTrackingLocation.HOMEPAGE,
  })
  PennylaneSsoManager.setSsoOrigin()

  if (shouldShowValidationDialog.value === true) {
    isAccessBlockedDialogOpen.value = true
    PennylaneAmendmentTrackingManager.trackNonSignataireDisplayed()
  } else if (shouldShowAmendmentFlowDialog.value === true) {
    isAmendmentFlowDialogOpen.value = true
    PennylaneAmendmentTrackingManager.trackStepDisplayed(PennylaneAmendmentStep.INFORMATION)
  } else {
    window.open(ssoUrl.value, '_blank')
  }
}

const handleAcceptSuccess = () => {
  checkPennylaneAccess()
  isSuccessDialogOpen.value = true
  PennylaneAmendmentTrackingManager.trackOutroOK()
}

const handleDecline = () => {
  isDeclineDialogOpen.value = true
  PennylaneAmendmentTrackingManager.trackOutroKO()
}

const checkPennylaneAccess = async () => {
  if (FeatureFlagManager.isPennylaneAmendmentFlowActivated() === false) {
    return
  }

  if (currentAccountId === null) {
    return
  }

  isCheckingPennylaneAccess.value = true
  try {
    const accessResponse = await PennylaneService.checkPennylaneAccess(currentAccountId)

    canAccess.value = accessResponse.canAccess
    isPennylaneSignatory.value = accessResponse.isPennylaneSignatory
    accessDetails.value = accessResponse.details
  } catch {
    canAccess.value = undefined
    isPennylaneSignatory.value = undefined
    accessDetails.value = undefined
  } finally {
    isCheckingPennylaneAccess.value = false
  }
}

onMounted(() => {
  checkPennylaneAccess()
})
</script>

<style lang="scss" scoped>
.widget-sso__mobile-card {
  width: 132px;
  height: 132px;
}

.widget-sso__mobile-image {
  height: 32px;
  width: 32px;
}
</style>
