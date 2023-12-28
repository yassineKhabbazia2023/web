<template>
  <div>
    <PForm
      ref="createMandateFormRef"
      :model="createMandateForm"
      requireAsteriskPosition="right"
      labelPosition="top"
      :rules="rules"
      class="create-mandate-form"
    >
      <div v-if="step === 1">
        <PFormItem prop="erpId" :label="t('ibs-number')">
          <PInput
            v-model="createMandateForm.erpId"
            data-testid="ibs-number-test"
          >
            <template #suffix>
              <PIcon
                v-if="isIBSValid"
                class="el-button__icon--right"
                color="#5546FF"
              >
                <PICheck />
              </PIcon>
            </template>
          </PInput>
        </PFormItem>
        <PRow :gutter="16">
          <PCol :span="12">
            <PFormItem inline :label="t('company-name')">
              <PInput
                data-testid="name-input-test"
                v-model="createMandateForm.name"
                disabled
              />
            </PFormItem>
          </PCol>
          <PCol :span="12">
            <PFormItem
              inline
              :label="t('siret-number')"
              disabled
            >
              <PInput
                data-testid="siretNumber-input-test"
                v-model="createMandateForm.siretNumber"
                state="default"
                disabled
              />
            </PFormItem>
          </PCol>
        </PRow>
      </div>
      <div v-if="step === 2">
        <PFormItem prop="title">
          <template #label>
            <label class="create-mandate-form__title-label">{{
              t('title')
            }}</label>
          </template>
          <PRadio
            v-model="createMandateForm.title"
            label="M"
          >
            {{ t('mister') }}
          </PRadio>
          <PRadio v-model="createMandateForm.title" label="Mme">
            {{ t('madam') }}
          </PRadio>
        </PFormItem>
        <PRow :gutter="16">
          <PCol :span="12">
            <PFormItem
              prop="lastName"
              inline
              :label="t('lastName')"
              disabled>
              <PInput v-model="createMandateForm.lastName" state="default" />
            </PFormItem>
          </PCol>
          <PCol :span="12">
            <PFormItem
              prop="firstName"
              inline
              :label="t('firstName')"
            >
              <PInput
                v-model="createMandateForm.firstName"
                data-testid="firstName-test"
              />
            </PFormItem>
          </PCol>
        </PRow>
        <PFormItem
          prop="email"
          inline
          disabled
        >
          <template #label>
            <span class="create-mandate-form_optional-title"
            >{{ t('email') }}
            </span>
            <span class="create-mandate-form_optional">{{
              t('optional')
            }}</span>
          </template>
          <PInput
            v-model="createMandateForm.email"
            data-testid="email-test"
            state="default"
          />
        </PFormItem>
        <h5 class="create-mandate-form__section-title">
          {{ t('headquarters') }}
        </h5>
        <PFormItem
          prop="street"
          inline
          :label="`${t('address')}`"
          disabled
        >
          <PInput v-model="createMandateForm.street" state="default" />
        </PFormItem>
        <PFormItem
          prop="addressComplement"
          inline
          disabled
        >
          <template #label>
            <span class="create-mandate-form_optional-title"
            >{{ t('complement') }}
            </span>
            <span class="create-mandate-form_optional">{{
              t('optional')
            }}</span>
          </template>
          <PInput v-model="createMandateForm.addressComplement" state="default" />
        </PFormItem>
        <PRow :gutter="16">
          <PCol :span="8">
            <PFormItem
              prop="zipCode"
              inline
              :label="t('zipCode')"
              disabled
            >
              <PInput
                v-model="createMandateForm.zipCode"
                data-testid="zipCode-test"
                state="default"
              />
            </PFormItem>
          </PCol>
          <PCol :span="16">
            <PFormItem
              prop="city"
              inline
              :label="t('city')"
            >
              <PInput v-model="createMandateForm.city"/>
            </PFormItem>
          </PCol>
        </PRow>
        <PFormItem
          prop="country"
          inline
          :label="`${t('country')}`"
          disabled
        >
          <PInput v-model="createMandateForm.country" state="default" />
        </PFormItem>
      </div>
      <div v-if="step === 3">
        <PRow :gutter="16">
          <PCol :span="12">
            <PFormItem
              prop="institutionCode"
              inline
              :label="`${t('institutionCode')}`"
              :showMessage="(!validationError || !isBankCodeValid)
                && !isNonScrappable && !isScrappable"
              :validateStatus="validationError ? 'error' : ''"
              disabled
            >
              <PInput
                data-testid="institutionCode-input-test"
                v-model="createMandateForm.institutionCode"
                placeholder="_ _ _ _ _"
                @blur="checkFields()"
                state="default"
              />
            </PFormItem>
          </PCol>
          <PCol :span="12">
            <PFormItem
              prop="branchCode"
              inline
              :label="`${t('branchCode')}`"
              :showMessage="!validationError"
              :validateStatus="validationError ? 'error' : ''"
              disabled
            >
              <PInput
                data-testid="branchCode-input-test"
                v-model="createMandateForm.branchCode"
                placeholder="_ _ _ _ _"
                @blur="checkFields()"
                state="default"
              />
            </PFormItem>
          </PCol>
        </PRow>
        <PRow :gutter="16">
          <PCol :span="18">
            <PFormItem
              prop="accountNumber"
              inline
              :label="`${t('accountNumber')}`"
              :error="customErrorMessage"
              :validateStatus="validationError ? 'error' : ''"
              disabled
            >
              <PInput
                data-testid="accountNumber-input-test"
                v-model="createMandateForm.accountNumber"
                placeholder="_ _ _ _ _ _ _ _ _ _ _"
                @blur="checkFields()"
                state="default"
              />
            </PFormItem>
          </PCol>
          <PCol :span="6">
            <PFormItem
              prop="key"
              inline
              :label="`${t('key')}`"
              :showMessage="!validationError"
              :validateStatus="validationError ? 'error' : ''"
              disabled
            >
              <PInput
                data-testid="key-input-test"
                v-model="createMandateForm.key"
                placeholder="_ _"
                @blur="checkFields()"
                state="default"
              />
            </PFormItem>
          </PCol>
        </PRow>
        <PFormItem
          prop="bank"
          inline
          :label="`${t('bank')}`"
          disabled
        >
          <PInput
            data-testid="bank-input-test"
            v-model="createMandateForm.bank"
            state="default"
            disabled
          />
        </PFormItem>
        <PAlert pType="danger" v-if="isScrappable">
          {{ t('form.error.notListed') }}
          <span class="create-mandate-form__content--bold">
            {{ t('form.error.frFmMandat') }}
          </span>
          {{ t('form.error.contactTeam') }}
        </PAlert>
        <PAlert pType="danger" v-if="isNonScrappable">
          {{ t('form.error.nonScrappable') }}
        </PAlert>
      </div>
    </PForm>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    ibs-number: 'IBS Number'
    company-name: 'Company name'
    siret-number: 'SIRET'
    title: 'Civility'
    mister: 'Mister'
    madam: 'Madam'
    lastName: 'Last name'
    firstName: 'First name'
    email: 'Email'
    optional: ' (optional)'
    headquarters: 'Headquarters'
    address: 'Address'
    complement: 'Address complement'
    zipCode: 'ZipCode'
    city: 'City'
    country: 'Country'
    institutionCode: 'Institution Code'
    branchCode: 'Branch Code'
    accountNumber: 'Account Number'
    key: 'Key'
    bank: 'Bank'
    form:
      error:
        requiredField: 'Required field'
        mandatoryChoice: 'Mandatory choice'
        input_5_chars: 'Input must have exactly 5 characters'
        input_11_chars: 'Input must have exactly 11 characters'
        input_2_chars: 'Input must have exactly 2 characters'
        only_numbers: 'Input must contain only numbers'
        alphanumeric_only: 'Input must contain only numbers and letters'
        bankingInfoNotRecognized: 'The entered banking information is not recognized'
        notListed: 'This bank is not listed as a JeDéclare partner and requires data scrapping.
         We invite you to contact the '
        contactTeam: ' teams for this.'
        frFmMandat: 'FR-FM-MesMandats'
        correctEmail: 'Please input correct email address'
        validNumber: 'Please input a valid number'
        ibsNotFound: 'IBS number not found.'
        outWalletIBS: 'The IBS must be part of your portfolio and have active engagement.'
        nonScrappable: 'This bank is not scrappable.'
  fr-FR:
    ibs-number: 'Numéro IBS'
    company-name: 'Raison sociale'
    siret-number: 'N° SIRET'
    title: 'Civilité'
    mister: 'Monsieur'
    madam: 'Madame'
    lastName: 'Prénom'
    firstName: 'Nom'
    email: 'Adresse mail'
    optional: ' (facultatif)'
    headquarters: 'Siège social'
    address: 'Adresse postale'
    complement: "Complément d'adresse"
    zipCode: 'Code postal'
    city: 'Ville'
    country: 'Pays'
    institutionCode: 'Code établissement'
    branchCode: 'Code guichet'
    accountNumber: 'Numéro de compte'
    key: 'Clé'
    bank: 'Banque'
    form:
      error:
        requiredField: 'Champ obligatoire'
        mandatoryChoice: 'Mandatory choice'
        input_5_chars: 'L''entrée doit avoir exactement 5 caractères'
        input_11_chars: 'L''entrée doit avoir exactement 11 caractères'
        input_2_chars: 'L''entrée doit avoir exactement 2 caractères'
        only_numbers: 'L''entrée doit contenir uniquement des chiffres'
        alphanumeric_only: 'L''entrée doit contenir uniquement des chiffres et des lettres'
        bankingInfoNotRecognized: 'Les informations bancaires saisies ne sont pas reconnues'
        notListed: 'Cette banque n''est pas listée comme partenaire JeDéclare et doit faire l''objet
         d''un scrapping de données. Nous vous invitons à contacter les équipes '
        contactTeam: ' pour cela.'
        frFmMandat: 'FR-FM-MesMandats'
        correctEmail: 'Veuillez entrer une adresse e-mail valide'
        validNumber: 'Veuillez entrer un nombre valide'
        ibsNotFound: "Le numéro IBS saisi n'est pas reconnu."
        outWalletIBS: "Le numéro d'IBS saisi doit faire
         parti de votre portefeuille et avoir un engagement actif."
        nonScrappable: 'Cette banque n''est pas scrappable.'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { ref, reactive, watch, computed } from 'vue'
