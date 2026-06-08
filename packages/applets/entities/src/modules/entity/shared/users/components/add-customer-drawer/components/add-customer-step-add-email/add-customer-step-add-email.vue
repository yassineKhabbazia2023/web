<template>
  <div>
    <PAlert
      v-if="isProspect"
      pType="warning"
      class="margin-bottom--4"
      data-testid="prospect-rights-warning-alert"
    >
      {{ t('prospectRightsWarning') }}
    </PAlert>
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
          pLabelPosition="top"
          pRequireAsteriskPosition="right"
        >
          <PFormItem
            class="margin-bottom--4"
            :pLabel="t('email.address')"
            pValidateStatus="success"
            pRequired
            :pShowMessage="false"
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
          <div v-if="shouldEnableNames === true" class="flex flex--align-items-start flex-gap--4">
            <PFormItem
              class="margin-bottom--0 flex--grow-1 flex--shrink-1 flex--basis-0"
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
              class="margin-bottom--0 flex--grow-1 flex--shrink-1 flex--basis-0"
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
          </div>
        </PForm>
      </template>
    </PBlockHeader>
    <PAlert
      v-if="emailErrorMessage"
      pType="danger"
      class="margin-top--2"
    >
      {{ emailErrorMessage }}
    </PAlert>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import {
  PForm,
  PFormItem,
  PInput,
  PAlert,
  PBlockHeader,
} from '@pulse/styleguide/components'
import type { AddCustomerStepAddEmailProps } from './add-customer-step-add-email.types'

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
      email: {
        address: 'E-mail',
        placeholder: 'lastName.firstName{\'@\'}example.fr',
      },
      newUser: 'New user',
      setUserEmail: 'Please enter the email address of the user to be added',
      prospectRightsWarning: 'Warning: adding a user will grant them access to all compliance documents.',
    },
    'fr-FR': {
      lastName: {
        label: 'Nom',
      },
      firstName: {
        label: 'Prénom',
      },
      email: {
        address: 'E-mail',
        placeholder: 'nom.prenom{\'@\'}exemple.fr',
      },
      newUser: 'Nouvel utilisateur',
      setUserEmail: 'Veuillez saisir l\'adresse e-mail de l\'utilisateur à ajouter',
      prospectRightsWarning: 'Attention, l\'ajout d\'un utilisateur lui donnera accès à tous les documents de conformité.',
    },
  },
})

defineProps<AddCustomerStepAddEmailProps>()

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
</script>

