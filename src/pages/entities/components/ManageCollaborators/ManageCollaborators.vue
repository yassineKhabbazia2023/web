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
          ref="formRef"
          :pModel="formValues"
          pLabelPosition="top"
          pHideRequiredAsterisk
        >
          <PFormItem
            pProp="selectedCollaborator"
            :pLabel="t('searchCollaborator')"
            class="margin-bottom--0"
          >
            <PAutocomplete
              v-model="formValues.selectedCollaborator"
              :pFetchSuggestions="() => []"
              :pPlaceholder="t('selectCollaborator')"
              pClearable
            >
              <template #prefix>
                <PIcon>
                  <PISearch />
                </PIcon>
              </template>
            </PAutocomplete>
          </PFormItem>
        </PForm>
      </template>
    </PBlockHeader>
    <div class="margin-top--6">
      <PUserAction
        :pProfile="
          getInitials(
            defaultCollaborator?.firstName,
            defaultCollaborator?.lastName
          )
        "
        :pTitle="collaboratorFullName"
        :pDescription="defaultCollaborator?.email ?? ''"
        :pRole="collaboratorOccupation"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PBlockHeader,
  PAutocomplete,
  PUserAction,
  PForm,
  PIcon,
  PISearch,
  PFormItem
} from '@kpmg/styleguide'
import { getInitials } from '@/helper'
import type { ManageCollaboratorsProps } from './ManageCollaboratorsTypes'

const props = defineProps<ManageCollaboratorsProps>()
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const formValues = ref({
  selectedCollaborator: undefined
})

const collaboratorFullName = computed(
  () =>
    `${props.defaultCollaborator?.firstName} ${props.defaultCollaborator?.lastName}`
)
const collaboratorOccupation = computed(
  () => props.defaultCollaborator?.occupation ?? t('consultantAdvisory')
)
</script>

<i18n lang="yaml">
en-US:
  addCollaborators: 'Add collaborators'
  searchCollaborator: 'Please search for a collaborator :'
  selectCollaborator: 'Select one or more collaborators'
  description: 'You can add collaborators to this offer.'
  consultantAdvisory: 'Consultant Advisory'
fr-FR:
  addCollaborators: 'Ajoutez des collaborateurs'
  searchCollaborator: 'Veuillez rechercher un collaborateur :'
  selectCollaborator: 'Sélectionner un ou plusieurs collaborateurs'
  description: 'Vous pouvez ajouter des collaborateurs sur cette offre.'
  consultantAdvisory: 'Consultant en conseil'
</i18n>
