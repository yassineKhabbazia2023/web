<template>
  <div class="add-collaborators-card">
    <PBlockHeader
      :pTitle="t('newCollaborators')"
      :pDescription="t('addCollaboratorsToFolder')"
      :pHasButton="false"
      pColor="persian"
      pSize="big"
      :pImage="{
        pName: 'user-add-duotone'
      }"
    >
      <template #suffix>
        <p class="margin-bottom--2 font-xsmall">
          {{ t('searchLabel') }}
        </p>
        <AddCollaboratorsAutocomplete
          :selectedCollaborators="selectedCollaborators"
          @add-collaborator="addSelectedCollaborator"
          @remove-collaborator="removeSelectedCollaborator"
        />
      </template>
    </PBlockHeader>

    <div class="margin-top--6">
      <ul class="add-collaborators-card__user-list list-style-none">
        <li
          v-for="({ id, fullName, initials, email, persona }) in selectedCollaboratorsFormatted"
          :key="id"
        >
          <PUserAction
            :pProfile="initials"
            :pTitle="fullName"
            :pDescription="email"
            :pRole="persona?.name"
            :pAvatarRole="AvatarRoles.COLLAB"
            pShowDelete
            @click-delete="removeSelectedCollaborator(id)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PBlockHeader, PUserAction } from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import { useI18n } from 'vue-i18n'
import AddCollaboratorsAutocomplete from '../AddCollaboratorsAutocomplete'
import { fetchContactsFromSameHub } from '@entities/services/account'
import type { Contact } from '@entities/services/contact/contactTypes'
import { getInitials } from '@entities/helper/helper'
import { getFullNameWithUppercaseLastName } from '@entities/utils/helpers/helpers'

const emit = defineEmits<{
  'collaborator-selection': [Contact[]]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const entityUsers = ref<Contact[]>([])
onMounted(async () => {
  entityUsers.value = await fetchContactsFromSameHub('', 100)
})

const selectedCollaborators = ref<Contact[]>([])
const selectedCollaboratorsFormatted = computed(() => {
  return selectedCollaborators.value
    .map(user => ({
      ...user,
      fullName: getFullNameWithUppercaseLastName(user.firstName, user.lastName),
      initials: getInitials(user.firstName, user.lastName),
    }))
})

function addSelectedCollaborator(contact: Contact) {
  selectedCollaborators.value.push(contact)
  emitCollaboratorSelection()
}

function removeSelectedCollaborator(id: Contact['id']) {
  const index = selectedCollaborators.value.findIndex((contact: Contact) => contact.id === id)
  selectedCollaborators.value.splice(index, 1)
  emitCollaboratorSelection()
}

function emitCollaboratorSelection() {
  emit('collaborator-selection', selectedCollaboratorsFormatted.value)
}
</script>

<style lang="scss" scoped>
.add-collaborators-card {
  li + li {
    border-top: 1px solid var(--p-gray-100);
  }
}
</style>

<i18n lang="yaml">
  en-US:
    newCollaborators: 'New collaborators'
    addCollaboratorsToFolder: 'You can add collaborators to this folder.'
    searchLabel: 'Please search for a collaborator:'
  fr-FR:
    newCollaborators: 'Nouveaux collaborateurs'
    addCollaboratorsToFolder: 'Vous pouvez ajouter des collaborateurs à ce dossier.'
    searchLabel: 'Veuillez rechercher un collaborateur :'
</i18n>
