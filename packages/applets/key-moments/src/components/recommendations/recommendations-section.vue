<template>
  <section
    :id="RECOMMENDATIONS_ANCHOR_ID"
    class="key-moments__screen key-moments-recommendations"
    data-testid="key-moments-recommendations-section"
  >
    <SectionHead
      :rank="rank"
      :subtitle="t('keyMoments.recommendations.subtitle')"
      :title="t('keyMoments.recommendations.title')"
    />

    <!-- The choice screen: first choice, or a change the reader may still cancel -->
    <CategoryPicker
      v-if="hasCategory === false || isChangingCategory"
      :categories="categories"
      :isChanging="hasCategory"
      @choose="onChoose"
      @cancel="isChangingCategory = false"
    />

    <template v-else>
      <RecommendationsHeader
        :categoryLabel="categoryLabel"
        :totalCount="totalCount"
        :visibleCount="visibleCount"
        :isSaving="isSaving"
        :hasSaveFailed="hasSaveFailed"
        @change-category="isChangingCategory = true"
      />

      <RecommendationRubrics
        :rubricViews="rubricViews"
        :catalog="catalog"
        :canAdd="canAdd"
        hasVisibility
        :areThemesUnreadable="areThemesUnreadable"
        testIdPrefix="key-moments-recommendations"
        @add="(rubric, settle) => emit('add', rubric, settle)"
        @move="(key, index) => emit('move', key, index)"
        @update="(key, patch) => emit('update', key, patch)"
        @remove="key => emit('remove', key)"
      />
    </template>

    <!-- Replacing copies the category over everything, manual additions included -->
    <PConfirmationPopup
      pAppendToBody
      :pIsVisible="pendingCategoryId !== undefined"
      :pTitle="t('keyMoments.recommendations.replace.title')"
      :pConfirmButtonContent="t('keyMoments.recommendations.replace.confirm')"
      :pCancelButtonContent="t('keyMoments.recommendations.replace.cancel')"
      pTestId="key-moments-recommendations-replace-popup"
      @on-confirm-button-click="confirmReplace"
      @on-cancel-button-click="pendingCategoryId = undefined"
    >
      <p>{{ t('keyMoments.recommendations.replace.text', { label: pendingCategoryLabel }) }}</p>
    </PConfirmationPopup>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PConfirmationPopup } from '@pulse/styleguide/components'
import SectionHead from '../section-head/section-head.vue'
import CategoryPicker from './category-picker.vue'
import RecommendationRubrics from './recommendation-rubrics.vue'
import RecommendationsHeader from './recommendations-header.vue'
import { RECOMMENDATIONS_ANCHOR_ID } from '../../utils/anchor.utils'
import type { RecommendationRubric as Rubric } from '../../enums/key-moments.enums'
import type { CategoryPayload } from '../../services/recommendations.service.types'
import type { SearchableOffer } from '../../types/key-moments.types'
import type { RubricView, WorkingRecommendation } from '../../types/recommendations.types'

const props = defineProps<{
  rank: string
  categories: CategoryPayload[]
  /** Absent when the category left the referential since it was chosen */
  categoryLabel: string | undefined
  rubricViews: RubricView[]
  isSaving: boolean
  hasSaveFailed: boolean
  areThemesUnreadable: boolean
  hasCategory: boolean
  totalCount: number
  visibleCount: number
  canAdd: boolean
  catalog: SearchableOffer[]
}>()

const emit = defineEmits<{
  choose: [categoryId: number]
  /** Returns the key of the added line, which opens unfolded */
  add: [rubric: Rubric, settle: (key: string) => void]
  move: [key: string, index: number]
  update: [key: string, patch: Partial<WorkingRecommendation>]
  remove: [key: string]
}>()

const { t } = useI18n()

const isChangingCategory = ref(false)
/** A category chosen while one exists: the replacement waits for a confirmation */
const pendingCategoryId = ref<number>()

const pendingCategoryLabel = computed(() => props.categories
  .find(category => category.id === pendingCategoryId.value)
  ?.label ?? '')

// The very first choice asks nothing: there is nothing to erase yet
function onChoose(categoryId: number): void {
  if (props.hasCategory) {
    pendingCategoryId.value = categoryId

    return
  }

  emit('choose', categoryId)
}

function confirmReplace(): void {
  const categoryId = pendingCategoryId.value

  pendingCategoryId.value = undefined
  isChangingCategory.value = false

  if (categoryId !== undefined) {
    emit('choose', categoryId)
  }
}
</script>
