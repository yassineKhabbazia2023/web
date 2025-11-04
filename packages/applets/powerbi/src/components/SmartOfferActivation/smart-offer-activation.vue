<template>
  <div>
    <ActivateTrialOfferDialog
      v-model="isTrialOfferDialogVisible"
      :currentEntity
      @offer-activated="handleOfferActivated"
    />
    <SmartOfferHeader :currentEntity />
    <div class="padding-x--11 padding-y--10">
      <SmartOfferMainSection @activate-offer="handleOfferActivation" />
      <BusinessRealTimeControl />
      <ThreeStepActivation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { SmartOfferActivationProps } from './smart-offer-activation.type'
import ThreeStepActivation from './components/ThreeStepActivation/three-step-activation.vue'
import BusinessRealTimeControl from './components/BusinessRealTimeControl/business-real-time-control.vue'
import SmartOfferHeader from './components/SmartOfferHeader/smart-offer-header.vue'
import SmartOfferMainSection from './components/SmartOfferMainSection/smart-offer-main-section.vue'
import ActivateTrialOfferDialog from './components/ActivateTrialOfferDialog/activate-trial-offer-dialog.vue'

defineProps<SmartOfferActivationProps>()
const emits = defineEmits<{
  'display-reports': []
}>()

// #region manage activate trial offer
const isTrialOfferDialogVisible = ref(false)
const handleOfferActivation = () => {
  isTrialOfferDialogVisible.value = true
  AmplitudeService.track('Power BI Promotion Activated', {
    powerbi_eligibilty_promotion_type: 'Clarity',
  })
}
const handleOfferActivated = () => {
  AmplitudeService.track('Power BI Promotion Validated', {
    powerbi_eligibilty_form_type: 'Clarity',
  })
  emits('display-reports')
}
// #endregion

// #region manage amplitude tracking event
const route = useRoute()
onMounted(() => {
  const source = route.query?.source

  if (source === 'email') {
    AmplitudeService.track('Power BI Mail Eligible consulted', {
      powerbi_eligibility_mail_type: 'Clarity',
    })
  } else {
    AmplitudeService.track('Feature Consulted', {
      feature_name: 'Clarity',
    })
  }
})
// #endregion

</script>
