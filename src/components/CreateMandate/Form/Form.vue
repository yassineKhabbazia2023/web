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
          validateStatus="primary"
          required>
          <PInput v-model="createMandateForm.ibs" type="number">
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
        <div>
          <el-row :gutter="8">
            <el-col :span="12">
              <PFormItem inline :label="t('company-name')">
                <PInput v-model="createMandateForm.companyName" disabled>
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
    </PForm>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    ibs-number: 'IBS Number'
    company-name: 'Company name'
    siret-number: 'SIRET'
    form:
      error:
        requiredField: 'Required field'
  fr-FR:
    ibs-number: 'Numéro IBS'
    company-name: 'Raison sociale'
    siret-number: 'N° SIRET'
    form:
      error:
        requiredField: 'Champ obligatoire'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { ref, reactive } from 'vue'
import { createMandate } from '@/services/mandate'
import { PICheck } from '@kpmg/styleguide'

const isIBSValid = ref(false)

const validateIBS = async (rule: any, value: any, callback: any) => {
  emit('loading-event-form')
  isIBSValid.value = false
  createMandateForm.siret = ''
  createMandateForm.companyName = ''
  if (value.toString().length === 10) {
    await getDataByIbsNumber(value)
    // callback(new Error('Please input the password again'))
  } else {
    callback()
  }
}

interface FormProps {
  step: number
}

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const createMandateFormRef = ref<any>()
const createMandateForm = reactive({
  ibs: '',
  siret: '',
  companyName: ''
})
const emit = defineEmits(['next-step-event-form', 'loading-event-form'])

defineProps<FormProps>()

const rules = reactive<any>({
  ibs: [
    {
      required: true,
      message: t('form.error.requiredField'),
      trigger: 'change'
    },
    {
      validator: validateIBS, trigger: 'change'
    }
  ]
  /* jobRank: [
    {
      required: true,
      message: t('payroll.commonForm.error.requiredField'),
      trigger: 'change'
    }
  ],
  amount: [
    {
      required: true,
      message: t('payroll.commonForm.error.requiredField'),
      trigger: 'blur'
    },
    { validator: validateAndSanitizeAmountInput, trigger: 'blur' }
  ] */
})

/* watch(() => createMandateForm.ibs, async (newValue) => {
  emit('loading-event-form')
  if (newValue.toString().length === 10) {
    try {
      return await mandate(newValue)
    } catch (_) {
    }
  }
  isIBSValid.value = false
  createMandateForm.siret = ''
  createMandateForm.companyName = ''
}) */

const getDataByIbsNumber = async (ibsNumber) => {
  try {
    const { data: { name, siretNumber } } = await createMandate(ibsNumber)
    /* const { data: { id, name, siretNumber, signatory } } = await createMandate(ibsNumber) */
    isIBSValid.value = false
    if (createMandateForm.ibs.toString().length === 10) {
      createMandateForm.siret = siretNumber
      createMandateForm.companyName = name
      isIBSValid.value = true
      emit('next-step-event-form')
    }
  } catch (_) {
  }
}

</script>
<style lang="scss">
.create-mandate-form {
  &__ibs {
    display: flex;
    &-label {
      padding-right: 8px;
    }
  }
  .el-input__inner::-webkit-inner-spin-button,
  .el-input__inner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
}
</style>

