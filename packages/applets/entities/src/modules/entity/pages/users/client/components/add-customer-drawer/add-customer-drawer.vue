<template>
  <PDrawer
    v-model="isDrawerOpened"
    pSize="50%"
    @close-drawer-button="isDrawerOpened = false"
  >
    <template #header-prefix>
      <div>
        <p
          class="
            text-color--neutral-gray-300
            margin-left--1
            margin-bottom--2
          "
        >
          {{ targetEntityName }}
        </p>
        <div class="flex flex--align-items-center">
          <PIcon
            pName="pulse"
            :pColor="AppColors.JUNGLE_400"
            pSize="30"
          />
          <h3 class="margin-left--1 font-semibold">
            {{ isAddContactSucceeded ? t('userAdded') : t('addUser') }}
          </h3>
        </div>
      </div>
    </template>
    <AddCustomerContent
      v-model:authorizationsState="authorizationsState"
      v-model:additionalOptionByActionCode="additionalOptionByActionCode"
      v-model:additionalOptionByActionCodeOrigin="additionalOptionByActionCodeOrigin"
      :newContact="newContact"
      :entityId="targetEntityId"
      :accountNumber="targetEntityNumber"
      :contactId="contactId"
      :hasFormSubmissionFailed="hasFormSubmissionFailed"
      :emailErrorMessage="emailErrorMessage"
      :firstNameErrorMessage="firstNameErrorMessage"
      :lastNameErrorMessage="lastNameErrorMessage"
      :shouldEnableNames="shouldEnableNames"
      :addCustomerDrawerStepIndex="addCustomerDrawerStepIndex"
      :addCustomerDrawerStep="addCustomerDrawerStep"
      @update:email="onUpdateEmail"
      @update:first-name="onUpdateFirstName"
      @update:last-name="onUpdateLastName"
    />
    <template #footer>
      <NextPreviousButtons
        v-if="isLastStep === false"
        :previousLabel="t(previousLabelKey)"
        :nextLabel="t(nextLabelKey)"
        :isNextButtonDisabled="isNextButtonDisabled"
        :isNextButtonLoading="isNextButtonLoading"
        @click-next="onClickNext"
        @click-previous="onClickPrevious"
      />
      <PButton
        v-if="isLastStep === true"
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
  PButton,
  PIcon,
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import type { AddCustomerDrawerProps } from './add-customer-drawer.types'
import NextPreviousButtons from '@entities/components/NextPreviousButtons'
import AddCustomerContent from './components/add-customer-content/add-customer-content.vue'
import { DEBOUNCE_DELAY, ADD_CUSTOMER_DRAWER_STEPS } from './add-customer-drawer.const'
import { useAddCustomerDrawer } from './add-customer-drawer.composable'
import { AddCustomerDrawerStep } from '@entities/modules/entity/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<AddCustomerDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'refresh-customers-list': [void]
}>()

const {
  addCustomerDrawerStepIndex,
  addCustomerDrawerStep,
  isLastStep,
  hasFormSubmissionFailed,
  isNextButtonLoading,
  isNextButtonDisabled,
  newContact,
  contactId,
  isAddContactSucceeded,
  emailErrorMessage,
  firstNameErrorMessage,
  lastNameErrorMessage,
  shouldEnableNames,
  authorizationsState,
  additionalOptionByActionCode,
  additionalOptionByActionCodeOrigin,
  debouncedCheckEmail,
  debouncedCheckFirstName,
  debouncedCheckLastName,
  submitForm,
  goNextStep,
} = useAddCustomerDrawer({
  debounceDelay: DEBOUNCE_DELAY,
  invalidEmailAdresseMessage: t('incorrectEmail'),
  requiredInputMessage: t('requiredInput'),
  alreadyAddedToAccountMessage: t('alreadyAddedToAccount'),
  addCustomerDrawerSteps: ADD_CUSTOMER_DRAWER_STEPS,
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

<i18n lang="yaml">
  en-US:
    close: 'Close'
    nextLabel: 'Next'
    addUser: 'Add a user'
    previousLabel: 'Cancel'
    userAdded: 'User added'
    incorrectEmail: "Email format is not valid"
    alreadyAddedToAccount: 'This user has already been added to this account'
    noRights: 'Do not grant any rights'
    grantSelectedRights: 'Grant selected rights'
    requiredInput: 'This field is required'
  fr-FR:
    close: 'Fermer'
    nextLabel: 'Suivant'
    addUser: 'Ajouter un utilisateur'
    previousLabel: 'Annuler'
    userAdded: 'Utilisateur ajouté'
    incorrectEmail: "L'adresse mail n'est pas conforme"
    alreadyAddedToAccount: 'Cet utilisateur a déjà été ajouté sur cette entité'
    noRights: 'Ne pas donner de droit'
    grantSelectedRights: 'Donner les droits sélectionnés'
    requiredInput: 'Ce champ est obligatoire'
</i18n>
