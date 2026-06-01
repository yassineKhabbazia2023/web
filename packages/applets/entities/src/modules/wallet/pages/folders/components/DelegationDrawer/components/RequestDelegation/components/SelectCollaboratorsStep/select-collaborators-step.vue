<template>
  <div data-testid="select-collaborators-step">
    <Transition
      name="fade-scale"
      mode="out-in"
    >
      <div
        v-if="isLoading"
        key="loader"
        class="flex flex--justify-content-center"
        data-testid="select-collaborators-loader"
      >
        <PLoader
          pType="primary"
          pSize="50"
        />
      </div>

      <div
        v-else
        key="content"
      >
        <p
          class="
            select-collaborators__title--sticky
            font-large
            font-bold
            margin-bottom--6
            padding-bottom--2
            padding-top--4
            position--sticky
            bg--white
          "
          data-testid="select-collaborators-title"
        >
          {{ t('entities.requestDelegation.selectCollaboratorsTitle') }}
        </p>

        <PAlert
          v-if="hasNoCollaborators"
          pType="warning"
          class="margin-bottom--6"
          data-testid="no-collaborators-alert"
        >
          <template #bold-text>
            {{ t('entities.requestDelegation.noCollaboratorsTitle') }}
          </template>
          {{ t('entities.requestDelegation.noCollaboratorsDescription') }}
        </PAlert>

        <TransitionGroup
          v-if="hasNoCollaborators === false"
          name="fade-drop"
          tag="div"
          class="select-collaborators__list select-collaborators__list--scrollable"
          data-testid="select-collaborators-list"
        >
          <CollaboratorListItem
            v-for="collab in sortedDisplayedCollaborators"
            :key="collab.contactId"
            :collaborator="collab"
            :isSelected="isSelected(collab.contactId)"
            :isDisabled="isCheckboxDisabled(collab.contactId)"
            @toggle="handleToggle(collab)"
          />
        </TransitionGroup>

        <div
          v-if="hasNoCollaborators === false"
          class="select-collaborators__search margin-top--6"
          data-testid="select-collaborators-search"
        >
          <label class="font-small font-bold margin-bottom--2">
            {{ t('entities.requestDelegation.findAnotherCollaborator') }}
          </label>
          <PAutocomplete
            v-model="searchQuery"
            :pPlaceholder="t('entities.requestDelegation.searchCollaboratorPlaceholder')"
            :pFetchSuggestions="fetchCollaboratorSuggestions"
            :pLoading="isSearchLoading"
            valueKey="contactId"
            class="margin-top--2"
            data-testid="search-collaborators-autocomplete"
            @select="handleAddFromDropdown"
          >
            <template #prefix>
              <PLoader
                v-if="isSearchLoading"
                pType="primary"
                pSize="16"
              />
              <PIcon
                v-else
                pName="search"
              />
            </template>
            <template #default="{ item }">
              <div
                class="select-collaborators__dropdown-item padding-y--2"
                :data-testid="`select-collaborators-dropdown-item-${item.contactId}`"
              >
                {{ item.firstName }} {{ item.lastName }} - {{ item.personaName }} - {{ item.email }}
              </div>
            </template>
          </PAutocomplete>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PAutocomplete, PIcon, PLoader } from '@pulse/styleguide/components'
import type { Collab } from '@entities/types'
import type { SelectCollaboratorsStepProps } from './select-collaborators-step.types'
import { useSelectCollaboratorsStep } from './select-collaborators-step.composable'
import CollaboratorListItem from './components/collaborator-list-item.vue'

const props = defineProps<SelectCollaboratorsStepProps>()

const emit = defineEmits<{
  'update:selected-collaborators': [Collab[]]
}>()

const { t } = useI18n()

function handleSelectionChange(collabs: Collab[]) {
  emit('update:selected-collaborators', collabs)
}

const {
  isLoading,
  isSearchLoading,
  hasNoCollaborators,
  sortedDisplayedCollaborators,
  searchQuery,
  isSelected,
  isCheckboxDisabled,
  handleToggle,
  fetchCollaboratorSuggestions,
  handleAddFromDropdown,
  loadInitialCollaborators,
} = useSelectCollaboratorsStep(props.accountId, handleSelectionChange, props.initialSelectedCollaborators)

onMounted(async () => {
  await loadInitialCollaborators()
})
</script>

<style lang="scss" scoped>
.select-collaborators__list--scrollable {
  max-height: 450px;
  overflow-y: auto;

  :deep(.collaborator-list-item) {
    border-bottom: 1px solid var(--p-gray-100);
  }
}

.select-collaborators__title--sticky {
  top: 0;
  z-index: 10;
}
</style>
