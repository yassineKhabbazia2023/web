<template>
  <PDrawer
    v-model="isDelegationDrawerOpened"
    class="delegation-drawer"
    pSize="50%"
    :pTitle="drawerTitle"
    @close-drawer-button="handleCloseDrawer"
    @close="handleCloseDrawer"
  >
    <PTabs
      v-if="isSpecificDelegationFlowType === false && hasPermanentDelegations"
      v-model="activeTab"
      class="margin-bottom--6"
    >
      <PTabPane
        :pLabel="t('walletDelegation')"
        :pName="DelegationTab.DELEGATE_WALLET"
      />
      <PTabPane
        :pLabel="t('permanentDelegations')"
        :pName="DelegationTab.PERMANENT_DELEGATIONS"
      />
    </PTabs>

    <template v-if="activeTab === DelegationTab.DELEGATE_WALLET || isSpecificDelegationFlowType">
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
    </template>

    <PermanentDelegationsTab
      v-else-if="activeTab === DelegationTab.PERMANENT_DELEGATIONS"
      :initialData="initialPermanentDelegations"
    />

    <template #footer>
      <PDrawerActions
        v-if="activeTab === DelegationTab.DELEGATE_WALLET || isSpecificDelegationFlowType"
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-back-cta="handlePreviousClick"
        @click-primary-cta="handleNextClick"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PDrawerActions, PSteps, PStep, PTabs, PTabPane } from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import { delegateAccounts, fetchPermanentDelegations } from '@entities/services/account'
import { DelegationFlowType, DelegationTab } from '@entities/modules/wallet/enums'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'
import AddDelegatesStep from './components/AddDelegatesStep'
import type { Contact } from '@entities/services/contact/contactTypes'
import DelegationPreviewList from './components/DelegationPreviewList'
import CollapsableFoldersList from './components/CollapsableFoldersList'
import SelectedFoldersList from './components/SelectedFoldersList'
import PermanentDelegationsTab from './components/permanent-delegations/permanent-delegations.vue'
import type { DelegationDetails } from './models/Delegation'
import type { AccountsDelegationDetails, AccountsDelegation, PermanentDelegationApiItem } from '@entities/services/account/account.type'

const props = defineProps<DelegationDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      myDelegations: 'My delegations',
      walletDelegation: 'Delegate my wallet',
      folderDelegation: 'Delegate a folder | Delegate multiple folders',
      permanentDelegations: 'Permanent delegations',
      addCollaborator: 'Add a collaborator',
      automaticDelegation: 'Automatic delegation',
      cancelButtonLabel: 'Cancel',
      backButtonLabel: 'Cancel',
      primaryButtonLabel: 'Next',
      submitButtonLabel: 'Submit',
      notificationMessages: {
        flowTypeFull: {
          successNotificationMessage: 'Your wallet has been successfully delegated.',
          failureNotificationMessage: 'Your wallet was not delegated due to a technical error.',
        },
        flowTypeSpecific: {
          successNotificationMessage: 'The folder has been successfully delegated. | The folders have been successfully delegated.\n',
          failureNotificationMessage: 'The folder was not delegated following a technical error. | The folders were not delegated following a technical error.\n',
        },
      },
    },
    'fr-FR': {
      myDelegations: 'Mes délégations',
      walletDelegation: 'Déléguer mon portefeuille',
      folderDelegation: 'Déléguer un dossier | Déléguer plusieurs dossiers',
      permanentDelegations: 'Délégations permanentes',
      addCollaborator: 'Ajout des collaborateurs',
      automaticDelegation: 'Délégation automatique',
      cancelButtonLabel: 'Annuler',
      backButtonLabel: 'Précedent',
      primaryButtonLabel: 'Suivant',
      submitButtonLabel: 'Valider',
      notificationMessages: {
        flowTypeFull: {
          successNotificationMessage: 'Votre portefeuille a été délégué avec succès.',
          failureNotificationMessage: 'Votre portefeuille n’a pas été délégué suite à une erreur technique.',
        },
        flowTypeSpecific: {
          successNotificationMessage: 'Le dossier a été délégué avec succès. | Les dossiers ont été délégués avec succès.\n',
          failureNotificationMessage: 'Le dossier n’a pas été délégué suite à une erreur technique. | Les dossiers n’ont pas été délégués suite à une erreur technique.\n',
        },
      },
    },
  },
})

const activeTab = ref<DelegationTab>(DelegationTab.DELEGATE_WALLET)
const hasPermanentDelegations = ref(false)
const initialPermanentDelegations = ref<PermanentDelegationApiItem[]>([])
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

const drawerTitle = computed(() => isSpecificDelegationFlowType.value
  ? t('folderDelegation', props.selectedFolders.length)
  : t('myDelegations'),
)

const backButtonLabel = computed(() => activeStep.value ? t('backButtonLabel') : t('cancelButtonLabel'))
const primaryButtonLabel = computed(() => activeStep.value === 1 ? t('submitButtonLabel') : t('primaryButtonLabel'))

const isNextButtonLoading = ref<boolean>(false)

const backCTA = computed(() => ({ pLabel: backButtonLabel.value, pTestId: 'previousButton' }))
const primaryCTA = computed(() => ({
  pLabel: isSpecificDelegationFlowType.value ? t('submitButtonLabel') : primaryButtonLabel.value,
  pDisabled: selectedCollaborators.value.length === 0,
  pLoading: isNextButtonLoading.value,
  pTestId: 'nextButton',
}))

function handlePreviousClick() {
  if (!activeStep.value) {
    isDelegationDrawerOpened.value = false
  } else {
    activeStep.value--
  }
}

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
  let message
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

async function loadInitialPermanentDelegations() {
  try {
    const response = await fetchPermanentDelegations()
    initialPermanentDelegations.value = response?.items ?? []
    hasPermanentDelegations.value = initialPermanentDelegations.value.length > 0
  } catch {
    hasPermanentDelegations.value = false
  }
}

onMounted(() => {
  if (isSpecificDelegationFlowType.value === false) {
    loadInitialPermanentDelegations()
  }
})
</script>

