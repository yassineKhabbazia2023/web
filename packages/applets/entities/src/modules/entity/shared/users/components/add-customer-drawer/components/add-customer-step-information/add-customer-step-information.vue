<template>
  <div>
    <PBlockHeader
      :pTitle="t('newUser')"
      :pDescription="t('setUserEmail')"
      :pHasButton="false"
      pColor="persian"
      pSize="big"
      :pImage="{
        pFit: 'fill',
        pName: 'user-add-duotone'
      }"
    >
      <template #suffix>
        <PForm
          ref="formRef"
          :pModel="newContact"
          :pRules="rules"
          pRequireAsteriskPosition="right"
        >
          <PFormItem
            class="margin-bottom--4"
            :pLabel="t('email.address')"
            :pValidateStatus="emailErrorMessage !== '' ? 'error' : 'success'"
            pRequired
            :pError="emailErrorMessage"
          >
            <PInput
              :model-value="newContact.email"
              pType="email"
              :pPlaceholder="t('email.placeholder')"
              data-testid="email-input"
              @input="onUpdateEmail"
            />
          </PFormItem>
          <div v-if="shouldEnableNames === true">
            <PFormLine>
              <PFormItem
                class="margin-bottom--0"
                pWidth="100px"
                pProp="title"
                :pLabel="t('title.label')"
                pRequired
              >
                <PDropdown
                  v-model="newContact.title"
                  :pOptions="customerTitleOptions"
                  pTestId="customer-drawer-title-dropdown"
                />
              </PFormItem>
              <PFormItem
                class="margin-bottom--0"
                :pLabel="t('lastName.label')"
                pRequired
                pValidateStatus="success"
                :pError="lastNameErrorMessage"
              >
                <PInput
                  v-model="newContact.lastname"
                  pType="text"
                  data-testid="customer-drawer-last-name-input"
                  @input="onUpdateLastName"
                />
              </PFormItem>
              <PFormItem
                class="margin-bottom--0"
                :pLabel="t('firstName.label')"
                pRequired
                pValidateStatus="success"
                :pError="firstNameErrorMessage"
              >
                <PInput
                  v-model="newContact.firstname"
                  pType="text"
                  data-testid="customer-drawer-first-name-input"
                  @input="onUpdateFirstName"
                />
              </PFormItem>
            </PFormLine>
            <PFormLine class="margin-top--4">
              <PFormItem
                class="margin-bottom--0"
                pProp="mobilePhone"
                :pLabel="t('mobilePhone.label')"
                pRequired
              >
                <PPhoneInput
                  v-model="newContact.mobilePhone"
                  :pPlaceholder="t('mobilePhone.placeholder')"
                  pTestId="customer-drawer-mobile-phone-input"
                />
              </PFormItem>
            </PFormLine>
          </div>
        </PForm>
      </template>
    </PBlockHeader>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from '@pulse/styleguide/types'
import {
  PDropdown,
  PForm,
  PFormItem,
  PFormLine,
  PInput,
  PPhoneInput,
  PBlockHeader,
} from '@pulse/styleguide/components'
import type { AddCustomerStepInformationProps } from './add-customer-step-information.types'
import { useAddCustomerStepInformationValidation } from './add-customer-step-information.validation'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      lastName: {
        label: 'Last name',
      },
      firstName: {
        label: 'First name',
      },
      title: {
        label: 'Title',
      },
      mobilePhone: {
        label: 'Mobile phone',
        placeholder: '6 12 34 56 78',
      },
      email: {
        address: 'E-mail',
        placeholder: 'lastName.firstName{\'@\'}example.fr',
      },
      newUser: 'New user',
      setUserEmail: 'Please enter the email address of the user to be added',
      requiredField: 'This field is required',
      invalidPhoneNumber: 'The phone number is invalid',
    },
    'fr-FR': {
      lastName: {
        label: 'Nom',
      },
      firstName: {
        label: 'Prénom',
      },
      title: {
        label: 'Civilité',
      },
      mobilePhone: {
        label: 'Téléphone mobile',
        placeholder: '6 12 34 56 78',
      },
      email: {
        address: 'E-mail',
        placeholder: 'nom.prenom{\'@\'}exemple.fr',
      },
      newUser: 'Nouvel utilisateur',
      setUserEmail: 'Veuillez saisir l\'adresse e-mail de l\'utilisateur à ajouter',
      requiredField: 'Ce champ est obligatoire',
      invalidPhoneNumber: 'Le numéro de téléphone est invalide',
    },
  },
})

const props = defineProps<AddCustomerStepInformationProps>()

const formRef = useTemplateRef<FormInstance>('formRef')
const { rules, validate } = useAddCustomerStepInformationValidation({
  formRef,
  customerTitleOptions: () => props.customerTitleOptions,
  requiredFieldMessage: t('requiredField'),
  invalidPhoneNumberMessage: t('invalidPhoneNumber'),
})

const emit = defineEmits<{
  'update:email': [string]
  'update:first-name': [string]
  'update:last-name': [string]
}>()

function onUpdateEmail(email: string) {
  emit('update:email', email)
}
function onUpdateFirstName(firstName: string) {
  emit('update:first-name', firstName)
}
function onUpdateLastName(lastName: string) {
  emit('update:last-name', lastName)
}

defineExpose({ validate })
</script>
