<template>
  <PSteps
    class="margin-bottom--6"
    :pActive="activeStep"
    :pFinishStatus="PStepStatus.SUCCESS"
    :pSteps="delegationStepItems"
  />

  <SelectAccountStep
    v-if="isSelectFolderStep"
    :selectedAccount="selectedAccount"
    @select-account="handleSelectAccount"
    @remove-account="handleRemoveAccount"
  />

  <SelectCollaboratorsStep
    v-if="isSelectCollaboratorsStep && selectedAccount"
    :key="selectedAccount.accountId"
    :accountId="selectedAccount.accountId"
    :initialSelectedCollaborators="selectedCollaborators"
    @update:selected-collaborators="handleCollaboratorsSelected"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PSteps } from '@pulse/styleguide/components'
import { PStepStatus, type PStepsItem } from '@pulse/styleguide/types'
import type { Collab } from '@entities/types'
import type { SearchAccountItem } from '@entities/services/account/account.type'
import SelectAccountStep from './components/SelectAccountStep/select-account-step.vue'
import SelectCollaboratorsStep from './components/SelectCollaboratorsStep/select-collaborators-step.vue'
import { REQUEST_DELEGATION_STEPS } from './request-delegation.consts'
import { MAX_SELECTED_COLLABORATORS, MIN_SELECTED_COLLABORATORS } from './components/SelectCollaboratorsStep/select-collaborators-step.consts.js'

const activeStep = defineModel<number>('activeStep', { default: 0 })

const { t } = useI18n()
const selectedAccount = ref<SearchAccountItem | null>(null)
const selectedCollaborators = ref<Collab[]>([])
const initiallySelectedCollaborators = ref<Collab[]>([])

const delegationStepItems = computed<PStepsItem[]>(() => [
  { pTitle: t('entities.requestDelegation.selectFolder') },
  { pTitle: t('entities.requestDelegation.selectCollaborators') },
  { pTitle: t('entities.requestDelegation.recap') },
])

const isSelectFolderStep = computed(() => activeStep.value === REQUEST_DELEGATION_STEPS.SELECT_FOLDER)
const isSelectCollaboratorsStep = computed(() => activeStep.value === REQUEST_DELEGATION_STEPS.SELECT_COLLABORATORS)

const canGoNext = computed(() => {
  if (activeStep.value === REQUEST_DELEGATION_STEPS.SELECT_FOLDER) {
    return selectedAccount.value !== null
  }

  if (activeStep.value === REQUEST_DELEGATION_STEPS.SELECT_COLLABORATORS) {
    return selectedCollaborators.value.length >= MIN_SELECTED_COLLABORATORS &&
    selectedCollaborators.value.length <= MAX_SELECTED_COLLABORATORS
  }

  return false
})

function handleSelectAccount(account: SearchAccountItem) {
  selectedAccount.value = account
  selectedCollaborators.value = []
  initiallySelectedCollaborators.value = []
}

function handleRemoveAccount() {
  selectedAccount.value = null
}

function handleCollaboratorsSelected(collabs: Collab[]) {
  if (initiallySelectedCollaborators.value.length === 0) {
    initiallySelectedCollaborators.value = [...collabs]
  }
  selectedCollaborators.value = collabs
}

defineExpose({
  canGoNext,
  selectedCollaborators,
  initiallySelectedCollaborators,
})
</script>
