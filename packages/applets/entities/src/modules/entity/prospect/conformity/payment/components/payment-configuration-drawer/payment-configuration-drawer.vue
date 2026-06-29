<template>
  <div>
    <PDrawer
      v-model="isOpen"
      destroyOnClose
      pSize="50%"
      :pTitle="t(`${I18N}.title`)"
      :pBeforeClose="requestClose"
      @close-drawer-button="requestClose()"
      @closed="onDrawerClosed"
    >
      <PSteps
        :pActive="currentStep - 1"
        pDirection="horizontal"
        :pProcessStatus="PStepStatus.PROCESS"
        :pFinishStatus="PStepStatus.SUCCESS"
        :pSteps="stepItems"
        class="margin-bottom--6"
      />

      <GeneralInformationStep
        v-if="currentStep === PaymentConfigurationStep.GeneralInformation"
        :bank-details="bankDetails"
        :rib-file="ribFile"
        @update:rib-file="onRibFileChanged"
        @update:valid="isGeneralInformationValid = $event"
      />
      <SignatureStep
        v-else-if="currentStep === PaymentConfigurationStep.Signature"
        :signature-url="signatureUrl"
        @iframe-load="onSignatureIframeLoad"
      />
      <CompletedStep
        v-else
        :prospect-id="prospectId"
      />

      <template #footer>
        <div
          v-if="currentStep === PaymentConfigurationStep.GeneralInformation"
          class="
            flex
            flex--align-items-center
            flex--justify-content-flex-end
            flex-gap--4
          "
        >
          <PCheckbox
            v-model="isAccuracyConfirmed"
            pLabelLeft
          >
            {{ t(`${I18N}.accuracyConfirmation`) }}
          </PCheckbox>
          <PButton
            pType="primary"
            :pDisabled="isContinueDisabled"
            :pLoading="isSubmitting"
            @click="onPrimaryClick"
          >
            {{ t(`${I18N}.continue`) }}
          </PButton>
        </div>
        <PDrawerActions
          v-else
          :pBackCTA="backCTA"
          :pPrimaryCTA="primaryCTA"
          @click-back-cta="onAbandonClick"
          @click-primary-cta="onPrimaryClick"
        />
      </template>
    </PDrawer>

    <QuitConfirmationModal
      v-model="isQuitConfirmationVisible"
      @quit="performClose"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { PButton, PCheckbox, PDrawer, PDrawerActions, PSteps } from '@pulse/styleguide/components'
import { PStepStatus } from '@pulse/styleguide/types'
import type { PStepsItem } from '@pulse/styleguide/types'
import { PAYMENT_I18N_BASE } from '../../payment.consts'
import { PaymentConfigurationStep } from './payment-configuration-drawer.enums'
import { usePaymentConfiguration } from './payment-configuration-drawer.composable'
import GeneralInformationStep from './steps/general-information-step/general-information-step.vue'
import SignatureStep from './steps/signature-step/signature-step.vue'
import CompletedStep from './steps/completed-step/completed-step.vue'
import QuitConfirmationModal from './quit-confirmation-modal/quit-confirmation-modal.vue'

const I18N = `${PAYMENT_I18N_BASE}.configurationDrawer`

const { t } = useI18n()

const isOpen = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  completed: []
}>()

const { currentEntity } = storeToRefs(useCurrentEntityStore())

const officeAddress = currentEntity.value?.office?.address

const prospectId = currentEntity.value?.prospectId as number

const {
  bankDetails,
  ribFile,
  isAccuracyConfirmed,
  isGeneralInformationValid,
  currentStep,
  isSubmitting,
  signatureUrl,
  isVerifyingSignature,
  hasUnsavedProgress,
  submitGeneralInformation,
  confirmSignature,
  checkSignatureOnIframeNavigation,
  onRibFileChanged,
  reset,
} = usePaymentConfiguration({
  prospectId,
  addressPrefill: {
    addressLine1: officeAddress?.addressLine1,
    addressLine2: officeAddress?.addressLine2,
    postalCode: officeAddress?.zipCode,
    city: officeAddress?.city,
    country: officeAddress?.country,
  },
  submitErrorMessage: t(`${I18N}.submitError`),
  notSignedMessage: t(`${I18N}.notSignedYet`),
  signatureCheckErrorMessage: t(`${I18N}.signatureCheckError`),
})

