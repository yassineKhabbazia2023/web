<template>
  <PAutocomplete
    v-model="searchExpression"
    :pFetchSuggestions="handleSearchCollaborator"
    valueKey="lastName"
    :pPlaceholder="t('selectCollaborator')"
    :pTriggerOnFocus="false"
    pHighlightFirstItem
    pClearable
    @select="onSelect"
  >
    <template #prefix>
      <PIcon>
        <PISearch />
      </PIcon>
    </template>
    <template #default="{ item }">
      <p
        class="collab-details"
        data-testid="autocomplete-row"
      >
        {{ item.firstName }}
        {{ item.lastName }}
        {{ hyphen }}
        {{ item.email }}
        <span class="collab-details__office">
          {{ item.persona.name }}
          {{ hyphen }}
          {{ item.office }}
        </span>
      </p>
    </template>
  </PAutocomplete>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PAutocomplete, PISearch, PIcon } from '@kpmg/styleguide'
import type { CollaboratorAutocompleteProps } from './CollaboratorAutocompleteTypes'
import type { Contact } from '@/services/contact/contactTypes'
import { useI18n } from 'vue-i18n'
import { getAutocompleteContacts } from './CollaboratorAutocompleteUtils'

const hyphen = '-'
const searchExpression = ref('')

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<CollaboratorAutocompleteProps>()

const emits = defineEmits<{
  'add-contact': [Contact]
}>()

async function handleSearchCollaborator(queryString: string, callback: any) {
  const results = await getAutocompleteContacts(props.selectedCollaborators, queryString)

  callback(results)
}
function onSelect(contact: Contact) {
  emits('add-contact', contact)
  searchExpression.value = ''
}
</script>

<style lang="scss" scoped>
.collab-details {
  &__office {
    color: var(--el-color-neutral-gray-300);
  }
}
</style>

<i18n lang="yaml">
  en-US:
    selectCollaborator: 'Select one or more collaborators'
  fr-FR:
    selectCollaborator: 'Sélectionnez un ou plusieurs collaborateurs'
</i18n>
