<template>
  <div class="delegates-add">
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
            <span class="font-bold">{{ t('folders', numberOfFoldersInPortfolio)  }}</span>
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
        pType: 'portrait',
        pName: 'collab-male-add'
      }"
    >
      <template #suffix>
        <p class="margin-bottom--2 font-xsmall">
          {{ t('searchLabel') }}
        </p>
        <CollaboratorsSearchAutocomplete
          :selectedCollaborators="selectedCollaboratorsIds"
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
            :pTitle="getFormattedFirstAndLastName(firstName, lastName)"
            :pDescription="email"
            :pRole="persona?.name"
            pShowDelete
            @click-delete="removeSelectedCollaborator(id)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { PAlert, PBlockHeader, PUserAction } from '@kpmg/styleguide'
import { useI18n } from 'vue-i18n'
import type { DelegatorsAddStepProps } from './AddDelegatesStepTypes'
import CollaboratorsSearchAutocomplete from '../CollaboratorsSearchAutocomplete'
import { getCollaborators } from '@/services/contact'
import type { Contact } from '@/services/contact/contactTypes'
import { getInitials } from '@/helper/helper'

defineProps<DelegatorsAddStepProps>()
const emit = defineEmits<{
  'collaborator-selection': [Contact[]]
}>()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const folderUsers = ref<undefined | Contact[]>()
onMounted(async () => {
  folderUsers.value = await getCollaborators()
})

const selectedCollaboratorsIds: Contact['id'][] = reactive([])
const selectedCollaborators = computed(() => {
  return (folderUsers.value ?? []).filter(user => selectedCollaboratorsIds.includes(user.id))
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

function getFormattedFirstAndLastName(firstName: string, lastName: string) {
  return `${firstName} ${lastName.toUpperCase()}`
}

function emitCollaboratorSelection() {
  emit('collaborator-selection', selectedCollaborators.value)
}
</script>

<style lang="scss" scoped>
.delegates-add {
  $self:  &;

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

  &__colaborators-list-item:not(:first-of-type) {
    border-top: 1px solid var(--el-color-neutral-gray-100)
  }
}

.separator {
  width: 100%;
  height: 1px;
  background: var(--el-color-neutral-gray-100);
}
</style>

<i18n lang="yaml">
  en-US:
    folders: 1 folder | {count} folders
    numberOfFolders: 'There are {amount} in your portfolio'
    addDelegator: 'Add delegators'
    addDelegatorDescription: 'Choose collaborators to delegate your portfolio to.'
    searchLabel: 'Please search for a collaborator:'
  fr-FR:
    folders: 1 dossier | {count} dossiers
    numberOfFolders: 'Il y a {amount} dans votre portefeuille'
    addDelegator: 'Ajouter des délégataires'
    addDelegatorDescription: 'Choisissez des collaborateurs à qui déléguer votre portefeuille'
    searchLabel: 'Veuillez rechercher un collaborateur :'
</i18n>
