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
        <PFormItem pProp="erpId" :pLabel="t('ibs-number')">
          <PInput
            v-model="createMandateForm.erpId"
            data-testid="ibs-number-test"
          >
          <!-- <template #suffix>
              <PIcon
                v-if="isIBSValid"
                class="el-button__icon--right"
                color="#5546FF"
              >
                <PICheck />
              </PIcon>
            </template> -->
          </PInput>
        </PFormItem>
        <PRow :pGutter="16">
          <PCol :pSpan="12">
            <PFormItem inline :pLabel="t('company-name')">
              <PInput
                data-testid="name-input-test"
                v-model="createMandateForm.name"
                disabled
              />
            </PFormItem>
          </PCol>
          <PCol :pSpan="12">
            <PFormItem
              inline
              :pLabel="t('siret-number')"
              disabled
            >
              <PInput
                data-testid="siretNumber-input-test"
                v-model="createMandateForm.siretNumber"
                pSize="default"
                disabled
              />
            </PFormItem>
          </PCol>
        </PRow>
      </div>
      <div v-if="step === 2">
        <PFormItem pProp="title">
          <label class="create-mandate-form__title-label font-semibold">
            {{ t('title') }}
            <span class="create-mandate-form__title-label__asterisk">
              {{ t('form.asterisk') }}
            </span>
          </label>
          <div>
            <PRadio
              v-model="createMandateForm.title"
              pLabel="M"
            >
              {{ t('mister') }}
            </PRadio>
            <PRadio v-model="createMandateForm.title" pLabel="Mme">
              {{ t('madam') }}
            </PRadio>
          </div>
        </PFormItem>
        <PRow :pGutter="16">
          <PCol :pSpan="12">
            <PFormItem
              pProp="lastName"
              inline
              :pLabel="t('lastName')"
              disabled>
              <PInput v-model="createMandateForm.lastName" state="default" />
            </PFormItem>
          </PCol>
          <PCol :pSpan="12">
            <PFormItem
              pProp="firstName"
              inline
              :pLabel="t('firstName')"
            >
              <PInput
                v-model="createMandateForm.firstName"
                data-testid="firstName-test"
              />
            </PFormItem>
          </PCol>
        </PRow>
        <PFormItem
          pProp="email"
          inline
          disabled
          :pLabel="t('email')"
        >
          <PInput
            v-model="createMandateForm.email"
            data-testid="email-test"
            pSize="default"
          />
        </PFormItem>
        <h5 class="create-mandate-form__section-title margin-top--8 margin-bottom--4 font-semibold">
          {{ t('headquarters') }}
        </h5>
        <PFormItem
          pProp="street"
          inline
          :pLabel="`${t('address')}`"
          disabled
        >
          <PInput v-model="createMandateForm.street" pSize="default" />
        </PFormItem>
        <PFormItem
          pProp="addressComplement"
          inline
          disabled
        >
          <div>
            <span class="create-mandate-form_optional-title font-semibold"
            >{{ t('complement') }}
            </span>
            <span class="create-mandate-form_optional font-normal">{{
              t('optional')
            }}</span>
          </div>
          <PInput v-model="createMandateForm.addressComplement" state="default" />
        </PFormItem>
        <PRow :pGutter="16">
          <PCol :pSpan="8">
            <PFormItem
              pProp="zipCode"
              inline
              :pLabel="t('zipCode')"
              disabled
            >
              <PInput
                v-model="createMandateForm.zipCode"
                data-testid="zipCode-test"
                state="default"
              />
            </PFormItem>
          </PCol>
          <PCol :pSpan="16">
            <PFormItem
              pProp="city"
              inline
              :pLabel="t('city')"
            >
              <PInput v-model="createMandateForm.city"/>
            </PFormItem>
          </PCol>
        </PRow>
        <PFormItem
          pProp="country"
          inline
          :pLabel="`${t('country')}`"
          disabled
        >
          <PInput v-model="createMandateForm.country" state="default" />
        </PFormItem>
      </div>
      <div v-if="step === 3">
        <PRow :pGutter="16">
          <PCol :pSpan="12">
            <PFormItem
              pProp="institutionCode"
              inline
              :pLabel="`${t('institutionCode')}`"
              :pShowMessage="(!validationError || !isBankCodeValid)
                && !isNonScrappable && !isScrappable"
              :pValidateStatus="validationError ? 'error' : ''"
              disabled
            >
              <PInput
                data-testid="institutionCode-input-test"
                v-model="createMandateForm.institutionCode"
                pPlaceholder="_ _ _ _ _"
                @blur="checkFields()"
                state="default"
              />
            </PFormItem>
          </PCol>
          <PCol :pSpan="12">
            <PFormItem
              pProp="branchCode"
              inline
              :pLabel="`${t('branchCode')}`"
              :pShowMessage="!validationError"
              :pValidateStatus="validationError ? 'error' : ''"
              disabled
            >
              <PInput
                data-testid="branchCode-input-test"
                v-model="createMandateForm.branchCode"
                pPlaceholder="_ _ _ _ _"
                @blur="checkFields()"
                state="default"
              />
            </PFormItem>
          </PCol>
        </PRow>
        <PRow :pGutter="16">
          <PCol :pSpan="18">
            <PFormItem
              pProp="accountNumber"
              inline
              :pLabel="`${t('accountNumber')}`"
              :pError="customErrorMessage"
              :pValidateStatus="validationError ? 'error' : ''"
              disabled
            >
              <PInput
                data-testid="accountNumber-input-test"
                v-model="createMandateForm.accountNumber"
                pPlaceholder="_ _ _ _ _ _ _ _ _ _ _"
                @blur="checkFields()"
                state="default"
              />
            </PFormItem>
          </PCol>
          <PCol :pSpan="6">
            <PFormItem
              pProp="key"
              inline
              :pLabel="`${t('key')}`"
              :pShowMessage="!validationError"
              :pValidateStatus="validationError ? 'error' : ''"
              disabled
            >
              <PInput
                data-testid="key-input-test"
                v-model="createMandateForm.key"
                pPlaceholder="_ _"
                @blur="checkFields()"
                state="default"
              />
            </PFormItem>
          </PCol>
        </PRow>
        <PFormItem
          pProp="bank"
          inline
          :pLabel="`${t('bank')}`"
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
          <span class="font-bold">
            {{ t('form.error.frFmMandat') }}
          </span>
          {{ t('form.error.contactTeam') }}
        </PAlert>
        <PAlert pType="danger" v-if="isNonScrappable">
          {{ t('form.error.nonScrappable') }}
        </PAlert>
        <PAlert pType="danger" v-if="creationMandateError">
          {{ creationMandateError }}
        </PAlert>
      </div>
    </PForm>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { ref, reactive, watch, computed } from 'vue'
