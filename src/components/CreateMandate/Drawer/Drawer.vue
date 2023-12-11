<template>
  <div>
    <PDrawer
      v-model="drawerModel"
      :pTitle="currentStep <= 3 ? `${t('new-collection')}` : ''"
      :pShowPreviousStep="false"
      pSize="50%"
      pDirection="rtl"
      class="drawer-create-mandate"
      :beforeClose="drawerBeforeClose"
      @close-drawer-button="drawerBeforeClose"
    >
      <PSteps
        v-if="currentStep <= 3"
        :active="currentStep - 1"
        direction="horizontal"
        processStatus="process"
        finishStatus="success"
        class="drawer-create-mandate__stepper"
      >
        <PStepItem :title="t('entity')" />
        <PStepItem :title="t('infos')" />
        <PStepItem :title="t('banking-data')" />
      </PSteps>
      <div v-if="currentStep <= 3" class="drawer-create-mandate__title">
        <h2 class="h3">
          <template v-if="currentStep === 1">
            {{ t('entity') }}
          </template>
          <template v-if="currentStep === 2">
            {{ t('signatory') }}
          </template>
          <template v-if="currentStep === 3">
            {{ t('bank-identity-statement') }}
          </template>
        </h2>
        <PTooltip
          v-if="currentStep === 1"
          :pContent="t('tooltip')"
          pPlacement="top"
        >
          <PIcon class="drawer-create-mandate__tooltip" color="#A4A4A4">
            <PIQuestionCircle />
          </PIcon>
        </PTooltip>
      </div>
      <Form
        v-if="currentStep <= 3"
        :step="currentStep"
        @enable-disable-next="handleNextAvailability"
        @enable-disable-validate="handleValidateAvailability"
        @update-mandate-model="updateMandateModel"
      />
      <DownloadMandate :mandateId="mandateId" v-if="currentStep > 3" />
      <template #footer>
        <div v-if="currentStep <= 3">
          <PButton
            v-if="currentStep === 2 || currentStep === 3"
            pType="default"
            pSize="default"
            :pPlain="false"
            :pRound="false"
            :pLoading="false"
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
            pType="primary"
            pSize="default"
            :pPlain="false"
            :pRound="false"
            :pLoading="loading"
            :pDisabled="!validateAvailability"
            data-testid="validate-step-test"
            @click="submitMandate(mandateModel)"
          >
            {{ t('validate') }}
          </PButton>
          <PButton
            v-if="currentStep < 3"
            pType="primary"
            pSize="default"
            :pPlain="false"
            :pRound="false"
            :pDisabled="!nextStepAvailability"
            :pLoading="false"
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
            pType="primary"
            pSize="default"
            pPlain
            @click="closeDrawerAndInitStep()"
            data-testid="close-button-test"
          >
            {{ t('close-button') }}
          </PButton>
        </div>
      </template>
    </PDrawer>
    <PDialog
      v-model="pDialogControl.dialogVisible"
      :pWidth="pDialogControl.dialogWidth"
      :pModal="pDialogControl.dialogModal"
      :pCenter="pDialogControl.dialogCenter"
      :pBeforeClose="closeDialogDrawer"
      :dialogCloseOnClickModal="pDialogControl.dialogCloseOnClickModal"
      :dialogCloseOnPressEscape="pDialogControl.dialogCloseOnPressEscape"
      :pTitle="t('title-popup')"
    >
      <template #footer>
        <div class="p-dialog__footer">
          <PButton
            pType="primary"
            pSize="small"
            pPlain
            :pRound="false"
            :pDisabled="false"
            :pLoading="false"
            @click="pDialogControl.dialogVisible = false"
          >
            {{ t('cancel-popup') }}
          </PButton>
          <PButton
            pType="primary"
            pSize="small"
            :pPlain="false"
            :pRound="false"
            :pDisabled="false"
            :pLoading="false"
            @click="closeDialogDrawer()"
            class="margin-left--4"
          >
            {{ t('exit-popup') }}
          </PButton>
        </div>
      </template>
      <p class="p-dialog__text">
        {{ t('text-popup') }}
      </p>
    </PDialog>
  </div>
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
    title-popup: 'Exit mandate creation ?'
    text-popup: 'You are about to exit the mandate creation path,
      all progress will be lost. Do you want to leave the course?'
    cancel-popup: 'Cancel'
    exit-popup: 'Exit'
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
    title-popup: 'Quitter la création de mandat ?'
    text-popup: 'Vous êtes sur le point de quitter le parcours de création de mandat,
      toute progression sera perdue. Souhaitez-vous quitter le parcours ?'
    cancel-popup: 'Annuler'
    exit-popup: 'Quitter'
</i18n>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import {
  PButton,
  PDrawer,
  PDialog,
  PIcon,
  PIArrowLeft,
  PIArrowRight,
  PIQuestionCircle,
  PStepItem,
  PSteps,
  PTooltip
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
  locale: 'en-US',
  useScope: 'local'
})

const pDialogControl = reactive({
  dialogVisible: false,
  dialogWidth: '40%',
  dialogModal: true,
  dialogCenter: false,
  dialogShowClose: true,
  dialogCloseOnClickModal: false,
  dialogCloseOnPressEscape: true,
  dialogCustomClass: 'my-dialog-class'
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
    return ++currentStep.value
  }
  nextStepAvailability.value = false
  ++currentStep.value
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

const drawerBeforeClose = (done: any) => {
  if (currentStep.value <= 3) {
    pDialogControl.dialogVisible = true
    return
  }
  done()
  closeDrawerAndInitStep()
}

const closeDialogDrawer = () => {
  pDialogControl.dialogVisible = false
  closeDrawerAndInitStep()
}

const updateMandateModel = (mandate: CreateMandateModel) => {
  Object.assign(mandateModel, mandate)
}

const submitMandate = async (mandate: CreateMandateModel) => {
  try {
    loading.value = true
    const {
      data: { id }
    } = await createMandate(mandate)
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
.drawer-create-mandate {
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
