<template>
  <PDialog
    v-model="isVisible"
    :p-width="dialogWidth"
    :p-fullscreen="isMobile"
    :p-show-close="false"
    p-lock-scroll
    p-align-center
    :before-close="() => {}"
    class="
      pennylane-amendment-flow-dialog
      no-spacing
    "
  >
    <div :class="contentClasses">
      <div
        class="
          pennylane-amendment-flow-dialog__left
          padding-top--0
          padding--10
          flex
          flex--direction-column
          bg--base-white
        "
      >
        <StepInformation
          v-if="currentStep === PennylaneAmendmentStep.INFORMATION"
        />

        <StepAccountsPricing
          v-if="currentStep === PennylaneAmendmentStep.ACCOUNTS_PRICING"
          :accounts
        />

        <StepTermsPreview
          v-else-if="currentStep === PennylaneAmendmentStep.TERMS_PREVIEW"
          :account-id="props.currentAccountId"
          @scroll-complete="setTermsScrollComplete"
        />

        <StepAcceptance
          v-else-if="currentStep === PennylaneAmendmentStep.ACCEPTANCE"
          :is-accepted="isTermsAccepted"
          :account-id="props.currentAccountId"
          @update:is-accepted="setTermsAccepted"
        />

        <div class="margin-top--auto">
          <div id="pennylane-amendment-flow-dialog-footer" />

          <div class="flex flex--justify-content-space-between margin-top--2">
            <div
              v-if="currentStep === PennylaneAmendmentStep.ACCEPTANCE"
              class="flex flex--align-items-center"
            >
              <PTooltip
                :pContent="t('widgets.pennylaneAmendmentFlow.step4.refuseTooltip')"
                pPlacement="top"
              >
                <PIcon
                  p-name="infoCircle"
                  p-size="16"
                  class="text-color--red-800 cursor--pointer"
                />
              </PTooltip>
              <PButton
                p-type="tertiary"
                class="text-color--red-800"
                :p-loading="isRefuseLoading"
                @click="handleRefuse"
              >
                {{ t('widgets.pennylaneAmendmentFlow.step4.buttonRefuse') }}
              </PButton>
            </div>

            <div class="flex flex--align-items-center flex-gap--2 margin-left--auto">
              <PButton
                v-if="isFirstStep === false"
                p-type="secondary"
                @click="handlePrevious"
              >
                {{ t('widgets.pennylaneAmendmentFlow.common.buttonBack') }}
              </PButton>

              <PButton
                v-if="currentStep === PennylaneAmendmentStep.ACCEPTANCE"
                p-type="primary"
                :p-disabled="isNextButtonDisabled"
                :p-loading="isAcceptLoading"
                @click="handleAccept"
              >
                {{ t('widgets.pennylaneAmendmentFlow.step4.buttonAccept') }}
              </PButton>

              <PButton
                v-else-if="isLastStep === false"
                p-type="primary"
                :p-disabled="isNextButtonDisabled"
                @click="handleNext"
              >
                {{ t('widgets.pennylaneAmendmentFlow.common.buttonContinue') }}
              </PButton>
            </div>
          </div>
        </div>
      </div>

      <div
        class="
          pennylane-amendment-flow-dialog__right
          position--relative
          bg--black-rock-900
          flex
          flex--justify-content-center
        "
      >
        <template v-if="currentStep === PennylaneAmendmentStep.INFORMATION">
          <div
            class="
              pennylane-amendment-flow-dialog__branding
              flex
              flex--direction-column
              flex--align-items-center
              flex-gap--6
            "
          >
            <PImage
              pName="brand-white"
              pFit="contain"
              class="
                pennylane-amendment-flow-dialog__logo
                pennylane-amendment-flow-dialog__logo--brand
              "
            />

            <div class="pennylane-amendment-flow-dialog__separator bg--base-white" />

            <PImage
              pName="pennylane-logo"
              pFit="contain"
              class="
                pennylane-amendment-flow-dialog__logo
                pennylane-amendment-flow-dialog__logo--pennylane
              "
            />
          </div>

          <PImage
            pName="pennylane-header-illustration"
            pFit="cover"
            class="pennylane-amendment-flow-dialog__background"
          />
        </template>

        <StepAccountsPricingFAQ v-else-if="currentStep === PennylaneAmendmentStep.ACCOUNTS_PRICING" />
      </div>
    </div>
  </PDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { PButton, PDialog, PImage, PTooltip, PIcon } from '@pulse/styleguide/components'
