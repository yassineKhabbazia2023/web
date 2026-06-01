<template>
  <PBlockHeader
    :pTitle="t('entities.requestDelegation.chooseFolderTitle')"
    :pHasButton="false"
    pColor="persian"
    pSize="big"
    :pImage="{
      pName: 'building-duotone',
    }"
  >
    <template #suffix>
      <p v-if="showDescription" class="margin-bottom--2 font-xsmall">
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PBlockHeader } from '@pulse/styleguide/components'
import type { SearchAccountItem } from '@entities/services/account/account.type'
import SearchAccountAutocomplete from '../SearchAccountAutocomplete/search-account-autocomplete.vue'
import type { SelectAccountStepProps } from './select-account-step.types'

const props = defineProps<SelectAccountStepProps>()

const emit = defineEmits<{
  'select-account': [SearchAccountItem]
  'remove-account': []
}>()

const { t } = useI18n()

const showDescription = computed(() => props.selectedAccount === null)

function handleSelectAccount(account: SearchAccountItem) {
  emit('select-account', account)
}

function handleRemoveAccount() {
  emit('remove-account')
}
</script>
