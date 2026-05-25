<template>
  <PAutocomplete
    v-model="searchQuery"
    :pPlaceholder="t('searchPlaceholder')"
    :pFetchSuggestions="getCollaboratorsSuggestions"
    valueKey="id"
    @select="handleCollaboratorSelection"
  >
    <template #default="{ item }">
      <div
        class="
          delegates-add__search-line
          flex flex--align-items-center
        "
        :class="{'delegates-add__search-line--selected': isCollaboratorSelected(item.id)}"
        data-testid="collaborator-autocomplete-line"
      >
        <span>{{ item.firstName }}</span>
        <span class="text-uppercase">&nbsp;{{ item.lastName }}</span>
        <span>&nbsp;{{ t('hyphen') }}&nbsp;</span>
        <span class="delegates-add__search-line__additional-information">
          {{ item.persona.name }}{{ t('comma') }}
          {{ item.office }}
        </span>
      </div>
    </template>
  </PAutocomplete>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { PAutocomplete } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import type { Contact } from '@entities/services/contact/contactTypes'
import { fetchContactsFromSameHub } from '@entities/services/account'
import type { AddCollaboratorsAutocompleteProps } from './AddCollaboratorsAutocompleteTypes'

const props = defineProps<AddCollaboratorsAutocompleteProps>()
const emit = defineEmits<{
  'add-collaborator': [Contact]
  'remove-collaborator': [Contact['id']]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      searchPlaceholder: 'First name, last name, office, city, service, role',
      hyphen: '-',
      comma: ',',
    },
    'fr-FR': {
      searchPlaceholder: 'Nom, prénom, bureau, ville, service, rôle',
      hyphen: '-',
      comma: ',',
    },
  },
})

const searchQuery = ref('')

function isCollaboratorSelected(id: Contact['id']) {
  return props.selectedCollaborators.find((contact: Contact) => contact.id === id)
}

function handleCollaboratorSelection(contact: Contact) {
  const { id } = contact
  if (isCollaboratorSelected(id)) {
    emit('remove-collaborator', id)
  } else {
    emit('add-collaborator', contact)
  }

  resetSearchQuery()
}

async function getCollaboratorsSuggestions(searchValue: string, callback: any) {
  const collaborators = props.pFetchCollaborators !== undefined
    ? await props.pFetchCollaborators(searchValue)
    : await fetchContactsFromSameHub(searchValue, 100)
  callback(collaborators ?? [])
}

function resetSearchQuery() {
  searchQuery.value = ''
}
</script>

<style lang="scss" scoped>
.delegates-add {
  $self: &;

  &__search-line {
    &--selected {
      color: var(--p-jungle-400);
      font-weight: 600;
    }

    &__additional-information {
      font-weight: 400;
    }

    &:not(#{$self}--selected) #{self}__additional-information {
      color: var(--p-gray-300);
    }
  }
}
</style>

