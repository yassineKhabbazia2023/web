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
      class="company-information__form"
      aria-describedby="company-info-note company-info-alert"
    >
      <section
        v-for="(section, index) in dynamicFormStructure"
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
        <PDynamicFieldsAccount
          :pModel="internalAccount"
          :pFields="section.fields"
          class="company-information__form-section-fields"
          @update:p-model="
            (fieldKey, fieldValue) =>
              handleUpdateAccountModel(fieldKey, fieldValue)
          "
        />
        <div
          v-if="shouldShowNoSirenToggle(section)"
          class="company-information__no-siren-switch"
        >
          <PSwitch
            :modelValue="hasNoSiren"
            :pDisabled="isSirenFilled"
            data-testid="has-no-siren-switch"
            @update:model-value="onHasNoSirenChange"
          />
          <span class="margin-left--2">{{ t('hasNoSirenLabel') }}</span>
        </div>
      </section>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { AKUITEO_URL } from '@pulse/common/constants'
import { ref, onMounted, useTemplateRef, computed, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { cloneDeep, setWith, get } from 'lodash-es'
import { PAlert, PForm, PDynamicFields, PLoader, PSwitch } from '@pulse/styleguide/components'
import { cleanRecordStructure, getFormStructure } from '@entities/utils/referential'
import { type Account } from '@entities/services/account'
import type { CompanyInformationProps } from './CompanyInformationTypes'
import type { FormSection } from '@entities/types'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { SubscriptionOfferCode } from '@pulse/common/enums'
import {
  PENNYLANE_REQUIRED_FIELDS,
  SIREN_FIELD_KEY,
  HAS_NO_SIREN_FIELD_KEY,
  PLAN_CODE,
  MISSION_TYPE,
  MISSION_TYPE_FIELD_KEY,
} from '@entities/constants'
import type { FormInstance } from '@pulse/styleguide/types'

const PDynamicFieldsAccount = PDynamicFields<Account>

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      alertInstruction: {
        line1: 'If certain {a}, you must {b}',
        line2: 'After updating in Akuiteo, the data will be automatically {c}',
        line3: '{warning}',
      },
      alertParts: {
        infos: 'immutable information are incorrect or missing',
        crmName: 'Akuiteo CRM',
        fillInCrm: 'complete them directly in the {crmName}',
        updatedInForm48h: 'updated in the form below within 48h',
        warningNotActivated: 'If the information is not provided, the offer cannot be activated.',
      },
      formInstruction: 'Please provide the following necessary information for activation :',
      hasNoSirenLabel: 'The company does not have a SIREN yet',
    },
    'fr-FR': {
      alertInstruction: {
        line1: 'Si certaines {a}, vous devez les {b}',
        line2: 'Après modification dans Akuiteo, les données seront automatiquement {c}',
        line3: '{warning}',
      },
      alertParts: {
        infos: 'informations non modifiables sont incorrectes ou manquantes',
        crmName: 'CRM Akuiteo',
        fillInCrm: 'compléter directement dans le {crmName}',
        updatedInForm48h: 'mises à jour dans le formulaire ci-dessous sous 48h',
        warningNotActivated: 'Si les informations ne sont pas renseignées, l’offre ne pourra pas être activée.',
      },
      formInstruction: 'Veuillez renseigner les informations suivantes nécessaires pour l\'activation :',
      hasNoSirenLabel: 'L\'entreprise n\'a pas encore de SIREN',
    },
  },
})

const props = defineProps<CompanyInformationProps>()
const emit = defineEmits<{
  'input': [string, any]
}>()

const formStructure = ref<FormSection[]>()
const internalAccount = ref<Account | undefined>()
const isLoading = ref<boolean>(true)
const companyFormRef = useTemplateRef<FormInstance>('companyForm')
const areRequiredFieldsValid = ref<boolean>(true)
const hasNoSiren = ref<boolean>(false)

const isSirenFilled = computed(() => {
  const sirenValue = get(internalAccount.value, SIREN_FIELD_KEY)
  return isNotNullNorEmpty(sirenValue)
})

const dynamicFormStructure = computed(() => {
  if (formStructure.value === undefined) {
    return []
  }

  if (hasNoSiren.value === false) {
    return formStructure.value
  }

  return formStructure.value.map((section) => ({
    ...section,
    fields: section.fields.map((field) => {
      if (field.pFieldKey === SIREN_FIELD_KEY) {
        return {
          ...field,
          pRules: [],
        }
      }
      return field
    }),
  }))
})

