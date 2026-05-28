<template>
  <Transition name="fade-scale" mode="out-in">
    <PUserActionCard
      v-if="selectedAccount !== null"
      key="account-card"
      class="bg--gray-50 padding--4"
      :pAvatarProps="{
        pType: 'large',
        pColor: 'green',
      }"
      @trash-clicked="handleRemoveAccount"
    >
      <template #avatar>
        {{ getStringInitials(selectedAccount.legalName) }}
      </template>
      <template #content>
        <div
          class="
            flex
            flex--align-items-center
            flex-gap--2
            margin-bottom--1
          "
        >
          <p class="font-bold font-size--16">
            {{ selectedAccount.legalName }}
          </p>
          <PTag
            pColor="gray"
            pSize="small"
            pIconLeftName="building"
            :pContent="selectedAccount.accountNumber"
          />
        </div>
        <p class="font-size--16 margin-top--2">
          <a
            v-if="selectedAccount.directorEmail"
            :href="`mailto:${selectedAccount.directorEmail}`"
            class="text-underline"
          >{{ selectedAccount.directorEmail }}</a>
          <template v-if="selectedAccount.directorEmail && selectedAccount.siret">
            |
          </template>
          <template v-if="selectedAccount.siret">
            Siret: {{ selectedAccount.siret }}
          </template>
        </p>
      </template>
    </PUserActionCard>

    <div v-else key="autocomplete-search">
      <PAutocomplete
        v-model="searchQuery"
        :pPlaceholder="t('entities.requestDelegation.searchAccountPlaceholder')"
        :pFetchSuggestions="getAccountsSuggestions"
        valueKey="accountId"
        @select="handleAccountSelection"
      >
        <template #prefix>
          <PIcon pName="search" />
        </template>
        <template #default="{ item }">
          <div
            class="flex flex--align-items-center"
            data-testid="account-autocomplete-line"
          >
            <span class="text-bold">{{ item.legalName }}</span>
            <span>&nbsp;{{ t('entities.requestDelegation.hyphen') }}&nbsp;</span>
            <span class="text-color--text-secondary">
              {{ item.accountNumber }}
              <template v-if="item.siret">
                {{ t('entities.requestDelegation.hyphen') }}
                SIRET : {{ item.siret }}
              </template>
              <template v-if="item.directorEmail">
                {{ t('entities.requestDelegation.hyphen') }}
                {{ item.directorEmail }}
              </template>
            </span>
          </div>
        </template>
      </PAutocomplete>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAutocomplete, PIcon, PTag, PUserActionCard } from '@pulse/styleguide/components'
import { displayNotification } from '@pulse/styleguide'
import { logger, useDebounce } from '@pulse/toolbox'
import { getStringInitials } from '@pulse/toolbox/utils/string'
import { searchAccounts } from '@entities/services/account'
import type { SearchAccountItem } from '@entities/services/account/account.type'
import type { SearchAccountAutocompleteProps } from './search-account-autocomplete.types'

defineProps<SearchAccountAutocompleteProps>()
const emit = defineEmits<{
  'select-account': [SearchAccountItem]
  'remove-account': []
}>()

const { t } = useI18n()
const searchQuery = ref('')

function handleAccountSelection(account: SearchAccountItem) {
  emit('select-account', account)
  resetSearchQuery()
}

function handleRemoveAccount() {
  emit('remove-account')
}

const performSearch = useDebounce(async (searchValue: string, callback: (accounts: SearchAccountItem[]) => void) => {
  try {
    const response = await searchAccounts(searchValue)
    callback(response?.items ?? [])
  } catch (error) {
    logger.error('Failed to search accounts', error)
    displayNotification('error', t('entities.requestDelegation.searchError'))
    callback([])
  }
})

async function getAccountsSuggestions(searchValue: string, callback: (accounts: SearchAccountItem[]) => void) {
  const trimmedValue = searchValue.trim()

  if (trimmedValue === '') {
    callback([])
    return
  }

  performSearch(trimmedValue, callback)
}

function resetSearchQuery() {
  searchQuery.value = ''
}
</script>
