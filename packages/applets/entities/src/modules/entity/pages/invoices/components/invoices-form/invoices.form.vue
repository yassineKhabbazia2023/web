<template>
  <div class="invoices-form padding--10">
    <div class="invoices-form__card">
      <div class="invoices-form__content padding--8">
        <div
          v-if="shouldShowVaultBeingCreated === false"
          class="
            flex
            flex--justify-content-space-between
            flex--align-items-flex-start
          "
        >
          <h2 class="invoices-form__title">
            <i18n-t :keypath="`entities.invoices.step${currentStep}.title`">
              <template #highlight>
                <span class="invoices-form__title-highlight">
                  {{ t(`entities.invoices.step${currentStep}.titleHighlight`) }}
                </span>
              </template>
            </i18n-t>
          </h2>
          <span class="invoices-form__indicator font-semibold">
            {{ currentStep }}/{{ TOTAL_STEPS }}
          </span>
        </div>

        <Transition
          name="slide-fade"
          mode="out-in"
        >
          <InvoicesFirstStepForm
            v-if="currentStep === InvoicesFormStep.EMAIL_AND_TERMS"
            v-model="formData"
            @next="goToNextStep"
          />

          <InvoicesSecondStepForm
            v-else-if="currentStep === InvoicesFormStep.SELECT_CONTACT"
            v-model="formData"
            @back="goToPreviousStep"
            @submit="handleSubmit"
          />

          <InvoicesVaultBeingCreatedStep
            v-else-if="shouldShowVaultBeingCreated"
          />
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InvoicesFirstStepForm from '../invoices-first-step-form/invoices-first-step.form.vue'
import InvoicesSecondStepForm from '../invoices-second-step-form/invoices-second-step.form.vue'
import InvoicesVaultBeingCreatedStep from '../invoices-vault-being-created-step/invoices-vault-being-created-step.vue'
import { TOTAL_STEPS } from '../../invoices.constants'
import { InvoicesFormStep } from '@entities/modules/entity/enums'
import { useInvoicesForm } from './invoices.form.composable'

const { t } = useI18n()

const {
  currentStep,
  formData,
  shouldShowVaultBeingCreated,
  submitIntegration,
  goToNextStep,
  goToPreviousStep,
  goToVaultBeingCreated,
} = useInvoicesForm()

const handleSubmit = async () => {
  await submitIntegration()
  goToVaultBeingCreated()
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.invoices-form {
  flex: 0 0 40%;
  background-color: var(--p-jungle-600);
  display: flex;
  align-items: center;
  justify-content: center;

  @include breakpoints.media(md2) {
    flex: 0 0 45%;
  }

  &__card {
    background-color: var(--p-white);
    width: 100%;
  }

  &__title {
    font-size: 28px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--p-black-rock-900);
    margin: 0;
    max-width: 80%;
  }

  &__title-highlight {
    color: var(--p-jungle-400);
  }

  &__indicator {
    font-size: 24px;
    color: var(--p-gray-900);
  }
}
</style>
