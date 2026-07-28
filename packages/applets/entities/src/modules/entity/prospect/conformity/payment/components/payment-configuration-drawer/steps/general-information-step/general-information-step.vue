<template>
  <div
    class="
      flex
      flex--direction-column
      flex-gap--6
    "
  >
    <PAlert pType="information">
      {{ t(`${I18N}.infoBanner`) }}
    </PAlert>

    <!-- Section 1 — Import RIB -->
    <section
      class="
        flex
        flex--direction-column
        flex-gap--2
      "
    >
      <div
        class="
          flex
          flex--align-items-center
          flex-gap--2
        "
      >
        <span class="font-size--16 font-semibold">{{ t(`${I18N}.ribSectionTitle`) }}</span>
        <PTag
          pColor="green"
          pSize="small"
          :pContent="t(`${I18N}.required`)"
        />
      </div>
      <p class="margin--0 font-size--14">
        {{ t(`${I18N}.ribSectionSubtitle`) }}
      </p>

      <PUpload
        v-model="ribFile"
        pAccept=".pdf"
        :pPrefixLabelFileLine="t(`${I18N}.uploadPrefixLabel`)"
        :pSuffixLabelFileLine="t(`${I18N}.uploadSuffixLabel`)"
        :pAuthorizedFileFormat="t(`${I18N}.uploadAuthorizedFormats`)"
        :pTextLimitSize="t(`${I18N}.uploadMaxSize`)"
        :pMaxFileSize="RIB_MAX_FILE_SIZE_MB"
        @update:model-value="onRibFileChanged"
      />

      <div
        v-if="isExtractingRib"
        class="
          flex
          flex--align-items-center
          flex-gap--2
          font-size--14
        "
      >
        <PLoader pSize="16px" />
        <span>{{ t(`${I18N}.extracting`) }}</span>
      </div>

      <PAlert
        v-if="hasRibExtractionFailed"
        pType="danger"
      >
        {{ t(`${I18N}.ribExtractionError`) }}
      </PAlert>

      <PAlert
        v-if="isRibUnrecognized"
        pType="danger"
      >
        {{ t(`${I18N}.ribUnrecognized`) }}
      </PAlert>
    </section>

    <!-- Section 2 — Bank details -->
    <section
      class="
        flex
        flex--direction-column
        flex-gap--2
      "
    >
      <div
        class="
          flex
          flex--align-items-center
          flex-gap--2
        "
      >
        <span class="font-size--16 font-semibold">{{ t(`${I18N}.bankSectionTitle`) }}</span>
        <PTag
          pColor="green"
          pSize="small"
          :pContent="t(`${I18N}.required`)"
        />
      </div>
      <p class="margin--0 font-size--14">
        {{ t(`${I18N}.bankSectionSubtitle`) }}
      </p>

      <PForm
        ref="bankForm"
        :pModel="bankDetails"
        pRequireAsteriskPosition="right"
        class="margin-top--4"
      >
        <PFormItem
          pProp="holder"
          :pLabel="t(`${I18N}.holderLabel`)"
          :pRules="requiredRule"
        >
          <PInput
            v-model="bankDetails.holder"
            :pPlaceholder="t(`${I18N}.holderPlaceholder`)"
          />
        </PFormItem>

        <PFormItem
          pProp="addressLine1"
          :pLabel="t(`${I18N}.addressLine1Label`)"
          :pRules="requiredRule"
        >
          <PInput
            v-model="bankDetails.addressLine1"
            :pPlaceholder="t(`${I18N}.addressLine1Placeholder`)"
          />
        </PFormItem>

        <PFormItem
          pProp="addressLine2"
          :pLabel="t(`${I18N}.addressLine2Label`)"
        >
          <PInput
            v-model="bankDetails.addressLine2"
            :pPlaceholder="t(`${I18N}.addressLine2Placeholder`)"
          />
        </PFormItem>

        <div
          class="
            flex
            flex-gap--4
          "
        >
          <PFormItem
            class="flex--grow-1"
            pProp="postalCode"
            :pLabel="t(`${I18N}.postalCodeLabel`)"
            :pRules="requiredRule"
          >
            <PInput
              v-model="bankDetails.postalCode"
              :pPlaceholder="t(`${I18N}.postalCodePlaceholder`)"
            />
          </PFormItem>

          <PFormItem
            class="flex--grow-1"
            pProp="city"
            :pLabel="t(`${I18N}.cityLabel`)"
            :pRules="requiredRule"
          >
            <PInput
              v-model="bankDetails.city"
              :pPlaceholder="t(`${I18N}.cityPlaceholder`)"
            />
          </PFormItem>

          <PFormItem
            class="flex--grow-1"
            pProp="country"
            :pLabel="t(`${I18N}.countryLabel`)"
            :pRules="requiredRule"
          >
            <PInput
              v-model="bankDetails.country"
              :pPlaceholder="t(`${I18N}.countryPlaceholder`)"
            />
          </PFormItem>
        </div>

        <div
          class="
            flex
            flex-gap--4
          "
        >
          <PFormItem
            class="flex--grow-1"
            pProp="iban"
            :pLabel="t(`${I18N}.ibanLabel`)"
            :pRules="ibanBicRules"
            :pShowMessage="false"
          >
            <PInput
              v-model="bankDetails.iban"
              :pPlaceholder="t(`${I18N}.ibanPlaceholder`)"
              @change="revalidateBankPair"
            />
          </PFormItem>

          <PFormItem
            class="flex--grow-1"
            pProp="bic"
            :pLabel="t(`${I18N}.bicLabel`)"
            :pRules="ibanBicRules"
            :pShowMessage="false"
          >
            <PInput
              v-model="bankDetails.bic"
              :pPlaceholder="t(`${I18N}.bicPlaceholder`)"
              @change="revalidateBankPair"
            />
          </PFormItem>
        </div>
      </PForm>

      <PAlert
        v-if="hasIbanBicMismatch"
        pType="danger"
      >
        {{ t(`${I18N}.ibanBicMismatch`) }}
      </PAlert>

      <PAlert
        pType="success"
        pIconName="lock"
      >
        {{ t(`${I18N}.encryptionReassurance`) }}
      </PAlert>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'
