<template>
  <div class="add-collaborators-card">
    <PBlockHeader
      :pTitle="t('newCollaborators')"
      :pDescription="t('addCollaboratorsToFolder')"
      :pHasButton="false"
      pColor="persian"
      pSize="big"
      :pImage="{
        pFit: 'fill',
        pType: 'portrait',
        pName: 'collab-female-add'
      }"
    >
      <template #suffix>
        <p class="margin-bottom--2 font-xsmall">
          {{ t('searchLabel') }}
        </p>
        <AddCollaboratorsAutocomplete
          :selectedCollaboratorsIds="selectedCollaboratorsIds"
          @add-collaborator="addSelectedCollaborator"
          @remove-collaborator="removeSelectedCollaborator"
        />
      </template>
    </PBlockHeader>

    <div class="margin-top--6">
      <ul class="add-collaborators-card__user-list list-style-none">
        <li
          v-for="({ id, fullName, initials, email, persona }) in selectedCollaborators"
          :key="id"
        >
          <PUserAction
            :pProfile="initials"
            :pTitle="fullName"
            :pDescription="email"
            :pRole="persona?.name"
            pShowDelete
            @click-delete="removeSelectedCollaborator(id)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { PBlockHeader, PUserAction } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import AddCollaboratorsAutocomplete from '../AddCollaboratorsAutocomplete'
import { fetchContactsFromSameHub } from '@/services/account'
import type { Contact } from '@/services/contact/contactTypes'
import { getInitials } from '@/helper/helper'
import { getFullName } from '@/common/utils/helpers/helpers'

const emit = defineEmits<{
  'collaborator-selection': [Contact[]]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const folderUsers = ref<Contact[]>([])
onMounted(async () => {
  folderUsers.value = await fetchContactsFromSameHub('', 100)
})

const selectedCollaboratorsIds: Contact['id'][] = reactive([])
const selectedCollaborators = computed(() => {
  return folderUsers.value
    .filter(user => selectedCollaboratorsIds.includes(user.id))
    .map(user => ({
      ...user,
      fullName: getFullName(user.firstName, user.lastName, true),
      initials: getInitials(user.firstName, user.lastName),
    }))
})

function addSelectedCollaborator(id: Contact['id']) {
  selectedCollaboratorsIds.push(id)
  emitCollaboratorSelection()
}

function removeSelectedCollaborator(id: Contact['id']) {
  const index = selectedCollaboratorsIds.indexOf(id)
  selectedCollaboratorsIds.splice(index, 1)
  emitCollaboratorSelection()
}

function emitCollaboratorSelection() {
  emit('collaborator-selection', selectedCollaborators.value)
}
</script>

<style lang="scss" scoped>
.add-collaborators-card {
  li + li {
    border-top: 1px solid var(--el-color-neutral-gray-100);
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