import { validateIban, getBankDetail, getCompany } from '@/services/mandate'
import { Rule } from './FormModels'
import {
  PICheck,
  PForm,
  PFormItem,
  PInput,
  PIcon,
  PRadio,
  PCol,
  PRow,
  PAlert
} from '@kpmg/styleguide'

// Props
interface FormProps {
  step: number
}
const props = defineProps<FormProps>()

// i18n
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

// Emits
const emit = defineEmits(['enable-disable-next', 'enable-disable-validate', 'update-mandate-model'])

// Reactive state
const createMandateFormRef = ref<any>()
const createMandateForm: any = reactive({
  erpId: '',
  siretNumber: '',
  name: '',
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  addressComplement: '',
  zipCode: '',
  city: '',
  country: '',
  institutionCode: '',
  branchCode: '',
  accountNumber: '',
  key: '',
  bank: ''
})
const isIBSValid = ref(false)
const customErrorMessage = ref('')
const validationError = ref(false)
const isScrappable = ref(false)
const isNonScrappable = ref(false)
const isBankCodeValid = ref(false)
const isRibValid = ref(false)
const isValidateEnabled = computed(() => isBankCodeValid.value && isRibValid.value)

const areFieldsFilled = (fieldsToCheck: string[]) =>
  fieldsToCheck.every((field) => !!createMandateForm[field] &&
  createMandateForm[field].trim() !== '')

