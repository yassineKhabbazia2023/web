<template>
  <div>
    <SmartOfferHeader :selectedEntity />
    <div class="padding-x--11 padding-y--10">
      <SmartOfferMainSection />
      <BusinessRealTimeControl />
      <ThreeStepActivation />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { SmartOfferActivationProps } from './smart-offer-activation.type'
import ThreeStepActivation from './components/ThreeStepActivation/three-step-activation.vue'
import BusinessRealTimeControl from './components/BusinessRealTimeControl/business-real-time-control.vue'
import SmartOfferHeader from './components/SmartOfferHeader/smart-offer-header.vue'
import SmartOfferMainSection from './components/SmartOfferMainSection/smart-offer-main-section.vue'

defineProps<SmartOfferActivationProps>()

onMounted(() => {
  AmplitudeService.track('Feature Consulted', {
    feature_name: 'Clarity',
  })
})
</script>
