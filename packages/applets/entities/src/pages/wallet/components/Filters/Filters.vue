<template>
  <PFilterGroupEntityStatus
    :modelValue="activeFilters"
    :pFilters="filters"
    @toggle="onToggleFilter"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { PFilterGroup } from '@pulse/styleguide/components'
import { type FilterOption } from '@pulse/styleguide/types'
import { fetchEntitiesStatistics } from '@entities/services/wallet'
import { EntityStatus } from './FiltersTypes'
import { getFilters } from './FiltersUtils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const activeFilters = ref<EntityStatus[]>([])
const PFilterGroupEntityStatus = PFilterGroup<EntityStatus | undefined>

const filters = ref<FilterOption<EntityStatus | undefined>[]>([])

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
    filters.value = getFilters(FILTER_LABELS, data)
  } catch (err) {
    console.error(err)
  }
})
</script>

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
