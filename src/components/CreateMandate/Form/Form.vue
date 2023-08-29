<!-- eslint-disable max-len -->
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
      <!-- <PFormItem
        label="Age"
        prop="age"
        required>
        <PInput v-model="formValues.age" type="number" />
      </PFormItem> -->
      <!--  <PFormItem>
        <PButton type="primary" @click="handleSubmit(formRef)">
          Submit
        </PButton>
        <PButton @click="handleReset(formRef)">
            Reset
        </PButton>
      </PFormItem> -->
    </PForm>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    ibs-number: 'IBS Number'
    company-name: 'Company name'
    siret-number: 'SIRET'
    tooltip: 'The IBS number entered must be part of your portfolio and have an active commitment.'
  fr-FR:
    ibs-number: 'Numéro IBS'
    company-name: 'Raison sociale'
    siret-number: 'N° SIRET'
    tooltip: "Le numéro d’IBS saisi doit faire parti de votre
      portefeuille et avoir un engagement actif."
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { ref, reactive, watch } from 'vue'
import { createMandate } from '@/services/mandate'
import { PIQuestionCircle } from '@kpmg/styleguide'

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
      /* message: t('form.error.requiredField'), */
      message: 'test value',
      trigger: 'change'
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

watch(() => createMandateForm.ibs, async (newValue) => {
  if (newValue.toString().length === 10) {
    try {
      emit('loading-event-form')
      await mandate(newValue)
    } catch (_) {
    }
  }
})

const mandate = async (ibsNumber) => {
  try {
    const { data: { raisonSociale, siret } } = await createMandate(ibsNumber)
    createMandateForm.siret = siret
    createMandateForm.companyName = raisonSociale
    emit('next-step-event-form')
  } catch (_) {
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
}
</style>

