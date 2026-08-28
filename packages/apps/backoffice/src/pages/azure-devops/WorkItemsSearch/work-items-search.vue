<template>
  <div class="work-items-search">
    <h2 class="font-medium font-bold text-color--black-rock-900 margin-bottom--1">
      Rechercher des Work Items
    </h2>

    <p class="text-color--neutral-gray-400 font-small margin-bottom--4">
      Entrez les IDs de commits pour récupérer les work items liés aux commits dans cette plage.
    </p>

    <PForm>
      <div
        v-if="availableRepositories && availableRepositories.length > 0"
      >
        <PFormItem
          pLabel="Filtre par repository"
        >
          <div class="work-items-search__repository-filter">
            <PDropdown
              :modelValue="repositoryFilter"
              data-testid="work-items-repository-filter"
              pPlaceholder="Sélectionnez un repository"
              :pOptions="repositoryFilterOptions"
              pFilterable
              pClearable
              @update:model-value="repositoryFilter = $event ?? ''"
            />
          </div>
        </PFormItem>
      </div>

      <div
        v-if="repositoryFilter !== ''"
        class="flex flex-gap--4 flex--align-items-center"
      >
        <PFormItem
          class="work-items-search__input"
          pLabel="Commit de départ (plus ancien)"
          pLabelFor="from-commit-input"
          :pError="fromCommitIdError ?? undefined"
        >
          <div class="flex flex-gap--1 flex--align-items-center">
            <PInput
              id="from-commit-input"
              v-model="fromCommitId"
              data-testid="work-items-from-commit-input"
              pPlaceholder="abc123..."
              :pDisabled="isLoading"
              :pStatus="fromCommitIdError ? 'error' : undefined"
            />
            <PButton
              pType="tertiary"
              pSize="small"
              pIconOnly
              data-testid="from-commit-explore-button"
              :pDisabled="isLoading"
              @click="$emit('openExplorer', 'from')"
            >
              <PIcon
                pName="search"
                pSize="14"
              />
            </PButton>
          </div>
        </PFormItem>

        <PFormItem
          class="work-items-search__input"
          pLabel="Commit de fin (plus récent)"
          pLabelFor="to-commit-input"
          :pError="toCommitIdError ?? undefined"
        >
          <div class="flex flex-gap--1 flex--align-items-center">
            <PInput
              id="to-commit-input"
              v-model="toCommitId"
              data-testid="work-items-to-commit-input"
              pPlaceholder="def456..."
              :pDisabled="isLoading"
              :pStatus="toCommitIdError ? 'error' : undefined"
            />
            <PButton
              pType="tertiary"
              pSize="small"
              pIconOnly
              data-testid="to-commit-explore-button"
              :pDisabled="isLoading"
              @click="$emit('openExplorer', 'to')"
            >
              <PIcon
                pName="search"
                pSize="14"
              />
            </PButton>
          </div>
        </PFormItem>

        <div class="flex flex--direction-column flex-gap--2">
          <PButton
            pType="primary"
            pSize="default"
            data-testid="work-items-search-button"
            :pDisabled="canSearch === false"
            :pLoading="isLoading"
            @click="$emit('search')"
          >
            <PIcon
              pName="search"
              pSize="16"
              class="el-button__icon--left"
            />
            Rechercher
          </PButton>
          <PCheckbox
            v-model="backofficeOnly"
            data-testid="backoffice-only-checkbox"
          >
            BackOffice only
          </PCheckbox>
        </div>
      </div>

      <div
        v-if="repositoryFilter !== ''"
        class="flex flex-gap--4 margin-top--1"
      >
        <div class="work-items-search__tag-row">
          <PLoader
            v-if="isLoadingMepTag"
            pSize="small"
          />
          <template v-else-if="latestMepTag !== null">
            <span class="text-color--neutral-gray-400 font-small margin-right--2">Dernière MEP :</span>
            <PTag
              class="work-items-search__mep-tag"
              pColor="blue"
              pClickable
              :pContent="latestMepTag.name"
              data-testid="latest-mep-tag"
              @click="$emit('applyMepTag')"
            />
          </template>
        </div>

        <div class="work-items-search__tag-row">
          <PLoader
            v-if="isLoadingHead"
            pSize="small"
          />
          <template v-else-if="headInfo !== null">
            <span class="text-color--neutral-gray-400 font-small margin-right--2">Tag le plus récent :</span>
            <PTag
              class="work-items-search__mep-tag"
              pColor="blue"
              pClickable
              :pContent="headTagLabel"
              data-testid="head-tag"
              @click="$emit('applyHead')"
            />
          </template>
        </div>
      </div>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PForm, PFormItem, PInput, PButton, PIcon, PTag, PLoader, PCheckbox, PDropdown } from '@pulse/styleguide/components'
import type { WorkItemsSearchProps } from './work-items-search.types'

const fromCommitId = defineModel<string>('fromCommitId', { required: true })
const toCommitId = defineModel<string>('toCommitId', { required: true })
const backofficeOnly = defineModel<boolean>('backofficeOnly', { required: true })
const repositoryFilter = defineModel<string>('repositoryFilter', { default: '' })

const props = defineProps<WorkItemsSearchProps>()

defineEmits<{
  'search': []
  'applyMepTag': []
  'applyHead': []
  'openExplorer': [target: 'from' | 'to']
}>()

const repositoryFilterOptions = computed(() => {
  if (props.availableRepositories === undefined) {
    return []
  }
  return props.availableRepositories.map((repo) => ({
    pValue: repo,
    pLabel: repo,
  }))
})

const headTagLabel = computed(() => {
  if (props.headInfo === null) {
    return ''
  }
  return props.headInfo.tagName !== null
    ? `HEAD (${props.headInfo.tagName})`
    : 'HEAD'
})
</script>

<style lang="scss" scoped>
.work-items-search {
  &__repository-filter {
    width: min(400px, 60vw);
  }

  &__input {
    flex: 1;
    max-width: 300px;
  }

  &__tag-row {
    flex: 1;
    max-width: 300px;
    min-height: 24px;
  }

  &__mep-tag {
    cursor: pointer;
  }
}
</style>
