<template>
  <PDrawer v-model="isDrawerOpened" pSize="45%">
    <template #header-prefix>
      <div class="add-customer-drawer__header">
        <span>{{ targetEntityName }}</span>
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
        {{  t('fillUserInformation') }}
      </div>
      <PForm
        ref="addCustomerFormRef"
        pLabelPosition="top"
        pRequireAsteriskPosition = "right"
        :pModel="formData"
        :pRules="formRules"
        :pInlineMessage="false"
      >
        <PFormItem
          class="margin-bottom--4"
          :pLabel="t('emailAddress')"
          pProp="email"
          pValidateStatus='success'
        >
          <PInput
            v-model="formData.email"
            @blur="checkIfUserExists"
            :pattern="validEmailPattern"
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
import { debounce } from '@kpmg/common'
import { PDrawer, PForm, PFormItem, PInput, PImage, PAlert, PButton } from '@kpmg/styleguide'
import { getFullName } from '@/common/utils/helpers'
import type { AddCustomerDrawerProps } from './AddCustomerDrawerTypes'
import NextPreviousButtons from '@/common/components/NextPreviousButtons'
import { validEmailPattern, validPhoneNumberPattern } from '@/common/utils/helpers/forms'
import { getUserByEmail } from '@/services/contact'
import { addCustomerToEntity } from '@/services/account'
import AddCustomerFeedback from './components/addCustomerFeedback'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<AddCustomerDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
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
    await addCustomerFormRef.value.validate()
      .then(() => {
        isNextButtonDisabled.value = false
      })
      .catch((error: any) => console.error(error))
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
async function checkIfUserExists() {
  if (!formData.email) return
  const fetchedUser = await getUserByEmail(formData.email)

  if (fetchedUser) {
    doesUserEmailExists.value = true
    formData.firstName = fetchedUser.firstName
    formData.lastName = fetchedUser.lastName
    formData.mobilePhone = fetchedUser.mobilePhone

    disabledFormInputs.firstName = true
    disabledFormInputs.lastName = true
    disabledFormInputs.mobilePhone = true

    isNextButtonDisabled.value = false
    addCustomerFormRef.value.clearValidate()
  } else {
    formData.firstName = ''
    formData.lastName = ''
    formData.mobilePhone = ''

    disabledFormInputs.firstName = false
    disabledFormInputs.lastName = false
    disabledFormInputs.mobilePhone = false

    isNextButtonDisabled.value = true
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

    const { firstName, lastName, mobilePhone, email } = formData
    await addCustomerToEntity({
      firstName,
      lastName,
      mobilePhone,
      email,
      accountNumber: String(props.targetEntityId),
    })

    hasFormBeenSent.value = true
    isNextButtonLoading.value = false
  } catch (error) {
    hasFormBeenSent.value = true
    isNextButtonDisabled.value = true
    isNextButtonLoading.value = false
    hasFormSubmitFailed.value = true
  }
}

const formRules = reactive({
  email: [
    {
      required: true,
      message: t('incorrectEmail'),
      trigger: 'blur',
      pattern: validEmailPattern,
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
      message: t('requiredField'),
      trigger: 'blur',
    },
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
  &__header {
    > span {
      color: var(--el-color-neutral-gray-300)
    }
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
    requiredField: 'This field is mendatory'
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
