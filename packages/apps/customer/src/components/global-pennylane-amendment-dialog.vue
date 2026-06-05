<template>
  <PennylaneAmendmentFlowDialog
    v-model="isVisible"
    :access-details="accessDetails"
    :free-trial-info="freeTrialInfo"
    @accept-success="handleAcceptSuccess"
    @decline="handleDecline"
  />
</template>

<script setup lang="ts">
import { PennylaneAmendmentFlowDialog } from '@pulse/widgets/pennylane-dialogs'
import type { GlobalPennylaneAmendmentDialogProps } from './global-pennylane-amendment-dialog.types'

defineProps<GlobalPennylaneAmendmentDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'accept-success': []
  'decline': []
}>()

const isVisible = defineModel<boolean>({ required: true })

function handleAcceptSuccess() {
  emit('accept-success')
}

function handleDecline() {
  emit('decline')
}
</script>
