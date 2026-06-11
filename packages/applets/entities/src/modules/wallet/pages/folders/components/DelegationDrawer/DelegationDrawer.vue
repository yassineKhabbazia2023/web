<template>
  <PDrawer
    v-model="isDelegationDrawerOpened"
    class="delegation-drawer"
    pSize="50%"
    :pTitle="drawerTitle"
    @close-drawer-button="handleCloseDrawer"
    @close="handleCloseDrawer"
  >
    <!-- Specific Flow: Direct delegation for selected folders -->
    <template v-if="isSpecificDelegationFlowType">
      <div class="margin-bottom--6">
        <CollapsableFoldersList v-if="selectedFolders.length > 1">
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
        :shouldDisplayNumberOfFoldersInPortfolio="false"
        @collaborator-selection="handleCollaboratorSelection"
      />

      <DelegationPreviewList
        v-else-if="activeStep === 1"
        v-model="delegationDetails"
      />
    </template>

    <!-- Full Flow: Tabs with all delegation options -->
    <template v-else>
      <PTabs
        v-if="shouldShowDelegationRequestTabs || hasPermanentDelegations"
        v-model="activeTab"
        class="margin-bottom--6"
        @tab-click="handleTabChange"
      >
        <template v-if="shouldShowDelegationRequestTabs">
          <PTabPane
            :pLabel="t('entities.delegationDrawer.pendingRequests')"
            :pName="DelegationTab.PENDING_REQUESTS"
            :pCount="pendingRequestsCount"
          />
          <PTabPane
            :pLabel="t('entities.delegationDrawer.requestDelegation')"
            :pName="DelegationTab.REQUEST_DELEGATION"
          />
        </template>
        <PTabPane
          :pLabel="t('entities.delegationDrawer.walletDelegation')"
          :pName="DelegationTab.DELEGATE_WALLET"
        />
        <PTabPane
          :pLabel="t('entities.delegationDrawer.permanentDelegations')"
          :pName="DelegationTab.PERMANENT_DELEGATIONS"
        />
      </PTabs>

      <PendingRequestsTab v-if="activeTab === DelegationTab.PENDING_REQUESTS" />

      <RequestDelegationTab
        v-if="activeTab === DelegationTab.REQUEST_DELEGATION"
        ref="requestDelegationRef"
        v-model:activeStep="requestDelegationStep"
      />

      <template v-if="activeTab === DelegationTab.DELEGATE_WALLET">
        <PSteps
          class="margin-bottom--6"
          :pActive="activeStep"
          :pFinishStatus="PStepStatus.SUCCESS"
          :pSteps="delegationStepItems"
        />

        <AddDelegatesStep
          v-if="activeStep === 0"
          v-model:hasPennylaneAccess="hasPennylaneAccess"
          :numberOfFoldersInPortfolio="numberOfFoldersInPortfolio"
          shouldDisplayNumberOfFoldersInPortfolio
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
    </template>

    <template #footer>
      <!-- Specific Flow Footer -->
      <PDrawerActions
        v-if="isSpecificDelegationFlowType"
        :pBackCTA="backCTA"
        :pPrimaryCTA="primaryCTA"
        @click-back-cta="handlePreviousClick"
        @click-primary-cta="handleNextClick"
      />

      <!-- Full Flow Footer -->
      <template v-else>
        <PDrawerActions
          v-if="activeTab === DelegationTab.REQUEST_DELEGATION"
          :pBackCTA="requestDelegationBackCTA"
          :pPrimaryCTA="requestDelegationPrimaryCTA"
          @click-back-cta="handleRequestDelegationPrevious"
          @click-primary-cta="handleRequestDelegationNext"
        />
        <PDrawerActions
          v-else-if="activeTab === DelegationTab.DELEGATE_WALLET"
          :pBackCTA="backCTA"
          :pPrimaryCTA="primaryCTA"
          @click-back-cta="handlePreviousClick"
          @click-primary-cta="handleNextClick"
        />
      </template>
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PDrawerActions, PSteps, PTabPane, PTabs } from '@pulse/styleguide/components'
import { displayNotification } from '@pulse/styleguide'
import { PStepStatus, type PStepsItem } from '@pulse/styleguide/types'
import { FeatureFlagManager } from '@pulse/common/managers'
import { logger } from '@pulse/toolbox'
import { delegateAccounts, fetchPermanentDelegations } from '@entities/services/account'
import type { AccountsDelegation, AccountsDelegationDetails, PermanentDelegationApiItem } from '@entities/services/account/account.type'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { Collab } from '@entities/types'
import { DelegationFlowType, DelegationTab } from '@entities/modules/wallet/enums'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'
import type { DelegationDetails } from './models/Delegation'
import AddDelegatesStep from './components/AddDelegatesStep'
import CollapsableFoldersList from './components/CollapsableFoldersList'
import DelegationPreviewList from './components/DelegationPreviewList'
import PendingRequestsTab from './components/PendingRequests/pending-requests.vue'
import PermanentDelegationsTab from './components/permanent-delegations/permanent-delegations.vue'
import { REQUEST_DELEGATION_INITIAL_STEP } from './components/RequestDelegation/request-delegation.consts'
import RequestDelegationTab from './components/RequestDelegation/request-delegation.vue'
import SelectedFoldersList from './components/SelectedFoldersList'
import { useRequestDelegation } from './composables/use-request-delegation.composable'

