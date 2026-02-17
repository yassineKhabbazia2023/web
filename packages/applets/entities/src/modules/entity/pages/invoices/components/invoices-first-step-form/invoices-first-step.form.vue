<template>
  <PForm
    ref="formRef"
    :pModel="formModel"
    :pRules="rules"
    pLabelPosition="top"
    pRequireAsteriskPosition="right"
  >
    <p class="invoices-form-step__subtitle margin-top--4">
      {{ t('entities.invoices.formSubtitle') }}
    </p>

    <PFormItem
      pProp="email"
      :pLabel="t('entities.invoices.emailLabel')"
      pRequired
      class="margin-top--8"
    >
      <PInput
        v-model="formModel.email"
        pType="email"
        :pPlaceholder="t('entities.invoices.emailPlaceholder')"
        :pDisabled="isReadOnly"
      />
    </PFormItem>

    <PFormItem
      pProp="acceptTerms"
    >
      <PCheckbox v-model="acceptTermsModel">
        {{ t('entities.invoices.checkboxLabel') }}
        <span class="invoices-form-step__required">*</span>
      </PCheckbox>
    </PFormItem>

    <div
      class="
        flex
        flex--justify-content-flex-end
        flex-gap--3
        margin-top--6
      "
    >
      <InvoicesAssistance :step="InvoicesFormStep.EMAIL_AND_TERMS" />
      <PButton
        pType="primary"
        :pDisabled="isReadOnly"
        @click="handleNext"
      >
        {{ t('entities.invoices.nextButton') }}
      </PButton>
    </div>
  </PForm>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'element-plus'
import {
  PButton,
  PCheckbox,
  PInput,
  PForm,
  PFormItem,
} from '@pulse/styleguide/components'
import { useUserStore } from '@pulse/common/stores'
import { useInvoicesFirstStepForm } from './invoices-first-step.form.composable'
import { createInvoicesFormRules } from './invoices-first-step.form.validation'
import type { InvoicesFullFormModel } from '@entities/modules/entity/types'
import { InvoicesFirstStepFormManager } from './invoices-first-step.form.manager'
import InvoicesAssistance from '../invoices-assistance/invoices-assistance.vue'
import { InvoicesFormStep } from '@entities/modules/entity/enums'

const emit = defineEmits<{
  next: []
}>()

const formModel = defineModel<InvoicesFullFormModel>({ required: true })

const { t } = useI18n()

const userStore = useUserStore()
const isReadOnly = computed(() => userStore.isCollab === true)

const formRef = useTemplateRef<FormInstance>('formRef')
const { acceptTermsModel } = useInvoicesFirstStepForm({ formRef, isReadOnly, formModel })

const rules = ref(createInvoicesFormRules({
  emailRequired: t('entities.invoices.emailRequired'),
  emailInvalid: t('entities.invoices.emailInvalid'),
  acceptTermsRequired: t('entities.invoices.acceptTermsRequired'),
}))

const handleNext = async () => {
  const result = await InvoicesFirstStepFormManager.submitForm(formRef.value)
  if (result.success) {
    emit('next')
  }
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.invoices-form-step {
  &__subtitle {
    width: 65%;
    font-size: 14px;
    line-height: 1.5;
    color: var(--p-gray-900);
    margin: 0;

    @include breakpoints.media(md2) {
      width: 80%;
    }
  }

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: var(--p-gray-900);
  }

  &__required {
    color: var(--el-color-danger);
    margin-left: 4px;
  }
}
</style>
