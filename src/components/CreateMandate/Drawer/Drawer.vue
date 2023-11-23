<template>
  <PDrawer
    v-model="drawerModel"
    :title="currentStep <= 3 ? `${t('new-collection')}`: ''"
    :showPreviousStep="false"
    size="50%"
    direction="rtl"
    class="drawer"
  >
    <PSteps
      v-if="currentStep <= 3"
          :active="currentStep-1"
          direction="horizontal"
          processStatus="process"
          finishStatus="success"
          class="drawer__stepper"
      >
        <PStepItem :title="t('entity')" />
        <PStepItem :title="t('infos')" />
        <PStepItem :title="t('banking-data')" />
      </PSteps>
    <h5 class="drawer__title" v-if="currentStep <= 3">
      <div v-if="currentStep === 1">
        {{ t('entity') }}
      </div>
      <div v-if="currentStep === 2">
        {{ t('signatory') }}
      </div>
      <div v-if="currentStep === 3">
        {{ t('bank-identity-statement') }}
      </div>
      <PTooltip
        :content="t('tooltip')"
        placement="top"
        v-if="currentStep === 1"
        >
        <PIcon class="drawer__tooltip" color="#A4A4A4">
          <PIQuestionCircle />
        </PIcon>
      </PTooltip>
    </h5>
    <Form
      v-if="currentStep <= 3"
      :step="currentStep"
      @enable-disable-next="handleNextAvailability"
      @enable-disable-validate="handleValidateAvailability"
      @update-mandate-model="updateMandateModel" />
    <DownloadMandate
      :mandateId="mandateId"
      v-if="currentStep > 3"
    />
    <template #footer>
      <div v-if="currentStep <= 3">
        <PButton
          v-if="currentStep === 2 || currentStep === 3"
          type="default"
          size="default"
          :plain="false"
          :round="false"
          :loading="false"
          data-testid="next-step-test"
          @click="goToPreviousStep()"
        >
        <PIcon class="el-button__icon--left">
          <PIArrowLeft />
        </PIcon>
          {{ t('previous') }}
        </PButton>
        <PButton
          v-if="currentStep === 3"
          class="margin-left--4"
          type="primary"
          size="default"
          :plain="false"
          :round="false"
          :loading="loading"
          :disabled="!validateAvailability"
          data-testid="validate-step-test"
          @click="submitMandate(mandateModel)"
        >
          {{ t('validate') }}
        </PButton>
        <PButton
          v-if="currentStep < 3"
          type="primary"
          size="default"
          :plain="false"
          :round="false"
          :disabled="!nextStepAvailability"
          :loading="false"
          data-testid="next-step-test"
          @click="goToNextStep()"
          class="margin-left--4"
        >
          {{ t('next') }}
          <PIcon class="el-button__icon--right">
            <PIArrowRight />
          </PIcon>
        </PButton>
      </div>
      <div v-else>
        <PButton
          type="primary"
          size="default"
          plain
          @click="closeDrawerAndInitStep()"
          data-testid="close-button-test"
        >
          {{ t('close-button') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<i18n lang="yaml">
    en-US:
      new-collection: 'New collection'
      next: 'Next'
      previous: 'Previous'
      validate: 'Validate'
      entity: 'Entity'
      signatory: 'Signatory'
      infos: 'Infos'
      banking-data: 'Banking data'
      bank-identity-statement: 'Bank identity statement'
      tooltip: 'The IBS number entered must be part of your
        portfolio and have an active commitment.'
      close-button: 'Close page'
    fr-FR:
      new-collection: 'Nouvelle collecte'
      next: 'Suivant'
      previous: 'Précédent'
      validate: 'Valider'
      entity: 'Entité'
      signatory: 'Signataire'
      infos: 'Infos'
      banking-data: 'Données bancaires'
      bank-identity-statement: "Relevé d’identité bancaire"
      tooltip: "Le numéro d’IBS saisi doit faire parti de
        votre portefeuille et avoir un engagement actif."
      close-button: 'Fermer la page'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { computed, ref, reactive } from 'vue'
import {
  PIArrowLeft,
  PIArrowRight,
  PIQuestionCircle,
  PDrawer,
  PSteps,
  PStepItem,
  PTooltip,
  PIcon,
  PButton
} from '@kpmg/styleguide'
import { createMandate } from '@/services/mandate'
import Form from '@/components/CreateMandate/Form'
import DownloadMandate from '@/components/CreateMandate/Download'
import type { CreateMandateModel } from '@/components/CreateMandate/Form/FormModels'

const currentStep = ref(1)
const nextStepAvailability = ref(false)
const validateAvailability = ref(false)
const mandateModel: CreateMandateModel = reactive({
  erpId: '',
  address: {
    street: '',
    addressComplement: '',
    zipCode: '',
    city: '',
    country: ''
  },
  signatory: {
    title: '',
    firstName: '',
    lastName: '',
    email: ''
  },
  bban: {
    bankCode: '',
    branchCode: '',
    accountNumber: '',
    checkDigits: ''
  }
})
const loading = ref(false)
const mandateId = ref('')

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Boolean
})

const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const goToNextStep = () => {
  if (currentStep.value === 1) {
    return currentStep.value++
  }
  nextStepAvailability.value = false
  currentStep.value++
}

const goToPreviousStep = () => {
  currentStep.value--
}

const handleNextAvailability = (availability: boolean) => {
  nextStepAvailability.value = availability
}

const handleValidateAvailability = (availability: boolean) => {
  validateAvailability.value = availability
}

const closeDrawerAndInitStep = () => {
  drawerModel.value = false
  currentStep.value = 1
}

const updateMandateModel = (mandate: CreateMandateModel) => {
  Object.assign(mandateModel, mandate)
}

const submitMandate = async (mandate: CreateMandateModel) => {
  try {
    loading.value = true
    const { data: { id } } = await createMandate(mandate)
    mandateId.value = id
    currentStep.value++
  } catch (error) {
  } finally {
    loading.value = false
  }
}

defineExpose({
  drawerModel,
  goToNextStep,
  currentStep,
  nextStepAvailability
})
</script>
<style lang="scss">
.drawer {
  &__title {
    display: flex;
    align-items: center;
    color: var(--pulse-color-neutral-gray-900);
    font-size: 1.6rem;
    font-style: normal;
    font-weight: 600;
    line-height: 120%;
    padding: 4px 0px;
    margin-bottom: 16px;
  }
  &__stepper {
    margin-bottom: 24px;
  }
  &__tooltip {
    margin-top: 1px;
    margin-left: 8px;
  }
}
</style>
