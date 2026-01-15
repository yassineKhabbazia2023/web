<template>
  <div
    class="widget-sso"
    data-testid="widget-pennylane-sso"
  >
    <PButton
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
      <PIcon v-else-if="isCheckingPennylaneAccess === false" pName="arrowRight" />
    </PButton>

    <PennylaneAccessBlockedDialog v-model="isAccessBlockedDialogOpen" />

    <PennylaneAmendmentFlowDialog
      v-model="isAmendmentFlowDialogOpen"
      :access-details="accessDetails"
      @continue="handleAmendmentFlowContinue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon, PLoader } from '@pulse/styleguide/components'
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

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const route = useRoute()
const props = defineProps<PennylaneSSOProps>()

const ssoUrl = computed(() => PennylaneSsoManager.getUrl(props.isCollab))

const isAccessBlockedDialogOpen = ref(false)
const isAmendmentFlowDialogOpen = ref(false)
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
  } else if (shouldShowAmendmentFlowDialog.value === true) {
    isAmendmentFlowDialogOpen.value = true
  } else {
    window.open(ssoUrl.value, '_blank')
  }
}

const handleAmendmentFlowContinue = () => {
  isAmendmentFlowDialogOpen.value = false
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