import { validateIban, getBankDetail, getCompany } from '@/services/mandate'
import type { Rule } from './FormModels'
import {
  PForm,
  PFormItem,
  PInput,
  PRadio,
  PCol,
  PRow,
  PAlert,
} from '@kpmg/styleguide'

// Props
interface FormProps {
  step: number
  creationMandateError?: string
}
const props = defineProps<FormProps>()

// i18n
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
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
  bank: '',
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
    'country',
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
    if (error?.response?.status === 403) {
      callback(new Error(t('form.error.outWalletIBS')))
    }
    if (error?.response?.status === 404) {
      callback(new Error(t('form.error.ibsNotFound')))
    }
    if (error?.response?.status === 500) {
      callback(new Error(t('form.error.serverError')))
    }
  }
}

const getDataByIbsNumber = async (ibsNumber: string) => {
  const { data } = await getCompany({ ibsNumber })
  if (data.id && createMandateForm.erpId === ibsNumber) {
    const {
      id,
      name,
      siretNumber,
    } = data
    Object.assign(createMandateForm, {
      id,
      siretNumber,
      name,
    })
    isIBSValid.value = true
    areFieldsFilledStepBased(props.step)
    return emit('enable-disable-next', true)
  }
}

const getMandateModel = () => {
  return {
    erpId: createMandateForm.erpId,
    bban: {
      bankCode: createMandateForm.institutionCode,
      branchCode: createMandateForm.branchCode,
      accountNumber: createMandateForm.accountNumber,
      checkDigits: createMandateForm.key,
    },
    address: {
      street: createMandateForm.street,
      addressComplement: createMandateForm.addressComplement,
      zipCode: createMandateForm.zipCode,
      city: createMandateForm.city,
      country: createMandateForm.country,
    },
    signatory: {
      title: createMandateForm.title,
      firstName: createMandateForm.firstName,
      lastName: createMandateForm.lastName,
      email: createMandateForm.email,
    },
  }
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
      'country',
    ],
    3: ['institutionCode', 'branchCode', 'accountNumber',
      'key', 'bank'],
  }
  const fieldStepFilledDone = areFieldsFilled(fieldsToCheckMap[step])
  if (fieldStepFilledDone) {
    emit('update-mandate-model', getMandateModel())
  }
  emit('enable-disable-next', fieldStepFilledDone)
}

