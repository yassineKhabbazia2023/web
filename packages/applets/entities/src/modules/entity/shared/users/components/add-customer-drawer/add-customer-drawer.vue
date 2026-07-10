<template>
  <PDrawer
    v-model="isDrawerOpened"
    pSize="50%"
    :pTitle="t('addUser')"
    @close-drawer-button="isDrawerOpened = false"
  >
    <template #header-prefix>
      <p
        class="
          text-color--neutral-gray-300
          margin-left--1
          margin-bottom--2
        "
      >
        {{ targetEntityName }}
      </p>
    </template>
    <AddCustomerContent
      v-model:authorizationsState="authorizationsState"
      v-model:additionalOptionByActionCode="additionalOptionByActionCode"
      v-model:additionalOptionByActionCodeOrigin="additionalOptionByActionCodeOrigin"
      v-model:pennylaneAvailableRoles="pennylaneAvailableRoles"
      :newContact="newContact"
      :entityId="targetEntityId"
      :accountNumber="targetEntityNumber"
      :isProspect="isProspect"
      :contactId="contactId"
      :hasFormSubmissionFailed="hasFormSubmissionFailed"
      :emailErrorMessage="emailErrorMessage"
      :firstNameErrorMessage="firstNameErrorMessage"
      :lastNameErrorMessage="lastNameErrorMessage"
      :shouldEnableNames="shouldEnableNames"
      :addCustomerDrawerStepIndex="addCustomerDrawerStepIndex"
      :addCustomerDrawerStep="addCustomerDrawerStep"
      :stepperSteps="stepperSteps"
      @update:email="onUpdateEmail"
      @update:first-name="onUpdateFirstName"
      @update:last-name="onUpdateLastName"
    />
    <template #footer>
      <PDrawerActions
        v-if="shouldShowDrawerActions"
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-primary-cta="onClickNext"
        @click-back-cta="onClickPrevious"
      />
      <PButton
        v-if="shouldShowCloseButton"
        pPlain
        pType="primary"
        data-testid="add-customer-cancel-button"
        @click="isDrawerOpened = false"
      >
        {{ t('close') }}
      </PButton>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import {
  PDrawer,
  PDrawerActions,
  PButton,
} from '@pulse/styleguide/components'
import type { AddCustomerDrawerProps } from './add-customer-drawer.types'
import AddCustomerContent from './components/add-customer-content/add-customer-content.vue'
import { ADD_CUSTOMER_USER_DRAWER_STEPS } from './add-customer-drawer.const'
import { useAddCustomerDrawer } from './add-customer-drawer.composable'
import { AddCustomerDrawerStep } from '@entities/modules/entity/shared/users/enums'
import { AccountType } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      close: 'Close',
      nextLabel: 'Next',
      addUser: 'Add a user',
      previousLabel: 'Cancel',
      incorrectEmail: 'Email format is not valid',
      alreadyAddedToAccount: 'This user has already been added to this account',
      noRights: 'Do not grant any rights',
      grantSelectedRights: 'Grant selected rights',
      requiredInput: 'This field is required',
      addCustomerFailed: 'Failed to add the user',
    },
    'fr-FR': {
      close: 'Fermer',
      nextLabel: 'Suivant',
      addUser: 'Ajouter un utilisateur',
      previousLabel: 'Annuler',
      incorrectEmail: 'L\'adresse mail n\'est pas conforme',
      alreadyAddedToAccount: 'Cet utilisateur a déjà été ajouté sur cette entité',
      noRights: 'Ne pas donner de droit',
      grantSelectedRights: 'Donner les droits sélectionnés',
      requiredInput: 'Ce champ est obligatoire',
      addCustomerFailed: 'L\'ajout de l\'utilisateur a échoué',
    },
  },
})

const props = defineProps<AddCustomerDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'refresh-customers-list': [void]
}>()

const isProspect = computed(() => props.targetEntityAccountType === AccountType.PROSPECT)

// Steps shown in the stepper header (the final confirmation step is never displayed there)
const stepperSteps = computed(() =>
  ADD_CUSTOMER_USER_DRAWER_STEPS.filter((step) => step !== AddCustomerDrawerStep.FORM_SENT),
)

const {
  addCustomerDrawerStepIndex,
  addCustomerDrawerStep,
  isLastStep,
  hasFormSubmissionFailed,
  isNextButtonLoading,
  isNextButtonDisabled,
  newContact,
  contactId,
  emailErrorMessage,
  firstNameErrorMessage,
  lastNameErrorMessage,
  shouldEnableNames,
  authorizationsState,
  additionalOptionByActionCode,
  additionalOptionByActionCodeOrigin,
  pennylaneAvailableRoles,
  debouncedCheckEmail,
  debouncedCheckFirstName,
  debouncedCheckLastName,
  submitForm,
  goNextStep,
} = useAddCustomerDrawer({
  invalidEmailAdresseMessage: t('incorrectEmail'),
  requiredInputMessage: t('requiredInput'),
  alreadyAddedToAccountMessage: t('alreadyAddedToAccount'),
  addCustomerFailedMessage: t('addCustomerFailed'),
  addCustomerDrawerSteps: ADD_CUSTOMER_USER_DRAWER_STEPS,
})

const nextLabelKey = computed(() => {
  switch (addCustomerDrawerStep.value) {
    case AddCustomerDrawerStep.ADD_EMAIL:
      return 'addUser'
    case AddCustomerDrawerStep.MANAGE_RIGHTS:
      return 'grantSelectedRights'
    default:
      return 'nextLabel'
  }
})

const previousLabelKey = computed(() => {
  switch (addCustomerDrawerStep.value) {
    case AddCustomerDrawerStep.MANAGE_RIGHTS:
      return 'noRights'
    default:
      return 'previousLabel'
  }
})

const backCTA = computed(() => ({ pLabel: t(previousLabelKey.value), pTestId: 'previousButton' }))
const primaryCTA = computed(() => ({
  pLabel: t(nextLabelKey.value),
  pDisabled: isNextButtonDisabled.value,
  pLoading: isNextButtonLoading.value,
  pTestId: 'nextButton',
}))

const shouldShowDrawerActions = computed(() => isLastStep.value === false)

const shouldShowCloseButton = computed(() =>
  addCustomerDrawerStep.value === AddCustomerDrawerStep.FORM_SENT,
)

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

async function onClickNext() {
  const isFirstStep = addCustomerDrawerStep.value === AddCustomerDrawerStep.ADD_EMAIL
  const isSuccess = await submitForm(
    props.targetEntityId,
    props.targetEntityNumber,
    props.targetEntityAccountType,
  )
  if (isSuccess === true && isFirstStep === true) {
    emit('refresh-customers-list')
  }
}

function onClickPrevious() {
  const isManageRightsStep = addCustomerDrawerStep.value === AddCustomerDrawerStep.MANAGE_RIGHTS
  if (isManageRightsStep) {
    goNextStep()
  } else {
    isDrawerOpened.value = false
  }
}

function onUpdateEmail(email: string) {
  newContact.value.email = email
  debouncedCheckEmail(props.targetEntityId)
}

function onUpdateFirstName(firstName: string) {
  newContact.value.firstname = firstName
  debouncedCheckFirstName()
}

function onUpdateLastName(lastName: string) {
  newContact.value.lastname = lastName
  debouncedCheckLastName()
}
</script>

