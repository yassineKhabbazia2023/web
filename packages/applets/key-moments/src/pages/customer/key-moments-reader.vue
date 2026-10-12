<template>
  <div
    class="
      key-moments
      flex
      flex--direction-column
    "
  >
    <section class="key-moments__content">
      <div
        class="
          key-moments__header
          flex
          flex--wrap
          flex--align-items-flex-start
          flex--justify-content-space-between
          flex-gap--4
        "
      >
        <div>
          <PTitle>
            <i18n-t
              v-if="entityName !== undefined"
              keypath="keyMoments.titleOf"
              scope="global"
              tag="span"
            >
              <template #name>
                <span class="key-moments__entity-name text-color--jungle-400">
                  {{ entityName }}
                </span>
              </template>
            </i18n-t>
            <template v-else>
              {{ t('keyMoments.title') }}
            </template>
          </PTitle>
          <p
            v-if="caption.length > 0"
            class="
              font-small
              text-color--text-neutral-neutral
              margin-top--1
            "
            data-testid="customer-key-moments-caption"
          >
            {{ caption.join(CAPTION_SEPARATOR) }}
          </p>
        </div>

        <div
          class="
            flex
            flex--wrap
            flex--align-items-flex-end
            flex-gap--4
          "
        >
          <!-- Offered from two exercices on: the caption already names a single one -->
          <PDropdown
            v-if="exerciceOptions !== undefined && exerciceOptions.length > 1"
            class="key-moments__exercice-select"
            :modelValue="selectedExerciceId"
            :pOptions="exerciceOptions"
            :pAriaLabel="t('keyMoments.exerciceSelect.ariaLabel')"
            pSize="small"
            pTestId="customer-key-moments-exercice-select"
            @update:model-value="exerciceId => emit('select-exercice', exerciceId as number)"
          />

          <!-- A reading choice for the client, not part of what the firm arbitrated -->
          <FilterSegment
            v-if="hasUnitSelect !== false && hasReport"
            class="flex--align-items-flex-end"
            :label="t('keyMoments.filters.unit')"
            :options="unitOptions"
            :selectedValue="isInThousands"
            testId="customer-key-moments-filter-unit"
            @select="value => emit('toggle-thousands', value === true)"
          />
        </div>
      </div>

      <div
        class="
          key-moments__body
          flex
          flex-gap--6
        "
      >
        <Nav
          v-if="hasNav"
          :screens="screens"
          :hasRecommendations="recommendations.length > 0"
          :recommendationRubrics="navRubrics"
        />

        <div class="key-moments__report">
          <!-- Replaced by the embedding page while there is nothing to read yet -->
          <slot name="report">
            <div class="key-moments__screens">
              <section
                v-for="(screen, index) in screens"
                :id="screenAnchorId(screen.id)"
                :key="screen.id"
                class="key-moments__screen"
                :style="{ '--key-moments-enter-rank': index }"
                :data-testid="`customer-key-moments-${screen.id}-screen`"
              >
                <SectionHead
                  :rank="formatScreenRank(index)"
                  :title="screen.title"
                  :subtitle="screen.subtitle"
                />

                <div class="key-moments__grid">
                  <Widget
                    v-for="(widget, widgetIndex) in screen.widgets"
                    :id="widgetAnchorId(widget.id)"
                    :key="widget.id"
                    :widget="widget"
                    isReadOnly
                    :style="{
                      gridColumn: `span ${widget.span}`,
                      '--key-moments-enter-rank': widgetIndex,
                    }"
                  />
                </div>
              </section>

              <!-- Omitted for the client when empty; the preview states the silence -->
              <CustomerRecommendationsSection
                :recommendations="recommendations"
                :rank="formatScreenRank(screens.length)"
                :isPreview="isPreview === true"
                :style="{ '--key-moments-enter-rank': screens.length }"
              />
            </div>
          </slot>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useResponsive } from '@pulse/styleguide'
import { PDropdown, PTitle } from '@pulse/styleguide/components'
import FilterSegment from '../../components/filters/filter-segment.vue'
import Nav from '../../components/nav/nav.vue'
import CustomerRecommendationsSection from '../../components/recommendations/customer-recommendations-section.vue'
import SectionHead from '../../components/section-head/section-head.vue'
import Widget from '../../components/widget/widget.vue'
import { screenAnchorId, widgetAnchorId } from '../../utils/anchor.utils'
import { formatScreenRank } from '../../utils/rank.utils'
import { groupedByRubric } from '../../utils/recommendations.utils'
import { CAPTION_SEPARATOR } from '../../const/key-moments.consts'
import type { NavRubric } from '../../components/nav/nav.types'
import type { FilterOption } from '../../types/key-moments.types'
import type { KeyMomentsReaderProps } from './key-moments-reader.types'

// The report as the client reads it, fed by the client page or the draft preview without fetching anything
const props = defineProps<KeyMomentsReaderProps>()

const emit = defineEmits<{
  'select-exercice': [exerciceId: number]
  'toggle-thousands': [inThousands: boolean]
}>()

const { t } = useI18n()

const { isMobile } = useResponsive()

// No navigation on a phone: stacked above the report, it only delays the figures
const hasNav = computed(() => props.hasReport && isMobile.value === false)

// Every published recommendation is visible by construction, so the counter reads N / N
const navRubrics = computed<NavRubric[]>(() => groupedByRubric(props.recommendations).map(rubric => ({
  rubric: rubric.rubric,
  visibleCount: rubric.recommendations.length,
  totalCount: rubric.recommendations.length,
})))

const unitOptions = computed<FilterOption[]>(() => [
  { value: false, label: t('keyMoments.filters.units.euro') },
  { value: true, label: t('keyMoments.filters.units.thousands') },
])
</script>

<style scoped lang="scss">
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/report';

.key-moments {
  // A select draws its value in an absolute layer: without a width it shrinks to its arrow
  &__exercice-select {
    width: 220px;
  }

  @include breakpoints.media(xs) {

    // A column rather than a wrap, so the title does not squeeze the controls beside it
    &__header {
      flex-direction: column;
      align-items: stretch;
    }

    // The entity name opens its own line, so the title does not read as one long sentence
    &__entity-name {
      display: block;
    }

    &__exercice-select {
      width: 100%;
    }

  }
}
</style>