// Preview-only escape hatch (e.g. Storybook): open the drawer directly on a given step.
defineExpose({
  openAtStep(step: PaymentConfigurationStep, url = ''): void {
    currentStep.value = step
    signatureUrl.value = url
    isOpen.value = true
  },
})

const isQuitConfirmationVisible = ref(false)

const stepItems = computed<PStepsItem[]>(() => [
  { pTitle: t(`${I18N}.steps.generalInformation`) },
  { pTitle: t(`${I18N}.steps.signature`) },
  { pTitle: t(`${I18N}.steps.completed`) },
])

// Step 1 has its own footer (checkbox + button); PDrawerActions only renders for steps 2 and 3.
// On the signature step, "Continue" verifies the signature against the payment preference (loading
// state shown meanwhile); the completed step's primary action just closes the drawer.
const primaryCTA = computed(() =>
  currentStep.value === PaymentConfigurationStep.Signature
    ? { pLabel: t(`${I18N}.signatureConfirm`), pLoading: isVerifyingSignature.value }
    : { pLabel: t(`${I18N}.close`) },
)

// "Abandonner" sits on the far left as a back CTA (like the "Add a user" drawer), only on the
// signature step; the completed step has no left action.
const backCTA = computed(() => {
  if (currentStep.value === PaymentConfigurationStep.Signature) {
    return { pLabel: t(`${I18N}.abandon`) }
  }
  return undefined
})

// Step 1 "Continuer" also requires the accuracy confirmation checkbox to be ticked.
const isContinueDisabled = computed(() =>
  isGeneralInformationValid.value === false
  || isAccuracyConfirmed.value === false,
)

// Each GetAccept iframe navigation is a chance to catch the freshly-signed mandate (verified silently).
const onSignatureIframeLoad = (): void => {
  checkSignatureOnIframeNavigation()
}

const onPrimaryClick = (): void => {
  switch (currentStep.value) {
    case PaymentConfigurationStep.GeneralInformation:
      submitGeneralInformation()
      break
    case PaymentConfigurationStep.Signature:
      confirmSignature()
      break
    default:
      performClose()
  }
}

// "Abandonner" on the signature step asks for confirmation before cancelling the procedure.
const onAbandonClick = (): void => {
  requestClose()
}

const performClose = (done?: () => void): void => {
  isQuitConfirmationVisible.value = false
  if (done !== undefined) {
    done()
  } else {
    isOpen.value = false
  }
}

// Reset only once the close animation has finished, so the drawer never flips back to the first step
// while it slides away. Guarded against a quick reopen happening during the transition.
// Reaching the completed step means the mandate is signed server-side, so any close from there
// (primary button OR the header cross) must notify the parent to refresh the payment card.
const onDrawerClosed = (): void => {
  if (isOpen.value === false) {
    if (currentStep.value === PaymentConfigurationStep.Completed) {
      emit('completed')
    }
    reset()
  }
}

// The signature step always confirms: a mandate has already been generated server-side, so leaving
// discards it regardless of the form fields. The entry step only warns when it holds progress, and
// the completed step never warns.
const requestClose = (done?: () => void): void => {
  const step = currentStep.value
  const shouldConfirm = step === PaymentConfigurationStep.Signature
    || (step === PaymentConfigurationStep.GeneralInformation && hasUnsavedProgress.value)
  if (shouldConfirm) {
    isQuitConfirmationVisible.value = true
    return
  }
  performClose(done)
}
</script>
