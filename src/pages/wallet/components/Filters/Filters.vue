<template>
<div class="margin-bottom--6">
  <PLoader v-if="state.isLoading" />
  <div
    v-if="!state.isLoading"
    class="
      flex
      filter
      padding-top--3
      padding-bottom--4
      padding-x--6
      shadow--3
      margin-negative-x--6
    "
  >
    <div>
      <p class="filter__title font-semibold margin-bottom--3">
        {{ t('fileBoardingRate') }}
      </p>
      <div class="filter__list flex">
        <FilterOption
          v-for="({ content, number, icon, color, filterValue, isSelected }, index) in state.entityTags"
          :key="index"
          :number="number"
          :content="content"
          :icon="icon"
          :color="color"
          :isSelected="isSelected"
          data-testid="filter-option"
          @click="handleClickFilter(filterValue, index)"
          @close="handleClose(index)"
        />
      </div>
    </div>
    <div
      class="
        separator
        margin-x--6
        hidden-sm-and-down"
    >
    </div>
    <div>
      <div>
        <p class="filter__title font-semibold margin-bottom--3">
          {{ t('userConnectionRate') }}
        </p>
        <div class="filter__list flex">
          <FilterOption
            v-for="({ content, number, icon }, index) in state.userTags"
            :key="index"
            :number="number"
            :content="content"
            :icon="icon"
            color="gray-500"
          />
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Component, onMounted, reactive } from 'vue'
import {
  PIArrowRepeat,
  PICheckCircle,
  PIPatchCheck,
  PIPerson,
  PIPower,
  PIArrowUpCircle,
  PLoader
} from '@kpmg/styleguide'
import { commonApi } from '@kpmg/common'
import type { IFilterOption, IState } from './types'
import { EntityStatus } from './types'
import FilterOption from '../FilterOption'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const TAGS = [
  {
    content: t('toDeploy'),
    icon: PIArrowUpCircle as Component,
    color: 'warning',
    apiKey: 'entityToDeploy',
    filterValue: EntityStatus.TO_DEPLOY,
    isSelected: false
  },
  {
    content: t('inProgress'),
    icon: PIArrowRepeat as Component,
    color: 'amethyste',
    apiKey: 'entityInProgress',
    filterValue: EntityStatus.IN_PROGRESS,
    isSelected: false
  },
  {
    content: t('connected'),
    icon: PICheckCircle as Component,
    color: 'success',
    apiKey: 'entityConnected',
    filterValue: EntityStatus.CONNECTED,
    isSelected: false
  },
  {
    content: t('declared'),
    icon: PIPatchCheck as Component,
    apiKey: 'userDeclared',
    isSelected: false
  },
  {
    content: t('connected'),
    icon: PIPower as Component,
    apiKey: 'userConnected',
    isSelected: false
  },
  {
    content: t('guests'),
    icon: PIPerson as Component,
    apiKey: 'userInvited',
    isSelected: false
  }
] as IFilterOption[]

const state: IState = reactive({
  userTags: [],
  entityTags: [],
  isLoading: undefined
})

const emit = defineEmits<{
  'filterByStatus': [EntityStatus]
  'removeFilter': []
}>()

onMounted(async () => {
  state.isLoading = true
  try {
    const { data } = await commonApi().wallet.get('statistics')
    const tagsWithNumber = TAGS.map(({ apiKey, ...rest }) => ({
      ...rest,
      apiKey,
      number: data[apiKey]
    }))
    state.userTags = tagsWithNumber.filter(({ apiKey }) => apiKey.startsWith('user'))
    state.entityTags = tagsWithNumber.filter(({ apiKey }) => apiKey.startsWith('entity'))
  } catch (err) {
    console.error(err)
  }
  state.isLoading = false
})
const handleClickFilter = (filterValue: EntityStatus, index:number) => {
  resetSelection(index)
  state.entityTags[index].isSelected = true
  emit('filterByStatus', filterValue)

}
const resetSelection = (excludedIndex: number) => {
  const copyEntityTags = [...state.entityTags]
  copyEntityTags.forEach((tags, index) => {
    tags.isSelected = index === excludedIndex
  })
  state.entityTags = copyEntityTags
}
const handleClose = (index: number) => {
  state.entityTags[index].isSelected = false
  emit('removeFilter')
}
</script>

<style lang="scss" scoped>
.filter {
  @media (min-width: 993px) {
    align-items: end;
  }
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: start;
    gap: 2.4rem
  }
  &__list {
    column-gap: 1.2rem;
  }
  &__title {
    font-size: var(--el-font-size-small);
    color: var(--el-color-neutral-gray-500);
  }
}
.separator {
  height: 3.8rem;
  width: 0.2rem;
  background: var(--el-color-neutral-gray-100);
}
</style>

<i18n lang="yaml">
  en-US:
    fileBoardingRate: 'File boarding rate'
    toDeploy: 'To Deploy'
    inProgress: 'In progress'
    connected: 'Connected'
    userConnectionRate: 'User connection rate'
    declared: 'Declared'
    guests: 'Guest(s)'
  fr-FR:
    fileBoardingRate: "Taux d'embarquement dossier"
    toDeploy: 'A déployer'
    inProgress: 'En cours'
    connected: 'Connecté(s)'
    userConnectionRate: 'Taux de connexion utilisateur'
    declared: 'Déclaré(s)'
    guests: 'Invité(s)'
</i18n>
