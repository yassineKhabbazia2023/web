<template>
  <div>
    <PBlockHeader
      :pTitle="headerTitle"
      :pDescription="headerDescription"
      :pHasButton="false"
      pColor="persian"
      pSize="big"
      :pImage="{
        pFit: 'fill',
        pName: 'user-add-duotone',
      }"
    >
      <template
        v-if="hasCollaboratorRole"
        #subtitle
      >
        <ul class="margin-y--3 padding-left--6 font-large font-normal">
          <li
            v-for="({ functionName }, index) in collaboratorRoles"
            :key="index"
          >
            {{ functionName }}
          </li>
        </ul>
        <p class="font-semibold">
          {{ t('descriptionWithRoles') }}
        </p>
      </template>
      <template #suffix>
        <PForm
          pHideRequiredAsterisk
          @submit.prevent
        >
          <PFormItem
            :pLabel="t('searchCollaborator')"
            class="margin-bottom--0"
          >
            <CollaboratorAutocomplete
              :selectedCollaboratorIds="selectedCollaboratorIds"
              @add-contact="onAddContact"
            />
          </PFormItem>
        </PForm>
      </template>
    </PBlockHeader>
    <div class="margin-top--6">
      <PUserActionWithOptionsNumbers
        v-for="(collaborator, index) in formattedCollaborators"
        :key="index"
        v-model:pOptionsValue="collaborator.roleIds"
        :pProfile="collaborator.profile"
        :pTitle="collaborator.fullName"
        :pDescription="collaborator.email"
        :pRole="collaborator.role"
        :pShowDelete="canDelete"
        :data-testid="collaborator.dataTestId"
        :pAvatarRole="AvatarRoles.COLLAB"
        :pShowOptions="hasCollaboratorRole"
        :pOptions="collaborator.availableRoles"
        :pOptionsPlaceholder="t('optionsPlaceholder')"
        :pOptionsNoDataText="t('optionsNoDataText')"
        pOptionsMultiple
        @click-delete="onClickDelete(index)"
        @update:p-options-value="onUpdateCollaboratorRoles(index, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PBlockHeader,
  PUserAction,
  PForm,
  PFormItem,
} from '@pulse/styleguide/components'
import { AvatarRoles } from '@pulse/styleguide'
import type { ManageCollaboratorsProps } from './ManageCollaboratorsTypes'
import type { ContactWithRoles } from '@entities/types'
import { type Contact } from '@entities/services/contact/contactTypes'
import CollaboratorAutocomplete from '@entities/components/CollaboratorAutocomplete'
import { getFormattedCollaborators } from './ManageCollaborators.utils'

const PUserActionWithOptionsNumbers = PUserAction<number[]> // pOptionsValue is a number array

const emits = defineEmits<{
  'update:knownCollaborators': [Contact[]]
  'update:selectedCollaboratorsWithRoles': [ContactWithRoles[]]
}>()

const props = defineProps<ManageCollaboratorsProps>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      addCollaborators: 'Add collaborators',
      addCollaboratorsWithRoles: 'Add up to {count} collaborators and assign the following roles:| Add up to {count} collaborators and assign the following roles:\n',
      searchCollaborator: 'Please search for a collaborator :',
      description: 'You can add collaborators to this offer.',
      descriptionWithRoles: 'A collaborator must have at least 1 role and can fulfill several roles\n',
      optionsPlaceholder: 'Select role(s)',
      optionsNoDataText: 'Remove a role from another collaborator',
    },
    'fr-FR': {
      addCollaborators: 'Ajoutez des collaborateurs',
      addCollaboratorsWithRoles: 'Ajouter au maximum {count} collaborateur et affecter le rôle ci-dessous :| Ajouter au maximum {count} collaborateurs et affecter les {count} rôles ci-dessous :\n',
      searchCollaborator: 'Veuillez rechercher un collaborateur :',
      description: 'Vous pouvez ajouter des collaborateurs sur cette offre.',
      descriptionWithRoles: 'Un collaborateur doit avoir au minimum 1 rôle et peut remplir plusieurs rôles\n',
      optionsPlaceholder: 'Choisir le(s) rôle(s)',
      optionsNoDataText: 'Supprimez un rôle d’un autre collaborateur',
    },
  },
})

const hasCollaboratorRole = computed(() => props.collaboratorRoles.length > 0)
const canDelete = computed(() => hasCollaboratorRole.value || props.selectedCollaboratorsWithRoles.length > 1)
const formattedCollaborators = computed(() => getFormattedCollaborators(
  props.knownCollaborators,
  props.selectedCollaboratorsWithRoles,
  props.collaboratorRoles,
))
const selectedCollaboratorIds = computed(() =>
  props.selectedCollaboratorsWithRoles.map(({ contactId }) => contactId),
)

const headerTitle = computed(() => {
  const count = props.collaboratorRoles.length

  return count > 0
    ? t('addCollaboratorsWithRoles', { count }, count)
    : t('addCollaborators')
})
const headerDescription = computed(() => {
  return hasCollaboratorRole.value
    ? ''
    : t('description')
})

function addContact(contact: Contact) {
  const knownCollaborators = props.knownCollaborators.some(({ id }) => id === contact.id)
    ? props.knownCollaborators
    : [...props.knownCollaborators, contact]
  emitUpdateCollaborators(knownCollaborators)

  const hasContact = props.selectedCollaboratorsWithRoles.some(({ contactId }) => contact.id === contactId)
  const selectedCollaboratorsWithRoles = hasContact
    ? props.selectedCollaboratorsWithRoles
    : [
      ...props.selectedCollaboratorsWithRoles,
      {
        contactId: contact.id,
        roleIds: [],
      },
    ]
  emitUpdateCollaboratorIds(selectedCollaboratorsWithRoles)
}

function emitUpdateCollaborators(knownCollaborators: Contact[]) {
  emits('update:knownCollaborators', knownCollaborators)
}

function emitUpdateCollaboratorIds(selectedCollaboratorsWithRoles: ContactWithRoles[]) {
  emits('update:selectedCollaboratorsWithRoles', selectedCollaboratorsWithRoles)
}

function onAddContact(contact: Contact) {
  addContact(contact)
}

function onClickDelete(index: number) {
  if (!canDelete.value) {
    logger.warn('Can not delete collaborator')
    return
  }
  const selectedCollaboratorsWithRoles = [...props.selectedCollaboratorsWithRoles]
  selectedCollaboratorsWithRoles.splice(index, 1)
  emitUpdateCollaboratorIds(selectedCollaboratorsWithRoles)
}

function onUpdateCollaboratorRoles(index: number, roleIds: number[]) {
  const selectedCollaboratorsWithRoles = [...props.selectedCollaboratorsWithRoles]
  selectedCollaboratorsWithRoles[index].roleIds = roleIds
  emitUpdateCollaboratorIds(selectedCollaboratorsWithRoles)
}
</script>

