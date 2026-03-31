<template>
  <ProspectCreationSteps
    :stepIndex="stepIndex"
    class="margin-bottom--10"
  />
  <ProspectCreationStepInformation
    v-if="currentStep === ProspectCreationDrawerStep.INFORMATION"
    v-model="formData.information"
  />
  <ProspectCreationStepCompany
    v-if="currentStep === ProspectCreationDrawerStep.COMPANY"
    v-model="formData.company"
  />
  <ProspectCreationStepContact
    v-if="currentStep === ProspectCreationDrawerStep.CONTACT"
    v-model="formData.contact"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import type { ProspectCreationContentProps } from './prospect-creation-content.type'
import type { ProspectFormData } from '../../prospect-creation-drawer.type'
import { PROSPECT_CREATION_DRAWER_STEPS } from '../../prospect-creation-drawer.const'
import ProspectCreationSteps from '../prospect-creation-steps/prospect-creation-steps.vue'
import ProspectCreationStepInformation from '../prospect-creation-step-information/prospect-creation-step-information.form.vue'
import ProspectCreationStepCompany from '../prospect-creation-step-company/prospect-creation-step-company.form.vue'
import ProspectCreationStepContact from '../prospect-creation-step-contact/prospect-creation-step-contact.form.vue'

const props = defineProps<ProspectCreationContentProps>()
const formData = defineModel<ProspectFormData>('formData', { required: true })

const currentStep = computed(() => PROSPECT_CREATION_DRAWER_STEPS[props.stepIndex])
</script>
