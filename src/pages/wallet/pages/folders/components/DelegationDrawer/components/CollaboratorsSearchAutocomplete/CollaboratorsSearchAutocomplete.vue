<template>
  <PAutocomplete
    v-model="searchAutocompleteQuery"
    :pPlaceholder="t('searchPlaceholder')"
    :pFetchSuggestions="getCollaboratorsAutocomplete"
    @select="handleCollaboratorSelection"
    valueKey="id"
  >
    <template #default="{ item }">
      <div
        class="delegates-add__search-line flex flex--align-items-center"
        :class="{'delegates-add__search-line--selected': isCollaboratorSelected(item.id)}"
        data-testid="collaborator-autocomplete-line"
      >
        <PCheckbox :modelValue="isCollaboratorSelected(item.id)" />
        <span class="uppercase">
          {{ item.firstName }}
          {{ item.lastName}}
        </span>
        <span>&nbsp;{{ t('hyphen') }}&nbsp;</span>
        <span class="delegates-add__search-line__additional-information">
          {{ item.persona.name }}{{ t('coma') }}
          {{ item.office }}
        </span>
      </div>
    </template>
  </PAutocomplete>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PAutocomplete, PCheckbox } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { CollaboratorsSearchAutocompleteProps } from './CollaboratorsSearchAutocompleteTypes'
import type { Contact } from '@/services/contact/contactTypes'
import { getCollaborators } from '@/services/contact'

const props = defineProps<CollaboratorsSearchAutocompleteProps>()
const emit = defineEmits<{
  'add-collaborator': [Contact['id']]
  'remove-collaborator': [Contact['id']]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const allCollaboratorsUsers = ref<undefined | Contact[]>()
onMounted(async () => {
  allCollaboratorsUsers.value = await getCollaborators()
})

const searchAutocompleteQuery = ref('')

function isCollaboratorSelected(id: Contact['id']) {
  return props.selectedCollaborators.includes(id)
}

function handleCollaboratorSelection(contact: Contact) {
  const { id } = contact
  if (!isCollaboratorSelected(id)) {
    emit('add-collaborator', id)
  } else {
    emit('remove-collaborator', id)
  }

  resetSearchAutocompleteQuery()
}

async function getCollaboratorsAutocomplete(searchValue: string, callback: any) {
  const collaborators = await getCollaborators(searchValue, 100) ?? []
  callback(collaborators)
}

function resetSearchAutocompleteQuery() {
  searchAutocompleteQuery.value = ''
}
</script>

<i18n lang="yaml">
  en-US:
    searchPlaceholder: 'First name, last name, office, city, service, role'
    hyphen: '-'
    coma: ','
  fr-FR:
    searchPlaceholder: 'Nom, prénom, bureau, ville service, rôle'
    hyphen: '-'
    coma: ','
</i18n>