const areStep2FieldsFilled = computed(() => {
  const fieldsToCheck = [
    'title',
    'firstName',
    'lastName',
    'street',
    'zipCode',
    'city',
    'country'
  ]
  return areFieldsFilled(fieldsToCheck)
})

// Methods
const validateIBS = async (_: Rule, value: string, callback: any) => {
  try {
    emit('enable-disable-next', false)
    isIBSValid.value = false
    createMandateForm.siretNumber = ''
    createMandateForm.name = ''
    if (value.toString().length === 10) {
      await getDataByIbsNumber(value)
    }
  } catch (error: any) {
    if (error?.message?.includes('outWalletIBS')) {
      callback(new Error(t('form.error.outWalletIBS')))
    }
    if (error?.message?.includes('ibsNotFound') || error?.message?.includes('404')) {
      callback(new Error(t('form.error.ibsNotFound')))
    }
  }
}

const getDataByIbsNumber = async (ibsNumber: string) => {
  const { data } = await getCompany({ ibsNumber })
  if (data.id) {
    const {
      id,
      name,
      siretNumber,
      signatory: { title, firstName, lastName, email },
      address: { street, addressComplement, zipCode, city, country }
    } = data
    Object.assign(createMandateForm, {
      id,
      siretNumber,
      name,
      title,
      firstName,
      lastName,
      email,
      street,
      addressComplement,
      zipCode,
      city,
      country
    })
    isIBSValid.value = true
    return emit('enable-disable-next', true)
  }
  throw new Error(data.errorType === 'CompanyForbidden'
    ? 'form.error.outWalletIBS'
    : 'form.error.ibsNotFound')
}

