<template>
  <PDrawer
    v-model="isDrawerOpened"
    pSize="45%"
    @close-drawer-button="isDrawerOpened = false"
  >
    <template #header-prefix>
      <div class="add-customer-drawer__header">
        <span class="add-customer-drawer__entity-name">{{ targetEntityName }}</span>
        <h3>
          {{ t('addUser')}}
        </h3>
      </div>
    </template>

    <div v-if="!hasFormBeenSent">
      <div class="add-customer-drawer__add-image margin-x--auto">
        <PImage
          pType="paupulse"
          pName="add-user"
          pFit="cover"
        />
      </div>

      <div class="margin-y--6">
        {{ t('fillUserInformation') }}
      </div>
      <PForm
        ref="addCustomerFormRef"
        pLabelPosition="top"
        pRequireAsteriskPosition="right"
        :pModel="formData"
        :pRules="formRules"
        :pInlineMessage="false"
      >
        <PFormItem
          class="margin-bottom--4"
          :pLabel="t('emailAddress')"
          pProp="email"
          pValidateStatus="success"
        >
          <PInput
            v-model="formData.email"
            pType="email"
            @blur="checkIfUserExists"
            data-testid="email-input"
          />
        </PFormItem>

        <PAlert v-if="doesUserEmailExists" pType="success">
          {{ t('userAlreadyExists') }}
        </PAlert>

        <PFormItem
          class="margin-top--4"
          :pLabel="t('lastName')"
          pProp="lastName"
        >
          <PInput
            v-model="formData.lastName"
            :disabled="disabledFormInputs.lastName"
            data-testid="last-name-input"
          />
        </PFormItem>

        <PFormItem
          :pLabel="t('firstName')"
          pProp="firstName"
        >
          <PInput
            v-model="formData.firstName"
            :disabled="disabledFormInputs.firstName"
            data-testid="first-name-input"
          />
        </PFormItem>

        <PFormItem
          :pLabel="t('mobilePhoneNumber')"
          pProp="mobilePhone"
        >
          <PInput
            v-model="formData.mobilePhone"
            pType="tel"
            :disabled="disabledFormInputs.mobilePhone"
            data-testid="mobile-phone-input"
          />
        </PFormItem>
      </PForm>
    </div>
    <AddCustomerFeedback
      v-else
      :fullName="userFullName"
      :email="formData.email"
      :isError="hasFormSubmitFailed"
    />

    <template #footer>
      <NextPreviousButtons
        v-if="!hasFormBeenSent"
        :previousLabel="t('previousLabel')"
        :nextLabel="t('nextLabel')"
        :isNextButtonDisabled="isNextButtonDisabled"
        :isNextButtonLoading="isNextButtonLoading"
        @click-next="handleFormSubmit"
        @click-previous="isDrawerOpened = false"
      />
      <PButton
        v-else
        pPlain
        pType="primary"
        @click="isDrawerOpened = false"
      >
        {{ t('close')}}
      </PButton>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { amplitudeService, debounce } from '@kpmg/common'
import {
  PDrawer,
  PForm,
  PFormItem,
  PInput,
  PImage,
  PAlert,
  PButton,
  type FormRules,
} from '@kpmg/styleguide'
import { getFullName } from '@/common/utils/helpers'
import type { AddCustomerDrawerProps } from './AddCustomerDrawerTypes'
import NextPreviousButtons from '@/common/components/NextPreviousButtons'
import { validPhoneNumberPattern } from '@/common/utils/helpers/forms'
import { createCustomer, addContactToEntity, getAccountUserByEmail } from '@/services/account'
import AddCustomerFeedback from './components/addCustomerFeedback'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<AddCustomerDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
  'refresh-customers-list': [void]
}>()

const isDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value: boolean) {
    emit('update:modelValue', value)
  },
})

const addCustomerFormRef = ref()
const isNextButtonDisabled = ref(true)
const isNextButtonLoading = ref(false)
const formData = reactive({
  email: '',
  lastName: '',
  firstName: '',
  mobilePhone: '',
})

watch(formData, debouncedCheckIfNextButtonShouldBeEnabled())
function debouncedCheckIfNextButtonShouldBeEnabled() {
  return debounce(() => checkIfNextButtonShouldBeEnabled(), 600)
}

async function checkIfNextButtonShouldBeEnabled() {
  if (!addCustomerFormRef.value) return

  const { lastName, firstName, email } = formData
  if (lastName && firstName && email) {
    try {
      await addCustomerFormRef.value.validate()
      isNextButtonDisabled.value = false
    } catch (_error) {
      isNextButtonDisabled.value = true
    }
  } else {
    isNextButtonDisabled.value = true
  }
}

