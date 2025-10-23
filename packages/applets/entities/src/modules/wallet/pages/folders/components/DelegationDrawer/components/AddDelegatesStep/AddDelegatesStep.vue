<template>
  <div>
    <div
      v-if="shouldDisplayNumberOfFoldersInPortfolio"
      class="margin-bottom--6"
    >
      <PAlert>
        <i18n-t
          keypath="numberOfFolders"
          tag="p"
        >
          <template #amount>
            <span class="font-bold">{{ t('folders', numberOfFoldersInPortfolio) }}</span>
          </template>
        </i18n-t>
      </PAlert>
    </div>

    <PBlockHeader
      :pTitle="t('addDelegator')"
      :pDescription="t('addDelegatorDescription')"
      :pHasButton="false"
      pColor="persian"
      pSize="big"
      :pImage="{
        pFit: 'fill',
        pName: 'user-add-duotone'
      }"
    >
      <template #suffix>
        <p class="margin-bottom--2 font-xsmall">
          {{ t('searchLabel') }}
        </p>
        <CollaboratorsSearchAutocomplete
          :selectedCollaborators="selectedCollaborators"
          @add-collaborator="addSelectedCollaborator"
          @remove-collaborator="removeSelectedCollaborator"
        />
      </template>
    </PBlockHeader>

    <div class="margin-top--6">
      <template v-for="({ id, firstName, lastName, email, persona }, index) in selectedCollaborators" :key="id">
        <div v-if="index" class="separator" />
        <div class="padding-x--4">
          <PUserAction
            :pProfile="getInitials(firstName, lastName)"
            :pTitle="getFullNameWithUppercaseLastName(firstName, lastName)"
            :pDescription="email"
            :pRole="persona?.name"
            :pAvatarRole="AvatarRoles.COLLAB"
            pShowDelete
            @click-delete="removeSelectedCollaborator(id)"
          />
        </div>
      </template>
    </div>
    <template v-if="hasPennylaneCheckbox">
      <PCheckbox
        v-model="internalHasPennylaneAccess"
        class="margin-top--6"
      >
        {{ t('pennylaneAccess.checkboxLabel', selectedCollaborators.length) }}
      </PCheckbox>
      <PAlert pType="information">
        <template #bold-text>
          {{ t('pennylaneAccess.adviseTitle') }} :
        </template>
        {{ t('pennylaneAccess.adviseMessage') }}
      </PAlert>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { PCheckbox, PAlert, PBlockHeader, PUserAction } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'
import type { DelegatorsAddStepProps } from './AddDelegatesStepTypes'
import CollaboratorsSearchAutocomplete from '../CollaboratorsSearchAutocomplete'
import { getCollaborators } from '@entities/services/wallet'
import type { Contact } from '@entities/services/contact/contactTypes'
import { getInitials } from '@entities/helper/helper'
import { getFullNameWithUppercaseLastName } from '@entities/utils/helpers'
import { AvatarRoles } from '@pulse/styleguide'
import { CurrentUserManager } from '@pulse/common/managers'
import { ACTION_PERMISSIONS } from '@pulse/common/constants'

const props = defineProps<DelegatorsAddStepProps>()
const emit = defineEmits<{
  'collaborator-selection': [Contact[]]
  'update:hasPennylaneAccess': [boolean]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const hasPennylaneCheckbox = computed(() => {
  const hasSelectedCollaborators = selectedCollaborators.value.length > 0
  const hasPermission = CurrentUserManager.hasPermission(ACTION_PERMISSIONS.ACCESS_PENNYLANE_COLLAB) === true

  return hasSelectedCollaborators === true && hasPermission === true
})

const internalHasPennylaneAccess = computed({
  get: () => props.hasPennylaneAccess,
  set: (hasPennylaneAccess: boolean) => emit('update:hasPennylaneAccess', hasPennylaneAccess),
})
const folderUsers = ref<undefined | Contact[]>()
onMounted(async () => {
  const { items } = await getCollaborators(1, 100)
  folderUsers.value = items
})

const selectedCollaborators = ref<Contact[]>([])

function addSelectedCollaborator(contact: Contact) {
  selectedCollaborators.value.push(contact)
  emitCollaboratorSelection()
}

function removeSelectedCollaborator(id: Contact['id']) {
  selectedCollaborators.value = selectedCollaborators.value.filter((contact: Contact) => contact.id !== id)
  emitCollaboratorSelection()
}

function emitCollaboratorSelection() {
  emit('collaborator-selection', selectedCollaborators.value)
}
</script>

<style lang="scss" scoped>
.separator {
  width: 100%;
  height: 1px;
  background: var(--p-gray-100);
}
</style>

<i18n lang="yaml">
  en-US:
    folders: 1 folder | {count} folders
    numberOfFolders: 'There are {amount} in your portfolio'
    addDelegator: 'Add delegators'
    addDelegatorDescription: 'Choose collaborators to delegate your portfolio to.'
    searchLabel: 'Please search for a collaborator:'
    pennylaneAccess:
      checkboxLabel: Give these collaborator access to Pennylane | Give these collaborators access to Pennylane
      adviseTitle: By enabling this option
      adviseMessage: >
        A Pennylane account will be created for these collaborators,
        allowing them to access the delegated folders.
  fr-FR:
    folders: 1 dossier | {count} dossiers
    numberOfFolders: 'Il y a {amount} dans votre portefeuille'
    addDelegator: 'Ajouter des délégataires'
    addDelegatorDescription: 'Choisissez des collaborateurs à qui déléguer votre portefeuille'
    searchLabel: 'Veuillez rechercher un collaborateur :'
    pennylaneAccess:
      checkboxLabel: Donner l’accès à ce collaborateur sur Pennylane | Donner l’accès à ces collaborateurs sur Pennylane
      adviseTitle: En activant cette option
      adviseMessage: >
        Un compte Pennylane sera créé pour ces collaborateurs,
        qui pourront accéder aux dossiers délégués.
</i18n>
