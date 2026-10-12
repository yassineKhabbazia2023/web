<template>
  <p class="prospect-creation-step-information__intro margin-bottom--6">
    {{ t('entities.wallet.prospect.form.intro') }}
  </p>

  <PForm
    ref="formRef"
    :pModel="prospectFormData"
    :pRules="rules"
    :pShowMessage="false"
    pRequireAsteriskPosition="right"
    :pInline="true"
  >
    <div
      class="
        prospect-creation-step-information__leader-section
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
        <PIcon pName="person" />
        <span class="font-bold font-size--16">{{ t('entities.wallet.prospect.form.leader') }}</span>
      </div>

      <PFormLine class="margin-top--6">
        <PFormItem
          class="
            prospect-creation-step-information__civility-form-item
            field-with-fixed-width
            margin-bottom--6
          "
          pWidth="120px"
          pProp="signatory.title"
          :pLabel="t('entities.wallet.prospect.form.civility')"
        >
          <PDropdown
            v-model="prospectFormData.signatory.title"
            :pOptions="titleOptions"
            pPlaceholder="-"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          pProp="signatory.lastName"
          :pLabel="t('entities.wallet.prospect.form.lastName')"
        >
          <PInput
            v-model="prospectFormData.signatory.lastName"
            pPlaceholder="-"
            data-testid="prospect-last-name-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          pProp="signatory.firstName"
          :pLabel="t('entities.wallet.prospect.form.firstName')"
        >
          <PInput
            v-model="prospectFormData.signatory.firstName"
            pPlaceholder="-"
            data-testid="prospect-first-name-input"
          />
        </PFormItem>
      </PFormLine>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--basis-0"
          pProp="signatory.jobTitle"
          :pLabel="t('entities.wallet.prospect.form.jobTitle')"
        >
          <PInput
            v-model="prospectFormData.signatory.jobTitle"
            pPlaceholder="-"
            data-testid="prospect-job-title-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--basis-0"
          pProp="signatory.department"
          :pLabel="t('entities.wallet.prospect.form.department')"
        >
          <PDropdown
            v-model="prospectFormData.signatory.department"
            :pOptions="departmentOptions"
            pPlaceholder="-"
            data-testid="prospect-department-input"
          />
        </PFormItem>
      </PFormLine>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6 flex--basis-0"
          pProp="signatory.companyRole"
          :pLabel="t('entities.wallet.prospect.form.companyRole')"
        >
          <PDropdown
            v-model="prospectFormData.signatory.companyRole"
            :pOptions="companyRoleOptions"
            pPlaceholder="-"
            data-testid="prospect-company-role-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6 flex--basis-0"
          pProp="signatory.contactTypes"
          :pLabel="t('entities.wallet.prospect.form.contactType')"
        >
          <PDropdown
            v-model="prospectFormData.signatory.contactTypes"
            :pOptions="contactTypeOptions"
            pMultiple
            pPlaceholder="-"
            data-testid="prospect-contact-type-input"
          />
        </PFormItem>
      </PFormLine>

      <PFormLine>
        <PFormItem
          class="margin-bottom--6"
          pProp="signatory.email"
          :pLabel="t('entities.wallet.prospect.form.email')"
        >
          <PInput
            v-model="prospectFormData.signatory.email"
            pPlaceholder="-"
            data-testid="prospect-email-input"
          />
        </PFormItem>

        <PFormItem
          class="margin-bottom--6"
          pProp="signatory.mobilePhone"
          :pLabel="t('entities.wallet.prospect.form.mobilePhone')"
        >
          <PPhoneInput
            v-model="prospectFormData.signatory.mobilePhone"
            pPlaceholder="-"
            data-testid="prospect-mobile-phone-input"
            p-country-disabled
          />
        </PFormItem>
      </PFormLine>
    </div>

    <div
      v-auto-animate
      class="
        prospect-creation-step-information__company-section
        margin-top--6
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
        <PIcon pName="building" />
        <span class="font-bold font-size--16">{{ t('entities.wallet.prospect.form.entity') }}</span>
      </div>

      <PFormLine class="margin-top--6">
        <!--
          Special validation flow: we validate the selected entity (legalName + siret),
          not the search query itself. Since pProp expects v-model to match the
          validated field, we handle validation manually via hasEntityError class.
        -->
        <PFormItem
          class="margin-bottom--6 flex--grow-1"
          :class="{ 'is-error': hasEntityError }"
          :pLabel="t('entities.wallet.prospect.form.entitySearchLabel')"
        >
          <PAutocomplete
            v-model="entitySearchQuery"
            pValueKey="legalName"
            :pDebounce="DEBOUNCE_TIMING.EXTERNAL_API"
            :pMinLength="3"
            :pFetchSuggestions="fetchEntitySuggestions"
            :pPlaceholder="t('entities.wallet.prospect.form.entitySearchPlaceholder')"
            :pTriggerOnFocus="false"
            data-testid="prospect-entity-search-input"
            @select="onEntitySelect"
          >
            <template #default="{ item }">
              <span>
                {{ asSearchResult(item).legalName }}
                <span class="text-color--text-neutral-neutral">({{ asSearchResult(item).siret }})</span>
              </span>
            </template>
          </PAutocomplete>
        </PFormItem>
      </PFormLine>

      <PUserActionCard
        v-if="prospectFormData.legalName !== ''"
        :pAvatarProps="{ pRole: AvatarRoles.PROSPECT, pType: 'small' }"
        :pIsAvatarVisible="isMobile === false"
        :pTopLeftSectionText="prospectFormData.legalName"
        :pTopLeftSubText="t('entities.wallet.prospect.form.siretLabel', { siret: prospectFormData.siret })"
        data-testid="prospect-entity-card"
        @trash-clicked="onEntityClear"
      />
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
  PAutocomplete,
  PDropdown,
  PForm,
  PFormItem,
  PFormLine,
  PIcon,
  PInput,
  PPhoneInput,
  PUserActionCard,
} from '@pulse/styleguide/components'
import { AvatarRoles, useResponsive } from '@pulse/styleguide'
import type { ProspectEntitySearchResult, ProspectFormData } from '@entities/modules/wallet/types'
import { ProspectCreationDrawerManager } from '../../prospect-creation-drawer.manager'
import { convertRecordToDropdownOptions } from '@entities/utils/helpers/forms'
import type { ProspectCreationStepInformationProps } from './prospect-creation-step-information.types'
import { useProspectCreationStepInformationValidation } from './prospect-creation-step-information.form.validation'
import { useProspectEntitySearch } from './prospect-creation-step-information.composable'
import { useScrollToAlert } from '../../use-scroll-to-alert.composable'
import { DEBOUNCE_TIMING } from '@pulse/toolbox'