const areFieldsFilledStepBased = (step: number) => {
  const fieldsToCheckMap: any = {
    1: ['erpId', 'siretNumber', 'name'],
    2: [
      'title',
      'firstName',
      'lastName',
      'street',
      'zipCode',
      'city',
      'country'
    ],
    3: ['institutionCode', 'branchCode', 'accountNumber',
      'key', 'bank']
  }
  emit('enable-disable-next', areFieldsFilled(fieldsToCheckMap[step]))
}

const checkBbanValidity = async ({
  bankCode,
  branchCode,
  accountNumber,
  checkDigits
}: any) => {
  const { valid } = await validateIban({
    bankCode,
    branchCode,
    accountNumber,
    checkDigits
  })

  if (!valid) {
    customErrorMessage.value = t('form.error.bankingInfoNotRecognized')
    validationError.value = true
  }
  emit('update-mandate-model', {
    erpId: createMandateForm.erpId,
    bban: {
      bankCode: createMandateForm.institutionCode,
      branchCode: createMandateForm.branchCode,
      accountNumber: createMandateForm.accountNumber,
      checkDigits: createMandateForm.key
    },
    address: {
      street: createMandateForm.street,
      addressComplement: createMandateForm.addressComplement,
      zipCode: createMandateForm.zipCode,
      city: createMandateForm.city,
      country: createMandateForm.country
    },
    signatory: {
      title: createMandateForm.title,
      firstName: createMandateForm.firstName,
      lastName: createMandateForm.lastName,
      email: createMandateForm.email
    }
  })
  isRibValid.value = valid
}

const getBankInformation = async (bankCode: string) => {
  try {
    const bank: any = await getBankDetail(bankCode)
    if (bank.jeDeclare.jdcPartnership === 'Scrappable') {
      isScrappable.value = true
      createMandateForm.bank = ''
      isBankCodeValid.value = false
      return { status: 'error-scrappable', data: null }
    }

    if (bank.jeDeclare.jdcPartnership === 'NonScrappable') {
      isNonScrappable.value = true
      createMandateForm.bank = bank.name
      isBankCodeValid.value = false
      return { status: 'error-non-scrappable', data: null }
    }

    isScrappable.value = false
    createMandateForm.bank = bank.name
    isBankCodeValid.value = true
    return { status: 'success', data: bank }
  } catch (error: any) {
    createMandateForm.bank = ''
    isBankCodeValid.value = false
    return { status: 'error-not-found', error: error?.response?.data?.message }
  }
}

const resetValidation = () => {
  emit('enable-disable-validate', false)
  customErrorMessage.value = ''
  validationError.value = false
  isScrappable.value = false
  isNonScrappable.value = false
}

const isBbanComplete = () => {
  const fieldsToValidate = [
    'institutionCode',
    'branchCode',
    'accountNumber',
    'key'
  ]

  return fieldsToValidate.every(field => createMandateForm[field] !== '')
}

const checkFields = async () => {
  try {
    resetValidation()
    const validInstitutionCode = await createMandateFormRef?.value?.validateField('institutionCode')
    if (validInstitutionCode) {
      await getBankInformation(createMandateForm.institutionCode)
    }
  } catch (_) {
  } finally {
    if (isBbanComplete()) {
      await checkBbanValidity({
        bankCode: createMandateForm.institutionCode,
        branchCode: createMandateForm.branchCode,
        accountNumber: createMandateForm.accountNumber,
        checkDigits: createMandateForm.key
      })
    }
    emit('enable-disable-validate', isValidateEnabled.value)
  }
}

