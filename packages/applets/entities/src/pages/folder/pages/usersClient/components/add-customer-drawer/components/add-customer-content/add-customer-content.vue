<template>
  <AddCustomerSteps
    v-if="addCustomerDrawerStep !== AddCustomerDrawerStep.FORM_SENT"
    :addCustomerDrawerStepIndex="addCustomerDrawerStepIndex"
    class="margin-bottom--10"
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
    :newContact="newContact"
    :contactId="contactId"
    :entityId="entityId"
    :accountNumber="accountNumber"
  />
  <AddCustomerStepFormSent
    v-if="addCustomerDrawerStep === AddCustomerDrawerStep.FORM_SENT"
    :newContact="newContact"
    :hasFormSubmissionFailed="hasFormSubmissionFailed"
  />
</template>

<script setup lang="ts">
import type { AddCustomerContentProps } from './add-customer-content.types'
import AddCustomerSteps from '../add-customer-steps/add-customer-steps.vue'
import AddCustomerStepAddEmail from '../add-customer-step-add-email/add-customer-step-add-email.vue'
import AddCustomerStepFormSent from '../add-customer-step-form-sent/add-customer-step-form-sent.vue'
import AddCustomerStepManageRights from '../add-customer-step-manage-rights/add-customer-step-manage-rights.vue'
import { AddCustomerDrawerStep } from '../../add-customer-drawer.enums'
import type { AuthorizationState } from '@entities/common/components/ManageRightsDrawer/ManageRightsTypes'

defineProps<AddCustomerContentProps>()
const authorizationsState = defineModel<Record<string, AuthorizationState>>('authorizationsState')
const additionalOptionByActionCode = defineModel<Record<string, string>>('additionalOptionByActionCode')
const additionalOptionByActionCodeOrigin = defineModel<Record<string, string>>('additionalOptionByActionCodeOrigin')

const emit = defineEmits<{
  'update:email': [string]
  'update:first-name': [string]
  'update:last-name': [string]
}>()
</script>
