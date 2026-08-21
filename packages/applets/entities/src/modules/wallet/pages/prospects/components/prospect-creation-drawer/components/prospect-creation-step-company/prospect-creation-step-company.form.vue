<template>
  <PForm
    ref="formRef"
    :pModel="model"
    :pRules="rules"
    :pShowMessage="false"
    pRequireAsteriskPosition="right"
    :pInline="true"
  >
    <p
      class="
        prospect-creation-step-company__intro
        margin-bottom--6
        white-space--pre-line
      "
    >
      {{ t('entities.wallet.prospect.form.company.intro') }}
    </p>

    <div
      class="
        prospect-creation-step-company__section
        bg--teal-100
        padding--4
        width--100
      "
    >
      <div
        class="
          flex
          flex-gap--2
          flex--align-items-center
          margin-bottom--4
        "
      >
        <PIcon pName="wallet2" />
        <span class="font-bold font-size--16">{{ t('entities.wallet.prospect.form.company.identification') }}</span>
      </div>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.callName')"
        >
          <PInput
            v-model="model.legalName"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-call-name-input"
          />
        </PFormItem>
      </PFormLine>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.siren')"
        >
          <PInput
            v-model="model.siren"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-siren-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.siret')"
        >
          <PInput
            v-model="model.siret"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-siret-input"
          />
        </PFormItem>
      </PFormLine>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          pProp="legalForm"
          :pLabel="t('entities.wallet.prospect.form.legalForm')"
        >
          <PDropdown
            v-model="model.legalForm"
            :pOptions="legalFormOptions"
            pPlaceholder="-"
            pFilterable
            data-testid="prospect-legal-form-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          pProp="legalStructure"
          :pLabel="t('entities.wallet.prospect.form.legalStructure')"
        >
          <PDropdown
            v-model="model.legalStructure"
            :pOptions="legalStructureOptions"
            pPlaceholder="-"
            pFilterable
            data-testid="prospect-legal-structure-input"
          />
        </PFormItem>
      </PFormLine>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.apeCode')"
        >
          <PInput
            v-model="model.nafCode"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-ape-code-input"
          />
        </PFormItem>
      </PFormLine>

      <div
        class="
          flex
          flex-gap--2
          flex--align-items-center
          margin-bottom--4
        "
      >
        <PIcon pName="locationDot" />
        <span class="font-bold font-size--16">{{ t('entities.wallet.prospect.form.company.addressTitle') }}</span>
      </div>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.address')"
        >
          <PInput
            v-model="model.address"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-address-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.zipCode')"
        >
          <PInput
            v-model="model.zipCode"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-zip-code-input"
          />
        </PFormItem>
      </PFormLine>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.city')"
        >
          <PInput
            v-model="model.city"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-city-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.department')"
        >
          <PInput
            v-model="model.department"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-department-input"
          />
        </PFormItem>
      </PFormLine>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.region')"
        >
          <PInput
            v-model="model.region"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-region-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :pLabel="t('entities.wallet.prospect.form.company.country')"
        >
          <PInput
            v-model="model.country"
            pPlaceholder="-"
            pReadonly
            pDisabled
            data-testid="prospect-country-input"
          />
        </PFormItem>
      </PFormLine>
    </div>

    <PAlert
      v-if="validationErrorMessageKey !== null"
      ref="alertRef"
      pType="danger"
      class="margin-y--4 font-bold"
    >
      {{ t(validationErrorMessageKey) }}
    </PAlert>
  </PForm>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from '@pulse/styleguide/types'
import {
  PAlert,
  PDropdown,
  PForm,
  PFormItem,
  PFormLine,
  PIcon,
  PInput,
} from '@pulse/styleguide/components'
import type { ProspectFormData } from '@entities/modules/wallet/types'
import { convertRecordToDropdownOptions } from '@entities/utils/helpers/forms'
import type { ProspectCreationStepCompanyProps } from './prospect-creation-step-company.types'
import { useProspectCreationStepCompanyValidation } from './prospect-creation-step-company.form.validation'
import { useScrollToAlert } from '../../use-scroll-to-alert.composable'

const { t } = useI18n()

const props = defineProps<ProspectCreationStepCompanyProps>()
const model = defineModel<ProspectFormData>({ required: true })

const formRef = useTemplateRef<FormInstance>('formRef')
const alertRef = useTemplateRef<HTMLElement>('alertRef')

const legalFormOptions = computed(() =>
  convertRecordToDropdownOptions(props.dropdownsContent.legalForm),
)
const legalStructureOptions = computed(() =>
  convertRecordToDropdownOptions(props.dropdownsContent.legalStructure),
)

const { rules, validationErrorMessageKey, validate: baseValidate } = useProspectCreationStepCompanyValidation({
  formRef,
})

const { scrollToAlert } = useScrollToAlert(alertRef)

async function validate(): Promise<boolean> {
  const isValid = await baseValidate()
  if (isValid === false) {
    await scrollToAlert()
  }
  return isValid
}

defineExpose({ validate })
</script>
