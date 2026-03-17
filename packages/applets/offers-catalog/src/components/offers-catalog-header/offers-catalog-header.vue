<template>
  <div
    class="
        offers-catalog-header
        padding--8
        bg--base-blue-pulse
        text-color--base-white

        flex
        flex--direction-column
        flex--align-items-center
        flex--justify-content-center
      "
  >
    <i18n-t
      keypath="sentence"
      tag="div"
      class="
        offers-catalog-header__title
        text-center
      "
    >
      <template #need>
        <span class="text-color--secondary-amethyste">{{ t('need') }}</span>
      </template>
      <template #theOffer>
        <span class="text-color--secondary-amethyste">{{ t('theOffer') }}</span>
      </template>
    </i18n-t>

    <div
      class="flex min-width--full"
    >
      <span class="flex--grow-1 flex--shrink-1 flex--basis-0" />
      <PSmartSearch
        ref="pSmartSearch"
        :pSearch="localSearchTerm"
        :pAiEnabled="aiEnabled"
        :pShowSmartSearchToggle="isSmartSearchEnabled"
        :pMinLength="0"
        :pSearchInvalidMessage="t('invalidSearch')"
        :pPlaceholder="t('searchPlaceholder')"
        :pAiPlaceholder="t('aiSearchPlaceholder')"
        :pSwitchLabel="t('smartSearch')"
        class="
          flex--grow-1
          flex--shrink-1
          flex--basis-300px
          margin-top--6
        "
        pClearable
        @update:p-search="onUpdateSearchTerm"
        @update:p-ai-enabled="onUpdateAiEnabled"
        @search="onAiSearch"
      >
        <template #header>
          <div class="margin-bottom--2 font-bold text-color--base-white">
            {{ t('smartSearchEnabled') }}
          </div>
        </template>
        <template #disclaimer>
          <p class="margin-top--2 text-color--base-white text-center">
            {{ t('aiDisclaimer') }}
          </p>
        </template>
      </PSmartSearch>
      <span class="flex--grow-1 flex--shrink-1 flex--basis-0" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PSmartSearch } from '@pulse/styleguide/components'
import { FeatureFlagManager, CurrentUserManager } from '@pulse/common/managers'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import type { OffersCatalogHeaderProps } from './offers-catalog-header.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      sentence: 'Got a customer {need}? Find {theOffer}!',
      need: 'need',
      theOffer: 'the right offer',
      invalidSearch: 'search term is invalid',
      searchPlaceholder: 'Describe a need',
      aiSearchPlaceholder: 'Smart search: Enter a keyword, phrase, or describe what you are looking for...',
      smartSearch: 'Smart search',
      smartSearchEnabled: 'Smart search enabled',
      aiDisclaimer: 'Verify relevance before presenting to the client. AI-generated content may be incorrect.',
    },
    'fr-FR': {
      sentence: 'Un {need} client ? Trouvez {theOffer} correspondante !',
      need: 'besoin',
      theOffer: 'l\'offre',
      invalidSearch: 'les critères de recherche sont invalides',
      searchPlaceholder: 'Renseignez un ou plusieurs mots-clés',
      aiSearchPlaceholder: 'Recherche intelligente : Renseignez un mot clé, une phrase, ou votre besoin "je cherche ..."',
      smartSearch: 'Recherche intelligente',
      smartSearchEnabled: 'Recherche intelligente activée',
      aiDisclaimer: 'Vérifiez la pertinence avant de proposer au client. Le contenu généré par l\'IA peut être incorrect.',
    },
  },
})

const props = defineProps<OffersCatalogHeaderProps>()

const emit = defineEmits<{
  'update:search-term': [string]
  'update:ai-enabled': [boolean]
  'ai-search': [string]
}>()

const pSmartSearchRef = useTemplateRef('pSmartSearch')
const aiEnabled = ref(false)
const localSearchTerm = ref(props.searchTerm)
const isSmartSearchEnabled =
  FeatureFlagManager.isSmartSearchOfferCatalogActivated() &&
  CurrentUserManager.hasGlobalPermission(GLOBAL_PERMISSIONS.SMART_SEARCH_OFFER_CATALOG)

function onUpdateSearchTerm(newSearchTerm: string) {
  localSearchTerm.value = newSearchTerm

  if (aiEnabled.value === false) {
    emit('update:search-term', newSearchTerm)
  }
}

function onUpdateAiEnabled(enabled: boolean) {
  aiEnabled.value = enabled
  emit('update:ai-enabled', enabled)
}

function onAiSearch(query: string) {
  emit('ai-search', query)
}

function clearSearch() {
  localSearchTerm.value = ''
  pSmartSearchRef.value?.clearSearch()
}

defineExpose({
  clearSearch,
})
</script>

<style lang="scss" scoped>
.offers-catalog-header {
  &__title {
    font-size: 3.2rem;
    font-weight: 700;
  }
}
</style>