import type { PennylaneAmendmentFlowDialogProps } from './pennylane-amendment-flow-dialog.type'
import { PennylaneAmendmentStep } from './pennylane-amendment-flow-dialog/pennylane-amendment-flow-dialog.enum'
import { usePennylaneAmendmentSteps } from './pennylane-amendment-flow-dialog/pennylane-amendment-flow-dialog.composable'
import StepInformation from './pennylane-amendment-flow-dialog/steps/step-information.vue'
import StepAccountsPricing from './pennylane-amendment-flow-dialog/steps/step-accounts-pricing.vue'
import StepAccountsPricingFAQ from './pennylane-amendment-flow-dialog/steps/step-accounts-pricing-faq.vue'
import StepTermsPreview from './pennylane-amendment-flow-dialog/steps/step-terms-preview.vue'
import StepAcceptance from './pennylane-amendment-flow-dialog/steps/step-acceptance.vue'
import { PennylaneService, PennylaneValidationPayload } from '@pulse/common/services/pennylane'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<PennylaneAmendmentFlowDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'accept-success': []
  'decline': []
}>()

const {
  currentStep,
  isFirstStep,
  isLastStep,
  isNextButtonDisabled,
  isTermsAccepted,
  handleNext,
  handlePrevious,
  reset,
  setTermsScrollComplete,
  setTermsAccepted,
} = usePennylaneAmendmentSteps()

const isAcceptLoading = ref(false)
const isRefuseLoading = ref(false)

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    if (value === false) {
      reset()
    }
  },
})

const accounts = computed(() => props.accessDetails?.accounts ?? [])

const accountNumbers = computed(() => accounts.value.map((a) => a.accountNumber))

const { isMobile } = useResponsive()

const dialogWidth = computed(() => {
  switch (currentStep.value) {
    case PennylaneAmendmentStep.TERMS_PREVIEW:
    case PennylaneAmendmentStep.ACCEPTANCE:
      return '56%'
    case PennylaneAmendmentStep.ACCOUNTS_PRICING:
      return '70%'
    default:
      return '70%'
  }
})

const contentClasses = computed(() => {
  const isAccountsPricing = currentStep.value === PennylaneAmendmentStep.ACCOUNTS_PRICING
  const isFullWidth = currentStep.value === PennylaneAmendmentStep.TERMS_PREVIEW
    || currentStep.value === PennylaneAmendmentStep.ACCEPTANCE

  return [
    'pennylane-amendment-flow-dialog__content',
    'font-large',
    'font-medium',
    'flex',
    {
      'pennylane-amendment-flow-dialog__content--step-accounts-pricing': isAccountsPricing,
      'pennylane-amendment-flow-dialog__content--full-width': isFullWidth,
    },
  ]
})

async function handleRefuse() {
  isRefuseLoading.value = true
  try {
    const payload: PennylaneValidationPayload = {
      accountNumbers: accountNumbers.value,
      status: false,
    }
    await PennylaneService.validatePennylaneAmendment(props.currentAccountId, payload)
    isVisible.value = false
    emit('decline')
  } catch {
    logger.error('Error refusing pennylane amendement')
  } finally {
    isRefuseLoading.value = false
  }
}

async function handleAccept() {
  isAcceptLoading.value = true
  try {
    const payload: PennylaneValidationPayload = {
      accountNumbers: accountNumbers.value,
      status: true,
    }
    await PennylaneService.validatePennylaneAmendment(props.currentAccountId, payload)
    isVisible.value = false
    emit('accept-success')
  } catch {
    logger.error('Error validating pennylane amendement')
  } finally {
    isAcceptLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.pennylane-amendment-flow-dialog {
  &__content {
    @media screen and (max-width: 1125px) {
      min-height: auto;
    }

    &--step-accounts-pricing {
      .pennylane-amendment-flow-dialog__left {
        flex-basis: 62%;
        min-width: 0;

        @media screen and (max-width: 1024px) {
          flex-basis: 100%;
        }
      }

      .pennylane-amendment-flow-dialog__right {
        flex-basis: 38%;
        min-width: 0;
        display: block;

        @media screen and (max-width: 1024px) {
          flex-basis: 100%;
        }
      }

      @media screen and (max-width: 1024px) {
        flex-wrap: wrap;
      }
    }

    &--full-width {
      .pennylane-amendment-flow-dialog__left {
        flex-basis: 100%;
        width: 100%;
      }

      .pennylane-amendment-flow-dialog__right {
        display: none;
      }
    }

    &:not(&--step-accounts-pricing):not(&--full-width) {
      .pennylane-amendment-flow-dialog__left {
        flex-basis: 54%;

        @media screen and (max-width: 1120px) {
          flex-basis: 100%;
        }
      }

      .pennylane-amendment-flow-dialog__right {
        flex-basis: 46%;

        @media screen and (max-width: 1120px) {
          display: none;
        }
      }
    }
  }

  &__branding {
    z-index: 1;
    margin-top: 45px;
  }

  &__logo {
    &--brand {
      width: 144px;
    }

    &--pennylane {
      width: 208px;
    }
  }

  &__separator {
    width: 32px;
    height: 1px;
  }

  &__background {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 380px;
    opacity: 0.5;
  }
}
</style>
