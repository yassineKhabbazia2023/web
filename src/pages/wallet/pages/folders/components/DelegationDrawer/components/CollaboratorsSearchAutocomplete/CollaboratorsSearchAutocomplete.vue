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
        <span class="uppercase">
          {{ item.firstName }}
          {{ item.lastName}}
        </span>
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
import { PAutocomplete } from '@kpmg/styleguide'
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

<style lang="scss" scoped>
.delegates-add {
  $self: &;

  &__search-line {
    &--selected {
      color: var(--el-color-base-persian);
      font-weight: 600;
    }

    &__additional-information {
      font-weight: 400;
    }

    &:not(#{$self}--selected) #{self}__additional-information {
      color: var(--el-color-neutral-gray-300);
    }
  }
}
</style>

<i18n lang="yaml">
  en-US:
    searchPlaceholder: 'First name, last name, office, city, service, role'
    hyphen: '-'
    comma: ','
  fr-FR:
    searchPlaceholder: 'Nom, prénom, bureau, ville, service, rôle'
    hyphen: '-'
    comma: ','
</i18n>