const { t } = useI18n()
const { isMobile } = useResponsive()

const props = defineProps<ProspectCreationStepInformationProps>()
const prospectFormData = defineModel<ProspectFormData>({ required: true })

const formRef = useTemplateRef<FormInstance>('formRef')
const alertRef = useTemplateRef<HTMLElement>('alertRef')

// The autocomplete #default slot item is typed as a plain record.
const asSearchResult = (item: unknown) => item as ProspectEntitySearchResult

const {
  entitySearchQuery,
  hasEntityError,
  fetchEntitySuggestions,
  onEntitySelect,
  onEntityClear,
  validateEntitySelection,
  checkEntityEligibility,
} = useProspectEntitySearch(prospectFormData)

const titleOptions = computed(() =>
  convertRecordToDropdownOptions(props.dropdownsContent.contactTitle),
)
const departmentOptions = computed(() =>
  convertRecordToDropdownOptions(props.dropdownsContent.contactService),
)
const companyRoleOptions = computed(() =>
  convertRecordToDropdownOptions(props.dropdownsContent.contactHierarchicalLevel),
)
const contactTypeOptions = computed(() =>
  ProspectCreationDrawerManager.toContactTypeOptions(props.dropdownsContent.contactType),
)

const { rules, validationErrorMessageKey, validate: baseValidate } = useProspectCreationStepInformationValidation({
  prospectFormData,
  formRef,
  validateEntitySelection,
  checkEntityEligibility,
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

<style lang="scss" scoped>
.prospect-creation-step-information {
  &__leader-section, &__company-section {
    background-color: var(--p-persian-100)
  }

  &__civility-form-item {
    width: 80px;
  }

  &__intro {
    white-space: pre-line;
  }
}
</style>
