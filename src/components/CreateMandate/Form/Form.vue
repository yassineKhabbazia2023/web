<template>
  <div>
    <PForm
      ref="createMandateFormRef"
      :rules="rules"
      :model="createMandateForm"
      requireAsteriskPosition="right"
      labelPosition="top"
      class="create-mandate-form"
    >
      <div v-if="step === 1">
        <PFormItem
          prop="ibs"
          :label="t('ibs-number')"
          required>
          <PInput
            v-model="createMandateForm.ibs"
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
                  disabled>
                </PInput>
              </PFormItem>
            </PCol>
            <PCol :span="12">
              <PFormItem
                inline
                :label="t('siret-number')"
                disabled>
                <PInput
                  data-testid="siretNumber-input-test"
                  v-model="createMandateForm.siretNumber"
                  state="default"
                  disabled
                >
                </PInput>
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
          <PRadio v-model="createMandateForm.title" label="M">
            {{ t('mister') }}
          </PRadio>
          <PRadio v-model="createMandateForm.title" label="Mme">
            {{ t('madam') }}
          </PRadio>
        </PFormItem>
          <PRow :gutter="8">
            <PCol :span="12">
              <PFormItem
                prop="lastName"
                inline
                :label="t('lastName')"
                disabled>
                <PInput
                  v-model="createMandateForm.lastName"
                  state="default">
                </PInput>
              </PFormItem>
            </PCol>
            <PCol :span="12">
              <PFormItem
                prop="firstName"
                inline
                :label="t('firstName')">
                <PInput
                  v-model="createMandateForm.firstName"
                  data-testid="firstName-test">
                </PInput>
              </PFormItem>
            </PCol>
          </PRow>
        <PFormItem
          prop="email"
          inline
          disabled>
          <template #label>
            <span class="create-mandate-form_optional-title">{{t('email')}} </span>
            <span class="create-mandate-form_optional">{{t('optional')}}</span>
          </template>
          <PInput
            v-model="createMandateForm.email"
            data-testid="email-test"
            state="default">
          </PInput>
        </PFormItem>
        <h5 class="create-mandate-form__section-title">
          {{t('headquarters')}}
        </h5>
        <PFormItem
          prop="address"
          inline
          :label="`${t('address')}`"
          disabled>
          <PInput
            v-model="createMandateForm.address"
            state="default">
          </PInput>
        </PFormItem>
        <PFormItem
          prop="addressComplement"
          inline
          disabled>
          <template #label>
            <span class="create-mandate-form_optional-title">{{t('complement')}} </span>
            <span class="create-mandate-form_optional">{{t('optional')}}</span>
          </template>
          <PInput
            v-model="createMandateForm.addressComplement"
            state="default">
          </PInput>
        </PFormItem>
          <PRow :gutter="8">
            <PCol :span="8">
              <PFormItem
                prop="zipCode"
                inline
                :label="t('zipCode')"
                disabled>
                <PInput
                  v-model="createMandateForm.zipCode"
                  data-testid="zipCode-test"
                  state="default">
                </PInput>
              </PFormItem>
            </PCol>
            <PCol :span="16">
              <PFormItem
                prop="city"
                inline
                :label="t('city')">
                <PInput v-model="createMandateForm.city">
                </PInput>
              </PFormItem>
            </PCol>
          </PRow>
        <PFormItem
          prop="country"
          inline
          :label="`${t('country')}`"
          disabled>
          <PInput
            v-model="createMandateForm.country"
            state="default">
          </PInput>
        </PFormItem>
      </div>
      <div v-if="step === 3">
        <PRow :gutter="8">
          <PCol :span="12">
            <PFormItem
              prop="institutionCode"
              inline
              :label="`${t('institutionCode')}`"
              :showMessage="validationError ? false : true"
              :validateStatus="validationError ? 'error' : ''"
              disabled>
              <PInput
                data-testid="institutionCode-input-test"
                v-model="createMandateForm.institutionCode"
                @blur="checkFields"
                state="default">
              </PInput>
            </PFormItem>
          </PCol>
          <PCol :span="12">
            <PFormItem
              prop="branchCode"
              inline
              :label="`${t('branchCode')}`"
              :showMessage="validationError ? false : true"
              :validateStatus="validationError ? 'error' : ''"
              disabled>
              <PInput
                data-testid="branchCode-input-test"
                v-model="createMandateForm.branchCode"
                @blur="checkFields"
                state="default">
              </PInput>
            </PFormItem>
          </PCol>
        </PRow>
        <PRow :gutter="8">
          <PCol :span="18">
            <PFormItem
              prop="accountNumber"
              inline
              :label="`${t('accountNumber')}`"
              :error="customErrorMessage"
              :validateStatus="validationError ? 'error' : ''"
              disabled>
              <PInput
                data-testid="accountNumber-input-test"
                v-model="createMandateForm.accountNumber"
                @blur="checkFields"
                state="default">
              </PInput>
            </PFormItem>
          </PCol>
          <PCol :span="6">
            <PFormItem
              prop="key"
              inline
              :label="`${t('key')}`"
              :showMessage="validationError ? false : true"
              :validateStatus="validationError ? 'error' : ''"
              disabled>
              <PInput
                data-testid="key-input-test"
                v-model="createMandateForm.key"
                @blur="checkFields"
                state="default">
              </PInput>
            </PFormItem>
          </PCol>
        </PRow>
        <PFormItem
          prop="bank"
          inline
          :label="`${t('bank')}`"
          disabled>
          <PInput
            data-testid="bank-input-test"
            v-model="createMandateForm.bank"
            state="default"
            disabled>
          </PInput>
        </PFormItem>
        <PAlert type="danger" v-if="isScrapable">
          {{ t('form.error.notListed') }}
          <span class="create-mandate-form__content--bold">
            {{ t('form.error.frFmMandat') }}
          </span>
          {{ t('form.error.contactTeam') }}
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
</i18n>

