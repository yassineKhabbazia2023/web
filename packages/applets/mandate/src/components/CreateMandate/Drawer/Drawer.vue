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
      @close-drawer-button="drawerBeforeClose(()=> {})"
    >
      <PSteps
        v-if="currentStep <= 3"
        :active="currentStep - 1"
        direction="horizontal"
        processStatus="process"
        finishStatus="success"
        class="margin-bottom--6"
      >
        <PStep :title="t('entity')" />
        <PStep :title="t('infos')" />
        <PStep :title="t('banking-data')" />
      </PSteps>
      <div
        v-if="currentStep <= 3"
        class="drawer-create-mandate__title margin-bottom--4 padding-x--0 padding-y--1"
      >
        <p class="font-large">
          <template v-if="currentStep === 1">
            {{ t('entity') }}
          </template>
          <template v-if="currentStep === 2">
            {{ t('signatory') }}
          </template>
          <template v-if="currentStep === 3">
            {{ t('bank-identity-statement') }}
          </template>
        </p>
        <PTooltip
          v-if="currentStep === 1"
          :pContent="t('tooltip')"
          pPlacement="top"
        >
          <PIcon
            class="drawer-create-mandate__tooltip margin-left--2"
            :color="AppColors.GRAY_300"
            pName="questionCircle"
          />
        </PTooltip>
      </div>
      <Form
        v-if="currentStep <= 3"
        :step="currentStep"
        :creationMandateError="creationErrorToDisplay"
        @enable-disable-next="handleNextAvailability"
        @enable-disable-validate="handleValidateAvailability"
        @update-mandate-model="updateMandateModel"
      />
      <Download
        v-if="currentStep > 3"
        :mandateId="mandateId"
        class="padding-top--4"
        @close-drawer="closeDialogDrawer"
      />
      <template #footer>
        <div v-if="currentStep <= 3">
          <PButton
            v-if="currentStep === 2 || currentStep === 3"
            pType="default"
            pSize="default"
            :pLoading="false"
            data-testid="previous-step-test"
            @click="goToPreviousStep()"
          >
            <PIcon class="el-button__icon--left" pName="arrowLeft" />
            {{ t('previous') }}
          </PButton>
          <PButton
            v-if="currentStep === 3"
            class="margin-left--4"
            pType="primary"
            pSize="default"
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
            :pDisabled="!nextStepAvailability"
            data-testid="next-step-test"
            class="margin-left--4"
            @click="goToNextStep()"
          >
            {{ t('next') }}
            <PIcon class="el-button__icon--right" pName="arrowRight" />
          </PButton>
        </div>
        <div v-else>
          <PButton
            pType="primary"
            pSize="default"
            pPlain
            data-testid="close-button-test"
            @click="closeDrawerAndInitStep()"
          >
            {{ t('close-button') }}
          </PButton>
        </div>
      </template>
    </PDrawer>
    <PDialog
      v-if="pDialogControl.dialogVisible"
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
            pType="secondary"
            pSize="small"
            pPlain
            data-testid="cancel-dialog-test"
            @click="pDialogControl.dialogVisible = false"
          >
            {{ t('cancel-popup') }}
          </PButton>
          <PButton
            pType="primary"
            pSize="small"
            data-testid="quit-dialog-test"
            class="margin-left--4"
            @click="closeDialogDrawer"
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

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import {
  PButton,
  PDrawer,
  PDialog,
  PIcon,
  PStep,
  PSteps,
  PTooltip,
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { createMandate } from '@mandate/services/mandate'
import Form from '@mandate/components/CreateMandate/Form'
import Download from '@mandate/components/CreateMandate/Download'
import type { CreateMandateModel } from '@mandate/components/CreateMandate/Form/FormModels'
import { AmplitudeService } from '@pulse/common/services/amplitude'

const currentStep = ref(1)
const nextStepAvailability = ref(false)
const validateAvailability = ref(false)
const creationErrorToDisplay = ref('')
const mandateModel: CreateMandateModel = reactive({
  erpId: '',
  address: {
    street: '',
    addressComplement: '',
    zipCode: '',
    city: '',
    country: '',
  },
  signatory: {
    title: '',
    firstName: '',
    lastName: '',
    email: '',
  },
  bban: {
    bankCode: '',
    branchCode: '',
    accountNumber: '',
    checkDigits: '',
  },
  destinationTool: '',
})
const loading = ref(false)
const mandateId = ref('')

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const pDialogControl = reactive({
  dialogVisible: false,
  dialogWidth: '440px',
  dialogModal: true,
  dialogCenter: false,
  dialogShowClose: true,
  dialogCloseOnClickModal: false,
  dialogCloseOnPressEscape: true,
  dialogCustomClass: 'my-dialog-class',
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
  'new-mandate-created': []
}>()

type DrawerProps = {
  modelValue: boolean
}

const props = defineProps<DrawerProps>()

const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
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
  if (currentStep.value === 4) {
    emit('new-mandate-created')
  }
  drawerModel.value = false
  currentStep.value = 1
}

const drawerBeforeClose = (done: any) => {
  if (mandateModel.erpId && currentStep.value < 4) {
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
      data: { id },
    } = await createMandate(mandate)
    mandateId.value = id
    ++currentStep.value
    creationErrorToDisplay.value = ''
    trackMandateCreation('success')
  } catch (error: any) {
    trackMandateCreation('failed')
    if (error.response) {
      creationErrorToDisplay.value = error.response.data.message
    } else if (error.request) {
      creationErrorToDisplay.value = error.request
    } else {
      creationErrorToDisplay.value = error.message
    }
  } finally {
    loading.value = false
  }
}

function trackMandateCreation(result: 'success' | 'failed') {
  AmplitudeService.track('Bank Mandate Creation Completed', {
    bank_mandate_creation_result: result,
  })
}

defineExpose({
  validateAvailability,
  nextStepAvailability,
  currentStep,
})
</script>

<style lang="scss">
.drawer-create-mandate {
  &__title {
    display: flex;
    align-items: center;
    color: var(--el-color-neutral-gray-900);
    font-style: normal;
    line-height: 120%;
  }
  &__tooltip {
    margin-top: 1px;
  }
}
</style>
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
    tooltip: 'The customer code entered must be part of your
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
    tooltip: "Le code client saisi doit faire parti de
      votre portefeuille et avoir un engagement actif."
    close-button: 'Fermer la page'
    title-popup: 'Quitter la création de mandat ?'
    text-popup: 'Vous êtes sur le point de quitter le parcours de création de mandat,
      toute progression sera perdue. Souhaitez-vous quitter le parcours ?'
    cancel-popup: 'Annuler'
    exit-popup: 'Quitter'
</i18n>
