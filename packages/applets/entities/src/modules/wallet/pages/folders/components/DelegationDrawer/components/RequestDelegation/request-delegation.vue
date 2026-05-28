<template>
  <PSteps
    class="margin-bottom--6"
    :pActive="activeStep"
    :pFinishStatus="PStepStatus.SUCCESS"
    :pSteps="delegationStepItems"
  />

  <PBlockHeader
    v-if="isSelectFolderStep"
    :pTitle="t('entities.requestDelegation.chooseFolderTitle')"
    :pHasButton="false"
    pColor="persian"
    pSize="big"
    :pImage="{
      pName: 'building-duotone',
    }"
  >
    <template #suffix>
      <p v-if="showFolderDescription" class="margin-bottom--2 font-xsmall">
        {{ t('entities.requestDelegation.chooseFolderDescription') }}
      </p>
      <SearchAccountAutocomplete
        :selectedAccount="selectedAccount"
        @select-account="handleSelectAccount"
        @remove-account="handleRemoveAccount"
      />
    </template>
  </PBlockHeader>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PBlockHeader, PSteps } from '@pulse/styleguide/components'
import { PStepStatus, type PStepsItem } from '@pulse/styleguide/types'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { SearchAccountItem } from '@entities/services/account/account.type'
import SearchAccountAutocomplete from './components/SearchAccountAutocomplete/search-account-autocomplete.vue'
import { REQUEST_DELEGATION_STEPS } from './request-delegation.consts'

const activeStep = defineModel<number>('activeStep', { default: 0 })

const { t } = useI18n()
const selectedAccount = ref<SearchAccountItem | null>(null)
const selectedCollaborators = ref<Contact[]>([])

const delegationStepItems = computed<PStepsItem[]>(() => [
  { pTitle: t('entities.requestDelegation.selectFolder') },
  { pTitle: t('entities.requestDelegation.selectCollaborators') },
  { pTitle: t('entities.requestDelegation.recap') },
])

const isSelectFolderStep = computed(() => activeStep.value === REQUEST_DELEGATION_STEPS.SELECT_FOLDER)
const showFolderDescription = computed(() => selectedAccount.value === null)

const canGoNext = computed(() => {
  if (activeStep.value === REQUEST_DELEGATION_STEPS.SELECT_FOLDER) {
    return selectedAccount.value !== null
  }

  if (activeStep.value === REQUEST_DELEGATION_STEPS.SELECT_COLLABORATORS) {
    return selectedCollaborators.value.length > 0
  }

  return false
})

function handleSelectAccount(account: SearchAccountItem) {
  selectedAccount.value = account
}

function handleRemoveAccount() {
  selectedAccount.value = null
}

defineExpose({
  canGoNext,
})
</script>
