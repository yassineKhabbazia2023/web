<template>
  <PDialog
    v-model="isVisible"
    p-width="70%"
    :p-fullscreen="isMobile"
    :p-lock-scroll="true"
    :p-show-close="false"
    :p-align-center="true"
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

        <div class="margin-top--auto">
          <div id="pennylane-amendment-flow-dialog-footer" />

          <div class="flex flex--justify-content-flex-end margin-top--4">
            <PButton
              v-if="isFirstStep === false"
              p-type="secondary"
              class="margin-right--2"
              @click="handlePrevious"
            >
              {{ t('widgets.pennylaneAmendmentFlow.common.buttonBack') }}
            </PButton>

            <PButton
              v-if="isLastStep === false"
              class="margin-left--auto"
              p-type="primary"
              :p-disabled="isNextButtonDisabled"
              @click="handleNext"
            >
              {{ t('widgets.pennylaneAmendmentFlow.common.buttonContinue') }}
            </PButton>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { PButton, PDialog, PImage } from '@pulse/styleguide/components'
import type { PennylaneAmendmentFlowDialogProps } from './pennylane-amendment-flow-dialog.type'
import { PennylaneAmendmentStep } from './pennylane-amendment-flow-dialog/pennylane-amendment-flow-dialog.enum'
import { usePennylaneAmendmentFlow } from './pennylane-amendment-flow-dialog/pennylane-amendment-flow-dialog.composable'
import StepInformation from './pennylane-amendment-flow-dialog/steps/step-information.vue'
import StepAccountsPricing from './pennylane-amendment-flow-dialog/steps/step-accounts-pricing.vue'
import StepAccountsPricingFAQ from './pennylane-amendment-flow-dialog/steps/step-accounts-pricing-faq.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<PennylaneAmendmentFlowDialogProps>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const {
  currentStep,
  isFirstStep,
  isLastStep,
  isNextButtonDisabled,
  goNext,
  goPrevious,
  reset,
} = usePennylaneAmendmentFlow()

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

const { isMobile } = useResponsive()

const contentClasses = computed(() => {
  return [
    'pennylane-amendment-flow-dialog__content',
    'font-large',
    'font-medium',
    'flex',
    {
      'pennylane-amendment-flow-dialog__content--step-accounts-pricing': currentStep.value === PennylaneAmendmentStep.ACCOUNTS_PRICING,
    },
  ]
})

function handleNext() {
  goNext()
}

function handlePrevious() {
  goPrevious()
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

    &:not(&--step-accounts-pricing) {
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
