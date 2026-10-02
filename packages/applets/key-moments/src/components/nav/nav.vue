<template>
  <nav
    class="key-moments-nav"
    :class="{ 'key-moments-nav--collapsed': isCollapsed }"
    :aria-label="t('keyMoments.nav.title')"
    data-testid="key-moments-nav"
  >
    <div
      class="
        key-moments-nav__head
        flex
        flex--align-items-center
        flex--justify-content-space-between
        flex-gap--2
        margin-bottom--4
      "
    >
      <!-- Kept mounted while folded, so the toggle slides instead of jumping -->
      <h2
        class="
          key-moments-nav__title
          margin--0
          overflow-hidden
          font-size--11
          font-bold
          text-uppercase
          no-wrap
        "
        :aria-hidden="isCollapsed"
      >
        {{ t('keyMoments.nav.title') }}
      </h2>

      <PButton
        pSize="small"
        pIconOnly
        pType="tertiary"
        :aria-expanded="isCollapsed === false"
        :aria-label="isCollapsed
          ? t('keyMoments.nav.expand')
          : t('keyMoments.nav.collapse')"
        pTestId="key-moments-nav-toggle-button"
        @click="isCollapsed = isCollapsed === false"
      >
        <PIcon
          class="key-moments-nav__toggle-icon"
          :class="{ 'key-moments-nav__toggle-icon--flipped': isCollapsed }"
          pName="chevronDoubleLeft"
        />
      </PButton>
    </div>

    <!-- Clipped rather than unmounted so the fold animates; `inert` takes it out of reach -->
    <div
      class="key-moments-nav__body"
      :inert="isCollapsed"
    >
      <!-- One section unfolded at a time, so the whole navigation fits a screen -->
      <div
        ref="screensListElement"
        class="key-moments-nav__screens"
        data-list-id="screens"
      >
        <div
          v-for="screen in screens"
          :key="screen.id"
          class="key-moments-nav__group"
          :data-item-id="screen.id"
          @mouseenter="alwaysExpanded === false && scheduleUnfold(screen.id)"
          @mouseleave="cancelScheduledUnfold"
        >
          <div
            class="
              key-moments-nav__screen-row
              flex
              flex--align-items-center
              flex-gap--1
            "
          >
            <NavSectionButton
              :label="screen.title"
              :isCurrent="isCurrentScreen(screen)"
              :isHidden="isScreenFullyHidden(screen)"
              :count="countVisibleWidgets(screen)"
              :isExpanded="isExpanded(screen.id)"
              :data-testid="`key-moments-nav-screen-${screen.id}`"
              @click="onScreenClick(screen.id)"
              @focus="alwaysExpanded === false && unfold(screen.id)"
            />

            <!-- Beside the entry: a button never nests in another one -->
            <slot
              name="screen-tools"
              :screen="screen"
            />
          </div>

          <!-- Two nested elements: the outer animates its row from 0fr to 1fr, the inner clips -->
          <div
            class="key-moments-nav__widgets grid"
            :class="{ 'key-moments-nav__widgets--open': isExpanded(screen.id) }"
            :inert="isExpanded(screen.id) === false"
          >
            <div
              :ref="element => emit('register-widgets-list', screen.id, element as HTMLElement | null)"
              class="overflow-hidden"
              :data-list-id="screen.id"
            >
              <div
                v-for="widget in screen.widgets"
                :key="widget.id"
                class="
                  key-moments-nav__widget-row
                  flex
                  flex--align-items-center
                  flex-gap--1
                "
                :data-item-id="widget.id"
              >
                <!-- Beside the entry: a button never nests in another one -->
                <slot
                  name="widget-tools"
                  :widget="widget"
                  :screen="screen"
                />

                <NavEntryButton
                  :label="widget.title"
                  :isActive="activeAnchorId === widgetAnchorId(widget.id)"
                  :isHidden="widget.isHidden"
                  :state="widget.isHidden ? t('keyMoments.visibility.hiddenBadge') : undefined"
                  :data-testid="`key-moments-nav-widget-${widget.id}`"
                  @click="goTo(widgetAnchorId(widget.id))"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <slot name="after-screens" />

      <!-- Driven by a flag, not pushed into `screens`: the recommendations are not part of the template -->
      <div
        v-if="hasRecommendations"
        class="key-moments-nav__group"
        @mouseenter="alwaysExpanded === false && scheduleUnfold(RECOMMENDATIONS_ANCHOR_ID)"
        @mouseleave="cancelScheduledUnfold"
      >
        <!-- Without a category, or with every rubric empty, the reader gets no recommendation -->
        <NavSectionButton
          :label="t('keyMoments.recommendations.title')"
          :isCurrent="isRecommendationsCurrent"
          :isHidden="isRecommendationsHidden"
          :count="filledRubricsCount"
          :isExpanded="isExpanded(RECOMMENDATIONS_ANCHOR_ID)"
          data-testid="key-moments-nav-screen-recommendations"
          @click="onScreenClick(RECOMMENDATIONS_ANCHOR_ID)"
          @focus="alwaysExpanded === false && unfold(RECOMMENDATIONS_ANCHOR_ID)"
        />

        <!-- One entry per rubric once a category exists; a single invitation before -->
        <div
          class="key-moments-nav__widgets grid"
          :class="{ 'key-moments-nav__widgets--open': isExpanded(RECOMMENDATIONS_ANCHOR_ID) }"
          :inert="isExpanded(RECOMMENDATIONS_ANCHOR_ID) === false"
          data-testid="key-moments-nav-recommendations-rubrics"
        >
          <div class="overflow-hidden">
            <NavEntryButton
              v-if="recommendationRubrics === undefined"
              :label="t('keyMoments.nav.chooseCategory')"
              isInvitation
              data-testid="key-moments-nav-recommendations-choose"
              @click="goTo(RECOMMENDATIONS_ANCHOR_ID)"
            />
            <!-- Nothing of a rubric reaches the reader, so it reads as a hidden widget -->
            <NavEntryButton
              v-for="rubric in recommendationRubrics"
              v-else
              :key="rubric.rubric"
              :label="t(`keyMoments.recommendations.rubrics.${rubric.rubric}`)"
              :isActive="activeAnchorId === rubricAnchorId(rubric.rubric)"
              :isHidden="rubric.visibleCount === 0"
              :state="rubric.visibleCount === 0
                ? t('keyMoments.visibility.hiddenBadge')
                : t('keyMoments.nav.rubricCount', { visible: rubric.visibleCount, total: rubric.totalCount })"
              :data-testid="`key-moments-nav-rubric-${rubric.rubric}`"
              @click="goTo(rubricAnchorId(rubric.rubric))"
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PIcon } from '@pulse/styleguide/components'
import { RECOMMENDATIONS_ANCHOR_ID, rubricAnchorId, screenAnchorId, widgetAnchorId } from '../../utils/anchor.utils'
import NavEntryButton from './nav-entry-button.vue'
import NavSectionButton from './nav-section-button.vue'
import { useAnchorScroll, useScrollSpy } from './nav.composable'
import type { Screen } from '../../types/key-moments.types'
import type { NavRubric } from './nav.types'

