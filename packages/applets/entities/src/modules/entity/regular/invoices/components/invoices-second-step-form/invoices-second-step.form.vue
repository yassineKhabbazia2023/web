<template>
  <PForm
    ref="formRef"
    :pModel="formModel"
    :pRules="rules"
    pLabelPosition="top"
    pRequireAsteriskPosition="right"
  >
    <p class="invoices-form-step__subtitle margin-top--4">
      {{ t('entities.invoices.step2.subtitle') }}
    </p>

    <PFormItem
      pProp="selectedContactId"
      :pLabel="t('entities.invoices.step2.contactLabel')"
      pRequired
      class="margin-top--8"
    >
      <PDropdown
        v-model="formModel.selectedContactId"
        :pOptions="customerOptions"
        :pPlaceholder="t('entities.invoices.step2.contactPlaceholder')"
        :pLoading="isLoadingCustomers"
        :pDisabled="isReadOnly"
        pFilterable
      />
    </PFormItem>
    <PAlert
      v-if="hasIntegrationError === true"
      class="margin-top--4"
      pType="danger"
    >
      {{ t('entities.invoices.step2.submitError') }}
    </PAlert>

    <div
      class="
        flex
        flex--justify-content-space-between
        flex-gap--3
        margin-top--8
      "
    >
      <PButton
        pType="tertiary"
        @click="handleBack"
      >
        {{ t('entities.invoices.backButton') }}
      </PButton>
      <div class="flex flex-gap--3">
        <InvoicesAssistance :step="InvoicesFormStep.SELECT_CONTACT" />
        <PButton
          pType="primary"
          :pDisabled="isReadOnly"
          @click="handleSubmit"
        >
          {{ t('entities.invoices.submitButton') }}
        </PButton>
      </div>
    </div>
  </PForm>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'element-plus'
import {
  PButton,
  PDropdown,
  PAlert,
  PForm,
  PFormItem,
} from '@pulse/styleguide/components'
import { useCurrentEntityStore, useUserStore } from '@pulse/common/stores'
import { useInvoicesSecondStepForm } from './invoices-second-step.form.composable'
import { createInvoicesSecondStepFormRules } from './invoices-second-step.form.validation'
import type { InvoicesFullFormModel } from '../../types'
import { InvoicesFormStep } from '../../enums'
import { InvoicesTracking } from '../../services/invoices.tracking.service'
import InvoicesAssistance from '../invoices-assistance/invoices-assistance.vue'

const emit = defineEmits<{
  back: []
  submit: [formData: InvoicesFullFormModel]
}>()

const props = withDefaults(defineProps<{
  hasIntegrationError?: boolean
}>(), {
  hasIntegrationError: false,
})
const hasIntegrationError = toRef(props, 'hasIntegrationError')

const formModel = defineModel<InvoicesFullFormModel>({ required: true })

const { t } = useI18n()

const userStore = useUserStore()
const currentEntityStore = useCurrentEntityStore()

const isReadOnly = computed(() => userStore.isCollab === true)
const accountId = computed(() => currentEntityStore.currentEntityId)

const formRef = useTemplateRef<FormInstance>('formRef')
const {
  customerOptions,
  isLoadingCustomers,
} = useInvoicesSecondStepForm({ formRef, isReadOnly, accountId })

const rules = ref(createInvoicesSecondStepFormRules({
  contactRequired: t('entities.invoices.step2.contactRequired'),
}))

const handleBack = () => {
  formModel.value.selectedContactId = null
  emit('back')
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    InvoicesTracking.trackInvoiceDigitizationRequestSuccess()
    emit('submit', formModel.value)
  } catch {
    InvoicesTracking.trackInvoiceDigitizationRequestFail()
  }
}
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.invoices-form-step {
  &__subtitle {
    width: 65%;
    font-size: 14px;
    color: var(--p-gray-900);
    margin: 0;

    @include breakpoints.media(md2) {
      width: 80%;
    }
  }
}
</style>