const checkBbanValidity = async ({
  bankCode,
  branchCode,
  accountNumber,
  checkDigits,
}: any) => {
  const { valid } = await validateIban({
    bankCode,
    branchCode,
    accountNumber,
    checkDigits,
  })

  if (!valid) {
    customErrorMessage.value = t('form.error.bankingInfoNotRecognized')
    validationError.value = true
  }
  emit('update-mandate-model', getMandateModel())
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

const isBbanComplete = async () => {
  const fieldsToValidate = [
    'institutionCode',
    'branchCode',
    'accountNumber',
    'key',
  ]
  return fieldsToValidate.every(field => createMandateForm[field] !== '') && await asyncEvery(fieldsToValidate, async (inputValue: string) => {
    try {
      return await createMandateFormRef?.value?.validateField(inputValue)
    } catch (error) {
      console.error(`Error in RIB field ${inputValue}`, error)
    }
  })
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
    if (await isBbanComplete()) {
      await checkBbanValidity({
        bankCode: createMandateForm.institutionCode,
        branchCode: createMandateForm.branchCode,
        accountNumber: createMandateForm.accountNumber,
        checkDigits: createMandateForm.key,
      })
    }
    emit('enable-disable-validate', isValidateEnabled.value)
  }
}

// Utility functions
const createRule = (message: string, trigger = 'blur') => ({
  required: true,
  message,
  trigger,
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
  fieldName?: string,
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
  trigger: 'blur',
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
const requiredFieldMessage = t('form.error.requiredField')
const rules = reactive<any>({
  erpId: [
    createRule(requiredFieldMessage, 'blur'),
    { validator: validateIBS, trigger: ['change', 'blur'] },
    { message: t('form.error.ibsFormatIssue'), pattern: /^\d{10}$/, trigger: ['blur'] },
  ],
  title: [createRule(t('form.error.mandatoryChoice'), 'change')],
  firstName: [createRule(requiredFieldMessage)],
  lastName: [createRule(requiredFieldMessage)],
  email: [
    createRule(requiredFieldMessage, 'blur'),
    { validator: validateEmail, trigger: 'blur' },
  ],
  street: [createRule(requiredFieldMessage)],
  zipCode: [
    createRule(requiredFieldMessage),
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
      trigger: 'blur',
    },
  ],
  city: [createRule(requiredFieldMessage)],
  country: [createRule(requiredFieldMessage)],
  institutionCode: [
    createValidator(
      5,
      /^\d+$/,
      t('form.error.input_5_chars'),
      t('form.error.only_numbers'),
      'institutionCode',
    ),
  ],
  branchCode: [
    createValidator(
      5,
      /^\d+$/,
      t('form.error.input_5_chars'),
      t('form.error.only_numbers'),
    ),
  ],
  accountNumber: [
    createValidator(
      11,
      /^[a-zA-Z0-9]+$/,
      t('form.error.input_11_chars'),
      t('form.error.alphanumeric_only'),
    ),
  ],
  key: [
    createValidator(
      2,
      /^\d+$/,
      t('form.error.input_2_chars'),
      t('form.error.only_numbers'),
    ),
  ],
})

// Watchers
watch(() => props.step, () => areFieldsFilledStepBased(props.step))
watch(areStep2FieldsFilled, () => areFieldsFilledStepBased(2))
watch(
  () => createMandateForm.erpId,
  (value) => {
    const valueTrimmed = value.trim()
    if (!valueTrimmed) {
      emit('enable-disable-next', false)
      createMandateForm.siretNumber = ''
      createMandateForm.name = ''
    }
    createMandateForm.erpId = valueTrimmed.replace(/\D/ig, '')
  },
)
watch(
  () => createMandateForm.institutionCode,
  (value) => {
    const valueTrimmed = value.trim()
    if (valueTrimmed.length > 5) {
      createMandateForm.institutionCode = valueFormat(valueTrimmed, 5)
    }
  },
)

watch(
  () => createMandateForm.branchCode,
  (value) => {
    const valueTrimmed = value.trim()
    if (valueTrimmed.length > 5) {
      createMandateForm.branchCode = valueFormat(valueTrimmed, 5)
    }
  },
)

watch(
  () => createMandateForm.accountNumber,
  (value) => {
    const valueTrimmed = value.trim()
    if (valueTrimmed.length > 11) {
      createMandateForm.accountNumber = valueFormat(valueTrimmed, 11)
    }
  },
)

watch(
  () => createMandateForm.key,
  (value) => {
    const valueTrimmed = value.trim()
    if (valueTrimmed.length > 2) {
      createMandateForm.key = valueFormat(valueTrimmed, 2)
    }
  },
)

const valueFormat = (value: string, maxSizeAllowed: number) => {
  return value.slice(0, maxSizeAllowed)
}

const asyncEvery = async (array: string[], predicate: Function) => {
  for (const inputValue of array) {
    if (!await predicate(inputValue)) {
      return false
    }
  }
  return true
}

// Expose
defineExpose({
  createMandateForm,
  validateIBS,
})

</script>

<style lang="scss">
.create-mandate-form {
  .el-form-item__content {
    display: flex;
    align-items: start;
    flex-direction: column;
  }

  &__title-label {
    font-size: 12px;
    font-style: normal;
    color: var(--el-color-neutral-gray-900);
    line-height: 120%;

    &__asterisk {
      color: var(--el-color-functionnal-red);
    }
  }

  &__section-title {
    color: var(--el-color-neutral-gray-900);
    font-size: 16px;
    font-style: normal;
    line-height: 120%;
  }

  &_optional-title {
    font-size: 12px;
    font-style: normal;
    line-height: 120%;
    color: var(--el-color-neutral-gray-900);
  }

  &_optional {
    font-size: 12px;
    font-style: normal;
    line-height: 120%;
    color: var(--el-color-neutral-gray-500);
  }

  .el-input__inner::-webkit-inner-spin-button,
  .el-input__inner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>

<i18n lang="json">
  {
    "en-US": {
    "ibs-number": "IBS Number",
    "company-name": "Company name",
    "siret-number": "SIRET",
    "title": "Civility",
    "mister": "Mister",
    "madam": "Madam",
    "lastName": "Last name",
    "firstName": "First name",
    "email": "Email",
    "optional": " (optional)",
    "headquarters": "Headquarters",
    "address": "Address",
    "complement": "Address complement",
    "zipCode": "ZipCode",
    "city": "City",
    "country": "Country",
    "institutionCode": "Institution Code",
    "branchCode": "Branch Code",
    "accountNumber": "Account Number",
    "key": "Key",
    "bank": "Bank",
    "form": {
      "asterisk": "*",
      "error": {
        "requiredField": "Required field",
        "mandatoryChoice": "Mandatory choice",
        "input_5_chars": "Input must have exactly 5 numbers",
        "input_11_chars": "Input must have exactly 11 characters",
        "input_2_chars": "Input must have exactly 2 numbers",
        "only_numbers": "Input must contain only numbers",
        "alphanumeric_only": "Input must contain only numbers and letters",
        "bankingInfoNotRecognized": "The entered banking information is not recognized",
        "notListed": "This bank is not listed as a JeDéclare partner and requires data scrapping. We invite you to contact the ",
        "contactTeam": " teams for this.",
        "frFmMandat": "FR-FM-MesMandats",
        "correctEmail": "Please input correct email address",
        "validNumber": "Please input a valid number",
        "ibsNotFound": "IBS number not found.",
        "ibsFormatIssue": "The format of the IBS number entered is not recognized",
        "outWalletIBS": "The IBS must be part of your portfolio and have active engagement.",
        "nonScrappable": "This bank is not scrappable.",
        "serverError": "An error has occurred."
      }
    }
  },
  "fr-FR": {
    "ibs-number": "Numéro IBS",
    "company-name": "Raison sociale",
    "siret-number": "N° SIRET",
    "title": "Civilité",
    "mister": "Monsieur",
    "madam": "Madame",
    "lastName": "Prénom",
    "firstName": "Nom",
    "email": "Adresse mail",
    "optional": " (facultatif)",
    "headquarters": "Siège social",
    "address": "Adresse postale",
    "complement": "Complément d'adresse",
    "zipCode": "Code postal",
    "city": "Ville",
    "country": "Pays",
    "institutionCode": "Code établissement",
    "branchCode": "Code guichet",
    "accountNumber": "Numéro de compte",
    "key": "Clé",
    "bank": "Banque",
    "form": {
      "asterisk": "*",
      "error": {
        "requiredField": "Champ obligatoire",
        "mandatoryChoice": "Mandatory choice",
        "input_5_chars": "L'entrée doit avoir exactement 5 chiffres",
        "input_11_chars": "L'entrée doit avoir exactement 11 caractères",
        "input_2_chars": "L'entrée doit avoir exactement 2 chiffres",
        "only_numbers": "L'entrée doit contenir uniquement des chiffres",
        "alphanumeric_only": "L'entrée doit contenir uniquement des chiffres et des lettres",
        "bankingInfoNotRecognized": "Les informations bancaires saisies ne sont pas reconnues",
        "notListed": "Cette banque n'est pas listée comme partenaire JeDéclare et doit faire l'objet d'un scrapping de données. Nous vous invitons à contacter les équipes ",
        "contactTeam": " pour cela.",
        "frFmMandat": "FR-FM-MesMandats",
        "correctEmail": "Veuillez entrer une adresse e-mail valide",
        "validNumber": "Veuillez entrer un nombre valide",
        "ibsNotFound": "Le numéro IBS saisi n'est pas reconnu.",
        "ibsFormatIssue": "Le format du numéro IBS saisi n'est pas reconnu.",
        "outWalletIBS": "Le numéro d'IBS saisi doit faire partie de votre portefeuille et avoir un engagement actif.",
        "nonScrappable": "Cette banque n'est pas scrappable.",
        "serverError": "Une erreur est survenue."
      }
    }
  }
}
</i18n>
