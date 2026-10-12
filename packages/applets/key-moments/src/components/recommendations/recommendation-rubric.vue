<template>
  <section
    :id="rubricAnchorId(rubric)"
    class="key-moments-recommendation-rubric"
    :data-testid="`key-moments-recommendations-rubric-${rubric}`"
  >
    <!-- A div, not a header: the drawer styles every header as a block -->
    <div
      class="
        key-moments-recommendation-rubric__head
        flex
        flex--align-items-center
        flex--wrap
        flex-gap--3
      "
    >
      <h3 class="key-moments-recommendation-rubric__title margin--0">
        {{ t(`keyMoments.recommendations.rubrics.${rubric}`) }}
      </h3>
      <span
        class="font-small text-color--text-neutral-neutral"
        :data-testid="`key-moments-recommendations-rubric-${rubric}-count`"
      >
        {{ hasVisibility
          ? t('keyMoments.recommendations.rubric.count', { visible: visibleCount, total: views.length })
          : t('keyMoments.recommendations.rubric.total', { count: views.length }, views.length) }}
      </span>

      <PButton
        class="margin-left--auto"
        pSize="small"
        pType="tertiary"
        :pDisabled="canAdd === false"
        :pTestId="`key-moments-recommendations-rubric-${rubric}-add-button`"
        @click="emit('add')"
      >
        {{ t('keyMoments.recommendations.rubric.add') }}
      </PButton>
    </div>

    <p
      v-if="views.length === 0"
      class="key-moments-recommendation-rubric__empty text-color--text-neutral-neutral"
      :data-testid="`key-moments-recommendations-rubric-${rubric}-empty`"
    >
      {{ t('keyMoments.recommendations.rubric.empty') }}
    </p>

    <ul
      v-else
      ref="cardsList"
      class="
        key-moments-recommendation-rubric__list
        list-style-none
        padding--0
        margin--0
      "
      :data-list-id="`key-moments-recommendations-rubric-${rubric}`"
    >
      <li
        v-for="(view, index) in views"
        :key="view.key"
        :data-item-id="view.key"
      >
        <RecommendationCard
          :recommendation="view"
          :themes="themes"
          :catalog="catalog"
          :isOpen="openKeys.has(view.key)"
          :hasVisibility="hasVisibility"
          @toggle="emit('toggle', view.key)"
          @update="patch => emit('update', view.key, patch)"
          @remove="emit('remove', view.key)"
          @move="direction => moveByArrow(view.key, index, direction)"
        />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton } from '@pulse/styleguide/components'
import { useSortableList } from '../../composables/use-sortable-list.composable'
import { rubricAnchorId } from '../../utils/anchor.utils'
import { countVisible } from '../../utils/recommendations.utils'
import RecommendationCard from './recommendation-card.vue'
import type { RecommendationRubric } from '../../enums/key-moments.enums'
import type { RecommendationThemePayload } from '../../services/recommendations.service.types'
import type { SearchableOffer } from '../../types/key-moments.types'
import type { RecommendationView, WorkingRecommendation } from '../../types/recommendations.types'

const props = defineProps<{
  rubric: RecommendationRubric
  /** What a line of the rubric may pick from */
  themes: RecommendationThemePayload[]
  views: RecommendationView[]
  openKeys: Set<string>
  catalog: SearchableOffer[]
  /** The lines may be kept from the client: off for a category */
  hasVisibility: boolean
  /** False once the list is full */
  canAdd: boolean
}>()

const emit = defineEmits<{
  add: []
  move: [key: string, index: number]
  toggle: [key: string]
  update: [key: string, patch: Partial<WorkingRecommendation>]
  remove: [key: string]
}>()

const { t } = useI18n()

const cardsList = useTemplateRef<HTMLElement>('cardsList')

// One list per rubric and no group: a recommendation never changes rubric
useSortableList(cardsList, {
  handle: '.key-moments-editor-handle',
  onMove: event => emit('move', event.itemId, event.newIndex),
})

const visibleCount = computed(() => countVisible(props.views))

function moveByArrow(key: string, index: number, direction: 'up' | 'down'): void {
  const target = direction === 'up' ? index - 1 : index + 1

  if (target >= 0 && target < props.views.length) {
    emit('move', key, target)
  }
}
</script>

<style lang="scss" scoped>
@use '../../styles/editor';

.key-moments-recommendation-rubric {
  scroll-margin-top: var(--key-moments-sticky-offset, 0);

  &__head {
    padding: 8px 0 12px;
    border-bottom: 2px solid var(--key-moments-line);
    margin-bottom: 12px;
  }

  &__title {
    font-size: 17px;
    font-weight: 800;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__empty {
    padding: 16px;
    font-style: italic;
    border: 1px dashed var(--key-moments-line);
  }
}

@include editor.ghost;
</style>