const props = withDefaults(defineProps<{
  screens: Screen[]
  /** The section exists for this reader: shown to the firm, or published to the client */
  hasRecommendations: boolean
  /** The rubrics to list under the section; undefined while no category is chosen */
  recommendationRubrics?: NavRubric[]
  /** Every section unfolded: the editor cannot drag into a list folding under the cursor */
  alwaysExpanded?: boolean
}>(), {
  alwaysExpanded: false,
  recommendationRubrics: undefined,
})

const emit = defineEmits<{
  'register-widgets-list': [screenId: string, element: HTMLElement | null]
}>()

const { t } = useI18n()

// Exposed so the editor can make the sections sortable
const screensListElement = useTemplateRef<HTMLElement>('screensListElement')

defineExpose({ screensListElement })

// Not persisted, like the filters
const isCollapsed = ref(false)

const anchorIds = computed(() => [
  ...props.screens.flatMap(screen => [
    screenAnchorId(screen.id),
    ...screen.widgets.map(widget => widgetAnchorId(widget.id)),
  ]),
  ...(props.hasRecommendations ? [RECOMMENDATIONS_ANCHOR_ID] : []),
  ...(props.recommendationRubrics ?? []).map(rubric => rubricAnchorId(rubric.rubric)),
])

const { activeAnchorId } = useScrollSpy(() => anchorIds.value)

const isRecommendationsCurrent = computed(() => activeAnchorId.value === RECOMMENDATIONS_ANCHOR_ID
  || (props.recommendationRubrics ?? []).some(rubric => activeAnchorId.value === rubricAnchorId(rubric.rubric)))

const { scrollToAnchor: goTo } = useAnchorScroll()

// The recommendations fold in the same accordion as the sections, under their anchor id: a screen id never takes that shape
const openScreenId = ref<string>()

// Scrolling unfolds the section it enters, so the highlighted block is never folded away
watch(activeAnchorId, (anchorId) => {
  if (props.alwaysExpanded) {
    return
  }

  const reachedScreen = props.screens.find(screen =>
    screenAnchorId(screen.id) === anchorId
    || screen.widgets.some(widget => widgetAnchorId(widget.id) === anchorId))

  if (reachedScreen !== undefined) {
    openScreenId.value = reachedScreen.id
  } else if (isRecommendationsCurrent.value) {
    openScreenId.value = RECOMMENDATIONS_ANCHOR_ID
  }
})

// Falls back to the first section when the open one no longer exists (template switch)
const unfoldedScreenId = computed(() => {
  const isStillDisplayed = props.screens
    .some(screen => screen.id === openScreenId.value)
    || (props.hasRecommendations && openScreenId.value === RECOMMENDATIONS_ANCHOR_ID)

  return isStillDisplayed ? openScreenId.value : props.screens[0]?.id
})