import type { FormInstance, FormItemRule } from '@pulse/styleguide/types'
import { useI18n } from 'vue-i18n'
import { PAlert, PForm, PFormItem, PInput, PLoader, PTag, PUpload } from '@pulse/styleguide/components'
import { validationRules } from '@pulse/styleguide/utils/validators'
import { PAYMENT_I18N_BASE, RIB_MAX_FILE_SIZE_MB } from '@entities/modules/entity/prospect/conformity/payment/payment.consts'
import type { MandateBankDetails } from '../../payment-configuration-drawer.types'
import { useGeneralInformationStep } from './general-information-step.composable'

const I18N = `${PAYMENT_I18N_BASE}.configurationDrawer.generalInformation`

const { t } = useI18n()

// The drawer owns the bank details and RIB file (the submit reads them); the step edits them via v-model.
const bankDetails = defineModel<MandateBankDetails>('bankDetails', { required: true })
const ribFile = defineModel<File | null>('ribFile', { required: true })

const emit = defineEmits<{
  'update:valid': [boolean]
}>()

// Step-local controller: runs the RIB OCR and derives validity, operating on the shared models.
const {
  isExtractingRib,
  isRibUnrecognized,
  hasRibExtractionFailed,
  hasIbanBicMismatch,
  isGeneralInformationValid,
  onRibSelected,
  onRibRemoved,
} = useGeneralInformationStep({
  bankDetails,
  ribFile,
})

// Report validity up so the drawer footer can enable/disable the "Continue" button.
watch(isGeneralInformationValid, (isValid) => emit('update:valid', isValid), { immediate: true })

// Localized required rule — trims whitespace and avoids the default English message.
const requiredRule = computed<FormItemRule[]>(() => [
  validationRules.requiredTextInput(t(`${I18N}.requiredField`)),
])

// IBAN and BIC carry the required rule plus the mismatch as a real validation rule (not a manual
// `pError`). The fields hide their inline messages (pShowMessage=false) and only keep the red error
// state from these rules; the mismatch is explained by a dedicated alert below the fields instead.
const ibanBicRules = computed<FormItemRule[]>(() => [
  validationRules.requiredTextInput(t(`${I18N}.requiredField`)),
  validationRules.custom(() => hasIbanBicMismatch.value === false, t(`${I18N}.ibanBicMismatch`), 'change'),
])

const bankForm = useTemplateRef<FormInstance>('bankForm')

// The mismatch is symmetric, so revalidate both fields whenever either changes — the form only
// revalidates the field that emitted the event, which would otherwise leave the sibling stale.
const revalidateBankPair = (): void => {
  void bankForm.value?.validateField(['iban', 'bic'], () => {})
}

// Fired only for user-driven changes (selection or pending line removal): parent-side
// writes (e.g. the OCR failure clearing ribFile) must not retrigger the OCR.
const onRibFileChanged = (file: File | null): void => {
  if (file !== null) {
    onRibSelected(file)
  } else {
    onRibRemoved()
  }
}
</script>
