<template>
  <div class="filters flex">
    <div>
      <div
        class="
          margin-bottom--2
          font-semibold
          font-small
          text-color--neutral-gray-500
        "
      >
        {{ t('fileBoardingRate') }}
      </div>
      <PFilterGroupEntityStatus
        :modelValue="activeFilters"
        :pFilters="onBoardingFilters"
        class="filters__filter-group--with-separator padding-right--3"
        @toggle="onToggleFilter"
      />
    </div>
    <div
      class="padding-left--3"
    >
      <div
        class="
          margin-bottom--2
          font-semibold
          font-small
          text-color--neutral-gray-500
        "
      >
        {{ t('userConnectionRate') }}
      </div>
      <PFilterGroupEntityStatus
        :modelValue="activeFilters"
        :pFilters="userConnectionFilters"
        class="padding-right--3"
        @toggle="onToggleFilter"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { PFilterGroup } from '@pulse/styleguide/components'
import { type FilterOption } from '@pulse/styleguide/types'
import { fetchEntitiesStatistics } from '@entities/services/wallet'
import { EntityStatus } from './FiltersTypes'
import { getOnboardingFilters, getUserConnexionFilters } from './FiltersUtils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeFilters = ref<EntityStatus[]>([])
const PFilterGroupEntityStatus = PFilterGroup<EntityStatus | undefined>

const onBoardingFilters = ref<FilterOption<EntityStatus | undefined>[]>([])
const userConnectionFilters = ref<FilterOption<EntityStatus | undefined>[]>([])

const emit = defineEmits<{
  'filterByStatus': [EntityStatus]
  'removeFilter': []
}>()

const FILTER_LABELS: Record<string, string> = {
  toDeploy: t('toDeploy'),
  inProgress: t('inProgress'),
  connected: t('connected'),
  declared: t('declared'),
  guests: t('guests'),
}

function onToggleFilter(filterKey: EntityStatus | undefined, isSelected: boolean) {
  if (isSelected && filterKey) {
    activeFilters.value = [filterKey]
    emit('filterByStatus', filterKey)
  } else {
    activeFilters.value = []
    emit('removeFilter')
  }
}

onMounted(async () => {
  try {
    const data = await fetchEntitiesStatistics()
    onBoardingFilters.value = getOnboardingFilters(FILTER_LABELS, data)
    userConnectionFilters.value = getUserConnexionFilters(FILTER_LABELS, data)
  } catch (err) {
    logger.error(err)
  }
})
</script>

<style lang="scss" scoped>
.filters {
  &__filter-group {
    &--with-separator {
      height: 32px;
      border-right: 1px solid var(--p-gray-100);;
    }
  }
  &__title {
    color: var(--p-gray-500);
  }
}
</style>

<i18n lang="yaml">
  en-US:
    fileBoardingRate: 'File boarding'
    toDeploy: 'To Deploy'
    inProgress: 'In progress'
    connected: 'Connected'
    userConnectionRate: 'User connection'
    declared: 'Declared'
    guests: 'Guest(s)'
  fr-FR:
    fileBoardingRate: "Embarquement dossier"
    toDeploy: 'A déployer'
    inProgress: 'En cours'
    connected: 'Connecté(s)'
    userConnectionRate: 'Connexion utilisateur'
    declared: 'Déclaré(s)'
    guests: 'Invité(s)'
</i18n>