const dynamicRequiredFields = computed(() => {
  if (hasNoSiren.value === true) {
    return PENNYLANE_REQUIRED_FIELDS.filter((field) => field !== SIREN_FIELD_KEY)
  }
  return PENNYLANE_REQUIRED_FIELDS
})

function hasSirenField(section: FormSection): boolean {
  return section.fields.some((field) => field.pFieldKey === SIREN_FIELD_KEY)
}

const isPennylaneOffer = computed(() => props.offerCode === SubscriptionOfferCode.PENNYLANE)

function shouldShowNoSirenToggle(section: FormSection): boolean {
  return isPennylaneOffer.value && hasSirenField(section)
}

async function onHasNoSirenChange(value: boolean) {
  hasNoSiren.value = value
  emit('input', HAS_NO_SIREN_FIELD_KEY, value)
  await nextTick()
  if (value === true) {
    companyFormRef.value?.clearValidate([SIREN_FIELD_KEY])
  }
  await validateRequiredFieldsForPennylane()
}

const handleUpdateAccountModel = (fieldKey: string, fieldValue: any) => {
  if (internalAccount.value === undefined) {
    return
  }
  setWith(internalAccount.value, fieldKey, fieldValue, Object)
  emit('input', fieldKey, fieldValue)
}

function manageMissionTypeForPlan() {
  if (internalAccount.value === undefined) {
    return
  }

  const currentMissionType = get(internalAccount.value, MISSION_TYPE_FIELD_KEY)
  if (props.selectedPlanCode === PLAN_CODE.APPROVED_PLATFORM) {
    if (isNotNullNorEmpty(currentMissionType) === false) {
      handleUpdateAccountModel(MISSION_TYPE_FIELD_KEY, MISSION_TYPE.REVISION)
    }
  }
}

async function loadCompanyInformation() {
  try {
    internalAccount.value = cloneDeep(props.modelValue)
    if (props.providerName) {
      formStructure.value = await getFormStructure(props.providerName)
      if (internalAccount.value !== undefined) {
        cleanRecordStructure(formStructure.value, internalAccount.value)
      }

      manageMissionTypeForPlan()
    }
  } catch (e) {
    logger.error(e)
  } finally {
    isLoading.value = false
  }
}

async function validateForm() {
  // Validate required fields after form is mounted (Pennylane only)
  await nextTick()
  await validateRequiredFieldsForPennylane()
}

onMounted(async () => {
  await loadCompanyInformation()
  await validateForm()
})

function isValid() {
  return companyFormRef.value?.validate() ?? false
}

async function isValidFields(fields: string[]): Promise<boolean> {
  if (companyFormRef.value === null) {
    return false
  }

  return new Promise((resolve) => {
    companyFormRef.value!.validateField(fields, (validationResult) => {
      resolve(validationResult)
    })
  })
}

async function validateRequiredFieldsForPennylane(): Promise<void> {
  // Only validate for Pennylane offer
  if (props.offerCode !== SubscriptionOfferCode.PENNYLANE) {
    areRequiredFieldsValid.value = true
    return
  }

  const validationResult = await isValidFields(dynamicRequiredFields.value)
  areRequiredFieldsValid.value = validationResult
}

function getSelectedHubName(): string | undefined {
  const hubId = internalAccount.value?.hub?.hubId
  if (hubId === undefined) {
    return
  }
  const hubField = formStructure.value
    ?.flatMap((section) => section.fields)
    .find((field) => field.pFieldKey === 'hub.hubId')
  const hubOption = hubField?.pDropdownOptions?.find(({ pValue }) =>
    Number(pValue) === Number(hubId),
  )

  const hubLabel = hubOption?.pLabel ?? undefined

  return hubLabel?.toString()
}

const OFFERS_WITHOUT_INFORMATION_NOTE: ReadonlyArray<string> = [
  SubscriptionOfferCode.FORMS.toString(),
]

const shouldDisplayInformationNote = computed(() => {
  return OFFERS_WITHOUT_INFORMATION_NOTE.includes(props.offerCode ?? '') === false
})

defineExpose({
  isValid,
  isValidFields,
  areRequiredFieldsValid,
  getSelectedHubName,
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
  &__no-siren-switch {
    display: flex;
    align-items: center;
    margin-top: -4px;
  }
}
</style>

