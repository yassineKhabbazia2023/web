<template>
  <div>
    <PBlockHeader
      :pTitle="t('addCollaborators')"
      :pDescription="t('description')"
      :pHasButton="false"
      pColor="persian"
      pSize="big"
      :pImage="{
        pFit: 'fill',
        pType: 'portrait',
        pName: 'collab-male-add'
      }"
    >
      <template #suffix>
        <PForm
          pLabelPosition="top"
          pHideRequiredAsterisk
        >
          <PFormItem
            :pLabel="t('searchCollaborator')"
            class="margin-bottom--0"
          >
            <CollaboratorAutocomplete
              :selectedCollaborators="selectedCollaborators"
              @add-contact="onAddContact"
            />
          </PFormItem>
        </PForm>
      </template>
    </PBlockHeader>
    <div class="margin-top--6">
      <PUserAction
        v-for="(selectedCollaborator, index) in selectedCollaborators"
        :key="index"
        :pProfile="
          getInitials(
            selectedCollaborator?.firstName,
            selectedCollaborator?.lastName
          )
        "
        :pTitle="getContactFullName(selectedCollaborator)"
        :pDescription="selectedCollaborator.email"
        :pRole="selectedCollaborator.office"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PBlockHeader,
  PUserAction,
  PForm,
  PFormItem
} from '@kpmg/styleguide'
import { getInitials } from '@/helper'
import type { ManageCollaboratorsProps } from './ManageCollaboratorsTypes'
import { Contact } from '@/services/contact/contactTypes'
import CollaboratorAutocomplete from '../CollaboratorAutocomplete'

const emits = defineEmits<{
  'update:collaborators': [Contact[]]
}>()

const props = defineProps<ManageCollaboratorsProps>()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const selectedCollaborators = ref<Contact[]>([])

function getContactFullName(contact: Contact) {
  return `${contact?.firstName} ${contact?.lastName}`
}

function addContact(contact: Contact) {
  selectedCollaborators.value.push(contact)
  emits('update:collaborators', selectedCollaborators.value)
}

function onAddContact(contact: Contact) {
  addContact(contact)
}

onMounted(() => {
  selectedCollaborators.value.push(...props.collaborators)
})
</script>

<i18n lang="yaml">
en-US:
  addCollaborators: 'Add collaborators'
  searchCollaborator: 'Please search for a collaborator :'
  description: 'You can add collaborators to this offer.'
fr-FR:
  addCollaborators: 'Ajoutez des collaborateurs'
  searchCollaborator: 'Veuillez rechercher un collaborateur :'
  description: 'Vous pouvez ajouter des collaborateurs sur cette offre.'
</i18n>