const props = defineProps<DelegationDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const { t } = useI18n()

const shouldShowDelegationRequestTabs = computed(() => FeatureFlagManager.isDelegationRequestTabsActivated())
const pendingRequestsCount = ref<number>(0)

const getDefaultTab = () => {
  if (props.selectedFolders.length > 0) {
    return DelegationTab.DELEGATE_WALLET
  }

  if (shouldShowDelegationRequestTabs.value === false) {
    return DelegationTab.DELEGATE_WALLET
  }
  return pendingRequestsCount.value > 0
    ? DelegationTab.PENDING_REQUESTS
    : DelegationTab.REQUEST_DELEGATION
}

const activeTab = ref<DelegationTab>(getDefaultTab())
const previousTab = ref<DelegationTab>(getDefaultTab())
const hasPermanentDelegations = ref(false)
const initialPermanentDelegations = ref<PermanentDelegationApiItem[]>([])
const activeStep = ref<number>(0)
const hasPennylaneAccess = ref(false)
const delegationDetails = ref<DelegationDetails[]>([])
const requestDelegationStep = ref<number>(0)
const requestDelegationRef = useTemplateRef<{ canGoNext: boolean; selectedCollaborators: Collab[]; initiallySelectedCollaborators: Collab[] | null } | null>('requestDelegationRef')

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
  ? t('entities.delegationDrawer.folderDelegation', props.selectedFolders.length)
  : t('entities.delegationDrawer.myDelegations'),
)

const backButtonLabel = computed(() => activeStep.value ? t('entities.delegationDrawer.backButtonLabel') : t('entities.delegationDrawer.cancelButtonLabel'))
const primaryButtonLabel = computed(() => activeStep.value === 1 ? t('entities.delegationDrawer.submitButtonLabel') : t('entities.delegationDrawer.primaryButtonLabel'))

const isNextButtonLoading = ref<boolean>(false)

const backCTA = computed(() => ({ pLabel: backButtonLabel.value, pTestId: 'previousButton' }))
const primaryCTA = computed(() => ({
  pLabel: isSpecificDelegationFlowType.value ? t('entities.delegationDrawer.submitButtonLabel') : primaryButtonLabel.value,
  pDisabled: selectedCollaborators.value.length === 0,
  pLoading: isNextButtonLoading.value,
  pTestId: 'nextButton',
}))

const delegationStepItems = computed<PStepsItem[]>(() => [
  { pTitle: t('entities.delegationDrawer.addCollaborator') },
  { pTitle: t('entities.delegationDrawer.automaticDelegation') },
])

const {
  requestDelegationBackCTA,
  requestDelegationPrimaryCTA,
  handleRequestDelegationPrevious,
  handleRequestDelegationNext,
} = useRequestDelegation({
  requestDelegationStep,
  requestDelegationRef,
  isDelegationDrawerOpened,
})

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
  } catch (error) {
    handleDisplayNotification(false, delegationRequest.accountIds.length)
    logger.error('Failed to delegate accounts', error)
  }
}

const handleDisplayNotification = (isSuccess: boolean, numberOfSelectedFolders: number) => {
  let message
  switch (flowType.value) {
    case DelegationFlowType.FULL:
      message = isSuccess
        ? t('entities.delegationDrawer.notificationMessages.flowTypeFull.successNotificationMessage')
        : t('entities.delegationDrawer.notificationMessages.flowTypeFull.failureNotificationMessage')
      break
    case DelegationFlowType.SPECIFIC:
      message = isSuccess
        ? t('entities.delegationDrawer.notificationMessages.flowTypeSpecific.successNotificationMessage', numberOfSelectedFolders)
        : t('entities.delegationDrawer.notificationMessages.flowTypeSpecific.failureNotificationMessage', numberOfSelectedFolders)
      break
    default:
      logger.warn('Unsupported flow type')
      return
  }

  displayNotification(isSuccess ? 'success' : 'error', message)
}

function handleTabChange(clickedTab: DelegationTab) {
  if (clickedTab !== previousTab.value) {
    resetDelegationState()
  }
  previousTab.value = clickedTab
}

function resetDelegationState() {
  activeStep.value = 0
  requestDelegationStep.value = 0
  selectedCollaborators.value = []
  delegationDetails.value = []
  hasPennylaneAccess.value = false
}

const handleCloseDrawer = () => {
  requestDelegationStep.value = REQUEST_DELEGATION_INITIAL_STEP
  activeTab.value = getDefaultTab()
  resetDelegationState()
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

