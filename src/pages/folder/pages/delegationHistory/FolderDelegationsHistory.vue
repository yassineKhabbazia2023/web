<template>
  <div class="margin-top--6 margin-bottom--4">
    <PInput
      v-model="searchValue"
      pType="search"
      :pPlaceholder="t('searchByName')"
      :pPrefixIcon="PISearch"
    />

    <!-- ⏳ Check the timeline component from element plus until we have the Pegase one ⏳ -->
    <!-- ⬇️⬇️⬇️⬇️ This will also be a styleguide component, don't waste time on this ⬇️⬇️⬇️⬇️ -->
    <div
      v-for="({ delegationDate, account, historyType, description }, index) in fakeDelegations"
      :key="index"
      class="placeholder-delegation-card margin-top--4 margin-bottom--4"
    >
      <div>
        {{ delegationDate }}
        {{ account.name }}
        {{ historyType }}
      </div>

      <div>
        {{ description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PInput, PISearch } from '@kpmg/styleguide'
import { fetchAccountDelegationHistory } from '@/services/account/accountServices'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const searchValue = ref('')

// Use the real interface and mock file during the mob session
const fakeDelegation = {
  delegationDate: '01/29/2024',
  account: {
    id: 1,
    name: 'Le chaudron baveur',
  },
  historyType: 'delegation', // History could be of any type in the future
  description: 'Vous avez délégué ce dossier  à Amaury Lindé',
}

const fakeDelegations = [
  fakeDelegation, fakeDelegation, fakeDelegation,
]

onMounted(async () => {
  // $route.params.id
  // endpoint not in desktop
  // https://api-dev78.dev.kpmg-pulse.fr/account/api/delegations/602/history
  // https://api-dev78.dev.kpmg-pulse.fr/desktop/gtw/account/api/delegations/602/history
  const plop = await fetchAccountDelegationHistory(602)
  console.warn({ plop })
})
</script>

<i18n lang="yaml">
en-US:
  searchByName: 'Search by name'
fr-FR:
  searchByName: 'Rechercher par nom'
</i18n>
