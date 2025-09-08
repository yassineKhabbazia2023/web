<template>
  <PDrawer
    v-model="isDelegationDrawerOpened"
    class="delegation-drawer"
    @close-drawer-button="handleCloseDrawer"
    @close="handleCloseDrawer"
  >
    <template #header-prefix>
      <h3 class="delegation-drawer__header flex flex--align-items-center">
        <PIcon
          pName="pulse"
          :pColor="AppColors.PRIMARY"
          pSize="30"
        />
        <h3 v-if="!isSpecificDelegationFlowType" class="margin-left--1 font-semibold">
          {{ t('walletDelegation') }}
        </h3>
        <h3 v-else class="margin-left--1 font-semibold">
          {{ t('folderDelegation', selectedFolders.length) }}
        </h3>
      </h3>
    </template>

    <PSteps
      v-if="!isSpecificDelegationFlowType"
      class="margin-bottom--6"
      :pActive="activeStep"
      pFinishStatus="success"
    >
      <PStep :title="t('addCollaborator')" />
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
      v-model:hasPennylaneAccess="hasPennylaneAccess"
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
        :isNextButtonLoading="isNextButtonLoading"
        @click-previous="handlePreviousClick"
        @click-next="handleNextClick"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { logger } from '@pulse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PSteps, PStep, PIcon } from '@pulse/styleguide/components'
import { AppColors, PNotification } from '@pulse/styleguide'
import { delegateAccounts } from '@entities/services/account'
import { DelegationFlowType } from './DelegationDrawerTypes'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'

import NextPreviousButtons from '@entities/common/components/NextPreviousButtons'
import AddDelegatesStep from './components/AddDelegatesStep'
import type { Contact } from '@entities/services/contact/contactTypes'
import DelegationPreviewList from './components/DelegationPreviewList'
import CollapsableFoldersList from './components/CollapsableFoldersList'
import SelectedFoldersList from './components/SelectedFoldersList'
import type { DelegationDetails } from './models/Delegation'
import type { AccountsDelegationDetails, AccountsDelegation } from '@entities/services/account/accountTypes'

const props = defineProps<DelegationDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeStep = ref<number>(0)
const hasPennylaneAccess = ref(false)
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

const isNextButtonLoading = ref<boolean>(false)

async function handleNextClick() {
  if (activeStep.value === 0) {
    delegationDetails.value = formatCollaboratorsDetailsForDelegateSummary()
  }

  if (activeStep.value === 1 || isSpecificDelegationFlowType.value) {
    const delegationRequest: AccountsDelegation = {
      isFullDelegation: !isSpecificDelegationFlowType.value,
      includePennylaneAccess: hasPennylaneAccess.value,
      delegationDetails: formatDelegateSummaryForAccountsDelegation(delegationDetails.value),
      accountIds: getAccountIdFromSelectedFolders(),
    }
    isNextButtonLoading.value = true
    await delegateFolder(delegationRequest)
    isNextButtonLoading.value = false
    handleCloseDrawer()
  } else {
    activeStep.value++
  }
}

const selectedCollaborators = ref<Contact[]>([])

function handleCollaboratorSelection(event: Contact[]) {
  selectedCollaborators.value = event
}

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

const formatDelegateSummaryForAccountsDelegation = (delegationDetails: DelegationDetails[]) => {
  return delegationDetails
    .map<AccountsDelegationDetails>(({ delegate, isAutomaticDelegation }) => (
      {
        delegateeId: delegate.id,
        startDate: new Date().toISOString(),
        isAutomaticDelegation,
      }
    ))
}

const delegateFolder = async (delegationRequest: AccountsDelegation) => {
  try {
    await delegateAccounts(delegationRequest)
    handleDisplayNotification(true, delegationRequest.accountIds.length)
  } catch (err) {
    handleDisplayNotification(false, delegationRequest.accountIds.length)
    logger.error(err)
  }
}

const displaySuccessNotification = (message:string) => {
  PNotification({
    message,
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const displayFailureNotification = (message: string) => {
  PNotification({
    message,
    iconName: 'x',
    showClose: true,
    customClass: 'error',
    position: 'bottom-right',
  })
}

const handleDisplayNotification = (isSuccess:boolean, numberOfSelectedFolders: number) => {
  let message = ''
  switch (flowType.value) {
    case DelegationFlowType.FULL:
      message = isSuccess
        ? t('notificationMessages.flowTypeFull.successNotificationMessage')
        : t('notificationMessages.flowTypeFull.failureNotificationMessage')
      break
    case DelegationFlowType.SPECIFIC:
      message = isSuccess
        ? t('notificationMessages.flowTypeSpecific.successNotificationMessage', numberOfSelectedFolders)
        : t('notificationMessages.flowTypeSpecific.failureNotificationMessage', numberOfSelectedFolders)
      break
    default:
      logger.warn('not supported')
      return
  }
  if (isSuccess) {
    displaySuccessNotification(message)
  } else {
    displayFailureNotification(message)
  }
}

const handleCloseDrawer = () => {
  emit('update:modelValue', false)
}
</script>

<i18n lang="yaml">
en-US:
  walletDelegation: 'Delegate my wallet'
  folderDelegation: 'Delegate a folder | Delegate multiple folders'
  addCollaborator: 'Add a collaborator'
  automaticDelegation: 'Automatic delegation'
  cancelButtonLabel: 'Cancel'
  previousButtonLabel: 'Cancel'
  nextButtonLabel: 'Next'
  submitButtonLabel: 'Submit'
  notificationMessages:
    flowTypeFull:
      successNotificationMessage: 'Your wallet has been successfully delegated.'
      failureNotificationMessage: 'Your wallet was not delegated due to a technical error.'
    flowTypeSpecific:
      successNotificationMessage: >
        The folder has been successfully delegated. |
        The folders have been successfully delegated.
      failureNotificationMessage: >
        The folder was not delegated following a technical error. |
        The folders were not delegated following a technical error.

fr-FR:
  walletDelegation: 'Déléguer mon portefeuille'
  folderDelegation: 'Déléguer un dossier | Déléguer plusieurs dossiers'
  addCollaborator: 'Ajout des collaborateurs'
  automaticDelegation: 'Délégation automatique'
  cancelButtonLabel: 'Annuler'
  previousButtonLabel: 'Précedent'
  nextButtonLabel: 'Suivant'
  submitButtonLabel: 'Valider'
  notificationMessages:
    flowTypeFull:
      successNotificationMessage: 'Votre portefeuille a été délégué avec succès.'
      failureNotificationMessage: "Votre portefeuille n’a pas été délégué suite à une erreur technique."
    flowTypeSpecific:
      successNotificationMessage: >
        Le dossier a été délégué avec succès. |
        Les dossiers ont été délégués avec succès.
      failureNotificationMessage: >
        Le dossier n’a pas été délégué suite à une erreur technique. |
        Les dossiers n’ont pas été délégués suite à une erreur technique.
</i18n>