// Utility functions
const createRule = (message: string, trigger = 'blur') => ({
  required: true,
  message: t(message),
  trigger
})

const validateInstitutionCode = async (value: string, callback: any) => {
  const result = await getBankInformation(value)
  if (result?.status === 'error-not-found') {
    callback(new Error(result?.error))
  }
}

const createValidator = (
  length: number,
  regex: any,
  errorMsg: string,
  regexErrorMsg?: string,
  fieldName?: string
) => ({
  required: true,
  validator: async (_: any, value: string, callback: any) => {
    if (value.length !== length) {
      createMandateForm.bank = ''
      callback(new Error(errorMsg))
    } else if (!regex.test(value)) {
      callback(new Error(regexErrorMsg))
    } else if (fieldName === 'institutionCode') {
      await validateInstitutionCode(value, callback)
    } else {
      callback()
    }
  },
  trigger: 'blur'
})

const validateEmail = (_: any, value: string, callback: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!value || emailRegex.test(value)) {
    callback()
    areFieldsFilledStepBased(2)
  } else {
    callback(new Error(t('form.error.correctEmail')))
    emit('enable-disable-next', false)
  }
}

// Validation rules
const rules = reactive<any>({
  erpId: [
    createRule(t('form.error.requiredField'), 'change'),
    { validator: validateIBS, trigger: 'change' }
  ],
  title: [createRule(t('form.error.mandatoryChoice'), 'change')],
  firstName: [createRule(t('form.error.requiredField'))],
  lastName: [createRule(t('form.error.requiredField'))],
  email: [{ validator: validateEmail, trigger: 'blur' }],
  street: [createRule(t('form.error.requiredField'))],
  zipCode: [
    createRule(t('form.error.requiredField')),
    {
      validator: (_: any, value: any, callback: any) => {
        if (isNaN(value)) {
          callback(new Error(t('form.error.validNumber')))
          emit('enable-disable-next', false)
        } else {
          callback()
          areFieldsFilledStepBased(2)
        }
      },
      trigger: 'blur'
    }
  ],
  city: [createRule(t('form.error.requiredField'))],
  country: [createRule(t('form.error.requiredField'))],
  institutionCode: [
    createValidator(
      5,
      /^\d+$/,
      t('form.error.input_5_chars'),
      t('form.error.only_numbers'),
      'institutionCode'
    )
  ],
  branchCode: [
    createValidator(
      5,
      /^\d+$/,
      t('form.error.input_5_chars'),
      t('form.error.only_numbers')
    )
  ],
  accountNumber: [
    createValidator(
      11,
      /^[a-zA-Z0-9]+$/,
      t('form.error.input_11_chars'),
      t('form.error.alphanumeric_only')
    )
  ],
  key: [
    createValidator(
      2,
      /^\d+$/,
      t('form.error.input_2_chars'),
      t('form.error.only_numbers')
    )
  ]
})

// Watchers
watch(() => props.step, () => areFieldsFilledStepBased(props.step))
watch(areStep2FieldsFilled, () => areFieldsFilledStepBased(2))
watch(
  () => createMandateForm.erpId,
  (value) => {
    createMandateForm.erpId = value.replace(/[^0-9]/i, '')
  }
)

// Expose
defineExpose({
  createMandateForm,
  validateIBS
})
</script>

<style lang="scss">
.create-mandate-form {
  &__ibs {
    display: flex;
    &-label {
      padding-right: 8px;
    }
  }

  &__section-title {
    margin: 32px 0px 16px 0px;
    color: var(--el-color-neutral-gray-900);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
  }

  &_title-optional {
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
    color: var(--el-color-neutral-gray-900);
  }

  &_optional {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 120%;
    color: var(--el-color-neutral-gray-500);
  }

  .el-input__inner::-webkit-inner-spin-button,
  .el-input__inner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &__content {
    &--bold {
      font-weight: 700;
    }
  }
}
</style>
