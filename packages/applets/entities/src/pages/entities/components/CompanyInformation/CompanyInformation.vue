<template>
  <div class="company-information">
    <div class="company-information__note">
      <p id="company-info-note">
        {{ t('formInstruction') }}
      </p>
    </div>
    <PAlert
      v-if="shouldDisplayInformationNote"
      id="company-info-alert"
      class="margin-y--3"
      data-testid="alert-instruction"
    >
      <!-- Line 1 -->
      <p class="company-information__alert-line">
        <i18n-t keypath="alertInstruction.line1" tag="span">
          <template #a>
            <span class="font-bold">{{ t('alertParts.infos') }}</span>
          </template>
          <template #b>
            <i18n-t
              keypath="alertParts.fillInCrm"
              tag="span"
              class="font-bold"
            >
              <template #crmName>
                <a
                  :href="AKUITEO_URL"
                  target="_blank"
                  class="text-underline"
                >{{ t('alertParts.crmName') }}</a>
              </template>
            </i18n-t>
          </template>
        </i18n-t>
      </p>

      <!-- Line 2 -->
      <p class="company-information__alert-line">
        <i18n-t keypath="alertInstruction.line2" tag="span">
          <template #c>
            <span class="font-bold">{{ t('alertParts.updatedInForm48h') }}</span>
          </template>
        </i18n-t>
      </p>
      <!-- Line 3 -->
      <p class="company-information__alert-line margin-top--4">
        <i18n-t keypath="alertInstruction.line3" tag="span">
          <template #warning>
            <span class="font-bold">{{ t('alertParts.warningNotActivated') }}</span>
          </template>
        </i18n-t>
      </p>
    </PAlert>
    <div
      v-if="isLoading"
      class="flex flex--justify-content-center margin-y--4"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <PForm
      v-if="providerName && internalAccount && !isLoading"
      ref="companyForm"
      :pModel="internalAccount"
      pLabelPosition="top"
      class="company-information__form"
      aria-describedby="company-info-note company-info-alert"
    >
      <section
        v-for="(section, index) in formStructure"
        :key="`section-${index}`"
        class="
        company-information__form-section
        padding-bottom--1
        margin-bottom--3"
      >
        <p
          class="company-information__form-section-title font-bold padding-top--5 margin-bottom--3"
        >
          {{ section.title }}
        </p>
        <PFieldSetAccount
          :pModel="internalAccount"
          :pFields="section.fields"
          class="company-information__form-section-fields"
          @update:p-model="
            (fieldKey, fieldValue) =>
              handleUpdateAccountModel(fieldKey, fieldValue)
          "
        />
      </section>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { logger, AKUITEO_URL } from '@pulse/core'
import { ref, onMounted, useTemplateRef, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloneDeep, setWith } from 'lodash-es'
import { PAlert, PForm, PFieldSet, PLoader } from '@pulse/styleguide/components'
import { cleanRecordStructure, getFormStructure } from '@entities/common/utils/referential'
import { type Account } from '@entities/services/account'
import type {
  CompanyInformationProps,
  FormSection,
} from './CompanyInformationTypes'
import { SubscriptionOfferCode } from '@pulse/common/enums'

const PFieldSetAccount = PFieldSet<Account>

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<CompanyInformationProps>()
const emit = defineEmits<{
  'input': [string, any]
}>()

const formStructure = ref<FormSection[]>()
const internalAccount = ref<Account | undefined>()
const isLoading = ref<boolean>(true)
const companyFormRef = useTemplateRef('companyForm')

const handleUpdateAccountModel = (fieldKey: string, fieldValue: any) => {
  if (internalAccount.value === undefined) {
    return
  }
  setWith(internalAccount.value, fieldKey, fieldValue, Object)
  emit('input', fieldKey, fieldValue)
}

onMounted(async () => {
  try {
    internalAccount.value = cloneDeep(props.modelValue)
    if (props.providerName) {
      formStructure.value = await getFormStructure(props.providerName)
      if (internalAccount.value !== undefined) {
        cleanRecordStructure(formStructure.value, internalAccount.value)
      }
    }
  } catch (e) {
    logger.error(e)
  } finally {
    isLoading.value = false
  }
})

function isValid() {
  return companyFormRef.value?.validate() ?? false
}

const OFFERS_WITHOUT_INFORMATION_NOTE: ReadonlyArray<string> = [
  SubscriptionOfferCode.FORMS.toString(),
]

const shouldDisplayInformationNote = computed(() => {
  return OFFERS_WITHOUT_INFORMATION_NOTE.includes(props.offerCode ?? '') === false
})

defineExpose({
  isValid,
})
</script>

<style lang="scss" scoped>
.company-information {
  &__form-section-fields {
    gap: 0px 20px;
  }
  &__alert-line {
    margin: 0.25rem 0;
  }
}
</style>

<i18n lang="yaml">
en-US:
  alertInstruction:
    line1: "If certain {a}, you must {b}"
    line2: "After updating in Akuiteo, the data will be automatically {c}"
    line3: "{warning}"
  alertParts:
    infos: "immutable information are incorrect or missing"
    crmName: "Akuiteo CRM"
    fillInCrm: "complete them directly in the {crmName}"
    updatedInForm48h: "updated in the form below within 48h"
    warningNotActivated: "If the information is not provided, the offer cannot be activated."
  formInstruction: 'Please provide the following necessary information for activation :'
fr-FR:
  alertInstruction:
    line1: "Si certaines {a}, vous devez les {b}"
    line2: "Après modification dans Akuiteo, les données seront automatiquement {c}"
    line3: "{warning}"

  alertParts:
    infos: "informations non modifiables sont incorrectes ou manquantes"
    crmName: "CRM Akuiteo"
    fillInCrm: "compléter directement dans le {crmName}"
    updatedInForm48h: "mises à jour dans le formulaire ci-dessous sous 48h"
    warningNotActivated: "Si les informations ne sont pas renseignées, l’offre ne pourra pas être activée."
  formInstruction: "Veuillez renseigner les informations suivantes nécessaires pour l'activation :"
</i18n>
