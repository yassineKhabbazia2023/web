<template>
  <!-- Without the themes no line can be placed in its rubric -->
  <p
    v-if="areThemesUnreadable === true"
    class="text-color--text-basic-error"
    :class="isCompact ? 'margin-top--4' : 'margin-top--6'"
    :data-testid="`${testIdPrefix}-themes-error`"
  >
    {{ t('keyMoments.recommendations.themesError') }}
  </p>

  <div
    v-else
    class="flex flex--direction-column"
    :class="isCompact ? 'flex-gap--5 margin-top--4' : 'flex-gap--7 margin-top--6'"
  >
    <RecommendationRubric
      v-for="{ rubric, themes, views } in rubricViews"
      :key="rubric"
      :rubric="rubric"
      :themes="themes"
      :views="views"
      :openKeys="openKeys"
      :catalog="catalog"
      :canAdd="canAdd"
      :hasVisibility="hasVisibility"
      @add="onAdd(rubric)"
      @move="(key, index) => emit('move', key, index)"
      @toggle="toggle"
      @update="(key, patch) => emit('update', key, patch)"
      @remove="onRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import RecommendationRubric from './recommendation-rubric.vue'
import { toggled, withValue, withoutValue } from '../../utils/set.utils'
import type { RecommendationRubric as Rubric } from '../../enums/key-moments.enums'
import type { SearchableOffer } from '../../types/key-moments.types'
import type { RubricView, WorkingRecommendation } from '../../types/recommendations.types'

defineProps<{
  rubricViews: RubricView[]
  catalog: SearchableOffer[]
  canAdd: boolean
  /** The lines may be kept from the client: off for a category */
  hasVisibility: boolean
  areThemesUnreadable: boolean
  /** Tighter spacing, for the drawer */
  isCompact?: boolean
  testIdPrefix: string
}>()

const emit = defineEmits<{
  /** Handed the key of the added line back, which opens unfolded */
  add: [rubric: Rubric, settle: (key: string) => void]
  move: [key: string, index: number]
  update: [key: string, patch: Partial<WorkingRecommendation>]
  remove: [key: string]
}>()

const { t } = useI18n()

/** Unfolded cards, by key; not persisted */
const openKeys = ref(new Set<string>())

function toggle(key: string): void {
  openKeys.value = toggled(openKeys.value, key)
}

function onAdd(rubric: Rubric): void {
  emit('add', rubric, (key) => {
    openKeys.value = withValue(openKeys.value, key)
  })
}

function onRemove(key: string): void {
  openKeys.value = withoutValue(openKeys.value, key)
  emit('remove', key)
}
</script>
