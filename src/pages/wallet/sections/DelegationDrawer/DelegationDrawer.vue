<template>
  <PDrawer class="delegation-drawer" v-model="isDelegationDrawerOpened">
    <template #header-prefix>
      <h3 class="delegation-drawer__header">
        <template v-if="flowType === DelegationFlowType.FULL">
          {{  t('walletDelegation') }}
        </template>
        <template v-else>
          {{  t('folderDelegation', selectedFolders.length) }}
        </template>
      </h3>
    </template>

    <PSteps
      v-if="flowType === DelegationFlowType.FULL"
      class="margin-bottom--6"
      :pActive="activeStep"
      pFinishStatus="success"
    >
      <PStep :title="t('addColaborator')" />
      <PStep :title="t('automaticDelegation')" />
    </PSteps>

    <AddDelegatesStep
      v-if="activeStep === 0"
      :numberOfFoldersInPortfolio="numberOfFoldersInPortfolio"
      @collaborator-selection="handleCollaboratorSelection"
    />

    <DelegationPreviewList
      v-else-if="activeStep === 1"
      v-model="delegationDetails"
    />

    <!-- This will be used in the next US
    <CollapsableFoldersList
      v-if="flowType === DelegationFlowType.SPECIFIC"
      :folders="selectedFolders"
    /> -->

    <template #footer>
      <NextPreviousButtons
        :previousLabel="previousButtonLabel"
        :nextLabel="nextButtonLabel"
        @click-previous="handlePreviousClick"
        @click-next="handleNextClick"
      />
    </template>
  </PDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer, PSteps, PStep, PICheck, PNotification, PIX } from '@kpmg/styleguide'
import { DelegationFlowType } from './DelegationDrawerTypes'
import type {
  DelegationDrawerProps,
} from './DelegationDrawerTypes'

import NextPreviousButtons from '@/components/NextPreviousButtons'
import AddDelegatesStep from './components/AddDelegatesStep'
import type { Contact } from '@/services/contact/contactTypes'
import DelegationPreviewList from './components/DelegationPreviewList'
import type { DelegationDetails } from '@/pages/wallet/sections/DelegationDrawer/models/Delegation'
import { commonApi, commonStore } from '@kpmg/common'

const props = defineProps<DelegationDrawerProps>()
const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeStep = ref<number>(0)

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

const previousButtonLabel = computed(() => activeStep.value ? t('previousButtonLabel') : t('cancelButtonLabel'))
const nextButtonLabel = computed(() => activeStep.value === 1 ? t('submitButtonLabel') : t('nextButtonLabel'))

function handlePreviousClick() {
  activeStep.value--
}

const userStore = commonStore()
const currentUserId = userStore.$state.user?.id ?? '0'

async function handleNextClick() {
  if (activeStep.value === 1 && flowType.value === DelegationFlowType.FULL) {
    const delegationRequest = {
      delegatorId: Number.parseInt(currentUserId),
      delegationDetails: formatDelegateSummaryForGtwDelegationRequest(delegationDetails.value),
      accountIds: getCurrentUserAccounts,
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

// second step
const delegationDetails = ref<DelegationDetails[]>([])
watch(activeStep, () => {
  if (activeStep.value === 1) {
    delegationDetails.value = formatCollaboratorsDetailsForDelegateSummary()
  }
})

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
        isAutomaticallyDelegated: false,
      }
    ))
}

const formatDelegateSummaryForGtwDelegationRequest = (delgationDetails: DelegationDetails[]) => {
  return delgationDetails
    .map(({ delegate }) => (
      {
        delegateeId: delegate.id,
        startDate: Date.now(),
        endDate: null,
        note: null,
      }
    ))
}

const getCurrentUserAccounts = () => {
  // return await commonApi().fateway.get(`/wallet/api/accounts/contacts/${currentUserId}`)
  return [1, 2, 3]
}

const delegateFolder = async (delegationRequest: any) => {
  try {
    await commonApi().gateway.post(
      'wallet/api/delegations',
      JSON.stringify(delegationRequest),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    displaySuccessNotification()
  } catch (err) {
    displayFailureNotification()
    console.error(err)
  }
  closeAndResetDrawer()
}

const displaySuccessNotification = () => {
  PNotification({
    message: t('successNotificationMessage'),
    icon: PICheck,
    showClose: true,
    customClass: 'error',
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

const closeAndResetDrawer = () => {
  emit('update:modelValue', false)
}
</script>

<i18n lang="yaml">
  en-US:
    walletDelegation: 'Delegate a wallet'
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
    walletDelegation: 'Déléguer un portefeuille'
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
