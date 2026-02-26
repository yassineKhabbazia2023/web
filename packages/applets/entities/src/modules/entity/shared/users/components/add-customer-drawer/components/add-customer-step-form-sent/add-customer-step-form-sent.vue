<template>
  <AddCustomerFeedback
    class="margin-top--4"
    :fullName="fullname"
    :email="newContact.email"
    :hasError="hasFormSubmissionFailed"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AddCustomerStepFormSentProps } from './add-customer-step-form-sent.types'
import AddCustomerFeedback from '../add-customer-feedback/add-customer-feedback.vue'
import { getFullName } from '@entities/utils'

const props = defineProps<AddCustomerStepFormSentProps>()
const fullname = computed(() => getFullName(
  props.newContact.firstname,
  props.newContact.lastname,
))
</script>

