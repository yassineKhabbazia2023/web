<!-- eslint-disable max-len -->
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
        <PFormItem prop="ibs">
          <template #label>
            <label class="create-mandate-form__ibs-label">{{
              t('ibs-number')
            }}</label>
            <PTooltip :content="t('tooltip')" placement="top">
              <PIcon> <PIQuestionCircle /> </PIcon>
            </PTooltip>
          </template>
          <PInput v-model="createMandateForm.ibs" type="number" />
        </PFormItem>
        <div>
          <el-row :gutter="8">
            <el-col :span="12">
              <PFormItem inline :label="t('company-name')">
                <PInput
                  v-model="createMandateForm.companyName"
                  disabled>
                </PInput>
              </PFormItem>
            </el-col>
            <el-col :span="12">
              <PFormItem
                inline
                :label="t('siret-number')"
                disabled>
                <PInput
                  v-model="createMandateForm.siret"
                  state="default"
                  disabled
                >
                </PInput>
              </PFormItem>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-if="step === 2">
        <h5 class="create-mandate-form__section-title">
          {{t('signatory')}}
        </h5>
        <PFormItem prop="title">
          <template #label>
            <label class="create-mandate-form__title-label">{{
              t('title')
            }}</label>
          </template>
          <PRadio v-model="createMandateForm.title" :label="t('mister')">
            {{ t('mister') }}
          </PRadio>
          <PRadio v-model="createMandateForm.title" :label="t('madam')">
            {{ t('madam') }}
          </PRadio>
        </PFormItem>
        <div>
          <el-row :gutter="8">
            <el-col :span="12">
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
            </el-col>
            <el-col :span="12">
              <PFormItem
                prop="firstName"
                inline
                :label="t('firstName')">
                <PInput v-model="createMandateForm.firstName">
                </PInput>
              </PFormItem>
            </el-col>
          </el-row>
        </div>
        <PFormItem
          inline
          :label="`${t('email')} (${t('optional')})`"
          disabled>
          <PInput
            v-model="createMandateForm.email"
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
          :label="`${t('complement')} (${t('optional')})`"
          disabled>
          <PInput
            v-model="createMandateForm.addressComplement"
            state="default">
          </PInput>
        </PFormItem>
        <div>
          <el-row :gutter="8">
            <el-col :span="8">
              <PFormItem
                prop="zipCode"
                inline
                :label="t('zipCode')"
                disabled>
                <PInput
                  v-model="createMandateForm.zipCode"
                  state="default">
                </PInput>
              </PFormItem>
            </el-col>
            <el-col :span="16">
              <PFormItem
                prop="city"
                inline
                :label="t('city')">
                <PInput v-model="createMandateForm.city">
                </PInput>
              </PFormItem>
            </el-col>
          </el-row>
        </div>
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
    </PForm>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    ibs-number: 'IBS Number'
    company-name: 'Company name'
    siret-number: 'SIRET'
    tooltip: 'The IBS number entered must be part of your portfolio and have an active commitment.'
    signatory: 'Signatory'
    title: 'Civility'
    mister: 'Mister'
    madam: 'Madam'
    lastName: 'Last name'
    firstName: 'First name'
    email: 'Email'
    optional: 'optional'
    headquarters: 'Headquarters'
    address: 'Address'
    complement: 'Address complement'
    zipCode: 'Postal Code'
    city: 'City'
    country: 'Country'
  fr-FR:
    ibs-number: 'Numéro IBS'
    company-name: 'Raison sociale'
    siret-number: 'N° SIRET'
    tooltip: "Le numéro d’IBS saisi doit faire parti de votre
      portefeuille et avoir un engagement actif."
    signatory: 'Signataire'
    title: 'Civilité'
    mister: 'Monsieur'
    madam: 'Madame'
    lastName: 'Prénom'
    firstName: 'Nom'
    email: 'Adresse mail'
    optional: 'facultatif'
    headquarters: 'Siège social'
    address: 'Adresse postale'
    complement: 'Complément d''addresse'
    zipCode: 'Code postal'
    city: 'Ville'
    country: 'Pays'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { ref, reactive, watch, computed } from 'vue'
import { createMandate } from '@/services/mandate'
import { PIQuestionCircle } from '@kpmg/styleguide'
import { FormModel, Rules } from './FormModels'

interface FormProps {
  step: number
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const createMandateFormRef = ref<any>()
const createMandateForm = reactive<FormModel>({
  ibs: '',
  siret: '',
  companyName: '',
  title: '',
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  addressComplement: '',
  zipCode: '',
  city: '',
  country: ''
})

const areFieldsFilled = computed(() => {
  const fieldsToCheck = [
    // 'title',
    'firstName',
    'lastName',
    'address',
    'zipCode',
    'city',
    'country'
  ]

  return fieldsToCheck.every(field => createMandateForm[field].trim() !== '')
})

const checkAndEmitEvents = () => {
  if (areFieldsFilled.value) {
    emit('next-step-event-form')
  } else {
    emit('loading-event-form')
  }
}

watch(() => props.step, checkAndEmitEvents)
watch(areFieldsFilled, checkAndEmitEvents)

const handleIbsChange = async (newIbsValue: string) => {
  if (newIbsValue.toString().length === 10) {
    try {
      emit('loading-event-form')
      await mandate(newIbsValue)
    } catch (error) {
      console.error('Error in handleIbsChange:', error)
    }
  }
}

watch(() => createMandateForm.ibs, handleIbsChange)

const emit = defineEmits(['next-step-event-form', 'loading-event-form'])

const props = defineProps<FormProps>()

const rules = reactive<Rules>({
  ibs: [
    {
      required: true,
      message: 'test value',
      trigger: 'change'
    }
  ],
  title: [
    {
      required: true,
      message: 'Choix obligatoire',
      trigger: 'change'
    }
  ],
  firstName: [
    {
      required: true,
      message: 'Champs obligatoire',
      trigger: 'blur'
    }
  ],
  lastName: [
    {
      required: true,
      message: 'Champs obligatoire',
      trigger: 'blur'
    }
  ],
  address: [
    {
      required: true,
      message: 'Champs obligatoire',
      trigger: 'blur'
    }
  ],
  zipCode: [
    {
      required: true,
      message: 'Champs obligatoire',
      trigger: 'blur'
    }
  ],
  city: [
    {
      required: true,
      message: 'Champs obligatoire',
      trigger: 'blur'
    }
  ],
  country: [
    {
      required: true,
      message: 'Champs obligatoire',
      trigger: 'blur'
    }
  ]
})

const mandate = async (ibsNumber: string) => {
  try {
    const {
      data: {
        raisonSociale: companyName,
        siret,
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
    } = await createMandate(ibsNumber)

    Object.assign(createMandateForm, {
      siret,
      companyName,
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

    emit('next-step-event-form')
  } catch (error) {
    console.error('Error creating mandate:', error)
  }
}
</script>

<style lang="scss" scoped>
.create-mandate-form {
  &__ibs {
    display: flex;
    &-label {
      padding-right: 8px;
    }
  }

  &__section-title {
    margin: 24px 0px 16px 0px;
    color: var(--el-color-neutral-gray-900);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
  }
}
</style>