<script setup lang='ts'>
// Imports
import { useI18n } from 'vue-i18n'
import { ref, reactive, watch, computed, nextTick } from 'vue'
import { createMandate, validateIban, getBankDetail } from '@/services/mandate'
import { FormModel, Rule } from './FormModels'
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

// Reactive state
const createMandateFormRef = ref<any>()
const createMandateForm = reactive<FormModel>({
  ibs: '',
  siretNumber: '',
  name: '',
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  address: '',
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
const isScrapable = ref(false)

// Computed properties
const areFieldsFilled = computed(() => {
  const fieldsToCheck = [
    'title',
    'firstName',
    'lastName',
    'address',
    'zipCode',
    'city',
    'country'
  ]

  return fieldsToCheck.every(field => createMandateForm[field].trim() !== '')
})

// Methods
const validateIBS = async (_: Rule, value: string, callback: any) => {
  emit('enable-disable-next', false)
  isIBSValid.value = false
  createMandateForm.siret = ''
  createMandateForm.companyName = ''
  if (value.toString().length === 10) {
    await getDataByIbsNumber(value)
  } else {
    callback()
  }
}

const getDataByIbsNumber = async (ibsNumber: string) => {
  try {
    const {
      data: {
        name,
        siretNumber,
        signatory: {
          title,
          firstName,
          lastName,
          email,
          address: {
            street: address,
            complements: addressComplement,
            zipCode,
            city,
            country
          }
        }
      }
    } = await createMandate({ ibsNumber })
    isIBSValid.value = false
    if (createMandateForm.ibs.toString().length === 10) {
      Object.assign(createMandateForm, {
        siretNumber,
        name,
        title,
        firstName,
        lastName,
        email,
        address,
        addressComplement,
        zipCode,
        city,
        country
      })
      isIBSValid.value = true
      emit('enable-disable-next', true)
    }
  } catch (_) {
  }
}

const checkAndEmitEvents = () => {
  if (areFieldsFilled.value) {
    emit('enable-disable-next', true)
  } else {
    emit('enable-disable-next', false)
  }
}

const checkRibValidity = async (rib: string) => {
  const { valid } = await validateIban(rib)

  if (!valid) {
    customErrorMessage.value = t('form.error.bankingInfoNotRecognized')
    validationError.value = true
    createMandateForm.bank = ''
    emit('enable-disable-validate', false)
  }

  return valid
}

const getBankInformation = async (rib: string) => {
  const bank: any = await getBankDetail(rib)
  if (bank.jeDeclare.isScrapable) {
    isScrapable.value = true
    createMandateForm.bank = ''
    emit('enable-disable-validate', false)
    return
  }

  isScrapable.value = false
  createMandateForm.bank = bank.name
  emit('enable-disable-validate', true)
}

const resetValidation = () => {
  emit('enable-disable-validate', false)
  createMandateForm.bank = ''
  customErrorMessage.value = ''
  validationError.value = false
  isScrapable.value = false
}

const checkFields = async () => {
  const fieldsToValidate = ['institutionCode', 'branchCode', 'accountNumber', 'key']
  const allFieldsFilled = fieldsToValidate.every(field => createMandateForm[field] !== '')

  if (!allFieldsFilled) {
    resetValidation()
    return
  }

  await nextTick()
  createMandateFormRef?.value?.validateField(fieldsToValidate, async (_: any) => {
    resetValidation()
    const rib = [
      createMandateForm.institutionCode,
      createMandateForm.branchCode,
      createMandateForm.accountNumber,
      createMandateForm.key
    ].join('')
    if (rib.length !== 23) {
      return
    }
    const validity = await checkRibValidity(rib)
    if (!validity) {
      return
    }
    await getBankInformation(rib)
  })
}

// Utility functions
const createRule = (message: string, trigger = 'blur') => ({
  required: true,
  message: t(message),
  trigger
})

const createValidator = (
  length: number,
  regex: any,
  errorMsg: string,
  customError: any,
  regexErrorMsg?: string) => ({
  required: true,
  validator: (_: any, value: string, callback: any) => {
    if (value.length !== length) {
      callback(new Error(errorMsg))
    } else if (!regex.test(value)) {
      callback(new Error(regexErrorMsg))
    } else if (customError.value) {
      callback(new Error(t('form.error.bankingInfoNotRecognized')))
    } else {
      callback()
    }
  },
  trigger: 'blur'
})

const validateEmail = (_: any, value: string, callback: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (value === '') {
    callback()
    emit('enable-disable-next', true)
  } else if (!emailRegex.test(value)) {
    callback(new Error(t('form.error.correctEmail')))
    emit('enable-disable-next', false)
  } else {
    callback()
    emit('enable-disable-next', true)
  }
}

// Validation rules
const rules = reactive<any>({
  ibs: [
    createRule(t('form.error.requiredField'), 'change'),
    { validator: validateIBS, trigger: 'change' }
  ],
  title: [createRule(t('form.error.mandatoryChoice'), 'change')],
  firstName: [createRule(t('form.error.requiredField'))],
  lastName: [createRule(t('form.error.requiredField'))],
  address: [createRule(t('form.error.requiredField'))],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  zipCode: [
    createRule(t('form.error.requiredField')),
    {
      validator: (_: any, value: any, callback: any) => {
        if (isNaN(value)) {
          callback(new Error(t('form.error.validNumber')))
          emit('enable-disable-next', false)
        } else {
          callback()
          emit('enable-disable-next', true)
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
      /^\d+$/, t('form.error.input_5_chars'),
      validationError,
      t('form.error.only_numbers')
    )
  ],
  branchCode: [
    createValidator(
      5,
      /^\d+$/,
      t('form.error.input_5_chars'),
      validationError,
      t('form.error.only_numbers')
    )
  ],
  accountNumber: [
    createValidator(
      11,
      /^[a-zA-Z0-9]+$/,
      t('form.error.input_11_chars'),
      validationError,
      t('form.error.alphanumeric_only')
    )
  ],
  key: [
    createValidator(
      2,
      /^\d+$/,
      t('form.error.input_2_chars'),
      validationError,
      t('form.error.only_numbers')
    )
  ]
})

// Watchers
watch(() => props.step, checkAndEmitEvents)
watch(areFieldsFilled, checkAndEmitEvents)
watch(() => createMandateForm.ibs, (value) => {
  createMandateForm.ibs = value.replace(/[^0-9]/i, '')
})

// Emits
const emit = defineEmits(['enable-disable-next', 'enable-disable-validate'])

// Expose
defineExpose({
  createMandateForm,
  validateIBS,
  checkAndEmitEvents
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