const disabledFormInputs = reactive({
  lastName: false,
  firstName: false,
  mobilePhone: false,
})

const doesUserEmailExists = ref(false)
const fetchedUser = ref()
async function checkIfUserExists() {
  if (!formData.email) return
  fetchedUser.value = await getAccountUserByEmail(formData.email)
  if (fetchedUser.value) {
    doesUserEmailExists.value = true
    formData.firstName = fetchedUser.value.firstName
    formData.lastName = fetchedUser.value.lastName
    formData.mobilePhone = fetchedUser.value.mobilePhone

    disabledFormInputs.firstName = true
    disabledFormInputs.lastName = true
    disabledFormInputs.mobilePhone = true

    isNextButtonDisabled.value = false
    addCustomerFormRef.value.clearValidate()
  } else {
    if (doesUserEmailExists.value) {
      formData.firstName = ''
      formData.lastName = ''
      formData.mobilePhone = ''
    }

    doesUserEmailExists.value = false

    disabledFormInputs.firstName = false
    disabledFormInputs.lastName = false
    disabledFormInputs.mobilePhone = false
  }
}

const hasFormBeenSent = ref(false)
const hasFormSubmitFailed = ref(false)
async function handleFormSubmit() {
  if (!addCustomerFormRef.value) return
  try {
    await addCustomerFormRef.value.validate()
    isNextButtonDisabled.value = false
    isNextButtonLoading.value = true

    if (!doesUserEmailExists.value) {
      const { firstName, lastName, mobilePhone, email } = formData
      fetchedUser.value = await createCustomer({
        firstName,
        lastName,
        mobilePhone,
        email,
        accountNumber: props.targetEntityNumber,
      })
    } else {
      await addContactToEntity(props.targetEntityId, fetchedUser.value.id)
      amplitudeService.track('Onboarding Started', {
        onboarding_start_localisation: "Ajout d'un utilisateur",
        onboarding_start_result: 'succeeded',
      })
    }

    hasFormBeenSent.value = true
    isNextButtonLoading.value = false
    emit('refresh-customers-list')
  } catch (error) {
    console.error(error)
    amplitudeService.track('Onboarding Started', {
      onboarding_start_localisation: "Ajout d'un utilisateur",
      onboarding_start_result: 'failed',
    })
    hasFormBeenSent.value = true
    isNextButtonDisabled.value = true
    isNextButtonLoading.value = false
    hasFormSubmitFailed.value = true
  }
}

const formRules = reactive<FormRules>({
  email: [
    {
      required: true,
      message: t('incorrectEmail'),
      trigger: 'blur',
      type: 'email',
    },
  ],
  lastName: [
    {
      required: true,
      message: t('requiredField'),
      trigger: 'blur',
    },
  ],
  firstName: [
    {
      required: true,
      message: t('requiredField'),
      trigger: 'blur',
    },
  ],
  mobilePhone: [
    {
      trigger: 'blur',
      pattern: validPhoneNumberPattern,
      message: t('incorrectPhoneNumberFormat'),
    },
  ],
})

const userFullName = computed(() => getFullName(formData.firstName, formData.lastName, true))
</script>

<style lang="scss" scoped>
.add-customer-drawer {
  &__entity-name {
    color: var(--el-color-neutral-gray-300)
  }
  &__add-image {
    width: 250px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    addUser: 'Add a user'
    fillUserInformation: "Please fill the user's information:"
    emailAddress: "E-mail"
    incorrectEmail: "Email format in not valid"
    userAlreadyExists: 'This user already have a KPMG Pulse account, the form has been filled.'
    firstName: 'First name'
    lastName: 'Last name'
    mobilePhoneNumber: 'Mobile phone number'
    requiredField: 'This field is mandatory'
    incorrectPhoneNumberFormat: 'Phone number format is incorrect'
    previousLabel: 'Cancel'
    nextLabel: 'Next'
    close: 'Close'
  fr-FR:
    addUser: 'Ajouter un utilisateur'
    fillUserInformation: "Veuillez saisir les informations suivantes :"
    emailAddress: "E-mail"
    incorrectEmail: "L'adresse mail n'est pas conforme"
    userAlreadyExists: 'Cet utilisateur a déjà un compte KPMG Pulse, le formulaire a été complété.'
    firstName: 'Prénom'
    lastName: 'Nom'
    mobilePhoneNumber: 'Téléphone portable'
    requiredField: 'Ce champ est obligatoire'
    incorrectPhoneNumberFormat: 'Le format du numéro est incorrect'
    previousLabel: 'Annuler'
    nextLabel: 'Suivant'
    close: 'Fermer'
</i18n>
