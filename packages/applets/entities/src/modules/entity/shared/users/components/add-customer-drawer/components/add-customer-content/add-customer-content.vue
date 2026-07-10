<template>
  <AddCustomerSteps
    v-if="isStepperVisible"
    :addCustomerDrawerStepIndex="addCustomerDrawerStepIndex"
    :steps="stepperSteps"
    class="margin-bottom--6"
  />
  <AddCustomerStepAddEmail
    v-if="addCustomerDrawerStep === AddCustomerDrawerStep.ADD_EMAIL"
    :newContact="newContact"
    :emailErrorMessage="emailErrorMessage"
    :firstNameErrorMessage="firstNameErrorMessage"
    :lastNameErrorMessage="lastNameErrorMessage"
    :shouldEnableNames="shouldEnableNames"
    @update:email="emit('update:email', $event)"
    @update:first-name="emit('update:first-name', $event)"
    @update:last-name="emit('update:last-name', $event)"
  />
  <AddCustomerStepManageRights
    v-if="contactId !== undefined && addCustomerDrawerStep === AddCustomerDrawerStep.MANAGE_RIGHTS"
    v-model:authorizationsState="authorizationsState"
    v-model:additionalOptionByActionCode="additionalOptionByActionCode"
    v-model:additionalOptionByActionCodeOrigin="additionalOptionByActionCodeOrigin"
    v-model:pennylaneAvailableRoles="pennylaneAvailableRoles"
    :newContact="newContact"
    :contactId="contactId"
    :entityId="entityId"
    :accountNumber="accountNumber"
    :isProspect="isProspect"
  />
  <AddCustomerStepFormSent
    v-if="addCustomerDrawerStep === AddCustomerDrawerStep.FORM_SENT"
    :newContact="newContact"
    :hasFormSubmissionFailed="hasFormSubmissionFailed"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AddCustomerContentProps } from './add-customer-content.types'
import AddCustomerSteps from '../add-customer-steps/add-customer-steps.vue'
import AddCustomerStepAddEmail from '../add-customer-step-add-email/add-customer-step-add-email.vue'
import AddCustomerStepFormSent from '../add-customer-step-form-sent/add-customer-step-form-sent.vue'
import AddCustomerStepManageRights from '../add-customer-step-manage-rights/add-customer-step-manage-rights.vue'
import { AddCustomerDrawerStep } from '@entities/modules/entity/shared/users/enums'
import type { AuthorizationState } from '@entities/components/ManageRightsDrawer/ManageRightsTypes'
import type { PennylaneAvailableRole } from '@pulse/common/types'

const props = defineProps<AddCustomerContentProps>()

const isStepperVisible = computed(() =>
  props.stepperSteps.length > 1 && props.addCustomerDrawerStep !== AddCustomerDrawerStep.FORM_SENT,
)
const authorizationsState = defineModel<Record<string, AuthorizationState>>('authorizationsState')
const additionalOptionByActionCode = defineModel<Record<string, string>>('additionalOptionByActionCode')
const additionalOptionByActionCodeOrigin = defineModel<Record<string, string>>('additionalOptionByActionCodeOrigin')
const pennylaneAvailableRoles = defineModel<PennylaneAvailableRole[]>('pennylaneAvailableRoles')

const emit = defineEmits<{
  'update:email': [string]
  'update:first-name': [string]
  'update:last-name': [string]
}>()
</script>