// The section being read, which alone is marked: an unfolded one may only be peeked at
function isCurrentScreen(screen: Screen): boolean {
  return activeAnchorId.value === screenAnchorId(screen.id)
    || screen.widgets.some(widget => activeAnchorId.value === widgetAnchorId(widget.id))
}

function isExpanded(screenId: string): boolean {
  return props.alwaysExpanded || screenId === unfoldedScreenId.value
}

function onScreenClick(screenId: string): void {
  unfold(screenId)
  goTo(screenId === RECOMMENDATIONS_ANCHOR_ID ? RECOMMENDATIONS_ANCHOR_ID : screenAnchorId(screenId))
}

// Keeps a cursor merely crossing the list from unfolding every section it passes over
const UNFOLD_HOVER_DELAY_MS = 300

let unfoldTimeout: ReturnType<typeof setTimeout> | undefined

function unfold(screenId: string): void {
  cancelScheduledUnfold()
  openScreenId.value = screenId
}

function scheduleUnfold(screenId: string): void {
  cancelScheduledUnfold()
  unfoldTimeout = setTimeout(() => unfold(screenId), UNFOLD_HOVER_DELAY_MS)
}

function cancelScheduledUnfold(): void {
  clearTimeout(unfoldTimeout)
  unfoldTimeout = undefined
}

onBeforeUnmount(cancelScheduledUnfold)

function countVisibleWidgets(screen: Screen): number {
  return screen.widgets.filter(widget => widget.isHidden === false).length
}

// The pendant of the visible widgets: a rubric without any visible recommendation shows nothing to the reader
const filledRubricsCount = computed(() => (props.recommendationRubrics ?? [])
  .filter(rubric => rubric.visibleCount > 0).length)

// Like a section: no rubric hides nothing, so only a chosen category left without any recommendation is hidden
const isRecommendationsHidden = computed(() => props.recommendationRubrics === undefined
  || (props.recommendationRubrics.length > 0 && filledRubricsCount.value === 0))

// An empty section hides nothing, so it is not considered hidden
function isScreenFullyHidden(screen: Screen): boolean {
  return screen.widgets.length > 0 && countVisibleWidgets(screen) === 0
}
</script>

<style scoped lang="scss">
// The custom property lets the template editor widen the column for its entry tools
$nav-width: 264px;
$nav-gutter: 16px;
$nav-collapsed-width: 40px;

.key-moments-nav {
  position: sticky;
  // under whatever the embedding page pins above the report — the preview banner
  top: calc(16px + var(--key-moments-sticky-offset, 0px));
  flex: 0 0 var(--key-moments-nav-width, #{$nav-width});
  // bounded by the layout main container, not the viewport, or its scrollbar runs off screen;
  // shortened by the sticky offset it is pushed down by, or its bottom falls below the fold
  max-height: calc(100vh - var(--p-header-height, 0px) - 32px - var(--key-moments-sticky-offset, 0px));
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: $nav-gutter;
  border-right: 1px solid var(--key-moments-line);
  transition: flex-basis 0.25s ease, padding-right 0.25s ease, border-right-color 0.25s ease;

  // A width rather than `auto`, which no browser interpolates
  &--collapsed {
    flex-basis: $nav-collapsed-width;
    padding-right: 0;
    border-right-color: transparent;
    overflow-y: hidden;
  }

  &__head {
    min-height: 32px;
  }

  // Kept at the open width so the list slides behind the column edge instead of reflowing
  &__body {
    width: calc(var(--key-moments-nav-width, #{$nav-width}) - #{$nav-gutter});
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  &--collapsed &__body {
    opacity: 0;
  }

  &__toggle-icon {
    transition: transform 0.2s;

    &--flipped {
      transform: rotate(180deg);
    }
  }

  &__title {
    flex: 1;
    min-width: 0;
    letter-spacing: 0.08em;
    color: var(--p-text-neutral);
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  &--collapsed &__title {
    opacity: 0;
  }

  &__group ~ &__group,
  &__screens + &__group {
    margin-top: 20px;
  }

  &__screen-row &__screen,
  &__widget-row &__widget {
    flex: 1;
    min-width: 0;
  }

  // `grid-template-rows` interpolates where `height: auto` does not
  &__widgets {
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.25s ease, opacity 0.2s ease;

    &--open {
      grid-template-rows: 1fr;
      opacity: 1;
    }
  }

}

@media (prefers-reduced-motion: reduce) {
  .key-moments-nav,
  .key-moments-nav__body,
  .key-moments-nav__title,
  .key-moments-nav__widgets,
  .key-moments-nav__toggle-icon {
    transition: none;
  }
}

@media (width <= 1050px) {
  .key-moments-nav {
    position: static;
    flex-basis: auto;
    max-height: none;
    padding-right: 0;
    padding-bottom: 16px;
    border-right: none;
    border-bottom: 1px solid var(--key-moments-line);
  }

  .key-moments-nav__body {
    width: 100%;
  }
}
</style>
