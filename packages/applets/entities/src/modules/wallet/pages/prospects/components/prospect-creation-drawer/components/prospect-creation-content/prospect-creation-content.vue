<template>
  <ProspectCreationSteps
    :step-index="stepIndex"
    class="margin-bottom--8"
  />
  <ProspectCreationStepInformation
    v-if="isInformationStep"
    ref="informationStepRef"
    v-model="formData"
    :dropdowns-content="dropdownsContent"
  />
  <ProspectCreationStepCompany
    v-if="isCompanyStep"
    ref="companyStepRef"
    v-model="formData"
    :dropdowns-content="dropdownsContent"
  />
  <ProspectCreationStepContact
    v-if="currentStep === ProspectCreationDrawerStep.CONTACT"
    ref="contactStepRef"
    v-model="formData"
    :collaborator-target-roles="collaboratorTargetRoles"
  />
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import type { ProspectCreationContentProps } from './prospect-creation-content.types'
import type { ProspectFormData } from '@entities/modules/wallet/types'
import { PROSPECT_CREATION_DRAWER_STEPS } from '../../prospect-creation-drawer.const'
import ProspectCreationSteps from '../prospect-creation-steps/prospect-creation-steps.vue'
import ProspectCreationStepInformation from '../prospect-creation-step-information/prospect-creation-step-information.form.vue'
import ProspectCreationStepCompany from '../prospect-creation-step-company/prospect-creation-step-company.form.vue'
import ProspectCreationStepContact from '../prospect-creation-step-contact/prospect-creation-step-contact.form.vue'

const props = defineProps<ProspectCreationContentProps>()

const formData = defineModel<ProspectFormData>('formData', { required: true })

const currentStep = computed(() => PROSPECT_CREATION_DRAWER_STEPS[props.stepIndex])
const isInformationStep = computed(() => currentStep.value === ProspectCreationDrawerStep.INFORMATION)
const isCompanyStep = computed(() => currentStep.value === ProspectCreationDrawerStep.COMPANY)
const isContactStep = computed(() => currentStep.value === ProspectCreationDrawerStep.CONTACT)

const informationStepRef = useTemplateRef<{
  validate: () => Promise<boolean>
}>('informationStepRef')

const companyStepRef = useTemplateRef<{
  validate: () => Promise<boolean>
}>('companyStepRef')

const contactStepRef = useTemplateRef<{
  validate: () => Promise<boolean>
}>('contactStepRef')

async function validate(): Promise<boolean> {
  if (isInformationStep.value && informationStepRef.value !== null) {
    return await informationStepRef.value.validate()
  }
  if (isCompanyStep.value && companyStepRef.value !== null) {
    return await companyStepRef.value.validate()
  }
  if (isContactStep.value && contactStepRef.value !== null) {
    return await contactStepRef.value.validate()
  }
  return true
}

defineExpose({ validate })
</script>
