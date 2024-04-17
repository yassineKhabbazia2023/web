<template>
  <PDrawer
    class="delegation-drawer"
    v-model="isDelegationDrawerOpened"
    @close-drawer-button="closeDrawer"
    @close="closeDrawer"
  >
    <template #header-prefix>
      <h3 class="delegation-drawer__header">
        <template v-if="!isSpecificDelegationFlowType">
          {{ t('walletDelegation') }}
        </template>
        <template v-else>
          {{ t('folderDelegation', selectedFolders.length) }}
        </template>
      </h3>
    </template>

    <PSteps
      v-if="!isSpecificDelegationFlowType"
      class="margin-bottom--6"
      :pActive="activeStep"
      pFinishStatus="success"
    >
      <PStep :title="t('addColaborator')" />
      <PStep :title="t('automaticDelegation')" />
    </PSteps>

    <div
      v-if="isSpecificDelegationFlowType"
      class="margin-bottom--6"
    >
      <CollapsableFoldersList
        v-if="selectedFolders.length > 1"
      >
        <SelectedFoldersList :folders="selectedFolders" />
      </CollapsableFoldersList>

      <SelectedFoldersList
        v-else
        :folders="selectedFolders"
      />
    </div>

    <AddDelegatesStep
      v-if="activeStep === 0"
      :numberOfFoldersInPortfolio="numberOfFoldersInPortfolio"
      :shouldDisplayNumberOfFoldersInPortfolio="!isSpecificDelegationFlowType"
      @collaborator-selection="handleCollaboratorSelection"
    />

    <DelegationPreviewList
      v-else-if="activeStep === 1"
      v-model="delegationDetails"
    />

    <template #footer>
      <NextPreviousButtons
        :previousLabel="previousButtonLabel"
        :nextLabel="isSpecificDelegationFlowType ? t('submitButtonLabel') : nextButtonLabel"
        :isNextButtonDisabled="!selectedCollaborators.length"
        @click-previous="handlePreviousClick"
        @click-next="handleNextClick"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PSteps, PStep, PICheck, PNotification, PIX } from '@kpmg/styleguide'
import { commonApi, commonStore } from '@kpmg/common'
import { DelegationFlowType } from './DelegationDrawerTypes'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'

import NextPreviousButtons from '@/components/NextPreviousButtons'
import AddDelegatesStep from './components/AddDelegatesStep'
import type { Contact } from '@/services/contact/contactTypes'
import DelegationPreviewList from './components/DelegationPreviewList'
import CollapsableFoldersList from './components/CollapsableFoldersList'
import SelectedFoldersList from './components/SelectedFoldersList'
import type { DelegationDetails } from './models/Delegation'

const props = defineProps<DelegationDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeStep = ref<number>(0)
const delegationDetails = ref<DelegationDetails[]>([])

const isDelegationDrawerOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const flowType = computed(() => props.selectedFolders.length
  ? DelegationFlowType.SPECIFIC
  : DelegationFlowType.FULL,
)
const isSpecificDelegationFlowType = computed(() => flowType.value === DelegationFlowType.SPECIFIC)

const previousButtonLabel = computed(() => activeStep.value ? t('previousButtonLabel') : t('cancelButtonLabel'))
const nextButtonLabel = computed(() => activeStep.value === 1 ? t('submitButtonLabel') : t('nextButtonLabel'))

function handlePreviousClick() {
  if (!activeStep.value) {
    isDelegationDrawerOpened.value = false
  } else {
    activeStep.value--
  }
}

const userStore = commonStore()
const currentUserId = userStore.$state.user?.id

async function handleNextClick() {
  if (isSpecificDelegationFlowType.value) {
    delegationDetails.value = formatCollaboratorsDetailsForDelegateSummary()
  }

  if (activeStep.value === 1 || isSpecificDelegationFlowType.value) {
    const delegationRequest = {
      isFullDelegation: !isSpecificDelegationFlowType.value,
      delegatorId: currentUserId,
      delegationDetails: formatDelegateSummaryForDelegationRequest(delegationDetails.value),
      accountIds: getAccountIdFromSelectedFolders(),
    }
    await delegateFolder(delegationRequest)
  } else {
    activeStep.value++
  }
}

const selectedCollaborators = ref<Contact[]>([])

function handleCollaboratorSelection(event: Contact[]) {
  selectedCollaborators.value = event
}

watch(activeStep, () => {
  if (activeStep.value === 1) {
    delegationDetails.value = formatCollaboratorsDetailsForDelegateSummary()
  }
})

const getAccountIdFromSelectedFolders = () =>
  props.selectedFolders.map(({ id }) => id)

function formatCollaboratorsDetailsForDelegateSummary() {
  return selectedCollaborators.value
    .map(({ id, firstName, lastName, email }) => (
      {
        delegate: {
          id,
          firstName,
          lastName,
          email,
        },
        isAutomaticDelegation: false,
      }
    ))
}

const formatDelegateSummaryForDelegationRequest = (delegationDetails: DelegationDetails[]) => {
  return delegationDetails
    .map(({ delegate, isAutomaticDelegation }) => (
      {
        delegateeId: delegate.id,
        startDate: new Date().toISOString(),
        isAutomaticDelegation,
      }
    ))
}

const delegateFolder = async (delegationRequest: any) => {
  try {
    await commonApi().gateway.post(
      'wallet/api/delegations',
      delegationRequest,
    )
    displaySuccessNotification()
  } catch (err) {
    displayFailureNotification()
    console.error(err)
  }
  closeDrawer()
}

const displaySuccessNotification = () => {
  PNotification({
    message: t('successNotificationMessage'),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const displayFailureNotification = () => {
  PNotification({
    message: t('failureNotificationMessage'),
    icon: PIX,
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}

const closeDrawer = () => {
  emit('update:modelValue', false)
}
</script>

<i18n lang="yaml">
  en-US:
    walletDelegation: 'Delegate my wallet'
    folderDelegation: 'Delegate a folder | Delegate multiple folders'
    addColaborator: 'Add a colaborator'
    automaticDelegation: 'Automatic delegation'
    cancelButtonLabel: 'Cancel'
    previousButtonLabel: 'Cancel'
    nextButtonLabel: 'Next'
    submitButtonLabel: 'Submit'
    successNotificationMessage: 'Votre portefeuille a été délégué avec succès.'
    failureNotificationMessage: 'Votre portefeuille n’a pas été délégué suite à une erreur technique.'
  fr-FR:
    walletDelegation: 'Déléguer mon portefeuille'
    folderDelegation: 'Déléguer un dossier | Déléguer plusieurs dossiers'
    addColaborator: 'Ajout des collaborateurs'
    automaticDelegation: 'Délégation automatique'
    cancelButtonLabel: 'Annuler'
    previousButtonLabel: 'Précedent'
    nextButtonLabel: 'Suivant'
    submitButtonLabel: 'Valider'
    successNotificationMessage: 'Votre portefeuille a été délégué avec succès.'
    failureNotificationMessage: 'Votre portefeuille n’a pas été délégué suite à une erreur technique.'
</i18n>
